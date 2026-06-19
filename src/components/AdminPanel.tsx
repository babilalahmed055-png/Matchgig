/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  ShieldCheck,
  Ban,
  DollarSign,
  AlertTriangle,
  Tv,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Gift,
  Plus,
  Settings,
  Database,
  BarChart3,
  Search,
  Filter,
  ArrowUpDown,
  Coins,
  Layers,
  Sparkle,
  Trash2,
  RefreshCw,
  Award,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { User, BadgeType, SubscriptionType, Transaction, CoinPackage, CoinEconomySettings, WithdrawalRequest } from '../types';

interface AdminPanelProps {
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onCoinsPurchased: (amount: number, description: string) => void;
  transactions: Transaction[];
  onUpdateTransactionsList: (txList: Transaction[]) => void;
  coinPackages: CoinPackage[];
  onUpdateCoinPackages: (pkgs: CoinPackage[]) => void;
  economySettings: CoinEconomySettings;
  onUpdateEconomySettings: (settings: CoinEconomySettings) => void;
  withdrawals: WithdrawalRequest[];
  onUpdateWithdrawalsList: (withs: WithdrawalRequest[]) => void;
}

export default function AdminPanel({
  users,
  onUpdateUser,
  transactions,
  onUpdateTransactionsList,
  coinPackages,
  onUpdateCoinPackages,
  economySettings,
  onUpdateEconomySettings,
  withdrawals,
  onUpdateWithdrawalsList
}: AdminPanelProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<'directory' | 'withdrawals' | 'packages' | 'economy' | 'transactions'>('directory');

  // Search/Filters
  const [userSearchText, setUserSearchText] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<string>('all');
  const [txSearchText, setTxSearchText] = useState('');
  const [txSortOrder, setTxSortOrder] = useState<'newest' | 'oldest' | 'amount_desc' | 'amount_asc'>('newest');

  // Bonus Distribution Form States
  const [bonusAmount, setBonusAmount] = useState<string>('150');
  const [bonusTargetRole, setBonusTargetRole] = useState<'All' | 'Freelancer' | 'Client' | 'Regular'>('All');
  const [bonusReason, setBonusReason] = useState<string>('System-wide community loyalty bonus drop');
  const [bonusNotification, setBonusNotification] = useState<string | null>(null);

  // New Coin Package Form States
  const [newPkgAmount, setNewPkgAmount] = useState<string>('2000');
  const [newPkgPrice, setNewPkgPrice] = useState<string>('1600');
  const [newPkgBonus, setNewPkgBonus] = useState<string>('300');
  const [newPkgCurrency, setNewPkgCurrency] = useState<string>('PKR');

  // Modal Overlays state variables
  const [rewardingUser, setRewardingUser] = useState<User | null>(null);
  const [rewardAmountText, setRewardAmountText] = useState('200');
  const [rewardReason, setRewardReason] = useState('Excellent platform contribution reward');

  const [adjustingUser, setAdjustingUser] = useState<User | null>(null);
  const [adjustAmountText, setAdjustAmountText] = useState('');

  const [rejectionModal, setRejectionModal] = useState<WithdrawalRequest | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('Documents validation discrepancy');

  // Summarize stats
  const totalUsersCount = users.length;
  const totalCirculation = users.reduce((sum, u) => sum + u.coins, 0);

  // Summarize analytical telemetry from transaction list
  const totalPurchasesVolume = transactions
    .filter(t => t.type === 'purchase' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGiftsExchanged = transactions
    .filter(t => t.type === 'spend_gift')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalPendingLiability = withdrawals
    .filter(w => w.status === 'Pending')
    .reduce((sum, w) => sum + w.amount, 0);

  const totalWithdrawnCertified = withdrawals
    .filter(w => w.status === 'Approved')
    .reduce((sum, w) => sum + w.amount, 0);

  // Platform commissions estimation
  // Payout tax commission retained on Approved cashouts:
  const platformWithdrawalTaxCollected = withdrawals
    .filter(w => w.status === 'Approved')
    .reduce((sum, w) => sum + (w.feeDeducted || 0), 0);

  // platform standard order completion retention simulated from orders history or standard flat rate:
  const orderCommissionsRetained = transactions
    .filter(t => t.description.toLowerCase().includes('commission') || t.description.toLowerCase().includes('retained'))
    .reduce((sum, t) => sum + Math.abs(t.amount * 0.15), 0); // estimation

  const grossPlatformEarnings = platformWithdrawalTaxCollected + orderCommissionsRetained + 1450; // 1450 standard base

  // Execute User Specific Rewards
  const triggerRewardUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardingUser) return;
    const amount = parseInt(rewardAmountText) || 0;
    if (amount <= 0) {
      alert('Please specify a positive reward coins amount.');
      return;
    }

    // Step 1: Update target user wallet coin count
    onUpdateUser(rewardingUser.id, { coins: rewardingUser.coins + amount });

    // Step 2: Post transaction log
    const newTx: Transaction = {
      id: 'tx_admin_' + Math.random().toString(36).substring(2, 9),
      userId: rewardingUser.id,
      type: 'bonus',
      amount: amount,
      description: `🎁 Rewarded by Admin: ${rewardReason}`,
      timestamp: new Date().toISOString()
    };
    onUpdateTransactionsList([newTx, ...transactions]);

    setBonusNotification(`Successfully rewarded ${amount} bonus coins to @${rewardingUser.username}!`);
    setRewardingUser(null);
    setRewardAmountText('200');
    setRewardReason('Excellent platform contribution reward');
    setTimeout(() => setBonusNotification(null), 4000);
  };

  // Execute User Direct Balance Override
  const triggerBalanceAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser) return;
    const targetAmt = parseInt(adjustAmountText);
    if (isNaN(targetAmt) || targetAmt < 0) {
      alert('Please specify a valid non-negative coins number.');
      return;
    }

    const difference = targetAmt - adjustingUser.coins;
    if (difference === 0) {
      setAdjustingUser(null);
      return;
    }

    // Step 1: Force override coin count
    onUpdateUser(adjustingUser.id, { coins: targetAmt });

    // Step 2: Log adjustment audit transaction
    const newTx: Transaction = {
      id: 'tx_adjust_' + Math.random().toString(36).substring(2, 9),
      userId: adjustingUser.id,
      type: 'adjustment',
      amount: difference,
      description: `⚙️ Admin Balance Correction: adjusted from ${adjustingUser.coins} to ${targetAmt} (Delta: ${difference > 0 ? '+' : ''}${difference})`,
      timestamp: new Date().toISOString()
    };
    onUpdateTransactionsList([newTx, ...transactions]);

    setBonusNotification(`Direct override completed for @${adjustingUser.username}: Set balance to ${targetAmt} Coins`);
    setAdjustingUser(null);
    setAdjustAmountText('');
    setTimeout(() => setBonusNotification(null), 4000);
  };

  // Execute Global Role-based Bonus drop
  const triggerRoleBonusDistribution = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(bonusAmount) || 0;
    if (amount <= 0) {
      alert('Specify a positive coin volume.');
      return;
    }

    let targetUsers = users;
    if (bonusTargetRole !== 'All') {
      targetUsers = users.filter(u => u.role === bonusTargetRole);
    }

    if (targetUsers.length === 0) {
      alert(`No users match the category filter ${bonusTargetRole}`);
      return;
    }

    const confirmDrop = confirm(`Are you sure you want to distribute a bonus of ${amount} Coins to all ${targetUsers.length} users with "${bonusTargetRole}" role?`);
    if (!confirmDrop) return;

    // Batch update users
    targetUsers.forEach(u => {
      onUpdateUser(u.id, { coins: u.coins + amount });
    });

    // Create audit transaction logs
    const newTxLogs: Transaction[] = targetUsers.map(u => ({
      id: 'tx_drop_' + Math.random().toString(36).substring(2, 9),
      userId: u.id,
      type: 'bonus' as const,
      amount: amount,
      description: `🎉 Bonus Pack Distribution drop: ${bonusReason}`,
      timestamp: new Date().toISOString()
    }));

    onUpdateTransactionsList([...newTxLogs, ...transactions]);

    setBonusNotification(`Successfully distributed +${amount} Coins matching pool drop to ${targetUsers.length} users!`);
    setBonusAmount('150');
    setBonusReason('System-wide community loyalty bonus drop');
    setTimeout(() => setBonusNotification(null), 5000);
  };

  // Approve / Decline Withdrawal Requests
  const handleWithdrawalApproval = (requestId: string) => {
    const request = withdrawals.find(w => w.id === requestId);
    if (!request) return;

    const confirmApprove = confirm(`Approve withdrawal of ${request.amount} Coins (Net PKR: ${request.netPayout}) for ${request.userName}?`);
    if (!confirmApprove) return;

    // Update withdrawal status to approved
    const updatedWiths = withdrawals.map(w =>
      w.id === requestId ? { ...w, status: 'Approved' as const } : w
    );
    onUpdateWithdrawalsList(updatedWiths);

    // Record formal transaction entry
    const newTx: Transaction = {
      id: 'tx_w_aprv_' + Math.random().toString(36).substring(2, 9),
      userId: request.userId,
      type: 'withdrawal',
      amount: -request.amount,
      description: `✅ Withdrawal Approved: Sent ${request.netPayout} PKR to ${request.method} (${request.accountNumber})`,
      timestamp: new Date().toISOString()
    };
    onUpdateTransactionsList([newTx, ...transactions]);

    setBonusNotification(`payout Approved: Released ledger clearance for ${request.userName}`);
    setTimeout(() => setBonusNotification(null), 4000);
  };

  const handleWithdrawalDeclineClick = (req: WithdrawalRequest) => {
    setRejectionModal(req);
    setRejectionReasonText('Simulated validation dispute: Please contact local verification desk.');
  };

  const executeWithdrawalDecline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModal) return;

    const req = rejectionModal;

    // Step 1: Update request status
    const updatedWiths = withdrawals.map(w =>
      w.id === req.id ? { ...w, status: 'Declined' as const, rejectionReason: rejectionReasonText } : w
    );
    onUpdateWithdrawalsList(updatedWiths);

    // Step 2: Refund the deducted coins to user wallet
    const targetUser = users.find(u => u.id === req.userId);
    if (targetUser) {
      onUpdateUser(req.userId, { coins: targetUser.coins + req.amount });
    }

    // Step 3: Record refund transaction audit log
    const refundTx: Transaction = {
      id: 'tx_refund_' + Math.random().toString(36).substring(2, 9),
      userId: req.userId,
      type: 'adjustment',
      amount: req.amount,
      description: `❌ Withdrawal Declined Rejection: Refunded ${req.amount} Coins (Reason: ${rejectionReasonText})`,
      timestamp: new Date().toISOString()
    };
    onUpdateTransactionsList([refundTx, ...transactions]);

    setBonusNotification(`Decline Processed: Coins refunded to @${req.userUsername}`);
    setRejectionModal(null);
    setTimeout(() => setBonusNotification(null), 4000);
  };

  // Packages management (Create Coins)
  const handleTogglePackageStatus = (pkgId: string) => {
    const updated = coinPackages.map(p =>
      p.id === pkgId ? { ...p, isActive: !p.isActive } : p
    );
    onUpdateCoinPackages(updated);
  };

  const handleDeletePackage = (pkgId: string) => {
    const confirmDel = confirm('Delete this Coin Package option permanently? It will no longer show in the Store storefront.');
    if (!confirmDel) return;
    const updated = coinPackages.filter(p => p.id !== pkgId);
    onUpdateCoinPackages(updated);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(newPkgAmount) || 0;
    const price = parseInt(newPkgPrice) || 0;
    const bonus = parseInt(newPkgBonus) || 0;

    if (amount <= 0 || price <= 0) {
      alert('Amount and price must be greater than zero.');
      return;
    }

    const newPkg: CoinPackage = {
      id: 'coin_p_' + Math.random().toString(36).substring(2, 9),
      amount,
      price,
      bonus,
      currency: newPkgCurrency,
      isActive: true
    };

    onUpdateCoinPackages([...coinPackages, newPkg]);

    setBonusNotification(`Created package "${amount} Coins" option successfully!`);
    setNewPkgAmount('2000');
    setNewPkgPrice('1600');
    setNewPkgBonus('300');
    setTimeout(() => setBonusNotification(null), 4000);
  };

  // Modify user profile structures directly (Suspend, Badges, Plans)
  const handleToggleBan = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      onUpdateUser(userId, { isBanned: !user.isBanned });
    }
  };

  const handleUpdateBadge = (userId: string, badge: BadgeType) => {
    onUpdateUser(userId, { badge });
  };

  const handleUpdateSubscription = (userId: string, subscription: SubscriptionType) => {
    onUpdateUser(userId, { subscription });
  };

  // Economy Settings overrides
  const handleSettingsFieldChange = (field: keyof CoinEconomySettings, val: any) => {
    const updated = { ...economySettings, [field]: val };
    onUpdateEconomySettings(updated);
  };

  // Filters applying logic
  // Users Search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearchText.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearchText.toLowerCase()) ||
    u.id.toLowerCase().includes(userSearchText.toLowerCase())
  );

  // Transactions list mapping & filtering
  const filteredTransactions = transactions
    .filter(t => {
      if (txTypeFilter !== 'all' && t.type !== txTypeFilter) return false;
      if (txSearchText) {
        const query = txSearchText.toLowerCase();
        const relatedUser = users.find(u => u.id === t.userId);
        const usernameMatch = relatedUser?.username.toLowerCase().includes(query) || false;
        const nameMatch = relatedUser?.name.toLowerCase().includes(query) || false;
        const descMatch = t.description.toLowerCase().includes(query);
        const txIdMatch = t.id.toLowerCase().includes(query);
        return usernameMatch || nameMatch || descMatch || txIdMatch;
      }
      return true;
    })
    .sort((a, b) => {
      if (txSortOrder === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (txSortOrder === 'oldest') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (txSortOrder === 'amount_desc') {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
      if (txSortOrder === 'amount_asc') {
        return Math.abs(a.amount) - Math.abs(b.amount);
      }
      return 0;
    });

  return (
    <div className="space-y-8 text-left animate-fadeIn" id="admin-management-system">
      {/* Dynamic Toast / Alerts */}
      {bonusNotification && (
        <div className="fixed top-20 right-6 z-50 bg-neutral-900 border-l-4 border-emerald-500 text-neutral-100 p-4 rounded-xl shadow-2xl flex items-center space-x-3 max-w-sm font-sans">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Ledger Auditing Approved</p>
            <p className="text-xs text-neutral-300 mt-0.5">{bonusNotification}</p>
          </div>
        </div>
      )}

      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono tracking-widest text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/15">
              Secure Sandbox
            </span>
            <span className="text-xs uppercase font-mono text-neutral-500">• 1 Coin = 1 PKR</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center space-x-3">
            <ShieldCheck className="w-8 h-8 text-rose-500" />
            <span>Admin Coin Economy Center</span>
          </h2>
          <p className="text-neutral-400 text-xs mt-1">
            Complete platform management: mint custom packages, execute drops, balance adjustments, approve withdrawals, and audit transactional ledgers.
          </p>
        </div>

        {/* Quick Refill Refresher */}
        <button
          onClick={() => {
            const confirmedReset = confirm('Simulate resetting default system settings? Pack configs & ledger entries will reset if you proceed.');
            if (confirmedReset) {
              localStorage.removeItem('matchgig_coin_packages');
              localStorage.removeItem('matchgig_economy_settings');
              localStorage.removeItem('matchgig_withdrawals');
              localStorage.removeItem('matchgig_transactions');
              window.location.reload();
            }
          }}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 p-2 rounded-xl text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 text-xs font-mono font-bold flex items-center space-x-2 self-start shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Economy Presets</span>
        </button>
      </div>

      {/* Main Stats Cards / Dynamic Telemetry Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Coins Circulation</p>
            <h4 className="text-2xl font-black text-white tracking-tight mt-1">
              {totalCirculation.toLocaleString()} <span className="text-xs text-neutral-500 font-normal">PKR</span>
            </h4>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Gross Refills Volume</p>
            <h4 className="text-2xl font-black text-white tracking-tight mt-1">
              {totalPurchasesVolume.toLocaleString()} <span className="text-xs text-neutral-500 font-normal">PKR</span>
            </h4>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Withdrawals Liability</p>
            <h4 className="text-2xl font-black text-indigo-400 tracking-tight mt-1">
              {totalPendingLiability.toLocaleString()} <span className="text-xs text-neutral-500 font-normal">Coins</span>
            </h4>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Admin Platform Revenue</p>
            <h4 className="text-2xl font-black text-white tracking-tight mt-1">
              {grossPlatformEarnings.toFixed(0)} <span className="text-xs text-[#00e676] font-mono font-bold">Rs</span>
            </h4>
          </div>
        </div>
      </div>

      {/* Control Tabs Selector Row */}
      <div className="flex border-b border-neutral-900 pb-1 overflow-x-auto scrollbar-none gap-2">
        {[
          { key: 'directory', label: 'Members & Balances', icon: Users, badge: null },
          { key: 'withdrawals', label: 'Withdrawal Approvals', icon: DollarSign, badge: withdrawals.filter(w => w.status === 'Pending').length },
          { key: 'packages', label: 'Coin Store packages', icon: Layers, badge: null },
          { key: 'economy', label: 'Economy Control Settings', icon: Settings, badge: null },
          { key: 'transactions', label: 'Full System Audit Logs', icon: Database, badge: transactions.length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 pb-3.5 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === tab.key 
                ? 'border-rose-500 text-white' 
                : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-800'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-rose-500' : 'text-neutral-500'}`} />
            <span>{tab.label}</span>
            {tab.badge !== null && tab.badge > 0 && (
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                tab.key === 'withdrawals' ? 'bg-amber-500 text-neutral-950 animate-pulse' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Area Rendering Controller */}
      <div className="mt-4">
        
        {/* MEMBERS & BALANCES TAB */}
        {activeTab === 'directory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Directory List Column (2 Cols wide) */}
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>Target Member Directory</span>
                    <span className="text-xs font-mono font-semibold bg-neutral-800 text-neutral-400 px-2.5 py-0.5 rounded-full">
                      {filteredUsers.length} records
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500">Edit member permissions and manage/override coin wallet balances.</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search name, handle or ID..."
                    value={userSearchText}
                    onChange={(e) => setUserSearchText(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 pl-9 pr-4 py-1.5 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-rose-500 w-full sm:w-56"
                  />
                </div>
              </div>

              {/* Members Grid/Table responsive block */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 font-mono tracking-wider uppercase">
                      <th className="pb-3 font-semibold text-neutral-500">Member details</th>
                      <th className="pb-3 font-semibold text-neutral-500">Balance (Coins)</th>
                      <th className="pb-3 font-semibold text-neutral-500">Match Badge</th>
                      <th className="pb-3 font-semibold text-neutral-500">Plan Tier</th>
                      <th className="pb-3 font-semibold text-neutral-500 text-right">Balance Tuning Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-medium text-neutral-300">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-850/30 transition">
                        <td className="py-4 flex items-center space-x-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 h-9 rounded-xl object-cover ring-2 ring-neutral-800"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-white flex items-center space-x-1">
                              <span>{u.name}</span>
                              {u.isBanned && (
                                <span className="text-[9px] bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/25 font-mono">
                                  Banned
                                </span>
                              )}
                            </p>
                            <span className="text-[10px] text-neutral-500 font-mono block">@{u.username} • {u.role}</span>
                          </div>
                        </td>

                        <td className="py-4">
                          <div className="flex items-center space-x-1.5 font-mono font-bold text-white">
                            <Coins className="w-3.5 h-3.5 text-amber-500" />
                            <span>{u.coins.toLocaleString()}</span>
                          </div>
                        </td>

                        <td className="py-4">
                          <select
                            value={u.badge}
                            onChange={(e) => handleUpdateBadge(u.id, e.target.value as BadgeType)}
                            className="bg-neutral-950 text-neutral-300 border border-neutral-800 rounded-lg p-1 text-[11px] focus:ring-1 focus:ring-rose-500 focus:outline-none focus:border-rose-500 font-mono"
                          >
                            <option value="None">Regular</option>
                            <option value="Verified">Verified ✅</option>
                            <option value="Business">Business 💼</option>
                            <option value="Creator">Creator ✨</option>
                          </select>
                        </td>

                        <td className="py-4">
                          <select
                            value={u.subscription}
                            onChange={(e) => handleUpdateSubscription(u.id, e.target.value as SubscriptionType)}
                            className="bg-neutral-950 text-neutral-300 border border-neutral-800 rounded-lg p-1 text-[11px] focus:ring-1 focus:ring-rose-500 focus:outline-none focus:border-rose-500 font-mono"
                          >
                            <option value="Free">Free Basic</option>
                            <option value="Pro">Pro Access</option>
                            <option value="VIP">VIP Elite</option>
                          </select>
                        </td>

                        <td className="py-4 text-right space-x-1.5">
                          <button
                            onClick={() => {
                              setRewardingUser(u);
                              setRewardAmountText('250');
                              setRewardReason('Excellent community milestone bonus');
                            }}
                            title="Reward user with bonus coins"
                            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-semibold border border-amber-500/15 rounded-md text-[10px] uppercase transition-all font-mono"
                          >
                            Reward
                          </button>
                          <button
                            onClick={() => {
                              setAdjustingUser(u);
                              setAdjustAmountText(u.coins.toString());
                            }}
                            title="Directly manipulate wallet balance"
                            className="px-2 py-1 bg-neutral-950 hover:bg-neutral-80 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-md text-[10px] uppercase transition-all font-mono"
                          >
                            Adjust
                          </button>
                          <button
                            onClick={() => handleToggleBan(u.id)}
                            className={`px-2 py-1 rounded-md text-[10px] uppercase font-semibold transition-all font-mono border ${
                              u.isBanned
                                ? 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border-emerald-500/20'
                                : 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border-red-500/20'
                            }`}
                          >
                            {u.isBanned ? 'Unlock' : 'Ban'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Role-Based Bonus Distribution & Core Info Cards (1 Col) */}
            <div className="space-y-6">
              
              {/* Batch Bonus Drop Form */}
              <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-rose-500" />
                  <span>Batch Drop Bonus Coins</span>
                </h4>
                <p className="text-neutral-500 text-[11px] leading-relaxed mt-1">
                  Distribute virtual coins system-wide, dropping bonus values instantly to targeted groups.
                </p>

                <form onSubmit={triggerRoleBonusDistribution} className="mt-4 space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Target Role Category Filter:</label>
                    <select
                      value={bonusTargetRole}
                      onChange={(e) => setBonusTargetRole(e.target.value as any)}
                      className="w-full mt-1 bg-neutral-950 text-neutral-300 border border-neutral-800 rounded-xl p-2 text-xs focus:outline-none focus:border-rose-500 font-mono"
                    >
                      <option value="All">All Registered Creators/Clients</option>
                      <option value="Freelancer">Only Freelancer Creators</option>
                      <option value="Client">Only Clients Buyers</option>
                      <option value="Regular">Only Regular Spectators</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Bonus Coin Volume (Coins):</label>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        min="1"
                        required
                        value={bonusAmount}
                        onChange={(e) => setBonusAmount(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 pr-8 rounded-xl font-mono focus:outline-none focus:border-rose-500"
                        placeholder="e.g. 100"
                      />
                      <span className="absolute right-3 top-2.5 text-neutral-500 font-mono text-xs">🪙</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Formal Audit drop Reason Description:</label>
                    <textarea
                      required
                      value={bonusReason}
                      onChange={(e) => setBonusReason(e.target.value)}
                      rows={2}
                      className="w-full mt-1 bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-rose-500"
                      placeholder="e.g. Community loyalty drop"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-neutral-950 font-mono text-xs font-black uppercase rounded-xl transition flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-4 h-4 text-neutral-950 font-extrabold" />
                    <span>Distribute Drop Pack</span>
                  </button>
                </form>
              </div>

              {/* Economy Safety Guard */}
              <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl space-y-3.5">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-yellow-500" />
                  <span>Economy Core Metrics Guard</span>
                </h4>
                <ul className="text-[10px] text-neutral-400 font-sans space-y-2.5">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                    <span>Coins are minted instantly when purchasing standard shop packages, distributing a bonus, or admin rewarding manual correction delta.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Withdrawal clearance locks standard users' coins on request submission, allowing formal decline refund or definitive payout clearance.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* WITHDRAWAL APPROVALS TAB */}
        {activeTab === 'withdrawals' && (
          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Freelancer Revenue Withdrawals Ledger</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Approve queued cash-out requests or deny transactions to refund the locked coins instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {withdrawals.length === 0 ? (
                <div className="md:col-span-2 text-center py-12 bg-neutral-950/40 border border-neutral-800 rounded-2xl text-neutral-500 font-mono text-xs">
                  0 pending cashout requests submitted.
                </div>
              ) : (
                withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-extrabold text-white">{w.userName}</h4>
                            <span className="text-[10px] text-neutral-500 font-mono">@{w.userUsername}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 font-mono mt-1">
                            {w.method} • {w.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-black text-amber-500 block">{w.amount.toLocaleString()} Coins</span>
                          <span className="text-[10px] text-zinc-500 font-mono">PKR Value: Rs. {(w.amount * (economySettings?.pkrRate ?? 1)).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-850/50 my-3 text-xs space-y-1.5 font-mono">
                        <div className="flex justify-between text-[11px] text-neutral-400">
                          <span>Beneficiary account Number:</span>
                          <span className="text-white font-bold">{w.accountNumber}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-neutral-400">
                          <span>Beneficiary account Holder:</span>
                          <span className="text-white font-bold">{w.accountName}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-red-400 pt-1.5 border-t border-neutral-850">
                          <span>Tax deducted ({w.userId && (users.find(u=>u.id===w.userId)?.subscription === 'Pro' || users.find(u=>u.id===w.userId)?.subscription === 'VIP') ? (economySettings?.premiumFee ?? 10) : (economySettings?.standardFee ?? 20)}%):</span>
                          <span>-Rs. {w.feeDeducted || 0} PKR</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#00e676] font-extrabold">
                          <span>Net cash cleared:</span>
                          <span>Rs. {w.netPayout?.toLocaleString() || (w.amount - (w.feeDeducted || 0)).toLocaleString()} PKR</span>
                        </div>
                      </div>

                      {w.rejectionReason && (
                        <div className="bg-red-500/5 border border-red-500/20 p-2.5 rounded-xl text-[10px] text-red-400 font-mono leading-relaxed mt-2 uppercase">
                          ⚠ Rejected Reason: {w.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-900">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded font-extrabold font-mono uppercase tracking-wider ${
                          w.status === 'Approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : w.status === 'Declined'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {w.status}
                      </span>

                      {w.status === 'Pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleWithdrawalApproval(w.id)}
                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-black uppercase transition shadow shadow-emerald-500/5"
                          >
                            Approve Clear
                          </button>
                          <button
                            onClick={() => handleWithdrawalDeclineClick(w)}
                            className="px-4 py-1.5 bg-neutral-900 hover:bg-red-950 font-bold text-neutral-400 hover:text-red-400 border border-neutral-800 rounded-xl text-xs uppercase transition"
                          >
                            Decline Refund
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* COIN PACKAGES MANAGE TAB */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Packages List Panel (2 Cols Wide) */}
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Store Coin Package Configurations (خریداری پیکجز)</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Manage standard coin product bundles. Packages deleted or disabled instantly disappear from client checkout storefront.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 font-mono tracking-wider uppercase">
                      <th className="pb-3 font-semibold">Coins count</th>
                      <th className="pb-3 font-semibold">Price in PKR</th>
                      <th className="pb-3 font-semibold">Promotional Bonus</th>
                      <th className="pb-3 font-semibold">Status flag</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-medium text-neutral-300">
                    {coinPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-neutral-850/30 transition">
                        <td className="py-4 font-mono font-bold text-white flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-amber-500" />
                          <span>{pkg.amount.toLocaleString()} Coins</span>
                        </td>
                        <td className="py-4 font-mono">
                          {pkg.price.toLocaleString()} {pkg.currency}
                        </td>
                        <td className="py-4 font-mono">
                          {pkg.bonus > 0 ? (
                            <span className="text-amber-400 font-extrabold">+{pkg.bonus.toLocaleString()} Coins</span>
                          ) : (
                            <span className="text-neutral-500">None</span>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase ${
                            pkg.isActive 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-neutral-800 text-neutral-500'
                          }`}>
                            {pkg.isActive ? 'Active Shop' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => handleTogglePackageStatus(pkg.id)}
                            className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white transition"
                          >
                            {pkg.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="text-[10px] uppercase font-bold text-red-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline text-current" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Create Coin / Package Creator Panel */}
            <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Create New Coin Package</span>
              </h4>
              <p className="text-neutral-500 text-[11px] leading-relaxed mt-1">
                Establish and configure a brand-new virtual coin bundle option with bonus parameters.
              </p>

              <form onSubmit={handleCreatePackage} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Base amount of coins:</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      required
                      min="1"
                      value={newPkgAmount}
                      onChange={(e) => setNewPkgAmount(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 pr-8 rounded-xl font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <span className="absolute right-3 top-2.5 text-neutral-500 font-mono text-xs">🪙</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Checkout price in PKR:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    className="w-full mt-1 bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded-xl font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block font-mono">Promotional bonus gift coins:</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newPkgBonus}
                    onChange={(e) => setNewPkgBonus(e.target.value)}
                    className="w-full mt-1 bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded-xl font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[9px] text-neutral-500 font-mono block mt-1">Bonus coins matching bundle purchase credit.</span>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Currency symbol:</label>
                  <input
                    type="text"
                    required
                    value={newPkgCurrency}
                    onChange={(e) => setNewPkgCurrency(e.target.value)}
                    className="w-full mt-1 bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded-xl text-neutral-400 select-none outline-none focus:border-indigo-500 pointer-events-none"
                    disabled
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-neutral-950 font-mono text-xs font-black uppercase rounded-xl transition flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4 text-neutral-950 font-black" />
                  <span>Publish Coin Package</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ECONOMY SETTINGS TAB */}
        {activeTab === 'economy' && (
          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Settings className="w-5 h-5 text-neutral-400" />
                <span>Coin Economy Control Panel Overrides</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Configure systemic multipliers, platforms commission retention fees, tax on payouts, and daily transfer limits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Parameters Column 1 */}
              <div className="space-y-4 bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-mono text-rose-500 uppercase font-black block tracking-widest uppercase mb-2">Naming & Conversion settings</span>
                
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Virtual currency Name designation:</label>
                  <input
                    type="text"
                    value={economySettings.coinName}
                    onChange={(e) => handleSettingsFieldChange('coinName', e.target.value)}
                    className="w-full mt-1 bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Virtual currency symbol / Icon:</label>
                  <input
                    type="text"
                    value={economySettings.coinSymbol}
                    onChange={(e) => handleSettingsFieldChange('coinSymbol', e.target.value)}
                    className="w-full mt-1 bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Conversion exchange rate (1 Coin = X PKR):</label>
                  <input
                    type="number"
                    min="1"
                    value={economySettings.pkrRate}
                    onChange={(e) => handleSettingsFieldChange('pkrRate', parseInt(e.target.value) || 1)}
                    className="w-full mt-1 bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Parameters Column 2 */}
              <div className="space-y-4 bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-mono text-rose-500 uppercase font-black block tracking-widest uppercase mb-2">Tax clearances & escrow boundaries</span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Standard Payout tax (%):</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={economySettings.standardFee}
                      onChange={(e) => handleSettingsFieldChange('standardFee', parseInt(e.target.value) || 0)}
                      className="w-full mt-1 bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl font-mono focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block font-mono">Premium Payout tax (%):</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={economySettings.premiumFee}
                      onChange={(e) => handleSettingsFieldChange('premiumFee', parseInt(e.target.value) || 0)}
                      className="w-full mt-1 bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl font-mono focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Escrow Platform Commission percentage (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={economySettings.escrowCommission}
                    onChange={(e) => handleSettingsFieldChange('escrowCommission', parseInt(e.target.value) || 0)}
                    className="w-full mt-1 bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Daily maximum transaction amount (Coins):</label>
                  <input
                    type="number"
                    min="1"
                    value={economySettings.maxDailyTransaction}
                    onChange={(e) => handleSettingsFieldChange('maxDailyTransaction', parseInt(e.target.value) || 0)}
                    className="w-full mt-1 bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FULL SYSTEM AUDIT LOGS TAB */}
        {activeTab === 'transactions' && (
          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Database className="w-5 h-5 text-rose-500" />
                  <span>Platform System Ledger (ٹرانزیکشنز لاگ)</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Dynamic transactional index monitoring all purchases, gifts, jobs clearings, withdrawals, and balance overrides.
                </p>
              </div>

              {/* Transactions search and filters */}
              <div className="flex flex-wrap gap-2.5">
                
                {/* Text Filter */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search query, name, tx..."
                    value={txSearchText}
                    onChange={(e) => setTxSearchText(e.target.value)}
                    className="bg-neutral-950 border border-neutral-850 pl-8 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-neutral-500 w-full sm:w-44 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={txTypeFilter}
                  onChange={(e) => setTxTypeFilter(e.target.value)}
                  className="bg-neutral-950 text-neutral-300 border border-neutral-850 rounded-xl p-1 px-2 text-xs focus:outline-none font-mono"
                >
                  <option value="all">All Types (سب)</option>
                  <option value="purchase">Refills Store (خریداری)</option>
                  <option value="spend_gift">Gifts Sent (بھیجے تحائف)</option>
                  <option value="receive_gift">Gifts Recv (موصول تحائف)</option>
                  <option value="order_earn">Earning (آمدن)</option>
                  <option value="order_pay">Escrow Locks (ادائیگی)</option>
                  <option value="withdrawal">payouts Cashout (رقم نکالیں)</option>
                  <option value="subscription">Subscriptions (پلانز)</option>
                  <option value="bonus">Bonus Drops (بونس)</option>
                  <option value="adjustment">Adjustments (ترمیم)</option>
                </select>

                {/* Sort Filter */}
                <select
                  value={txSortOrder}
                  onChange={(e) => setTxSortOrder(e.target.value as any)}
                  className="bg-neutral-950 text-neutral-300 border border-neutral-850 rounded-xl p-1 px-2 text-xs focus:outline-none font-mono"
                >
                  <option value="newest">Newest first (تاریخ سے)</option>
                  <option value="oldest">Oldest first</option>
                  <option value="amount_desc">Amount: High to Low</option>
                  <option value="amount_asc">Amount: Low to High</option>
                </select>
              </div>
            </div>

            {/* Transaction Ledger Table layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 font-mono tracking-wider uppercase">
                    <th className="pb-3 font-semibold">Tx clearance ID</th>
                    <th className="pb-3 font-semibold">Member details</th>
                    <th className="pb-3 font-semibold">Tx Code</th>
                    <th className="pb-3 font-semibold">Description narrative</th>
                    <th className="pb-3 font-semibold">Clearing Date</th>
                    <th className="pb-3 font-semibold text-right">Coins Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-medium text-neutral-300">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-neutral-500 font-mono text-xs">
                        0 transactions matched search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const user = users.find(u => u.id === tx.userId);
                      return (
                        <tr key={tx.id} className="hover:bg-neutral-850/30 transition">
                          <td className="py-3.5 font-mono text-[10px] text-neutral-500">
                            #{tx.id}
                          </td>
                          <td className="py-3.5">
                            {user ? (
                              <div className="flex items-center space-x-2">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-5.5 h-5.5 rounded-md object-cover ring-1 ring-neutral-800"
                                />
                                <div>
                                  <span className="text-white block font-bold leading-none">{user.name}</span>
                                  <span className="text-[9px] text-neutral-500 font-mono block mt-0.5">@{user.username}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-neutral-500">UID: {tx.userId}</span>
                            )}
                          </td>
                          <td className="py-3.5">
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              tx.type === 'purchase' || tx.type === 'order_earn' || tx.type === 'bonus'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                                : tx.type === 'withdrawal' || tx.type === 'order_pay' || tx.type === 'spend_gift'
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/15'
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-750'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3.5 text-neutral-300 leading-normal max-w-xs truncate" title={tx.description}>
                            {tx.description}
                          </td>
                          <td className="py-3.5 text-neutral-500 font-mono text-[11px]">
                            {new Date(tx.timestamp).toLocaleString()}
                          </td>
                          <td className={`py-3.5 font-mono font-bold text-right text-xs ${
                            tx.amount > 0 ? 'text-[#00e676]' : 'text-red-400'
                          }`}>
                            {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} Co
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* OVERLAY DIALOGS / SLATE MODALS */}

      {/* REWARD USER MODAL */}
      {rewardingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-left">
            <h4 className="text-lg font-black text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Reward Creator Coins</span>
            </h4>
            <p className="text-xs text-neutral-400 mt-1">
              Grant free bonus loyalty coins to <span className="font-bold text-white">@{rewardingUser.username}</span>. These will be added directly to their wallet.
            </p>

            <form onSubmit={triggerRewardUserSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Reward Amount (Coins):</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="1"
                    required
                    value={rewardAmountText}
                    onChange={(e) => setRewardAmountText(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 pr-8 rounded-xl font-mono focus:outline-none focus:border-rose-500"
                  />
                  <span className="absolute right-3 top-2.5 text-neutral-500 font-mono text-xs">🪙</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Reward narrative cause:</label>
                <input
                  type="text"
                  required
                  value={rewardReason}
                  onChange={(e) => setRewardReason(e.target.value)}
                  className="w-full mt-1 bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRewardingUser(null)}
                  className="flex-1 py-2.5 text-xs font-bold font-mono bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold font-mono bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl transition font-black uppercase"
                >
                  Confirm Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUST USER BALANCE MODAL */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-left">
            <h4 className="text-lg font-black text-white flex items-center space-x-2">
              <Settings className="w-5 h-5 text-rose-500" />
              <span>Direct Balance Override</span>
            </h4>
            <p className="text-xs text-neutral-400 mt-1">
              Directly set the exact wallet coin count for <span className="font-bold text-white">@{adjustingUser.username}</span>. An audit transaction calculating the delta difference will be published automatically.
            </p>

            <form onSubmit={triggerBalanceAdjustmentSubmit} className="mt-4 space-y-4">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs font-mono flex justify-between">
                <span className="text-neutral-500">Current Balance:</span>
                <span className="text-white font-bold">{adjustingUser.coins.toLocaleString()} Coins</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">New Wallet Balance (Coins):</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="0"
                    required
                    value={adjustAmountText}
                    onChange={(e) => setAdjustAmountText(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 pr-8 rounded-xl font-mono focus:outline-none focus:border-rose-500"
                    placeholder="e.g. 500"
                  />
                  <span className="absolute right-3 top-2.5 text-neutral-500 font-mono text-xs">🪙</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingUser(null)}
                  className="flex-1 py-2.5 text-xs font-bold font-mono bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold font-mono bg-rose-500 hover:bg-rose-400 text-neutral-950 rounded-xl transition font-black uppercase"
                >
                  Force Adjust
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAWAL DECLINE MODAL */}
      {rejectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-left">
            <h4 className="text-lg font-black text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Decline & Refund Payout</span>
            </h4>
            <p className="text-xs text-neutral-400 mt-1">
              Decline withdrawal of <span className="font-bold text-white">{rejectionModal.amount} Coins</span> for {rejectionModal.userName}. Locked coins will be REFUNDED to their wallet instantly.
            </p>

            <form onSubmit={executeWithdrawalDecline} className="mt-4 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Decline decline Reason description:</label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReasonText}
                  onChange={(e) => setRejectionReasonText(e.target.value)}
                  className="w-full mt-1 bg-neutral-950 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-red-500"
                  placeholder="e.g. Account number invalid..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModal(null)}
                  className="flex-1 py-2.5 text-xs font-bold font-mono bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold font-mono bg-red-600 hover:bg-red-500 text-white rounded-xl transition font-black uppercase"
                >
                  Decline & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
