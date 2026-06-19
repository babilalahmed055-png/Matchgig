/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Award, Coins, Sparkles, Trophy, Star, Flame, CheckCircle, Target, MessageSquare } from 'lucide-react';
import { User } from '../types';

interface GamificationCenterProps {
  currentUser: User;
  users: User[];
  onCoinsReward: (amount: number, description: string) => void;
}

export default function GamificationCenter({
  currentUser,
  users,
  onCoinsReward,
}: GamificationCenterProps) {
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [userXP, setUserXP] = useState(1450);
  const [activeTab, setActiveTab] = useState<'rewards' | 'badges' | 'leaderboard' | 'challenges'>('rewards');

  const level = Math.floor(userXP / 500) + 1;
  const xpInNextLevel = userXP % 500;
  const xpGoal = 500;
  const xpPercent = Math.min(100, Math.floor((xpInNextLevel / xpGoal) * 100));

  // Pre-seed mock leaderboard
  const sortedLeaderboard = [...users]
    .sort((a, b) => b.coins - a.coins)
    .slice(0, 5);

  const badges = [
    { id: 'b_1', name: 'Fast Deliverer', desc: 'Completed an order under 48 hours', icon: '⚡', unlocked: currentUser.completedJobs > 0, score: '100% completed' },
    { id: 'b_2', name: 'Coin Magnet', desc: 'Accumulated over 5,000 Coins', icon: '🪙', unlocked: currentUser.coins >= 5000, score: `${currentUser.coins}/5000` },
    { id: 'b_3', name: 'VIP Elite Club', desc: 'Hold active VIP membership plans', icon: '👑', unlocked: currentUser.subscription === 'VIP', score: currentUser.subscription },
    { id: 'b_4', name: 'Verified Creator', desc: 'Passed standard talent matching verification', icon: '✨', unlocked: currentUser.badge === 'Creator' || currentUser.badge === 'Verified', score: 'Verified' },
    { id: 'b_5', name: 'Social Monarch', desc: 'Received more than 2,000 coins from gifts', icon: '🌹', unlocked: currentUser.coins > 1000, score: 'Active' },
  ];

  const challenges = [
    { id: 'c_1', title: 'Listing Launch', desc: 'Publish a custom marketplace gig', progress: currentUser.role === 'Freelancer' ? 100 : 0, reward: 100, completed: currentUser.role === 'Freelancer' },
    { id: 'c_2', title: 'Active Chat', desc: 'Initiate a secure transaction thread under Private Chats', progress: 100, reward: 50, completed: true },
    { id: 'c_3', title: 'Consultation Session', desc: 'Attend a live Voice or Video booked consultation', progress: 40, reward: 250, completed: false },
    { id: 'c_4', title: 'High-Roller Refill', desc: 'Unlock more than 1,000 coins', progress: currentUser.coins >= 1000 ? 100 : 40, reward: 500, completed: currentUser.coins >= 1000 },
  ];

  const claimDaily = () => {
    if (dailyClaimed) return;
    setDailyClaimed(true);
    onCoinsReward(50, 'Claimed MatchGig Daily Login Reward');
    setUserXP(prev => prev + 120);
  };

  const completeChallengeSim = (val: number, label: string) => {
    onCoinsReward(val, `Claimed Challenge Reward: ${label}`);
    setUserXP(prev => prev + 250);
    alert(`🎉 Challenge completed! +${val} Coins & +250 XP added to @${currentUser.username}!`);
  };

  return (
    <div className="space-y-6" id="gamification-hub-container">
      {/* Experience level progress card */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute inset-y-0 -right-20 w-80 bg-gradient-to-l from-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>
        <div className="flex items-center space-x-5">
          <div className="relative flex items-center justify-center">
            {/* Level badge circle */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 p-1 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-full h-full rounded-xl bg-neutral-950 flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase leading-none">LVL</span>
                <span className="text-xl font-black text-white font-mono">{level}</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-neutral-950 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold flex items-center">
              <Flame className="w-3 h-3 fill-current mr-0.5" />
              <span>STREAK 3</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-black text-white flex items-center">
                <span>@{currentUser.username} Level Tracker</span>
              </h3>
              <span className="text-[9px] px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded font-mono font-bold">
                {userXP} TOTAL XP
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Complete gigs, participate in live workshops, and invite team members to unlock bonuses!
            </p>

            {/* Level Progress Bar slider */}
            <div className="mt-4 w-72 sm:w-80">
              <div className="flex justify-between text-[11px] font-mono text-neutral-500 mb-1">
                <span>XP {xpInNextLevel} / {xpGoal}</span>
                <span>{xpPercent}% towards level {level + 1}</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-950 rounded-full border border-neutral-800overflow-hidden p-0.5">
                <div
                  style={{ width: `${xpPercent}%` }}
                  className="h-full bg-gradient-to-r from-purple-600 to-amber-500 rounded-full transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick action: Daily rewards check */}
        <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl flex flex-col items-center justify-center text-center w-full md:w-56">
          <span className="text-[10px] font-mono text-neutral-400 block uppercase">Daily Reward Claim</span>
          <p className="text-sm font-extrabold text-white mt-1">Claim Free 50 Coins</p>
          <button
            disabled={dailyClaimed}
            onClick={claimDaily}
            className={`w-full mt-3 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              dailyClaimed
                ? 'bg-neutral-900 text-neutral-500 border border-neutral-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 shadow-md shadow-amber-500/10 font-black scale-100 hover:scale-102 flex items-center justify-center space-x-1'
            }`}
          >
            <Coins className="w-4 h-4 text-current" />
            <span>{dailyClaimed ? 'Claimed Today ✓' : 'Claim Daily Reward'}</span>
          </button>
        </div>
      </div>

      {/* Tabs list selector */}
      <div className="flex border-b border-neutral-800" id="gamification-tabs">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center space-x-1.5 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all ${
            activeTab === 'rewards' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Daily Rewards</span>
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`ml-5 flex items-center space-x-1.5 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all ${
            activeTab === 'badges' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Achievement Badges</span>
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`ml-5 flex items-center space-x-1.5 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all ${
            activeTab === 'challenges' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Match Tasks</span>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`ml-5 flex items-center space-x-1.5 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all ${
            activeTab === 'leaderboard' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Top Rankings</span>
        </button>
      </div>

      {/* Dynamic Tab Boards */}
      <div className="min-h-[220px]">
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { day: 'Day 1', reward: '10 Coins', claimed: true },
              { day: 'Day 2', reward: '15 Coins', claimed: true },
              { day: 'Day 3', reward: '50 Coins', claimed: dailyClaimed, isToday: !dailyClaimed },
              { day: 'Day 4', reward: '35 Coins', locked: true },
              { day: 'Day 5', reward: '50 Coins', locked: true },
              { day: 'Day 6', reward: '100 Coins', locked: true },
              { day: 'Day 7', reward: 'Premium Pass', locked: true, vip: true }
            ].map((day, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center relative overflow-hidden flex flex-col justify-between min-h-[120px] transition ${
                  day.isToday
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                    : day.claimed
                    ? 'bg-neutral-900/40 border-neutral-800 text-neutral-500'
                    : 'bg-neutral-950 border-neutral-900 text-neutral-400'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono tracking-wider block">{day.day}</span>
                  <p className="text-sm font-black mt-2 text-white">{day.reward}</p>
                </div>
                {day.claimed ? (
                  <span className="text-[10px] mt-3 block text-emerald-400 font-bold">✓ CLAIMED</span>
                ) : day.isToday ? (
                  <button
                    onClick={claimDaily}
                    className="w-full mt-3 py-1 bg-amber-500 text-neutral-950 text-[10px] font-black rounded-lg uppercase tracking-wider hover:bg-amber-400"
                  >
                    Claim
                  </button>
                ) : day.locked ? (
                  <span className="text-[10px] mt-3 block text-neutral-600 font-mono">🔒 LOCKED</span>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                  badge.unlocked
                    ? 'bg-neutral-900 border-neutral-800/80 shadow'
                    : 'bg-neutral-950/60 border-neutral-900 opacity-60'
                }`}
              >
                <div className="text-3xl p-2 bg-neutral-950 rounded-xl border border-neutral-800/40 shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{badge.name}</h4>
                  <p className="text-xs text-neutral-400 mt-1">{badge.desc}</p>
                  <div className="flex items-center space-x-2 mt-2 font-mono text-[9px]">
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                      badge.unlocked
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-neutral-900 text-neutral-600'
                    }`}>
                      {badge.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                    <span className="text-neutral-500">{badge.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-3">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="text-sm font-black text-white leading-none">{c.title}</h5>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/10 text-amber-500 font-mono font-bold rounded">
                      +{c.reward} COINS reward
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{c.desc}</p>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="text-right hidden sm:block font-mono text-xs">
                    <span className={c.completed ? 'text-emerald-400' : 'text-amber-500'}>
                      {c.completed ? 'COMPLETED' : `${c.progress}% done`}
                    </span>
                  </div>
                  {!c.completed ? (
                    <button
                      onClick={() => completeChallengeSim(c.reward, c.title)}
                      className="w-full sm:w-auto px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[11px] rounded-lg tracking-wider"
                    >
                      Complete & Verify
                    </button>
                  ) : (
                    <div className="p-1 px-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono font-bold flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/40 flex justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
              <span>Creator Profile Name</span>
              <span>Coin Account Balance</span>
            </div>
            <div className="divide-y divide-neutral-800">
              {sortedLeaderboard.map((user, idx) => (
                <div
                  key={user.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-neutral-850/20 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black font-mono w-4 text-center text-neutral-500">
                      #{idx + 1}
                    </span>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover bg-neutral-950"
                    />
                    <div>
                      <p className="text-xs font-extrabold text-white flex items-center">
                        <span>{user.name}</span>
                        {user.badge !== 'None' && (
                          <span className="ml-1.5 text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 py-0.2 rounded font-bold">
                            {user.badge}
                          </span>
                        )}
                      </p>
                      <span className="text-[10px] text-neutral-500 font-mono uppercase">
                        @{user.username} • LV {Math.floor(user.coins / 800) + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono text-sm font-bold text-white">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>{user.coins.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
