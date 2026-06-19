/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
import { 
  HelpCircle, 
  PlusCircle, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  User, 
  Clock, 
  MessageCircle, 
  ShieldAlert, 
  FileText, 
  DollarSign, 
  Send,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  XCircle,
  AlertCircle,
  Coins
} from 'lucide-react';
import { User as UserType } from '../types';

interface SupportCenterProps {
  currentUser: UserType;
  users: UserType[];
  onOpenWallet?: () => void;
}

export interface SupportTicket {
  id: string;
  referenceNumber: string;
  category: 'Payment Issues' | 'Withdrawal Issues' | 'Account Issues' | 'Verification Issues' | 'Technical Problems' | 'Content Reports' | 'Fraud Reports';
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Standard' | 'Premium Priority';
  createdAt: string;
  userId: string;
  userEmail: string;
  targetUsername?: string; // For user/fraud reports
  disputedAmount?: number; // For payment disputes
  messages: {
    id: string;
    sender: 'user' | 'agent';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

const INITIAL_FAQS = [
  {
    k: 'q_1',
    q: 'How does the MatchGig Coins Escrow protection operate?',
    a: 'When you purchase a gig or start a freelance agreement, your Coins are securely held inside our custody vault. Coins are only dispatched to the freelancer after you approve the finalized milestone delivery or if the agreed timeline milestones are verified.'
  },
  {
    k: 'q_2',
    q: 'What are the withdrawal processing times in Pakistan?',
    a: 'Withdrawal transfers are processed within 12 to 24 hours to your verified EasyPaisa, JazzCash, or bank account. If you face hold states, submit a "Withdrawal Issues" support request code for rapid manual release.'
  },
  {
    k: 'q_3',
    q: 'Why does my Profile show "Standard" rather than "Premium Priority Support"?',
    a: 'MatchGig Pro & VIP subscription plans unlock exclusive priority support tickets with custom SLA responses from human live agents within 15 minutes. Check the "Pro Plans" section in the menu matrix to level up.'
  },
  {
    k: 'q_4',
    q: 'What safety systems exist for payment dispute and fraud protection?',
    a: 'Every gig contract has a dedicated "Dispute Milestone" safety handle. If a creator fails to compile or delivers sub-par files, our compliance administrators verify the submission assets using sandboxed secure controls to coordinate fair coin returns.'
  }
];

export default function SupportCenter({
  currentUser,
  users,
  onOpenWallet
}: SupportCenterProps) {
  const isPremiumUser = currentUser.subscription === 'Pro' || currentUser.subscription === 'VIP';

  // State: support requests persistence across local sessions 
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('matchgig_support_tickets');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ticket_1',
        referenceNumber: 'MG-REF-90821-X9',
        category: 'Withdrawal Issues',
        subject: 'EasyPaisa Withdrawal Delay trace',
        description: 'Initiated 350 Coins transfer to EasyPaisa yesterday afternoon, has not hit my wallet balance yet. Please cross check the ledger log indices.',
        status: 'In Progress',
        priority: 'Premium Priority',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        userId: 'user_1', // Fatima Mailk demo
        userEmail: 'fatima.malik@example.pk',
        messages: [
          {
            id: 'm1',
            sender: 'user',
            senderName: 'Fatima Malik',
            text: 'I submitted the withdrawal request yesterday but did not receive response. Can you trace?',
            timestamp: 'Yesterday'
          },
          {
            id: 'm2',
            sender: 'agent',
            senderName: 'Agent Sidra (MatchGig)',
            text: 'Hi Fatima! Verified compliance log records. We trace that the transaction is held in secondary verification. It will release to EasyPaisa instantly upon validation. Thank you!',
            timestamp: '10 hours ago'
          }
        ]
      },
      {
        id: 'ticket_2',
        referenceNumber: 'MG-REF-30234-Y1',
        category: 'Fraud Reports',
        subject: 'Suspicious profile offering simulated video render downloads',
        description: 'Account profile @mock_scraper is uploading duplicate vertical UI elements from Pinterest and charging excessive coins. Please lock down compliance permissions.',
        status: 'Open',
        priority: 'Standard',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userId: 'user_2', // Hamza
        userEmail: 'hamza.siddiqui@example.pk',
        targetUsername: 'mock_scraper',
        messages: [
          {
            id: 'm1',
            sender: 'user',
            senderName: 'Hamza Siddiqui',
            text: 'Please look at this account right away. They copy others projects.',
            timestamp: '2 hours ago'
          }
        ]
      }
    ];
  });

  // Save tickets
  useEffect(() => {
    localStorage.setItem('matchgig_support_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // UI Active tabs: 'faqs' | 'file_ticket' | 'my_tickets' | 'admin_dashboard'
  const [activeTab, setActiveTab] = useState<'faqs' | 'file_ticket' | 'my_tickets' | 'admin_dashboard'>(
    (currentUser.role === 'Admin') ? 'admin_dashboard' : 'faqs'
  );

  // Form Submissions
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('Payment Issues');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [reportedUsername, setReportedUsername] = useState('');
  const [disputedAmount, setDisputedAmount] = useState('');

  // Search & Filters (for both user-tracking & admin-dashboard)
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Active chat section
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [chatMessageText, setChatMessageText] = useState('');

  // FAQ Accordion
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('q_1');

  // Submit new ticket
  const handleCreateTicket = (e: FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    const refNum = `MG-REF-${Math.floor(10000 + Math.random() * 90000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
    
    const newTicket: SupportTicket = {
      id: 'ticket_' + Math.random().toString(36).substring(2, 9),
      referenceNumber: refNum,
      category: ticketCategory,
      subject: ticketSubject,
      description: ticketDescription,
      status: 'Open',
      priority: isPremiumUser ? 'Premium Priority' : 'Standard',
      createdAt: new Date().toISOString(),
      userId: currentUser.id,
      userEmail: currentUser.email || `${currentUser.username}@matchgig.pk`,
      targetUsername: reportedUsername ? reportedUsername.replace('@', '') : undefined,
      disputedAmount: disputedAmount ? Number(disputedAmount) : undefined,
      messages: [
        {
          id: 'init_msg',
          sender: 'user',
          senderName: currentUser.name,
          text: ticketDescription + (reportedUsername ? ` | Reported Creator username: @${reportedUsername}` : '') + (disputedAmount ? ` | Disputed Coins Value: ${disputedAmount} 🪙` : ''),
          timestamp: 'Just now'
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    setTicketSubject('');
    setTicketDescription('');
    setReportedUsername('');
    setDisputedAmount('');
    
    // Automatically open active ticket tracker list
    setSelectedTicketId(newTicket.id);
    setActiveTab('my_tickets');

    // Simulated standard dynamic SLA support feedback chat response after 1.5 seconds
    setTimeout(() => {
      setTickets(currentTickets => 
        currentTickets.map(ticket => {
          if (ticket.id === newTicket.id) {
            return {
              ...ticket,
              status: 'In Progress',
              messages: [
                ...ticket.messages,
                {
                  id: 'auto_agent_response',
                  sender: 'agent',
                  senderName: isPremiumUser ? '⭐ VIP Priority Helper Amara' : 'MatchGig Automated Support',
                  text: isPremiumUser 
                    ? `Assalam-o-Alaikum! Your VIP Priority Tier is verified in active SLA nodes. A dedicated MatchGig compliance lead is investigating reference ${newTicket.referenceNumber}. Please type any extra details about this complaint below!`
                    : `Your report reference code ${newTicket.referenceNumber} has successfully reached our ticket backlog. Our support representative has marked this under standard queue category: ${newTicket.category}. We will respond with verification credentials soon.`,
                  timestamp: '1 min ago'
                }
              ]
            };
          }
          return ticket;
        })
      );
    }, 1500);
  };

  // Chat messaging
  const handleSendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !selectedTicketId) return;

    const selectedTicket = tickets.find(t => t.id === selectedTicketId);
    if (!selectedTicket) return;

    const isAgentReplier = currentUser.role === 'Admin' && activeTab === 'admin_dashboard';

    const cleanMsg = {
      id: 'msg_' + Date.now().toString(36),
      sender: isAgentReplier ? ('agent' as const) : ('user' as const),
      senderName: isAgentReplier ? 'Administrator Support' : currentUser.name,
      text: chatMessageText.trim(),
      timestamp: 'Just now'
    };

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          messages: [...t.messages, cleanMsg]
        };
      }
      return t;
    }));

    setChatMessageText('');

    // If regular user sent, simulate reply unless Admin takes care
    if (!isAgentReplier) {
      setTimeout(() => {
        setTickets(currentTickets => 
          currentTickets.map(t => {
            if (t.id === selectedTicketId) {
              // Only auto-reply if the last message was indeed from the user
              const lastMsg = t.messages[t.messages.length - 1];
              if (lastMsg && lastMsg.sender === 'user') {
                return {
                  ...t,
                  messages: [
                    ...t.messages,
                    {
                      id: 'auto_reply_' + Math.random().toString(36).substring(2, 5),
                      sender: 'agent',
                      senderName: 'MatchGig Support Agent',
                      text: `[Auto-Receipt Log] Received your description: "${cleanMsg.text.substring(0, 30)}...". Our compliance ledger queue is cross-referencing values. We appreciate your patience with our support framework.`,
                      timestamp: 'Just now'
                    }
                  ]
                };
              }
            }
            return t;
          })
        );
      }, 2500);
    }
  };

  // Admin Actions
  const handleUpdateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleUpdateTicketPriority = (ticketId: string, newPriority: SupportTicket['priority']) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, priority: newPriority };
      }
      return t;
    }));
  };

  // Filter lists based on states
  const filterAndSearch = (list: SupportTicket[]) => {
    return list.filter(t => {
      const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  };

  const userTickets = tickets.filter(t => t.userId === currentUser.id);
  const filteredUserTickets = filterAndSearch(userTickets);
  const filteredAdminTickets = filterAndSearch(tickets);

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  return (
    <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-5 md:p-6 space-y-6 text-left" id="support-center-viewport">
      
      {/* Upper Navigation support card details */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-indigo-950/40 p-6 rounded-2xl border border-neutral-850">
        <div>
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-black text-white tracking-wide">MatchGig help & Support Center</h2>
          </div>
          <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
            Resolve billing questions, trace blocked cashes, or report malicious profiles instantly under standard local escrow parameters.
          </p>
        </div>

        {isPremiumUser ? (
          <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 px-3.5 py-2 rounded-xl flex items-center space-x-2">
            <span className="text-lg">⭐</span>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-widest block">Priority support active</span>
              <span className="text-[9px] text-neutral-400 block">SLA Response time &lt; 15 mins</span>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-950 px-3.5 py-2 rounded-xl border border-neutral-850 text-left">
            <span className="text-[10px] font-mono text-neutral-500 font-bold block uppercase">Standard Support Status</span>
            <span className="text-[9px] text-neutral-400 block">Upgrade to Pro/VIP for live agent slots</span>
          </div>
        )}
      </div>

      {/* Internal Menu and tabs selectors */}
      <div className="flex bg-neutral-950 p-1.5 rounded-2xl border border-neutral-850 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => { setActiveTab('faqs'); setSelectedTicketId(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
            activeTab === 'faqs' ? 'bg-neutral-900 text-amber-400 border border-neutral-800' : 'text-neutral-400 hover:text-white'
          }`}
        >
          📚 FAQ Database
        </button>

        <button
          onClick={() => { setActiveTab('file_ticket'); setSelectedTicketId(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
            activeTab === 'file_ticket' ? 'bg-neutral-900 text-amber-400 border border-neutral-800' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>file ticket / Complaint</span>
        </button>

        <button
          onClick={() => { setActiveTab('my_tickets'); }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
            activeTab === 'my_tickets' ? 'bg-neutral-900 text-amber-400 border border-neutral-800' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>My Tickets ({userTickets.length})</span>
        </button>

        {currentUser.role === 'Admin' && (
          <button
            onClick={() => { setActiveTab('admin_dashboard'); setSelectedTicketId(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ml-auto border ${
              activeTab === 'admin_dashboard' 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : 'border-neutral-850 text-neutral-400 hover:text-rose-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Admin Support ({tickets.length})</span>
          </button>
        )}
      </div>

      {/* SEARCH AND FILTER BAR (except FAQs tab) */}
      {activeTab !== 'faqs' && activeTab !== 'file_ticket' && (
        <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Input */}
            <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 flex items-center space-x-2">
              <Search className="w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search ticket reference #, descriptions or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-white outline-none w-full"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-850 rounded-xl p-2 px-3 text-xs text-neutral-300 outline-none focus:border-amber-500"
            >
              <option value="all">All Categories</option>
              <option value="Payment Issues">Payment Issues</option>
              <option value="Withdrawal Issues">Withdrawal Issues</option>
              <option value="Account Issues">Account Issues</option>
              <option value="Verification Issues">Verification Issues</option>
              <option value="Technical Problems">Technical Problems</option>
              <option value="Content Reports">Content Reports</option>
              <option value="Fraud Reports">Fraud Reports</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-850 rounded-xl p-2 px-3 text-xs text-neutral-300 outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-850 rounded-xl p-2 px-3 text-xs text-neutral-300 outline-none focus:border-amber-500"
            >
              <option value="all">All Priorities</option>
              <option value="Standard">Standard</option>
              <option value="Premium Priority">Premium Priority</option>
            </select>

          </div>
        </div>
      )}

      {/* FAQs VIEW */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest font-black block">Help center database</span>
            <h3 className="text-base font-black text-white">Frequently Asked Questions</h3>
            <p className="text-neutral-400 text-xs mt-1">Get immediate answers on security systems, coin pricing tiers, and fraud rules.</p>
          </div>

          <div className="space-y-3.5">
            {INITIAL_FAQS.map(faq => (
              <div 
                key={faq.k} 
                className="bg-neutral-950 rounded-2xl border border-neutral-850 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedFaqId(expandedFaqId === faq.k ? null : faq.k)}
                  className="w-full flex items-center justify-between p-4 text-left font-sans text-xs font-extrabold text-white hover:bg-neutral-900/50 transition focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="text-neutral-500 text-lg">{expandedFaqId === faq.k ? '−' : '+'}</span>
                </button>
                {expandedFaqId === faq.k && (
                  <div className="p-4 pt-1 pb-4 bg-neutral-900/40 text-neutral-400 text-[11px] leading-relaxed border-t border-neutral-900">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-neutral-950 p-5 rounded-2xl border border-[#00e676]/10 flex flex-col sm:flex-row items-center justify-between text-left gap-4">
            <div>
              <span className="text-[10px] text-[#00e676] font-mono uppercase block font-bold">Unresolved inquiry?</span>
              <p className="text-xs text-neutral-300 mt-1 max-w-lg leading-relaxed">
                If the automated FAQ guidelines do not address your payment structure or specific dispute case, launch a dedicated ticket submission right away.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('file_ticket')}
              className="py-1.5 px-4 bg-[#1b1e22] hover:bg-neutral-900 text-white text-xs font-mono font-bold rounded-xl border border-neutral-800 transition"
            >
              Get Custom Support
            </button>
          </div>
        </div>
      )}

      {/* FILE COMPLAINT TICKET VIEW */}
      {activeTab === 'file_ticket' && (
        <form onSubmit={handleCreateTicket} className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest font-black block">Secure submission pipeline</span>
            <h3 className="text-base font-black text-white">Create New MatchGig Complaint</h3>
            <p className="text-indigo-400 text-xs">Priority level automatically set matching: {currentUser.subscription} privileges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Category selection */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-neutral-400 font-mono uppercase">Complaint Category *</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value as any)}
                className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs text-white outline-none focus:border-amber-500"
              >
                <option value="Payment Issues">Payment Issues – Deposit/Card checkout failures</option>
                <option value="Withdrawal Issues">Withdrawal Issues – Pending easypaisa / cashouts</option>
                <option value="Account Issues">Account Issues – Credentials recovery & logs</option>
                <option value="Verification Issues">Verification Issues – CNIC approval checks</option>
                <option value="Technical Problems">Technical Problems – App crashes & UI lags</option>
                <option value="Content Reports">Content Reports – Vulgarity or copied mockups</option>
                <option value="Fraud Reports">Fraud Reports – Scams or contract bypass attempts</option>
              </select>
            </div>

            {/* Subject input */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-neutral-400 font-mono uppercase">Ticket Subject line *</label>
              <input
                type="text"
                required
                placeholder="e.g., Blocked PKR withdrawal code or Payment dispute with freelancer"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Conditional items based on categories (Fraud Reporting or Payment Dispute) */}
          {(ticketCategory === 'Fraud Reports' || ticketCategory === 'Content Reports') && (
            <div className="bg-rose-950/10 border border-rose-500/20 p-4 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-rose-400 font-extrabold text-[10px] font-mono uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>Malicious User & Security Audit Form</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] text-neutral-400">Target User Username (optional)</span>
                  <input
                    type="text"
                    placeholder="e.g. mock_scraper or hacker_profile"
                    value={reportedUsername}
                    onChange={(e) => setReportedUsername(e.target.value)}
                    className="bg-neutral-950 p-2 text-xs border border-neutral-850 text-white rounded-xl outline-none"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] text-rose-300 leading-normal">
                    *Our system holds zero-tolerance logs against unauthorized contract evasions or copying. Verified violations result in total coins confiscations.
                  </span>
                </div>
              </div>
            </div>
          )}

          {ticketCategory === 'Payment Issues' && (
            <div className="bg-amber-950/10 border border-amber-500/20 p-4 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-amber-500 font-extrabold text-[10px] font-mono uppercase">
                <Coins className="w-4 h-4" />
                <span>Payment dispute & refund tracing parameters</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] text-neutral-400">Ledger Disputed Coins Capital value</span>
                  <input
                    type="number"
                    placeholder="e.g. 500 Coins"
                    value={disputedAmount}
                    onChange={(e) => setDisputedAmount(e.target.value)}
                    className="bg-neutral-950 p-2 text-xs border border-[#2b2511] text-white rounded-xl outline-none"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] text-neutral-400 leading-normal">
                    *State the exact coin count associated with the damaged escrow node. Standard refund processing triggers escrow lock conditions.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Description details */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] text-neutral-400 font-mono uppercase">Full Description / Complaint Statements (Urdu or English) *</label>
            <textarea
              required
              rows={4}
              placeholder="Provide exhaustive timelines, transaction receipt codes, or specific evidence details matching your dispute. This accelerates manual ledger audit processing."
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs text-white outline-none focus:border-amber-500 font-sans"
            />
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850 text-[10px] font-mono text-neutral-400 leading-snug">
            ⚠️ <strong>SLA Verification Consent:</strong> By clicking "Dispatch Complaint Ticket", you authorize MatchGig security inspectors to securely audit escrow ledger parameters relevant to this case. Slander or mock fraud reports will result in temporary suspension.
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black uppercase rounded-xl transition shadow-lg shadow-indigo-600/10 flex items-center justify-center space-x-1.5"
          >
            <span>Dispatch Complaint Ticket</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* USER DISPATCHED COMPLAINTS TRACKING PANEL */}
      {activeTab === 'my_tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* List panel */}
          <div className="lg:col-span-5 space-y-3 text-left">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">Submitted cases ({filteredUserTickets.length})</h4>
            
            {filteredUserTickets.length === 0 ? (
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 text-center text-xs text-neutral-500">
                🔍 No active ticket cases found matching filters. Select "file ticket" to create one.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredUserTickets.map(ticket => {
                  const isActive = ticket.id === selectedTicketId;
                  
                  return (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition flex flex-col justify-between capitalize ${
                        isActive 
                          ? 'bg-neutral-950 border-amber-500/50' 
                          : 'bg-neutral-950/60 border-neutral-850 hover:bg-neutral-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase">{ticket.referenceNumber}</span>
                        
                        <span className={`text-[8px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          ticket.status === 'Open' ? 'bg-amber-500/15 text-amber-400' :
                          ticket.status === 'In Progress' ? 'bg-blue-500/15 text-blue-400' :
                          ticket.status === 'Resolved' ? 'bg-[#00e676]/15 text-[#00e676]' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-white mt-1.5 truncate max-w-full">{ticket.subject}</h4>
                      
                      <div className="flex items-center justify-between mt-3 text-[9px] font-mono text-neutral-500 lowercase">
                        <span>{ticket.category}</span>
                        <span className="flex items-center space-x-1 uppercase text-neutral-400">
                          <span className={`w-1.5 h-1.5 rounded-full ${ticket.priority === 'Premium Priority' ? 'bg-amber-400' : 'bg-neutral-600'}`}></span>
                          <span>{ticket.priority.split(' ')[0]}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat / Interaction simulator panel */}
          <div className="lg:col-span-7">
            {activeTicket ? (
              <div className="bg-neutral-950 rounded-3xl border border-neutral-850 overflow-hidden flex flex-col h-[500px]">
                
                {/* Header detail */}
                <div className="bg-neutral-900 px-4 py-3.5 border-b border-neutral-850 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500">{activeTicket.referenceNumber} • {activeTicket.category}</span>
                    <h3 className="text-xs font-black text-white truncate max-w-[280px] mt-0.5">{activeTicket.subject}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[8px] font-mono uppercase bg-neutral-950 border border-neutral-800 text-amber-400 px-2.5 py-1 rounded-full font-black">
                      {activeTicket.priority}
                    </span>
                  </div>
                </div>

                {/* Message display panel */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-950/80">
                  
                  {/* Detailed summary wrapper list */}
                  <div className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-850 text-left text-[10px] space-y-1.5 text-neutral-300 font-sans">
                    <p className="font-extrabold text-white text-[11px] font-mono">📌 Complaint Fact-Sheet</p>
                    <p>• <strong>Filed Category:</strong> {activeTicket.category}</p>
                    <p>• <strong>Complaint Narrative:</strong> {activeTicket.description}</p>
                    {activeTicket.targetUsername && (
                      <p className="text-rose-400">• <strong>Reported User profile:</strong> @{activeTicket.targetUsername}</p>
                    )}
                    {activeTicket.disputedAmount && (
                      <p className="text-amber-400">• <strong>Disputed Ledger Sum:</strong> {activeTicket.disputedAmount} 🪙 (~{activeTicket.disputedAmount} PKR)</p>
                    )}
                    <span className="text-[8px] text-neutral-500 font-mono block pt-1">Time submitted: {new Date(activeTicket.createdAt).toLocaleDateString()}</span>
                  </div>

                  {activeTicket.messages.map((m) => {
                    const isAgent = m.sender === 'agent';
                    return (
                      <div
                        key={m.id}
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed text-left flex flex-col space-y-1 ${
                          isAgent 
                            ? 'bg-indigo-600/10 text-white border border-indigo-500/20 mr-auto' 
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-200 ml-auto'
                        }`}
                      >
                        <span className="text-[9px] font-mono font-extrabold tracking-widest uppercase text-neutral-400">{m.senderName}</span>
                        <p className="font-sans leading-normal">{m.text}</p>
                        <span className="text-[8px] text-neutral-500 self-end font-mono">{m.timestamp}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick actions tracker selection */}
                <div className="bg-neutral-90 px-4 py-2 border-t border-b border-neutral-850/60 bg-neutral-950 flex items-center justify-between text-left">
                  <span className="text-[9px] text-neutral-500 font-mono">State: <strong>{activeTicket.status}</strong></span>
                  {activeTicket.status !== 'Closed' && (
                    <button
                      onClick={() => handleUpdateTicketStatus(activeTicket.id, 'Closed')}
                      className="text-[9px] text-rose-400 hover:text-white font-mono uppercase bg-rose-500/5 hover:bg-rose-500/10 px-2 py-0.8 rounded border border-rose-500/15"
                    >
                      Close Complaint Ticket
                    </button>
                  )}
                </div>

                {/* Input text form */}
                <form onSubmit={handleSendChatMessage} className="p-3 bg-neutral-900 flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    disabled={activeTicket.status === 'Closed'}
                    placeholder={activeTicket.status === 'Closed' ? 'This ticket is closed.' : "Type message/detail to assist agents..."}
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={activeTicket.status === 'Closed'}
                    className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            ) : (
              <div className="bg-neutral-950 rounded-3xl border border-neutral-850 h-[500px] flex flex-col items-center justify-center p-8 text-center text-neutral-500 space-y-2">
                <span className="text-4xl">💬</span>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">Live Session Support Chat</h4>
                <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                  Select any ticket request code from the sidebar to view active status, message logs, or chat directly with MatchGig compliance supervisors.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ADMIN LEVEL CORE SUPPORT COORDINATOR PANEL */}
      {activeTab === 'admin_dashboard' && currentUser.role === 'Admin' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-neutral-950 p-5 rounded-2xl border border-rose-900/30">
            <div>
              <span className="text-[10px] text-rose-400 font-mono uppercase font-black tracking-widest block">Core Administrator Command Panel</span>
              <h3 className="text-base font-black text-white mt-1 uppercase tracking-tight">Active Support Tickets Desk</h3>
              <p className="text-neutral-400 text-xs">Verify dispute ledger nodes, escalate ticket priority level, or post replies on any active complaint instantly.</p>
            </div>
            <div className="bg-rose-950/20 border border-rose-500/20 p-2.5 px-3.5 rounded-xl text-left text-xs">
              <span className="text-rose-300 block font-bold font-mono">🚨 OVERRIDE AUDITING</span>
              <span className="text-[10px] text-neutral-400">Activity complies with national escrow data guidelines.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Admin filters lists */}
            <div className="lg:col-span-5 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase">Universal Tickets ({filteredAdminTickets.length})</span>
                <span className="text-[10px] text-neutral-500 font-mono">Real-time status tracking</span>
              </div>

              {filteredAdminTickets.length === 0 ? (
                <div className="bg-neutral-950 p-8 rounded-2xl border border-neutral-850 text-center text-xs text-neutral-400">
                  🔍 No complaint credentials found in backlog Matching your filter parameters.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {filteredAdminTickets.map(ticket => {
                    const isActive = ticket.id === selectedTicketId;
                    
                    return (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`w-full p-4 rounded-xl border text-left transition flex flex-col justify-between capitalize ${
                          isActive 
                            ? 'bg-neutral-950 border-rose-500/40' 
                            : 'bg-neutral-950/40 border-neutral-850 hover:bg-neutral-950'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-[#ff1744] font-mono font-bold uppercase">{ticket.referenceNumber}</span>
                          <span className={`text-[8px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            ticket.priority === 'Premium Priority' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-neutral-850 text-neutral-400'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-black text-white mt-1.5 truncate max-w-full leading-snug">{ticket.subject}</h4>
                        <p className="text-[10px] text-neutral-400 mt-1 truncate max-w-full font-sans lowercase">{ticket.description}</p>
                        
                        <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-neutral-900 text-[10px]">
                          <span className="text-indigo-400 font-mono">{ticket.category}</span>
                          <span className={`font-mono text-[9px] px-2 py-0.5 rounded font-black ${
                            ticket.status === 'Open' ? 'text-amber-400 bg-amber-500/10' :
                            ticket.status === 'In Progress' ? 'text-blue-400 bg-blue-500/10' :
                            ticket.status === 'Resolved' ? 'text-[#00e676] bg-emerald-500/10' :
                            'text-neutral-500 bg-neutral-900'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Admin response details */}
            <div className="lg:col-span-7">
              {activeTicket ? (
                <div className="bg-neutral-950 rounded-3xl border border-neutral-850 overflow-hidden flex flex-col h-[520px]">
                  
                  {/* Top bar controls */}
                  <div className="bg-neutral-900 p-4 border-b border-neutral-850 text-left flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] text-neutral-500 font-mono">{activeTicket.referenceNumber} • Filed by {activeTicket.userEmail}</span>
                      <h4 className="text-xs font-black text-white leading-none mt-0.5">{activeTicket.subject}</h4>
                    </div>

                    <div className="flex gap-2">
                      {/* Priority toggle */}
                      <button
                        onClick={() => {
                          const nextPriority = activeTicket.priority === 'Standard' ? 'Premium Priority' : 'Standard';
                          handleUpdateTicketPriority(activeTicket.id, nextPriority);
                        }}
                        className="p-1 px-2.5 bg-neutral-950 text-neutral-400 hover:text-white rounded text-[10px] border border-neutral-800 font-mono"
                      >
                        Escalate Priority
                      </button>
                    </div>
                  </div>

                  {/* Operational details card */}
                  <div className="bg-neutral-900/40 p-4 border-b border-neutral-850/50 text-xs text-left grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block">State Tracking Selector</span>
                      <div className="flex gap-1 mt-1">
                        {(['Open', 'In Progress', 'Resolved', 'Closed'] as const).map(state => (
                          <button
                            key={state}
                            onClick={() => handleUpdateTicketStatus(activeTicket.id, state)}
                            className={`px-1.5 py-0.8 rounded text-[9px] font-mono transition-all font-bold ${
                              activeTicket.status === state
                                ? 'bg-indigo-600 text-white'
                                : 'bg-neutral-950 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {state}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block">Evidence ledger trace</span>
                      <span className="text-xs font-mono font-bold block text-white mt-0.5">
                        {activeTicket.disputedAmount ? `${activeTicket.disputedAmount} Coins` : 'No Disputed Coins'}
                      </span>
                      {activeTicket.targetUsername && (
                        <span className="text-[10px] text-rose-400 block font-bold font-mono">Reported creator: @{activeTicket.targetUsername}</span>
                      )}
                    </div>
                  </div>

                  {/* Messages logs stream */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-950">
                    <p className="text-[10px] text-neutral-500 text-center font-mono">Complies with user trust & safety auditing rules.</p>
                    
                    {activeTicket.messages.map(m => (
                      <div
                        key={m.id}
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-normal text-left ${
                          m.sender === 'agent'
                            ? 'bg-neutral-900 border border-neutral-800 text-indigo-400 ml-auto'
                            : 'bg-[#1b1e22]/50 border border-neutral-800 text-white mr-auto'
                        }`}
                      >
                        <span className="text-[9px] font-mono uppercase text-neutral-400 font-extrabold">{m.senderName}</span>
                        <p className="mt-1 font-sans text-neutral-200">{m.text}</p>
                        <span className="text-[8px] text-neutral-500 block text-right mt-1 font-mono">{m.timestamp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Message write section */}
                  <form onSubmit={handleSendChatMessage} className="p-3 bg-neutral-900 border-t border-neutral-850 flex items-center space-x-2">
                    <input
                      type="text"
                      required
                      placeholder="Publish official support feedback message to creator..."
                      value={chatMessageText}
                      onChange={(e) => setChatMessageText(e.target.value)}
                      className="flex-1 bg-neutral-950 text-xs border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-rose-500"
                    />
                    <button
                      type="submit"
                      className="p-2.5 bg-rose-600 hover:bg-rose-500 font-mono text-xs text-white uppercase rounded-xl transition"
                    >
                      Post Reply
                    </button>
                  </form>

                </div>
              ) : (
                <div className="bg-neutral-950 rounded-3xl border border-neutral-850 h-[520px] flex flex-col items-center justify-center p-8 text-center text-neutral-500 space-y-2">
                  <ShieldAlert className="w-10 h-10 text-rose-500 animate-pulse" />
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">Select Active Helpdesk Case</h4>
                  <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                    Verify account disputes, release blocks on cashouts manual orders, or process pending tickets in chronological priorities.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
