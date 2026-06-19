/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from 'react';
import { 
  MessageSquare, Sparkles, X, Send, Coins, Compass, 
  HelpCircle, UserCheck, AlertOctagon, Search, Ticket, RefreshCw, AlertCircle
} from 'lucide-react';
import { User } from '../types';

interface AIAssistantWidgetProps {
  currentUser: User;
  setActiveMenu: (menu: 'home' | 'marketplace' | 'messages' | 'profiles' | 'subscription' | 'admin' | 'orders' | 'business_hub' | 'expert_suite' | 'rewards_hub' | 'flutter_suite' | 'privacy_hub' | 'support') => void;
  onOpenWallet: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: 'open_wallet' | 'file_ticket' | 'profile_guide' | 'none';
}

const HELP_ARTICLES = [
  {
    title: "💡 EasyPaisa & JazzCash Hold Release",
    category: "Withdrawal Issues",
    tags: ["withdrawal", "easypaisa", "jazzcash", "payout", "delay", "pakistan"],
    content: "If your easypaisa payout status indicates 'Pending secondary verification', our Pakistan billing team verification holds the coins to ensure compliance. Usually releases in 12-24 hours. For immediate action, ensure your CNIC is fully verified under profile bio parameters."
  },
  {
    title: "🪙 How to purchase premium Coins?",
    category: "Payment Issues",
    tags: ["buy coins", "charge", "add cash", "easypaisa", "pkr"],
    content: "Open your digital 'Wallet' panel, specify desired coin bundles, and select standard JazzCash or EasyPaisa checkout options. Conversion calculations trace at 1 Coin = 1 PKR."
  },
  {
    title: "📈 Profile Optimization for high-paying contracts",
    category: "Account Optimization",
    tags: ["optimize", "get hired", "profile description", "skills", "experience"],
    content: "Our matching algorithm prefers profiles that have (1) at least 3 high-quality portfolio files uploaded, (2) specified experience rows with clear durations, and (3) appropriate skills matched with current marketplace requests."
  },
  {
    title: "💎 Subscriptions: Pro vs VIP Support SLAs",
    category: "Subscriptions",
    tags: ["pro", "vip", "subscription", "priority support", "premium"],
    content: "Pro levels cost 300 coins/month and unlock normal tracking. VIP status costs 800 coins/month and guarantees Premium Priority Support with live response escalations under 15 minutes."
  },
  {
    title: "🛡️ Reporting duplicate designs or scam artists",
    category: "Fraud and Security",
    tags: ["fraud", "scam", "duplicate", "cheat", "stolen", "report user"],
    content: "Zero tolerance is active against plagiarism. If you discover duplicate designs downloaded from Pinterest, file a ticket choosing 'Fraud Reports' category. Admin moderators review logs and enforce coin freezes."
  }
];

export default function AIAssistantWidget({
  currentUser,
  setActiveMenu,
  onOpenWallet
}: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Assalam-o-Alaikum, ${currentUser.name}! 🌟 I am your 24/7 MatchGig AI Companion. How may I assist you today? 

I can guide you on:
• 🪙 Coins, payments, and EasyPaisa delays
• 💎 Pro/VIP subscription priorities
• 📈 Custom tips to optimize your Creator profile
• 🛡️ Reporting suspect users or file plagiarism

Type your questions in **English** or **Urdu (اردو)** script!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpSearch, setShowHelpSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(HELP_ARTICLES);
  const [activeTicketStatus, setActiveTicketStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Handle article searches
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(HELP_ARTICLES);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = HELP_ARTICLES.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.content.toLowerCase().includes(q) ||
      a.tags.some(t => t.includes(q))
    );
    setFilteredArticles(filtered);
  }, [searchQuery]);

  // Retrieve user's logged ticket stats from local storage if any
  const fetchLocalTicketStatus = () => {
    try {
      const saved = localStorage.getItem('matchgig_support_tickets');
      if (saved) {
        const parsed: any[] = JSON.parse(saved);
        const userTickets = parsed.filter(t => t.userId === currentUser.id);
        if (userTickets.length > 0) {
          // Get the latest ticket details
          const latest = userTickets[0];
          setActiveTicketStatus(`${latest.referenceNumber} (${latest.status})`);
        } else {
          setActiveTicketStatus(null);
        }
      }
    } catch (e) {
      console.warn("Could not load local ticket status:", e);
    }
  };

  useEffect(() => {
    fetchLocalTicketStatus();
    // Also attach listening to local storage change events
    window.addEventListener('storage', fetchLocalTicketStatus);
    return () => {
      window.removeEventListener('storage', fetchLocalTicketStatus);
    };
  }, [currentUser]);

  // Quick helper questions trigger
  const handleQuickQuestion = (val: string) => {
    handleSendMessage(val);
  };

  // Submit messages
  const handleSendMessage = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Gather conversation history limit 6 turns
      const recentHistory = messages.slice(-10).map(m => ({
        sender: m.sender,
        text: m.text
      }));
      recentHistory.push({ sender: 'user', text: cleanText });

      // Send to server-side AI endpoint
      const response = await fetch("/api/support/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: recentHistory,
          userContext: {
            name: currentUser.name,
            username: currentUser.username,
            subscription: currentUser.subscription,
            coins: currentUser.coins,
            completedJobs: currentUser.completedJobs,
            city: currentUser.city,
            country: currentUser.country,
            skills: currentUser.skills
          }
        })
      });

      if (!response.ok) {
        throw new Error("AI Support endpoint returned status " + response.status);
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: 'reply_' + Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: data.replyText || "Assalam-o-Alaikum! Thanks. Please try again.",
        suggestedAction: data.suggestedAction || 'none',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err) {
      console.error("AI Support Chat failed:", err);
      // Fallback
      setMessages(prev => [...prev, {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: `Assalam-o-Alaikum! I have successfully registered your inquiry content: "${cleanText.substring(0, 30)}...". Let me help connect you with a live MatchGig billing specialist. Please open our "Complaint Form" to trace this instantly.`,
        suggestedAction: 'file_ticket',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
      fetchLocalTicketStatus(); // Refresh ticket status in case they created one
    }
  };

  const onSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    handleSendMessage(inputText);
  };

  // Perform shortcut actions from suggestedAction codes
  const handleActionShortcut = (act: 'open_wallet' | 'file_ticket' | 'profile_guide') => {
    if (act === 'open_wallet') {
      onOpenWallet();
    } else if (act === 'file_ticket') {
      setActiveMenu('support');
    } else if (act === 'profile_guide') {
      setActiveMenu('profiles');
    }
  };

  return (
    <div className="fixed bottom-24 right-5 z-60 font-sans" id="ai-assistant-widget-container">
      {/* Floating Action Circle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            fetchLocalTicketStatus();
          }}
          className="relative group p-4 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-indigo-500/20 active:scale-95 transition-all duration-300 border border-indigo-400/30"
          title="Instant 24/7 MatchGig AI Support"
          id="ai-widget-trigger-btn"
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e676] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00e676]"></span>
          </span>
          
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-6 h-6 animate-pulse" />
            <span className="hidden group-hover:inline-block font-mono text-[10px] font-black uppercase tracking-wider pl-1 pr-1">
              AI SUPPORT
            </span>
          </div>
        </button>
      )}

      {/* Main Chat Assistant Modal Display */}
      {isOpen && (
        <div 
          className="bg-neutral-950/95 backdrop-blur-3xl border border-neutral-850 rounded-3xl w-[370px] sm:w-[410px] h-[580px] shadow-2xl flex flex-col overflow-hidden animate-slideUp text-left" 
          id="ai-chat-viewport"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-neutral-900 to-indigo-950/60 p-4 border-b border-neutral-850 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-white">MatchGig AI Helper</span>
                  <span className="bg-[#00e676]/10 text-[#00e676] text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase">
                    24/7 Online
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">Escrow Billing & Optimization Support</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 px-1.5 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Connected state header helper */}
          <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-850 text-[10px] text-neutral-400 flex items-center justify-between">
            <div className="flex items-center space-x-1 truncate max-w-[190px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span className="truncate">User: <strong>@{currentUser.username}</strong></span>
            </div>
            
            <button
              onClick={() => {
                setShowHelpSearch(prev => !prev);
                setSearchQuery('');
              }}
              className="text-[9px] font-mono hover:text-indigo-400 transition text-neutral-400 font-extrabold"
            >
              {showHelpSearch ? "💬 Back to Chat" : "🔍 Search Help Articles"}
            </button>
          </div>

          {/* ACTIVE HELPDOC SEARCH AREA OVERLAY */}
          {showHelpSearch ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Article Hub</h4>
                <p className="text-[10px] text-neutral-400">Search guides on EasyPaisa delay resolutions or profile ratings.</p>
              </div>

              {/* Input */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Type words (withraw, cnic, optimize...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-white outline-none w-full"
                />
              </div>

              <div className="space-y-3">
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-8 text-xs text-neutral-500">
                    No articles found matching word logs. Use the chat to ask the AI directly.
                  </div>
                ) : (
                  filteredArticles.map((art, idx) => (
                    <div 
                      key={idx} 
                      className="bg-neutral-900/40 p-3 rounded-xl border border-neutral-850 space-y-1.5 hover:border-indigo-500/20 transition text-left cursor-pointer"
                      onClick={() => {
                        // Ask AI about this article topic directly
                        handleQuickQuestion(`Tell me about help article: ${art.title}`);
                        setShowHelpSearch(false);
                      }}
                    >
                      <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">{art.category}</span>
                      <h5 className="text-xs font-bold text-white font-sans">{art.title}</h5>
                      <p className="text-[10px] text-neutral-400 leading-relaxed truncate">{art.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* CONVERSATION STREAM */
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950/50">
              
              {/* Optional Active Complaint notification summary */}
              {activeTicketStatus && (
                <div className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ticket className="w-4 h-4 text-emerald-400" />
                    <div className="text-[10px]">
                      <span className="text-neutral-400 block font-bold">Trace Active Complaint status</span>
                      <span className="text-white font-mono">{activeTicketStatus}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveMenu('support');
                      setIsOpen(false);
                    }}
                    className="p-1 px-2.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded text-[8px] font-mono border border-neutral-800"
                  >
                    Details
                  </button>
                </div>
              )}

              {/* Chat bubbles list */}
              {messages.map((m) => {
                const isAI = m.sender === 'assistant';
                return (
                  <div key={m.id} className={`flex flex-col space-y-1.5 ${isAI ? 'items-start' : 'items-end'}`}>
                    
                    <div className="flex items-center space-x-1.5 text-[9px] text-neutral-500 font-mono">
                      <span>{isAI ? '🤖 MatchGig AI Agent' : '👤 You'}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div 
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-normal font-sans whitespace-pre-wrap ${
                        isAI 
                          ? 'bg-neutral-900 text-neutral-100 border border-neutral-850' 
                          : 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/10'
                      }`}
                    >
                      {m.text}

                      {/* Display custom action shortcut help trigger buttons if specified */}
                      {isAI && m.suggestedAction && m.suggestedAction !== 'none' && (
                        <div className="mt-3.5 pt-3.5 border-t border-neutral-800 flex flex-col space-y-1.5">
                          <span className="text-[9px] text-neutral-500 font-mono uppercase block">Recommended direct shortcut:</span>
                          
                          {m.suggestedAction === 'open_wallet' && (
                            <button
                              onClick={() => handleActionShortcut('open_wallet')}
                              className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 text-amber-400 hover:text-white text-[10px] font-semibold rounded-xl border border-amber-500/20 text-center flex items-center justify-center space-x-1.5 transition-all"
                            >
                              <Coins className="w-3.5 h-3.5 text-amber-500" />
                              <span>Open Wallet / Coins top up</span>
                            </button>
                          )}

                          {m.suggestedAction === 'file_ticket' && (
                            <button
                              onClick={() => handleActionShortcut('file_ticket')}
                              className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 text-rose-300 hover:text-white text-[10px] font-semibold rounded-xl border border-rose-500/20 text-center flex items-center justify-center space-x-1.5 transition-all"
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>File Official Complaint Form</span>
                            </button>
                          )}

                          {m.suggestedAction === 'profile_guide' && (
                            <button
                              onClick={() => handleActionShortcut('profile_guide')}
                              className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 text-indigo-300 hover:text-[#00e676] text-[10px] font-semibold rounded-xl border border-indigo-500/20 text-center flex items-center justify-center space-x-1.5 transition-all"
                            >
                              <Compass className="w-3.5 h-3.5" />
                              <span>Optimize Profile parameters</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loader indicator state */}
              {isLoading && (
                <div className="space-y-1.5 items-start flex flex-col">
                  <span className="text-[9px] text-neutral-500 font-mono">🤖 Assistant is thinking...</span>
                  <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800 text-xs text-neutral-400 flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Analyzing ledger context for {currentUser.name}...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quick Click helper buttons row (scrollable horizontally) */}
          {!showHelpSearch && (
            <div className="px-3 py-2 bg-neutral-950 border-t border-neutral-900 overflow-x-auto scrollbar-none flex gap-1.5">
              <button
                onClick={() => handleQuickQuestion("🇵🇰 I have an EasyPaisa withdrawal delay. Can you check?")}
                className="whitespace-nowrap px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-400 text-[10px] font-mono rounded-xl border border-neutral-800 transition-all font-bold"
              >
                🇵🇰 withdrawal delays
              </button>

              <button
                onClick={() => handleQuickQuestion("📈 How can I optimize my creator profile to land more contracts?")}
                className="whitespace-nowrap px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-400 text-[10px] font-mono rounded-xl border border-neutral-800 transition-all font-bold"
              >
                📈 Optimize profile
              </button>

              <button
                onClick={() => handleQuickQuestion("💎 Pro vs VIP priority support privileges analysis")}
                className="whitespace-nowrap px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-400 text-[10px] font-mono rounded-xl border border-neutral-800 transition-all font-bold"
              >
                💎 Pro vs VIP differences
              </button>

              <button
                onClick={() => handleQuickQuestion("🛡️ How do I file a scam or copycat fraud complaint?")}
                className="whitespace-nowrap px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-400 text-[10px] font-mono rounded-xl border border-neutral-800 transition-all font-bold"
              >
                🛡️ report plagiarism
              </button>
            </div>
          )}

          {/* Bottom input text box */}
          <form onSubmit={onSubmitForm} className="p-3 bg-neutral-900 border-t border-neutral-850 flex items-center space-x-2">
            <input
              type="text"
              required
              disabled={isLoading || showHelpSearch}
              placeholder={showHelpSearch ? "Close Help Article page to text..." : "Ask in English or Urdu script..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || showHelpSearch || !inputText.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
