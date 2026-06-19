/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GenAI client lazily to handle missing key states gracefully
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Support Assistant AI Endpoint
app.post("/api/support/ai", async (req, res) => {
  const { messages, userContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "A valid list of messages is required." });
  }

  // Fallback if Gemini isn't initialized yet or user wants a basic mock reply
  if (!aiClient) {
    const lastMsg = messages[messages.length - 1]?.text || "";
    const isUrdu = /[\u0600-\u06FF]/.test(lastMsg);

    let fallbackText = `Assalam-o-Alaikum, ${userContext?.name || "MatchGig Guest"}! I am the MatchGig Support AI. Currently, the server is starting or the API key is getting registered, but I am ready to help! You currently hold **${userContext?.coins || 0} Coins** and have completed **${userContext?.completedJobs || 0} jobs**. If you have a critical billing or withdrawal delay to resolve, please use the "File Ticket / Complaint" tab above to alert our Lahore human support agents instantly.`;
    
    if (isUrdu) {
      fallbackText = `السلام علیکم، ${userContext?.name || "معزز صارف"}! میں میچ گگ کا معاون روبوٹ ہوں۔ سرور اس وقت فعال ہو رہا ہے، لیکن میں آپ کی معلومات دیکھ سکتا ہوں: آپ کے پاس **${userContext?.coins || 0} کوائنز** ہیں اور آپ نے **${userContext?.completedJobs || 0} کام** مکمل کیے ہیں۔ اگر آپ کو رقم نکالنے یا ادائیگی میں کوئی تاخیر درپیش ہے، تو فوری مدد کے لیے اوپر 'فائل ٹکٹ' پر کلک کر کے رابطہ کریں۔ شکریہ!`;
    }

    const action = lastMsg.toLowerCase().includes("wallet") || lastMsg.toLowerCase().includes("coin") ? "open_wallet" : "file_ticket";
    return res.json({
      replyText: fallbackText,
      suggestedAction: action
    });
  }

  try {
    const systemPrompt = `
You are the MatchGig 24/7 AI Support Assistant, a polite and highly helpful Urdu-English billing, wallet, and compliance support agent.
Your primary base is Lahore, Pakistan. You frequently use typical friendly phrases like "Assalam-o-Alaikum" and natural local tones.
You excel at helping freelancers and clients with the virtual Coin system (1 coin = 1 PKR), escrow protection, withdrawal hold-states, and in-app virtual gifts (100% coins goes to creator immediately).

Current Active User Profile context:
- Name: "${userContext?.name || "User"}"
- Username: @${userContext?.username || "anonymous"}
- Subscription Status: ${userContext?.subscription || "Free"} (${userContext?.subscription === "Free" ? "Standard Ticket queue" : "Premium VIP Fast-Track queue active"})
- Virtual wallet balance: ${userContext?.coins || 0} Coins
- Completed match jobs on ledger: ${userContext?.completedJobs || 0}
- Current City/Country: ${userContext?.city || "Pakistan"}
- Creator Skill Tags: ${userContext?.skills?.join(", ") || "No skills uploaded yet"}

Review the history and reply to the user's latest query directly, referencing any relevant user profile elements if helpful (e.g. if their profile needs optimization, or they need to upgrade).
Suggest actionable pathways using the "suggestedAction" field code to show beautiful inline shortcuts in the UI.

Return ONLY a premium, compliant JSON object matching this schema structural guidelines:
{
  "replyText": "The actual narrative answer, written nicely with paragraph breaks. Use supportive bilingual words if the query contains Urdu script, otherwise English is perfectly correct.",
  "suggestedAction": "one of: 'open_wallet' | 'file_ticket' | 'profile_guide' | 'none'"
}

Mapping:
- If user mentions 'wallet', 'coins', 'easy paisa', 'cash out', 'withdraw' or 'how to get more points/charge', suggest 'open_wallet'.
- If user is showing intense dissatisfaction, reporting fraud, reporting a scammer username, has duplicate vertical mockups to complain of, or needs human escalation, suggest 'file_ticket'.
- If user wants to optimize their portfolio, add experiences, get hired, improve rating, or learn what skills to list, suggest 'profile_guide'.
- Otherwise: 'none'.
`;

    // Package conversational turns
    const geminiContents = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...geminiContents
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: {
              type: Type.STRING,
              description: "The support response message text, formatted cleanly. Keep it polite, helpful, and personalized."
            },
            suggestedAction: {
              type: Type.STRING,
              description: "Action helper shortcut code: 'open_wallet', 'file_ticket', 'profile_guide', or 'none'"
            }
          },
          required: ["replyText", "suggestedAction"]
        },
        temperature: 0.75
      }
    });

    const returnText = response.text || "{}";
    return res.json(JSON.parse(returnText));

  } catch (error: any) {
    console.error("Gemini support request error:", error);
    return res.status(500).json({
      replyText: "Apologies! Our AI Support servers are running verification logs. If you need urgent assistance with wallets or a transaction hold, please trigger an official complaint form via the panel.",
      suggestedAction: "file_ticket"
    });
  }
});

// Combine Vite static serving and Fallback routing inside an async start function
async function start() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to host 0.0.0.0 and port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OK] Full-Stack MatchGig server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error("Failed to start MatchGig support server:", err);
});
