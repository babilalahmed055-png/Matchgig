/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Gem, 
  Gift, 
  RefreshCw, 
  Trophy, 
  Target, 
  Smartphone, 
  X, 
  Cpu, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { User, SubscriptionType } from '../types';

interface SubscriptionProps {
  currentUser: User;
  onUpdateSubscription: (tier: SubscriptionType, cost: number) => void;
}

export default function Subscription({ currentUser, onUpdateSubscription }: SubscriptionProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'tiers' | 'unlock_system' | 'commission_calc'>('tiers');
  const [loadingTier, setLoadingTier] = useState<SubscriptionType | null>(null);

  // Alternative Upgrade Path Goal values
  const TARGETS = {
    views: 50000,
    likes: 10000,
    followers: 500,
    completedJobs: 10,
    rating: 4.5
  };

  // State for simulated creator engagement metrics
  const [simMetrics, setSimMetrics] = useState({
    views: 12500,
    likes: 4200,
    followers: 180,
    completedJobs: currentUser.completedJobs || 2,
    rating: currentUser.rating || 4.2
  });

  // Safe validation logs representing anti-fraud filters working live
  const [validationLogs, setValidationLogs] = useState<string[]>([
    'System audit: Engagement engine active. Checking VPN boundaries...',
    'Approved view on Video #12: 18s duration, User Agent match [Safe]',
    'Suppressed like from user_bot44: Account registration too recent [Rejected]',
    'Filter trigger: Repeated self-viewing discarded from IP: 39.46.223.11 [Spam Abuse]'
  ]);

  const plans = [
    {
      id: 'Free' as SubscriptionType,
      name: 'Free User',
      priceCoins: 0,
      description: 'Test the waters—access the MatchGig marketplace with base communication parameters.',
      features: [
        'Create simple talent profile',
        'Upload portfolio videos & reels',
        'Create up to 3 marketplace service gigs',
        'Receive live stream virtual gifts',
        'Limited direct messaging limits (3/day)',
        'Limited daily matching priority',
        'Standard search indexing visibility'
      ],
      badge: 'Basic',
      badgeColor: 'bg-neutral-800 text-neutral-400',
      color: 'border-neutral-800 bg-neutral-900/30'
    },
    {
      id: 'Pro' as SubscriptionType,
      name: 'Pro Premium',
      priceCoins: 150,
      description: 'Enhance visibility & establish official trust on the platform.',
      features: [
        'Verified Badge status indicators ✅',
        'Priority matching rank indexing',
        'Unlimited direct chat messaging capabilities',
        'Weekly Profile Promoted Boost',
        'Enhanced gig & portfolio list visibility',
        'Access to Pro analytical tracking boards',
        'Lower commission withdrawal fees (10% lower)'
      ],
      badge: 'Verified Pro',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/35',
      color: 'border-blue-500/30 bg-blue-500/5 shadow-lg shadow-blue-500/5'
    },
    {
      id: 'VIP' as SubscriptionType,
      name: 'Elite Member',
      priceCoins: 400,
      description: 'Enjoy maximum prominence, client leads, and exclusive tools.',
      features: [
        'Maximum priority search visibility ✨',
        'Featured profile indexing placement',
        'Featured gigs and portfolios pinned',
        'Priority 24/7 dedicated customer support',
        'Advanced workspace tools & analytics',
        'Premium elite matching suggestions',
        'Higher overall earning referral opportunities',
        '0% payment surcharge fee on gig bookings'
      ],
      badge: 'VIP Elite',
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/35',
      color: 'border-amber-500/30 bg-amber-500/5 shadow-lg shadow-amber-500/5'
    }
  ];

  // Interactive Revenue parameters
  const [calcSaleAmount, setCalcSaleAmount] = useState('200'); // in coins
  const [calcSource, setCalcSource] = useState<'gift' | 'gig' | 'consult'>('gig');

  const handleSubscribe = (tier: SubscriptionType, cost: number) => {
    if (currentUser.subscription === tier) return;
    if (currentUser.coins < cost) {
      alert("Insufficient wallet balance! Refill coins in Wallet/Sandbox first.");
      return;
    }

    setLoadingTier(tier);
    setTimeout(() => {
      onUpdateSubscription(tier, cost);
      setLoadingTier(null);
    }, 1200);
  };

  // Alternative path upgrade claim
  const canUnlockProForFree = 
    simMetrics.views >= TARGETS.views &&
    simMetrics.likes >= TARGETS.likes &&
    simMetrics.followers >= TARGETS.followers &&
    simMetrics.completedJobs >= TARGETS.completedJobs &&
    simMetrics.rating >= TARGETS.rating;

  const handleClaimFreePro = () => {
    if (!canUnlockProForFree) return;
    setLoadingTier('Pro');
    setTimeout(() => {
      onUpdateSubscription('Pro', 0);
      setLoadingTier(null);
      alert("🎉 Congratulations! You have unlocked Pro Membership for 30 Days Free by achieving platform engagement targets!");
    }, 1500);
  };

  // Simulate organic traffic (increases stats genuinely, showing no fraud)
  const handleSimulateHealthyTraffic = () => {
    setSimMetrics(prev => ({
      views: Math.min(TARGETS.views, prev.views + 15000),
      likes: Math.min(TARGETS.likes, prev.likes + 2500),
      followers: Math.min(TARGETS.followers, prev.followers + 120),
      completedJobs: Math.min(TARGETS.completedJobs, prev.completedJobs + 3),
      rating: Math.min(5.0, Number((prev.rating + 0.2).toFixed(1)))
    }));

    setValidationLogs(prev => [
      `[Safe Engagement] Gained organic video traffic views. UA matching: mobile devices. Duration >20s.`,
      `[Validation passed] Auth completed for incoming Likes (accounts older than minimum age limit).`,
      ...prev
    ].slice(0, 8));
  };

  // Complete all goals immediately
  const handleSimulateCompleteAllGoals = () => {
    setSimMetrics({
      views: TARGETS.views,
      likes: TARGETS.likes,
      followers: TARGETS.followers,
      completedJobs: TARGETS.completedJobs,
      rating: 4.8
    });
    setValidationLogs(prev => [
      `[System Audit] All engagement validation audits passed successfully!`,
      `[Safe Account Score] Trusted parameters achieved. Security index: 95% perfect.`,
      ...prev
    ].slice(0, 8));
  };

  // Simulate bot attack and auto-refresh farms to demonstrate Anti-Fraud Ignored Activity
  const handleSimBotAttack = () => {
    const fraudLogs = [
      `🚨 [Bot Refused] Auto-refresh script detected from browser tab. Discarded 45 fake views!`,
      `🚨 [Bot Refused] click-farm suspicious pattern: 1,200 likes rejected from duplicate devices.`,
      `🚨 [Bot Refused] VPN farming block. Discarded views originating structural proxy networks.`,
      `🚨 [Bot Refused] self-view loop detected. Creator page refreshing halted.`
    ];
    setValidationLogs((prev) => [...fraudLogs, ...prev].slice(0, 10));
  };

  // Earnings calculations (70/30 split)
  const parsedCoins = parseInt(calcSaleAmount) || 0;
  const creatorEarnValue = Math.round(parsedCoins * 0.7);
  const platformFeeValue = Math.round(parsedCoins * 0.3);

  return (
    <div className="space-y-8 animate-fadeIn" id="premium-earnings-systems-lobby">
      {/* Visual Hub Header background segment */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-950 p-6 md:p-8 rounded-3xl border border-neutral-800 text-left relative overflow-hidden">
        <div className="absolute inset-x-0 -top-40 h-80 bg-orange-500/5 blur-3xl pointer-events-none rounded-full"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
              Creator Economy Engine
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-3 tracking-tight">
              Premium levels & Security Suite
            </h2>
            <p className="text-neutral-400 text-xs mt-2 max-w-xl leading-relaxed">
              Explore MatchGig membership structures, unlock temporary Pro tiers via genuine creator activity 
              monitors, or audit real-time anti-fraud engagement engines.
            </p>
          </div>
          
          <div className="flex gap-2">
            <span className="bg-neutral-950 border border-neutral-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-amber-400 font-extrabold flex items-center shrink-0">
              👛 Balance: {currentUser.coins} Coins
            </span>
            <span className="bg-purple-950/40 border border-purple-500/20 px-3.5 py-1.5 rounded-xl text-xs font-mono text-purple-300 font-bold uppercase shrink-0">
              Tier: {currentUser.subscription}
            </span>
          </div>
        </div>

        {/* Tab selection links */}
        <div className="flex border-b border-neutral-800 mt-8 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`pb-2.5 px-3.5 text-xs font-mono font-extrabold uppercase tracking-wide transition whitespace-nowrap ${
              activeTab === 'tiers' ? 'border-b-2 border-amber-500 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            ⭐ Membership Levels
          </button>
          <button
            onClick={() => setActiveTab('unlock_system')}
            className={`pb-2.5 px-3.5 text-xs font-mono font-extrabold uppercase tracking-wide transition whitespace-nowrap ${
              activeTab === 'unlock_system' ? 'border-b-2 border-amber-500 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            🔒 Premium Unlock Path
          </button>
          <button
            onClick={() => setActiveTab('commission_calc')}
            className={`pb-2.5 px-3.5 text-xs font-mono font-extrabold uppercase tracking-wide transition whitespace-nowrap ${
              activeTab === 'commission_calc' ? 'border-b-2 border-amber-500 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            📊 Creator Earnings Split
          </button>
        </div>
      </div>

      {/* RENDER MEMBERSHIP LEVELS GRID */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          <div className="text-left py-2">
            <h3 className="text-xl font-extrabold text-white">Compare MatchGig Levels</h3>
            <p className="text-xs text-neutral-400 mt-1">Upgrade using system coins instantly or clear platform benchmarks to unlock for free.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((p) => {
              const isCurrent = currentUser.subscription === p.id;
              const hasLowerTier = currentUser.subscription === 'VIP' && p.id === 'Pro';
              return (
                <div
                  key={p.id}
                  className={`border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${p.color} ${
                    isCurrent ? 'ring-2 ring-amber-500 translate-y-[-4px]' : ''
                  }`}
                  id={`mplan-${p.id}`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-neutral-950 text-[9px] uppercase font-mono font-black px-3.5 py-1 rounded-bl-2xl">
                      Activated Tier
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-black ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                      <h4 className="text-xl font-black text-white mt-3 leading-tight">{p.name}</h4>
                    </div>

                    <div className="flex items-baseline space-x-1 border-b border-neutral-850 pb-4">
                      <span className="text-3.5 font-mono text-2xl font-black text-white">{p.priceCoins} 🪙</span>
                      <span className="text-xs text-neutral-500">one-off coin exchange</span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed min-h-[40px]">
                      {p.description}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-2.5 pt-2 text-left">
                      {p.features.map((f, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-neutral-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purchase/Exchange controls */}
                  <div className="pt-6">
                    <button
                      disabled={isCurrent || p.priceCoins === 0 || loadingTier !== null || hasLowerTier}
                      onClick={() => handleSubscribe(p.id, p.priceCoins)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-mono font-extrabold uppercase tracking-widest transition-all ${
                        isCurrent
                          ? 'bg-neutral-800 text-neutral-500 cursor-default border border-neutral-700/30'
                          : p.priceCoins === 0
                          ? 'bg-neutral-900 text-neutral-500 border border-neutral-800 cursor-not-allowed'
                          : hasLowerTier
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-amber-500 text-neutral-950 hover:bg-amber-400 active:scale-[0.98]'
                      }`}
                    >
                      {loadingTier === p.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin mx-auto text-neutral-950" />
                      ) : isCurrent ? (
                        'Active Plan'
                      ) : p.id === 'Free' ? (
                        'Standard Default Level'
                      ) : hasLowerTier ? (
                        'Exclusive Elite Member hold'
                      ) : (
                        `Exchange ${p.priceCoins} Coins`
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER ALTERNATIVE UPGRADE PATH (PREMIUM UNLOCK SYSTEM) */}
      {activeTab === 'unlock_system' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Progress checks section */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Free Pro Premium Unlock</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-normal">
                Avoid paying coins! Creators and freelancers who demonstrate organic system growth unlock a temporary <span className="text-blue-400">30-day Pro Membership</span> on meeting all benchmarks.
              </p>
            </div>

            {/* Checklist items layout */}
            <div className="space-y-4">
              
              {/* Views */}
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-850">
                <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                  <span className="text-neutral-300">1. Video Views Tracker</span>
                  <span className={simMetrics.views >= TARGETS.views ? 'text-emerald-400' : 'text-neutral-500'}>
                    {simMetrics.views.toLocaleString()} / {TARGETS.views.toLocaleString()} Views
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden p-0.5">
                  <div 
                    style={{ width: `${Math.min(100, (simMetrics.views / TARGETS.views) * 100)}%` }}
                    className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                  ></div>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono block mt-1.5">Anti-abuse limit: Durations above 10 seconds apply only.</span>
              </div>

              {/* Likes */}
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-850">
                <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                  <span className="text-neutral-300">2. True Likes Aggregate</span>
                  <span className={simMetrics.likes >= TARGETS.likes ? 'text-emerald-400' : 'text-neutral-500'}>
                    {simMetrics.likes.toLocaleString()} / {TARGETS.likes.toLocaleString()} Genuine
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden p-0.5">
                  <div 
                    style={{ width: `${Math.min(100, (simMetrics.likes / TARGETS.likes) * 100)}%` }}
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  ></div>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono block mt-1.5">Checks age of liker profile accounts to filter bot networks.</span>
              </div>

              {/* Followers */}
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-850">
                <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                  <span className="text-neutral-300">3. Verified Followers count</span>
                  <span className={simMetrics.followers >= TARGETS.followers ? 'text-emerald-400' : 'text-neutral-500'}>
                    {simMetrics.followers} / {TARGETS.followers}
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden p-0.5">
                  <div 
                    style={{ width: `${Math.min(100, (simMetrics.followers / TARGETS.followers) * 100)}%` }}
                    className="h-full rounded-full bg-purple-500 transition-all duration-300"
                  ></div>
                </div>
              </div>

              {/* Services completed */}
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-850">
                <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                  <span className="text-neutral-300">4. Escrow Handshakes Delivered</span>
                  <span className={simMetrics.completedJobs >= TARGETS.completedJobs ? 'text-emerald-400' : 'text-neutral-500'}>
                    {simMetrics.completedJobs} / {TARGETS.completedJobs} jobs
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden p-0.5">
                  <div 
                    style={{ width: `${Math.min(100, (simMetrics.completedJobs / TARGETS.completedJobs) * 100)}%` }}
                    className="h-full rounded-full bg-amber-500 transition-all duration-300"
                  ></div>
                </div>
              </div>

              {/* Star Rating threshold */}
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-850 flex justify-between items-center text-xs font-mono font-bold">
                <span className="text-neutral-300">5. Client Star Rating (Min 4.5 ★)</span>
                <span className={simMetrics.rating >= TARGETS.rating ? 'text-emerald-450 text-emerald-400 font-black' : 'text-amber-500 font-bold'}>
                  {simMetrics.rating} ★ / 4.5 ★
                </span>
              </div>

            </div>

            {/* Claim button triggered on full satisfaction */}
            <div className="pt-4 border-t border-neutral-850 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">Unlock reward status</span>
                <span className="text-xs font-bold text-white mt-1">30 Days Pro Membership</span>
              </div>

              <button
                disabled={!canUnlockProForFree || loadingTier !== null || currentUser.subscription === 'Pro' || currentUser.subscription === 'VIP'}
                onClick={handleClaimFreePro}
                className={`py-3 px-5 rounded-xl text-xs font-mono font-extrabold uppercase tracking-widest transition-all ${
                  currentUser.subscription === 'Pro' || currentUser.subscription === 'VIP'
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : canUnlockProForFree
                    ? 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400 font-black animate-pulse'
                    : 'bg-neutral-850 text-neutral-600 cursor-not-allowed'
                }`}
              >
                {currentUser.subscription === 'Pro' || currentUser.subscription === 'VIP' ? 'Already Upgraded' : 'Claim Pro membership'}
              </button>
            </div>
          </div>

          {/* Sandbox Controls & Live Anti-Fraud Auditor Console */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* Simulation controls card */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4">
              <span className="text-[10px] font-mono font-extrabold text-amber-500 uppercase tracking-widest block">Sandbox Simulator Terminal</span>
              <div>
                <h4 className="text-sm font-extrabold text-white leading-tight">Test Campaign & Fraud Systems</h4>
                <p className="text-neutral-500 text-[11px] mt-1">Trigger simulated genuine organic traffic or launch a bot farm attack to test defensive ignoring rules.</p>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <button
                  onClick={handleSimulateHealthyTraffic}
                  className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold p-3 rounded-xl border border-indigo-500/20 text-left transition flex items-center justify-between"
                >
                  <span>🚀 Simulate Organic Activity (+Stats)</span>
                  <Zap className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleSimulateCompleteAllGoals}
                  className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold p-3 rounded-xl border border-emerald-500/20 text-left transition flex items-center justify-between"
                >
                  <span>✨ Complete Goals Instantly (Free Pro)</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleSimBotAttack}
                  className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-[11px] font-bold p-3 rounded-xl border border-rose-500/30 text-left transition flex items-center justify-between"
                >
                  <span>⚠️ Simulate VPN / Bot Farm Attempt</span>
                  <AlertTriangle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Anti-Fraud filter logger console */}
            <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl flex-1 min-h-[180px] max-h-[300px] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 text-xs font-mono font-bold text-neutral-400">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interactive Validation Filter Auditor</span>
                </div>
                <div className="mt-3 font-mono text-[10px] text-zinc-400 space-y-1.5 overflow-y-auto max-h-[160px] scrollbar-thin">
                  {validationLogs.map((log, index) => (
                    <div key={index} className="leading-snug">
                      <span className="text-zinc-650 text-neutral-600 font-mono">&gt;</span> {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-900 pt-2 text-[9px] font-mono text-neutral-500 flex justify-between items-center mt-3">
                <span>View Watched: &ge; 10s req.</span>
                <span>Clicks: Device-fingerprinted IP</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RENDER DYNAMIC REVENUE COMMISSION CALCULATOR */}
      {activeTab === 'commission_calc' && (
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl text-left max-w-2xl mx-auto space-y-6">
          <div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Creator Payout and Commission Splitter</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              MatchGig uses a fully sustainable transparent creator commission model. No crypto or investment volatility. 
              The creator receives <span className="text-white font-bold">70%</span> of all revenues while the platform retains <span className="text-white font-bold">30%</span> to cover escrow gas and network hosting costs.
            </p>
          </div>

          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Input form */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">Receipt Revenue Source</label>
                <div className="flex gap-1.5">
                  {(['gig', 'gift', 'consult'] as const).map((source) => (
                    <button
                      key={source}
                      onClick={() => setCalcSource(source)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition ${
                        calcSource === source 
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {source === 'gig' ? 'Gig Sale' : source === 'gift' ? 'Gift Rose' : 'Consult Fee'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">Total Transaction Amount (Coins)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={calcSaleAmount}
                    onChange={(e) => setCalcSaleAmount(Math.max(0, parseInt(e.target.value) || 0).toString())}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 pl-8 rounded-xl font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="absolute left-3 top-3 text-neutral-500 font-mono text-xs">🪙</span>
                </div>
              </div>
            </div>

            {/* Results visualizer bar */}
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Sustainable Distribution</span>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-400 font-bold">👩‍🎨 Creator Share (70%):</span>
                  <span className="text-white font-mono font-extrabold">{creatorEarnValue} Coins</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-bold">🏢 MatchGig Platform Split (30%):</span>
                  <span className="text-white font-mono font-extrabold">{platformFeeValue} Coins</span>
                </div>
              </div>

              {/* Progress split visuals */}
              <div className="mt-4">
                <div className="w-full h-3 rounded-full overflow-hidden flex">
                  <div style={{ width: '70%' }} className="bg-indigo-500 h-full" title="Creator Share"></div>
                  <div style={{ width: '30%' }} className="bg-amber-500 h-full" title="Platform Surcharge"></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-neutral-500 mt-1.5">
                  <span>Earned: 70%</span>
                  <span>Fee: 30%</span>
                </div>
              </div>
            </div>

          </div>

          <div className="text-[11px] text-neutral-500 leading-snug space-y-1 bg-neutral-950 p-4 rounded-xl border border-neutral-850/50">
            <span className="text-xs font-bold text-neutral-400 block mb-1">Platform Surcharge Utility:</span>
            <p>• Retained platform coins support structural infrastructure costs (SMS OTP Gateways, Google Maps geocoding searches).</p>
            <p>• Payout calculations remain exact. No volatile tokens, keeping risk evaluations close to zero.</p>
          </div>
        </div>
      )}

    </div>
  );
}
