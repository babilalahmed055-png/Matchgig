/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Briefcase,
  MessageSquare,
  User as UserIcon,
  Coins,
  ShieldCheck,
  LogOut,
  Gem,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  Heart,
  X,
  CreditCard,
  Bell,
  Check,
  ShieldCheck as ShieldIcon
} from 'lucide-react';

// Data and Types
import { INITIAL_USERS, INITIAL_GIGS, VIRTUAL_GIFTS } from './data';
import { User, Gig, Message, Transaction, GigOrder, SubscriptionType, WithdrawalRequest, CoinPackage, CoinEconomySettings } from './types';

// Child components
import HomeFeed from './components/HomeFeed';
import SupportCenter from './components/SupportCenter';
import AuthenticationSystem from './components/AuthenticationSystem';
import AIAssistantWidget from './components/AIAssistantWidget';
import GiftsOverlay from './components/GiftsOverlay';
import CoinWalletModal from './components/CoinWalletModal';
import Marketplace from './components/Marketplace';
import Profiles from './components/Profiles';
import ChatSystem from './components/ChatSystem';
import Subscription from './components/Subscription';
import AdminPanel from './components/AdminPanel';

import GamificationCenter from './components/GamificationCenter';
import SecurityCenter from './components/SecurityCenter';
import ConsultationCenter from './components/ConsultationCenter';
import CommunityCenter from './components/CommunityCenter';
import ReferralCenter from './components/ReferralCenter';
import AICenter from './components/AICenter';
import BusinessDashboard from './components/BusinessDashboard';
import FlutterHub from './components/FlutterHub';
import PrivacyGovernance from './components/PrivacyGovernance';

export default function App() {
  // Global Persisted State
  const [users, setUsers] = useState<User[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<GigOrder[]>([]);

  // Admin Coin Management State
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>([]);
  const [economySettings, setEconomySettings] = useState<CoinEconomySettings>({
    coinName: 'MatchGig Coin',
    coinSymbol: '🪙',
    pkrRate: 1,
    standardFee: 20,
    premiumFee: 10,
    maxDailyTransaction: 10000,
    escrowCommission: 15
  });
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  // Navigation and Auth
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<'home' | 'marketplace' | 'messages' | 'profiles' | 'subscription' | 'admin' | 'orders' | 'business_hub' | 'expert_suite' | 'rewards_hub' | 'flutter_suite' | 'privacy_hub' | 'support'>('home');

  // Multi-tier nested subtab states
  const [expertSubTab, setExpertSubTab] = useState<'consultations' | 'academy'>('consultations');
  const [rewardsSubTab, setRewardsSubTab] = useState<'gamification' | 'optimizer' | 'security' | 'referrals'>('gamification');

  // Dynamic Interactive Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Gig Match Found 🎯', text: 'AI matched your skills profile to Project Request: Vertical YouTube short audits!', date: 'Just Now', unread: true },
    { id: '2', title: 'Gift Received (+25 Coins) 🌹', text: 'Regular user usman_pk sent you an live Rose virtual gift.', date: '12 mins ago', unread: true },
    { id: '3', title: 'Secure Escrow Deposited 💼', text: 'Client Imran initialized contract budget escrow funds in order #ord_92f.', date: '2 hrs ago', unread: false },
    { id: '4', title: 'Live Creator Broadcast 🎥', text: 'Fatima Malik is going live with real-time UI/UX wireframing!', date: '3 hrs ago', unread: false },
    { id: '5', title: 'VIP Expiration Alert 👑', text: 'Premium verified validation status expires in 25 days.', date: '1 day ago', unread: false },
  ]);

  // Modals and visual event triggers
  const [showWallet, setShowWallet] = useState(false);
  const [activeGiftCelebration, setActiveGiftCelebration] = useState<{ icon: string; label: string; timestamp: number } | null>(null);

  // Authentication Fields (Sign up)
  const [signupUsername, setSignupUsername] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState<'Regular' | 'Freelancer' | 'Client'>('Regular');

  // Load and initialize states from LocalStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('matchgig_users');
    const savedGigs = localStorage.getItem('matchgig_gigs');
    const savedMessages = localStorage.getItem('matchgig_messages');
    const savedTransactions = localStorage.getItem('matchgig_transactions');
    const savedOrders = localStorage.getItem('matchgig_orders');
    const savedActiveUserId = localStorage.getItem('matchgig_active_user_id');

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(INITIAL_USERS);
      localStorage.setItem('matchgig_users', JSON.stringify(INITIAL_USERS));
    }

    if (savedGigs) {
      setGigs(JSON.parse(savedGigs));
    } else {
      setGigs(INITIAL_GIGS);
      localStorage.setItem('matchgig_gigs', JSON.stringify(INITIAL_GIGS));
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Seed initial messages
      const initialMessages: Message[] = [
        {
          id: 'm1',
          senderId: 'user_1',
          receiverId: 'user_4',
          text: 'Assalam-o-Alaikum Imran! I updated the modern UI retro guidelines mockup deck. Let me know if you would like custom adjustments.',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'm2',
          senderId: 'user_4',
          receiverId: 'user_1',
          text: 'Walaikum Assalam Fatima! These mockups look gorgeous. I want to hire you to scale our SaaS branding guidelines logo immediately.',
          type: 'text',
          timestamp: new Date(Date.now() - 3000000).toISOString()
        }
      ];
      setMessages(initialMessages);
      localStorage.setItem('matchgig_messages', JSON.stringify(initialMessages));
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      const initialTx: Transaction[] = [
        {
          id: 't1',
          userId: 'user_4',
          type: 'purchase',
          amount: 25000,
          description: 'Refilled Wallet Coins using Stripe simulated payment sandbox',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      setTransactions(initialTx);
      localStorage.setItem('matchgig_transactions', JSON.stringify(initialTx));
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders([]);
    }

    const savedCoinPackages = localStorage.getItem('matchgig_coin_packages');
    const savedEconomySettings = localStorage.getItem('matchgig_economy_settings');
    const savedWithdrawals = localStorage.getItem('matchgig_withdrawals');

    if (savedCoinPackages) {
      setCoinPackages(JSON.parse(savedCoinPackages));
    } else {
      const defaultPkgs: CoinPackage[] = [
        { id: 'coin_p1', amount: 100, price: 100, bonus: 0, currency: 'PKR', isActive: true },
        { id: 'coin_p2', amount: 500, price: 450, bonus: 25, currency: 'PKR', isActive: true },
        { id: 'coin_p3', amount: 1000, price: 850, bonus: 100, currency: 'PKR', isActive: true },
        { id: 'coin_p4', amount: 5000, price: 4000, bonus: 750, currency: 'PKR', isActive: true }
      ];
      setCoinPackages(defaultPkgs);
      localStorage.setItem('matchgig_coin_packages', JSON.stringify(defaultPkgs));
    }

    if (savedEconomySettings) {
      setEconomySettings(JSON.parse(savedEconomySettings));
    } else {
      const defaultEconomy: CoinEconomySettings = {
        coinName: 'MatchGig Coin',
        coinSymbol: '🪙',
        pkrRate: 1,
        standardFee: 20,
        premiumFee: 10,
        maxDailyTransaction: 10000,
        escrowCommission: 15
      };
      setEconomySettings(defaultEconomy);
      localStorage.setItem('matchgig_economy_settings', JSON.stringify(defaultEconomy));
    }

    if (savedWithdrawals) {
      setWithdrawals(JSON.parse(savedWithdrawals));
    } else {
      const defaultWiths: WithdrawalRequest[] = [
        { id: 'w_1', userId: 'user_1', userName: 'Fatima Malik', userUsername: 'designer_fatima', amount: 500, method: 'Easypaisa', accountNumber: '03001234567', accountName: 'Fatima Malik', status: 'Pending' as const, date: '2026-06-17', feeDeducted: 100, netPayout: 400 },
        { id: 'w_2', userId: 'user_2', userName: 'Hamza Siddiqui', userUsername: 'editor_hamza', amount: 1000, method: 'Bank Transfer', accountNumber: 'PK00MEZN00123456789', accountName: 'Hamza Siddiqui', status: 'Pending' as const, date: '2026-06-18', feeDeducted: 200, netPayout: 800 }
      ];
      setWithdrawals(defaultWiths);
      localStorage.setItem('matchgig_withdrawals', JSON.stringify(defaultWiths));
    }

    if (savedActiveUserId) {
      setCurrentUserId(savedActiveUserId);
    } else {
      // Auto-set default demo login to Fatima (Freelancer) for excellent out-of-box experience
      setCurrentUserId('user_1');
      localStorage.setItem('matchgig_active_user_id', 'user_1');
    }
  }, []);

  // Helper sync tool
  const syncState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleUpdateUsersList = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    syncState('matchgig_users', updatedUsers);
  };

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  // Custom Core Actions
  const handleLogin = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem('matchgig_active_user_id', userId);
    setActiveMenu('marketplace');
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    localStorage.removeItem('matchgig_active_user_id');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupUsername || !signupName || !signupEmail) return;

    const newId = 'user_' + Math.random().toString(36).substring(2, 9);
    const newUser: User = {
      id: newId,
      username: signupUsername.toLowerCase().trim(),
      name: signupName.trim(),
      email: signupEmail.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
      role: signupRole,
      bio: `Hi, I am ${signupName}. Looking to connect, trade services, go live, and support creative makers on MatchGig!`,
      skills: signupRole === 'Freelancer' ? ['Logo Design', 'UI/UX'] : ['Hiring', 'Growth'],
      city: 'Karachi',
      country: 'Pakistan',
      coins: signupRole === 'Client' ? 1000 : 250,
      rating: 0,
      completedJobs: 0,
      badge: 'None',
      experiences: [],
      portfolio: [],
      subscription: 'Free'
    };

    const updated = [...users, newUser];
    handleUpdateUsersList(updated);
    setCurrentUserId(newId);
    localStorage.setItem('matchgig_active_user_id', newId);
    setActiveMenu('marketplace');

    // Reset signup inputs
    setSignupUsername('');
    setSignupName('');
    setSignupEmail('');
  };

  // Add Coins to Profile Log
  const handleCoinsPurchased = (addAmount: number, description: string) => {
    if (!currentUser) return;

    const updatedUsers = users.map((u) =>
      u.id === currentUser.id ? { ...u, coins: u.coins + addAmount } : u
    );
    handleUpdateUsersList(updatedUsers);

    // Record Transaction log matching guidelines
    const newTx: Transaction = {
      id: 'tx_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      type: 'purchase',
      amount: addAmount,
      description,
      timestamp: new Date().toISOString()
    };

    const newTxList = [newTx, ...transactions];
    setTransactions(newTxList);
    syncState('matchgig_transactions', newTxList);
  };

  // Chat message transfer & messaging logs
  const handleSendMessage = (
    receiverId: string,
    text: string,
    type: Message['type'] = 'text',
    options?: Partial<Message>
  ) => {
    if (!currentUser) return;

    const newMsg: Message = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      senderId: options?.senderId || currentUser.id,
      receiverId: options?.receiverId || receiverId,
      text,
      type,
      giftType: options?.giftType,
      coinsCount: options?.coinsCount,
      timestamp: new Date().toISOString()
    };

    const newMessagesList = [...messages, newMsg];
    setMessages(newMessagesList);
    syncState('matchgig_messages', newMessagesList);
  };

  // Virtual Gift Coins Transfer
  const handleCoinsTransfer = (amount: number, targetId: string, description: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.coins < amount) return false;

    const targetUser = users.find((u) => u.id === targetId);
    const isGift = description.toLowerCase().includes('gift') || description.toLowerCase().includes('awarded') || description.toLowerCase().includes('rewarded');
    
    // Dynamic Revenue Split logic
    let creatorShare = amount;
    let platformFeePercentage = 0;
    
    if (isGift && targetUser) {
      const isPremium = targetUser.subscription === 'Pro' || targetUser.subscription === 'VIP';
      const percentage = isPremium ? 80 : 70;
      platformFeePercentage = 100 - percentage;
      creatorShare = Math.floor((amount * percentage) / 100);
    }

    // Deduct total coins from user, add creator's share to target creator
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, coins: u.coins - amount };
      }
      if (u.id === targetId) {
        return { ...u, coins: u.coins + creatorShare };
      }
      return u;
    });

    handleUpdateUsersList(updatedUsers);

    // Save transactions
    const newTx: Transaction = {
      id: 'tx_gift_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      type: 'spend_gift',
      amount: -amount,
      description: isGift ? `${description} (Dedicated Total Amount)` : description,
      timestamp: new Date().toISOString()
    };

    const targetTx: Transaction = {
      id: 'tx_rec_' + Math.random().toString(36).substring(2, 9),
      userId: targetId,
      type: 'receive_gift',
      amount: creatorShare,
      description: isGift
        ? `Received ${description.split(':')[1]?.trim() || 'virtual share'} from @${currentUser.username} (${100 - platformFeePercentage}% share tier)`
        : `Received payment from @${currentUser.username}`,
      timestamp: new Date().toISOString()
    };

    const newTxList = [newTx, targetTx, ...transactions];
    setTransactions(newTxList);
    syncState('matchgig_transactions', newTxList);

    return true;
  };

  // Virtual Gifting visual overlays triggers
  const handleSendGiftCelebration = (gift: any) => {
    setActiveGiftCelebration({
      icon: gift.icon,
      label: gift.name,
      timestamp: Date.now()
    });
  };

  // Buy service gig order booking
  const handleOrderPlaced = (order: GigOrder) => {
    if (!currentUser) return;

    // deduct coins from buyer (client) as payment escrow
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, coins: u.coins - order.price };
      }
      return u;
    });

    handleUpdateUsersList(updatedUsers);

    // Add Order to list
    const newOrdersList = [order, ...orders];
    setOrders(newOrdersList);
    syncState('matchgig_orders', newOrdersList);

    // Record order transaction
    const newTx: Transaction = {
      id: 'tx_pay_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      type: 'order_pay',
      amount: -order.price,
      description: `Escrow payment lock: Gig purchase "${order.title}"`,
      timestamp: new Date().toISOString()
    };

    const newTxList = [newTx, ...transactions];
    setTransactions(newTxList);
    syncState('matchgig_transactions', newTxList);
  };

  // Release project order completion payout funds
  const handleCompleteOrderPayout = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Deduct platform commission: 15% platform retaining standard
    const commission = 0.15;
    const finalFreelancerPay = order.price * (1 - commission);

    const updatedUsers = users.map((u) => {
      // Add funds to seller (freelancer)
      if (u.id === order.sellerId) {
        return { ...u, coins: u.coins + finalFreelancerPay, completedJobs: u.completedJobs + 1 };
      }
      return u;
    });

    handleUpdateUsersList(updatedUsers);

    // Update status to completed
    const updatedOrdersList = orders.map((o) =>
      o.id === orderId ? { ...o, status: 'completed' as const } : o
    );
    setOrders(updatedOrdersList);
    syncState('matchgig_orders', updatedOrdersList);

    // Save transaction logs
    const newTx: Transaction = {
      id: 'tx_earn_' + Math.random().toString(36).substring(2, 9),
      userId: order.sellerId,
      type: 'order_earn',
      amount: finalFreelancerPay,
      description: `Order completion payout: "${order.title}" (15% commission retained)`,
      timestamp: new Date().toISOString()
    };

    const newTxList = [newTx, ...transactions];
    setTransactions(newTxList);
    syncState('matchgig_transactions', newTxList);
  };

  // Modify subscriber tiers action
  const handleUpdateSubscription = (tier: SubscriptionType, cost: number) => {
    if (!currentUser) return;

    // Deduct coins & upgrade subscription tier
    const badgeType = tier === 'VIP' ? 'Creator' : tier === 'Pro' ? 'Verified' : 'None';
    const updatedUsers = users.map((u) =>
      u.id === currentUser.id
        ? { ...u, coins: u.coins - cost, subscription: tier, badge: badgeType as any }
        : u
    );

    handleUpdateUsersList(updatedUsers);

    // Save transactions
    const newTx: Transaction = {
      id: 'tx_sub_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      type: 'subscription',
      amount: -cost,
      description: `Subscribed to ${tier} Level Plan Account`,
      timestamp: new Date().toISOString()
    };

    const newTxList = [newTx, ...transactions];
    setTransactions(newTxList);
    syncState('matchgig_transactions', newTxList);
  };

  // Coins Reward Deposit (Daily Reward, referrals, challenges etc)
  const handleCoinsReward = (amount: number, description: string) => {
    if (!currentUser) return;
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, coins: u.coins + amount };
      }
      return u;
    });
    handleUpdateUsersList(updatedUsers);

    const newTx: Transaction = {
      id: 'tx_reward_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      type: 'purchase', // matches wallet schema
      amount: amount,
      description,
      timestamp: new Date().toISOString()
    };
    
    const newTxList = [newTx, ...transactions];
    setTransactions(newTxList);
    syncState('matchgig_transactions', newTxList);
  };

  // Update profile portfolios
  const handleAddPortfolio = (userId: string, item: any) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, portfolio: [...u.portfolio, item] } : u
    );
    handleUpdateUsersList(updatedUsers);
  };

  const handleRemovePortfolio = (userId: string, itemId: string) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, portfolio: u.portfolio.filter((p) => p.id !== itemId) } : u
    );
    handleUpdateUsersList(updatedUsers);
  };

  // Simple updates from Admin Panel (Ban/Unban, verified status toggles)
  const handleUpdateUserAdmin = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
    handleUpdateUsersList(updatedUsers);
  };

  const handleUpdateCoinPackages = (updatedPkgs: CoinPackage[]) => {
    setCoinPackages(updatedPkgs);
    syncState('matchgig_coin_packages', updatedPkgs);
  };

  const handleUpdateEconomySettings = (settings: CoinEconomySettings) => {
    setEconomySettings(settings);
    syncState('matchgig_economy_settings', settings);
  };

  const handleUpdateWithdrawalsList = (updatedWithdrawals: WithdrawalRequest[]) => {
    setWithdrawals(updatedWithdrawals);
    syncState('matchgig_withdrawals', updatedWithdrawals);
  };

  const handleWithdrawalRequested = (req: WithdrawalRequest) => {
    const updated = [req, ...withdrawals];
    setWithdrawals(updated);
    syncState('matchgig_withdrawals', updated);
  };

  return (
    <div className={`min-h-screen text-neutral-200 font-sans tracking-tight bg-[#0a0a0a] ${currentUser ? 'pb-24' : ''}`} id="app-viewport">
      {/* Real-time Gift Overlay Particles burst */}
      <GiftsOverlay triggerEvent={activeGiftCelebration} />

      {/* Wallet Modal */}
      {showWallet && currentUser && (
        <CoinWalletModal
          currentUser={currentUser}
          transactions={transactions}
          onClose={() => setShowWallet(false)}
          onCoinsPurchased={handleCoinsPurchased}
          coinPackages={coinPackages}
          economySettings={economySettings}
          onWithdrawalRequested={handleWithdrawalRequested}
        />
      )}

      {/* Main App Bar / Navigation Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 pl-2">
          <div className="bg-gradient-to-tr from-purple-600 to-amber-500 p-2 rounded-xl border border-purple-400/20 shadow-md">
            <Briefcase className="w-5 h-5 text-neutral-950 font-black" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none flex items-center">
              <span>MatchGig</span>
              <span className="text-[10px] ml-1 px-1.5 py-0.2 bg-purple-500/10 text-purple-400 font-mono font-bold rounded border border-purple-500/20">MVP</span>
            </h1>
            <span className="text-[9px] text-neutral-500 font-mono tracking-widest block font-bold uppercase mt-0.5">Freelance & Gifts Portal</span>
          </div>
        </div>

        {currentUser ? (
          /* Navigator buttons rows */
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveMenu('marketplace')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeMenu === 'marketplace' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setActiveMenu('messages')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeMenu === 'messages' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Private Chat 💬
              </button>
              <button
                onClick={() => setActiveMenu('profiles')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeMenu === 'profiles' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Portfolios
              </button>
              <button
                onClick={() => setActiveMenu('business_hub')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeMenu === 'business_hub' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Corporate Hub 💼
              </button>
              <button
                onClick={() => setActiveMenu('expert_suite')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeMenu === 'expert_suite' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Expert Suite 📞
              </button>
              <button
                onClick={() => setActiveMenu('rewards_hub')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeMenu === 'rewards_hub' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Rewards & Security 🛡️
              </button>
              <button
                onClick={() => setActiveMenu('privacy_hub')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeMenu === 'privacy_hub' ? 'bg-[#1b1e22] text-teal-400 border border-teal-500/20' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Privacy & Control 🔒
              </button>
              <button
                onClick={() => setActiveMenu('support')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeMenu === 'support' ? 'bg-neutral-900 text-amber-400 border border-amber-500/20' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Help & Support 🛠️
              </button>
              <button
                onClick={() => setActiveMenu('flutter_suite')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all text-indigo-400 border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/10 hover:text-white`}
              >
                Flutter Mobile Studio 🔮
              </button>
              <button
                onClick={() => setActiveMenu('subscription')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeMenu === 'subscription' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Pro Sub Plans
              </button>
              <button
                onClick={() => setActiveMenu('orders')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                  activeMenu === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Schedules</span>
                {orders.length > 0 && (
                  <span className="bg-purple-600 text-white font-mono text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {orders.length}
                  </span>
                )}
              </button>
              {(currentUser.role === 'Admin' || currentUserId === 'admin_user') && (
                <button
                  onClick={() => setActiveMenu('admin')}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg tracking-wider transition-all uppercase flex items-center space-x-1 ${
                    activeMenu === 'admin'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'text-neutral-400 hover:text-rose-400'
                  }`}
                >
                  <ShieldIcon className="w-3.5 h-3.5" />
                  <span>Admin Hub</span>
                </button>
              )}
            </nav>

            {/* Notifications Alert Dropdown Drawer */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-neutral-900 hover:bg-neutral-850 p-2 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition relative"
                title="View MatchGig dynamic live alerts"
              >
                <Bell className="w-4 h-4 text-current" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-[1px] -right-[1px] bg-amber-500 w-2.5 h-2.5 rounded-full animate-ping"></span>
                )}
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-[1px] -right-[1px] bg-amber-500 w-2.5 h-2.5 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Interactive Notifications</span>
                    <button
                      onClick={() => {
                        const marked = notifications.map(n => ({ ...n, unread: false }));
                        setNotifications(marked);
                      }}
                      className="text-[10px] text-amber-500 hover:underline font-mono"
                    >
                      Clear Unread
                    </button>
                  </div>
                  <div className="space-y-3.5 max-h-[280px] overflow-y-auto divide-y divide-neutral-850">
                    {notifications.map((n) => (
                      <div key={n.id} className="pt-2.5 flex flex-col space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-[11px] uppercase tracking-wider font-mono ${n.unread ? 'text-amber-400 font-extrabold' : 'text-neutral-400'}`}>
                            {n.title}
                          </span>
                          <span className="text-[9px] text-neutral-500 font-mono">{n.date}</span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-snug">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wallet quick balance selector */}
            <button
              onClick={() => setShowWallet(true)}
              className="bg-neutral-900 group hover:bg-neutral-850 px-3 py-1.5 rounded-full border border-neutral-800 flex items-center space-x-2 transition"
              title="Open Coin Wallet Packages & Purchase Simulator"
            >
              <Coins className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-extrabold font-mono text-white">{currentUser.coins.toLocaleString()}</span>
              <span className="hidden sm:inline text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-mono">
                REFILL
              </span>
            </button>

            {/* Profile trigger */}
            <div className="flex items-center space-x-2 border-l border-neutral-800 pl-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-neutral-800"
              />
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-white leading-none">{currentUser.name}</p>
                <span className="text-[9px] text-neutral-500 font-mono block mt-0.5">@{currentUser.username}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Log out from platform"
                className="p-1 px-2 hover:bg-neutral-900 rounded-lg text-neutral-500 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <span className="text-xs font-mono text-neutral-500">Security Sandbox Enabled</span>
        )}
      </header>

      {/* Navigation list for tablets and mobile screens (Responsive) */}
      {currentUser && (
        <div className="md:hidden flex flex-wrap items-center justify-around bg-neutral-950 py-2 border-b border-neutral-900 px-3 gap-y-1 gap-x-2">
          <button
            onClick={() => setActiveMenu('marketplace')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'marketplace' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveMenu('messages')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'messages' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            Chat 💬
          </button>
          <button
            onClick={() => setActiveMenu('profiles')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'profiles' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            Profiles
          </button>
          <button
            onClick={() => setActiveMenu('business_hub')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'business_hub' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            Biz 💼
          </button>
          <button
            onClick={() => setActiveMenu('expert_suite')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'expert_suite' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            Expert 📞
          </button>
          <button
            onClick={() => setActiveMenu('rewards_hub')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'rewards_hub' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            Rewards 🛡️
          </button>
          <button
            onClick={() => setActiveMenu('privacy_hub')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'privacy_hub' ? 'text-teal-400' : 'text-neutral-400'
            }`}
          >
            Privacy 🔒
          </button>
          <button
            onClick={() => setActiveMenu('support')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'support' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            Support 🛠️
          </button>
          <button
            onClick={() => setActiveMenu('flutter_suite')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'flutter_suite' ? 'text-indigo-400' : 'text-neutral-400'
            }`}
          >
            Flutter 🔮
          </button>
          <button
            onClick={() => setActiveMenu('subscription')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'subscription' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            Pro Sub
          </button>
          <button
            onClick={() => setActiveMenu('orders')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              activeMenu === 'orders' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            Schedules
          </button>
          {(currentUser.role === 'Admin' || currentUserId === 'admin_user') && (
            <button
              onClick={() => setActiveMenu('admin')}
              className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded ${
                activeMenu === 'admin' ? 'text-rose-400' : 'text-neutral-500'
              }`}
            >
              Admin
            </button>
          )}
        </div>
      )}

      {/* Active screen viewer router area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8" id="application-body-frame">
        {currentUser ? (
          <div>
            {/* Standard Warning banner if Banned */}
            {currentUser.isBanned && (
              <div className="bg-red-950 border border-red-500/40 text-red-300 p-5 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">Account Restricted / Suspended</h4>
                  <p className="text-xs text-red-400 mt-1">
                    Your MatchGig profile is disabled by Admin due to simulated content policy review flags.
                  </p>
                </div>
                <div className="text-xs bg-red-900/40 border border-red-500/20 px-3 py-1 rounded font-mono">
                  Read Only Mode
                </div>
              </div>
            )}

            {/* Menu screens switch routing */}
            {activeMenu === 'home' && (
              <HomeFeed
                currentUser={currentUser}
                users={users}
                gigs={gigs}
                onCoinsTransfer={handleCoinsTransfer}
                onSendGiftCelebration={handleSendGiftCelebration}
                onOrderPlaced={handleOrderPlaced}
                onOpenWallet={() => setShowWallet(true)}
              />
            )}

            {activeMenu === 'marketplace' && (
              <Marketplace
                gigs={gigs}
                users={users}
                currentUser={currentUser}
                onOrderPlaced={handleOrderPlaced}
                onOpenWallet={() => setShowWallet(true)}
              />
            )}

            {activeMenu === 'messages' && (
              <ChatSystem
                currentUser={currentUser}
                users={users}
                messages={messages}
                onSendMessage={handleSendMessage}
                onCoinsTransfer={handleCoinsTransfer}
                onSendGiftCelebration={handleSendGiftCelebration}
              />
            )}

            {activeMenu === 'profiles' && (
              <Profiles
                currentUser={currentUser}
                users={users}
                gigs={gigs}
                onAddPortfolio={handleAddPortfolio}
                onRemovePortfolio={handleRemovePortfolio}
              />
            )}

            {activeMenu === 'subscription' && (
              <Subscription
                currentUser={currentUser}
                onUpdateSubscription={handleUpdateSubscription}
              />
            )}

            {activeMenu === 'business_hub' && (
              <BusinessDashboard
                currentUser={currentUser}
                onCoinsTransfer={handleCoinsTransfer}
              />
            )}

            {activeMenu === 'expert_suite' && (
              <div className="space-y-6">
                <div className="flex border-b border-neutral-800 pb-1 gap-2 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setExpertSubTab('consultations')}
                    className={`pb-2 px-3 text-xs font-mono font-extrabold uppercase tracking-widest transition whitespace-nowrap ${
                      expertSubTab === 'consultations' ? 'border-b-2 border-amber-500 text-white' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    Audio & Video Consults 📞
                  </button>
                  <button
                    onClick={() => setExpertSubTab('academy')}
                    className={`pb-2 px-3 text-xs font-mono font-extrabold uppercase tracking-widest transition whitespace-nowrap ${
                      expertSubTab === 'academy' ? 'border-b-2 border-amber-500 text-white' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    Skills Academy & Networks 🎓
                  </button>
                </div>

                <div className="mt-4">
                  {expertSubTab === 'consultations' ? (
                    <ConsultationCenter
                      currentUser={currentUser}
                      users={users}
                      onCoinsTransfer={handleCoinsTransfer}
                    />
                  ) : (
                    <CommunityCenter
                      currentUser={currentUser}
                    />
                  )}
                </div>
              </div>
            )}

            {activeMenu === 'rewards_hub' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex border-b border-neutral-800 pb-1 gap-2 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setRewardsSubTab('gamification')}
                    className={`pb-2 px-3 text-xs font-mono font-extrabold uppercase tracking-widest transition whitespace-nowrap ${
                      rewardsSubTab === 'gamification' ? 'border-b-2 border-amber-500 text-white' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    Gamification Rewards 🏆
                  </button>
                  <button
                    onClick={() => setRewardsSubTab('optimizer')}
                    className={`pb-2 px-3 text-xs font-mono font-extrabold uppercase tracking-widest transition whitespace-nowrap ${
                      rewardsSubTab === 'optimizer' ? 'border-b-2 border-amber-500 text-white' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    Gemini AI Optimizer 🤖
                  </button>
                  <button
                    onClick={() => setRewardsSubTab('security')}
                    className={`pb-2 px-3 text-xs font-mono font-extrabold uppercase tracking-widest transition whitespace-nowrap ${
                      rewardsSubTab === 'security' ? 'border-b-2 border-amber-500 text-white' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    SMS 2FA Security 🛡️
                  </button>
                  <button
                    onClick={() => setRewardsSubTab('referrals')}
                    className={`pb-2 px-3 text-xs font-mono font-extrabold uppercase tracking-widest transition whitespace-nowrap ${
                      rewardsSubTab === 'referrals' ? 'border-b-2 border-amber-500 text-white' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    Referrals Program ✉️
                  </button>
                </div>

                <div className="mt-4">
                  {rewardsSubTab === 'gamification' ? (
                    <GamificationCenter
                      currentUser={currentUser}
                      users={users}
                      onCoinsReward={handleCoinsReward}
                    />
                  ) : rewardsSubTab === 'optimizer' ? (
                    <AICenter
                      currentUser={currentUser}
                      gigs={gigs}
                    />
                  ) : rewardsSubTab === 'security' ? (
                    <SecurityCenter
                      currentUser={currentUser}
                    />
                  ) : (
                    <ReferralCenter
                      currentUser={currentUser}
                      onCoinsReward={handleCoinsReward}
                    />
                  )}
                </div>
              </div>
            )}

            {activeMenu === 'flutter_suite' && (
              <FlutterHub
                currentUser={currentUser}
                onCoinsReward={handleCoinsReward}
              />
            )}

            {activeMenu === 'privacy_hub' && (
              <PrivacyGovernance
                currentUser={currentUser}
                users={users}
                gigs={gigs}
                onUpdateUser={handleUpdateUserAdmin}
              />
            )}

            {activeMenu === 'admin' && (
              <AdminPanel
                users={users}
                onUpdateUser={handleUpdateUserAdmin}
                onCoinsPurchased={handleCoinsPurchased}
                transactions={transactions}
                onUpdateTransactionsList={(txList) => {
                  setTransactions(txList);
                  syncState('matchgig_transactions', txList);
                }}
                coinPackages={coinPackages}
                onUpdateCoinPackages={handleUpdateCoinPackages}
                economySettings={economySettings}
                onUpdateEconomySettings={handleUpdateEconomySettings}
                withdrawals={withdrawals}
                onUpdateWithdrawalsList={handleUpdateWithdrawalsList}
              />
            )}

            {activeMenu === 'orders' && (
              /* Order schedules list track panel */
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">System Order Escrows Schedules</h3>
                  <p className="text-neutral-400 text-xs mt-1">
                    Funds holding system. Payout gets deposited to freelancer wallet packages upon final client approval.
                  </p>
                </div>

                <div className="space-y-4 max-w-4xl">
                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
                      <p className="text-xs text-neutral-500 font-mono">No active contract escrow orders logged.</p>
                      <button
                        onClick={() => setActiveMenu('marketplace')}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl"
                      >
                        Browse Service Marketplace Gigs
                      </button>
                    </div>
                  ) : (
                    orders.map((ord) => {
                      const buyer = users.find((u) => u.id === ord.buyerId);
                      const seller = users.find((u) => u.id === ord.sellerId);
                      const isBuyer = currentUser.id === ord.buyerId;
                      const isSeller = currentUser.id === ord.sellerId;

                      return (
                        <div
                          key={ord.id}
                          className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono font-bold bg-neutral-950 px-2 py-0.5 rounded text-neutral-400 uppercase">
                                ID: #{ord.id}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                                  ord.status === 'completed'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-amber-500/10 text-amber-500'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>

                            <h4 className="text-base font-extrabold text-white mt-2 leading-tight">{ord.title}</h4>

                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-neutral-500 font-mono">
                              {buyer && (
                                <span>
                                  Client Buyer: <span className="text-neutral-300 font-bold">@{buyer.username}</span>
                                </span>
                              )}
                              {seller && (
                                <span>
                                  Freelancer Creator: <span className="text-neutral-300 font-bold">@{seller.username}</span>
                                </span>
                              )}
                              <span>Due Delivery Date: {new Date(ord.deliveryDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 self-end md:self-auto pt-4 md:pt-0 border-t border-neutral-850 md:border-transparent w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                              <span className="text-[10px] text-neutral-500 uppercase font-mono block">Order Escrow Value</span>
                              <span className="text-lg font-black text-amber-400 font-mono">
                                {ord.price} 🪙
                              </span>
                            </div>

                            {ord.status === 'pending' && isBuyer && (
                              <button
                                onClick={() => handleCompleteOrderPayout(ord.id)}
                                className="px-4 py-2 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-xl shadow hover:bg-emerald-400 transition"
                              >
                                Approve Payout Payout Cash
                              </button>
                            )}

                            {ord.status === 'pending' && isSeller && (
                              <span className="text-xs bg-neutral-950 border border-neutral-850 px-3 py-1.5 rounded-lg text-neutral-400 block font-semibold italic">
                                Active Production
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeMenu === 'support' && (
              <SupportCenter
                currentUser={currentUser}
                users={users}
                onOpenWallet={() => setShowWallet(true)}
              />
            )}
          </div>
        ) : (
          <AuthenticationSystem
            users={users}
            onUpdateUsers={handleUpdateUsersList}
            onLoginSuccess={(uid) => {
              setCurrentUserId(uid);
              localStorage.setItem('matchgig_active_user_id', uid);
              setActiveMenu('marketplace');
            }}
          />
        )}
      </main>

      {/* Primary Bottom Menu sticky navigation bar (🏠 Home, 💼 Services, 💰 Wallet, 👤 Profile) */}
      {currentUser && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto bg-neutral-950/90 backdrop-blur-xl border border-neutral-800 rounded-2xl py-3 px-6 z-55 flex items-center justify-around shadow-2xl animate-fadeIn">
          {/* 🏠 Home Button */}
          <button
            onClick={() => setActiveMenu('home')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all focus:outline-none ${
              activeMenu === 'home'
                ? 'text-amber-400 scale-110 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Home</span>
          </button>

          {/* 💼 Services Button */}
          <button
            onClick={() => setActiveMenu('marketplace')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all focus:outline-none ${
              activeMenu === 'marketplace'
                ? 'text-amber-400 scale-110 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span className="text-lg">💼</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Services</span>
          </button>

          {/* 💰 Wallet Button */}
          <button
            onClick={() => setShowWallet(true)}
            className="flex flex-col items-center justify-center space-y-1 transition-all text-neutral-400 hover:text-white focus:outline-none group"
            title="Open Coins & Checkout Wallet System"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">💰</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Wallet</span>
          </button>

          {/* 👤 Profile Button */}
          <button
            onClick={() => setActiveMenu('profiles')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all focus:outline-none ${
              activeMenu === 'profiles'
                ? 'text-amber-400 scale-110 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Profile</span>
          </button>
        </div>
      )}

      {/* Persistent global footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-6 text-center text-xs text-neutral-500 font-mono">
        <p>© 2026 MatchGig Platform, Inc. All rights reserved. Operating behind sandboxed proxy port 3000.</p>
      </footer>

      {/* Floating 24/7 AI Support Assistant Widget */}
      {currentUser && (
        <AIAssistantWidget
          currentUser={currentUser}
          setActiveMenu={setActiveMenu}
          onOpenWallet={() => setShowWallet(true)}
        />
      )}
    </div>
  );
}
