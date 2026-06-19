/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { Gift, Share2, Award, Coins, Users, Check, Sparkles, Copy } from 'lucide-react';
import { User } from '../types';

interface ReferralCenterProps {
  currentUser: User;
  onCoinsReward: (amount: number, description: string) => void;
}

export default function ReferralCenter({ currentUser, onCoinsReward }: ReferralCenterProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [referredFriends, setReferredFriends] = useState([
    { name: 'Sajid Mehmood', email: 'sajid@peakscale.com', date: '2026-06-18', status: 'Coins Bonus Added', reward: '+100 Coins' },
    { name: 'Kiran Shah', email: 'kiran@matchgig.com', date: '2026-06-14', status: 'Premium verified upgrade', reward: '+250 Coins + VIP level XP' },
    { name: 'Umair Hassan', email: 'umair@brandidentity.pk', date: '2026-06-10', status: 'Registered Member', reward: '+100 Coins' }
  ]);

  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');

  const referralCode = `MATCH-${currentUser.username.toUpperCase()}-2026`;

  const copyCodeToClipboard = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputEmail) return;

    const newInvite = {
      name: inputName,
      email: inputEmail,
      date: new Date().toISOString().split('T')[0],
      status: 'Awaiting registration',
      reward: 'Awaiting'
    };

    setReferredFriends([newInvite, ...referredFriends]);
    setInputName('');
    setInputEmail('');
    
    // Reward user for sending simulated invitation (bonus loop!)
    onCoinsReward(25, `Referred prospective teammate matching validation check`);
    alert(`✉️ Simulated invite dispatched to ${inputName} (${inputEmail})! Received a quick Referral Loyalty Coin Bonus (+25 Coins & XP)!`);
  };

  const claimCommissionRewards = () => {
    onCoinsReward(500, 'Redeemed Premium Level Referral Campaign Bonus');
    alert('🎉 Redirection complete: 500 Coins deposited inside your active wallet with VIP referral Campaign badges!');
  };

  return (
    <div className="space-y-6" id="referral-system-lobby">
      {/* Intro Referral Program Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-y-0 -right-20 w-80 bg-gradient-to-l from-amber-500/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>
        <div className="space-y-2">
          <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-500 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
            Invite & Earn Program
          </span>
          <h3 className="text-xl font-black text-white leading-tight">Secure Multi-tier Referral Rewards</h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Invite fellow freelancers or business companies to register on MatchGig-Fiverr-Networking. Receive <span className="text-amber-400 font-bold">100 Coins</span> for each sign-up, plus <span className="text-purple-400 font-bold">250 bonus coins</span> when they upgrade subscription tiers!
          </p>
        </div>

        {/* Big copy referral block */}
        <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 flex flex-col items-center justify-center text-center w-full md:w-64">
          <span className="text-[10px] font-mono text-neutral-500 block uppercase">Your Exclusive Promo Code</span>
          <div className="flex items-center space-x-2 mt-2 bg-neutral-900 border border-neutral-800 p-2 rounded-xl text-xs w-full justify-between">
            <span className="font-mono font-black text-white tracking-wider">{referralCode}</span>
            <button
              onClick={copyCodeToClipboard}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition"
              title="Copy promo code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main form to dispatch invites */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispatch inviter */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Send Invite Mail Alert</h4>
            <form onSubmit={handleSimSendInvitation} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Friend full name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Sajid Mehmood"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Teammate active email address</label>
                <input
                  type="email"
                  required
                  placeholder="E.g. sajid@matchgig.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-white"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send Invite Message</span>
                </button>
              </div>
            </form>
          </div>

          {/* Invited friends trackers log list */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Referred Teammates Signups</h4>
            
            <div className="divide-y divide-neutral-850">
              {referredFriends.map((friend, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                      <Users className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{friend.name}</p>
                      <span className="text-[10px] text-neutral-500 font-mono block">{friend.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-mono text-neutral-500">{friend.date}</span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      friend.status === 'Coins Bonus Added' || friend.status === 'Premium verified upgrade'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-neutral-950 text-neutral-400 border border-neutral-900'
                    }`}>
                      {friend.status}
                    </span>
                    <span className="text-xs font-extrabold text-amber-400 font-mono">
                      {friend.reward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Affiliate telemetries */}
        <div>
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent"></div>
            
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl w-fit mx-auto">
              <Award className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Claimable Campaign Earnings</span>
              <p className="text-3xl font-black text-white mt-1">500 <span className="text-sm text-amber-400">Coins</span></p>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed text-left bg-neutral-950 p-4 rounded-xl border border-neutral-850">
              Your referred client matches have passed secure business verification checklist parameters! Claim your premium affiliate bounty now.
            </p>

            <button
              onClick={claimCommissionRewards}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase rounded-xl tracking-wider shadow"
            >
              Withdraw Bounty to Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
