var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var apiKey = process.env.GEMINI_API_KEY;
var aiClient = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  aiClient = new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.post("/api/support/ai", async (req, res) => {
  const { messages, userContext } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "A valid list of messages is required." });
  }
  if (!aiClient) {
    const lastMsg = messages[messages.length - 1]?.text || "";
    const isUrdu = /[\u0600-\u06FF]/.test(lastMsg);
    let fallbackText = `Assalam-o-Alaikum, ${userContext?.name || "MatchGig Guest"}! I am the MatchGig Support AI. Currently, the server is starting or the API key is getting registered, but I am ready to help! You currently hold **${userContext?.coins || 0} Coins** and have completed **${userContext?.completedJobs || 0} jobs**. If you have a critical billing or withdrawal delay to resolve, please use the "File Ticket / Complaint" tab above to alert our Lahore human support agents instantly.`;
    if (isUrdu) {
      fallbackText = `\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u06CC\u06A9\u0645\u060C ${userContext?.name || "\u0645\u0639\u0632\u0632 \u0635\u0627\u0631\u0641"}! \u0645\u06CC\u06BA \u0645\u06CC\u0686 \u06AF\u06AF \u06A9\u0627 \u0645\u0639\u0627\u0648\u0646 \u0631\u0648\u0628\u0648\u0679 \u06C1\u0648\u06BA\u06D4 \u0633\u0631\u0648\u0631 \u0627\u0633 \u0648\u0642\u062A \u0641\u0639\u0627\u0644 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2\u060C \u0644\u06CC\u06A9\u0646 \u0645\u06CC\u06BA \u0622\u067E \u06A9\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062F\u06CC\u06A9\u06BE \u0633\u06A9\u062A\u0627 \u06C1\u0648\u06BA: \u0622\u067E \u06A9\u06D2 \u067E\u0627\u0633 **${userContext?.coins || 0} \u06A9\u0648\u0627\u0626\u0646\u0632** \u06C1\u06CC\u06BA \u0627\u0648\u0631 \u0622\u067E \u0646\u06D2 **${userContext?.completedJobs || 0} \u06A9\u0627\u0645** \u0645\u06A9\u0645\u0644 \u06A9\u06CC\u06D2 \u06C1\u06CC\u06BA\u06D4 \u0627\u06AF\u0631 \u0622\u067E \u06A9\u0648 \u0631\u0642\u0645 \u0646\u06A9\u0627\u0644\u0646\u06D2 \u06CC\u0627 \u0627\u062F\u0627\u0626\u06CC\u06AF\u06CC \u0645\u06CC\u06BA \u06A9\u0648\u0626\u06CC \u062A\u0627\u062E\u06CC\u0631 \u062F\u0631\u067E\u06CC\u0634 \u06C1\u06D2\u060C \u062A\u0648 \u0641\u0648\u0631\u06CC \u0645\u062F\u062F \u06A9\u06D2 \u0644\u06CC\u06D2 \u0627\u0648\u067E\u0631 '\u0641\u0627\u0626\u0644 \u0679\u06A9\u0679' \u067E\u0631 \u06A9\u0644\u06A9 \u06A9\u0631 \u06A9\u06D2 \u0631\u0627\u0628\u0637\u06C1 \u06A9\u0631\u06CC\u06BA\u06D4 \u0634\u06A9\u0631\u06CC\u06C1!`;
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
    const geminiContents = messages.map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...geminiContents
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            replyText: {
              type: import_genai.Type.STRING,
              description: "The support response message text, formatted cleanly. Keep it polite, helpful, and personalized."
            },
            suggestedAction: {
              type: import_genai.Type.STRING,
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
  } catch (error) {
    console.error("Gemini support request error:", error);
    return res.status(500).json({
      replyText: "Apologies! Our AI Support servers are running verification logs. If you need urgent assistance with wallets or a transaction hold, please trigger an official complaint form via the panel.",
      suggestedAction: "file_ticket"
    });
  }
});
async function start() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OK] Full-Stack MatchGig server running on port ${PORT}`);
  });
}
start().catch((err) => {
  console.error("Failed to start MatchGig support server:", err);
});
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
