/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { Sparkles, Brain, Cpu, MessageSquare, CheckCircle2, RefreshCw, Star, ShieldAlert, Award } from 'lucide-react';
import { User, Gig } from '../types';

interface AICenterProps {
  currentUser: User;
  gigs: Gig[];
}

export default function AICenter({ currentUser, gigs }: AICenterProps) {
  const [activeTab, setActiveTab] = useState<'matching' | 'optimize' | 'spam'>('matching');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedBio, setOptimizedBio] = useState('');
  const [inputBio, setInputBio] = useState(currentUser.bio || '');

  // AI Skill matching calculations
  const calculateSkillMatch = (gig: Gig) => {
    const userSkills = currentUser.skills.map(s => s.toLowerCase());
    const gigTitleWords = gig.title.toLowerCase().split(' ');
    const gigDescWords = gig.description.toLowerCase().split(' ');
    
    let matchCount = 0;
    userSkills.forEach(s => {
      if (gigTitleWords.includes(s) || gigDescWords.includes(s)) {
        matchCount++;
      }
    });

    // Seed realistic match percentage
    let percentage = 40 + (matchCount * 20);
    if (percentage > 100) percentage = 100;
    return percentage;
  };

  const handleOptimizeBioSim = (e: React.FormEvent) => {
    e.preventDefault();
    setOptimizing(true);
    setOptimizedBio('');

    setTimeout(() => {
      setOptimizing(false);
      const generated = `🔥 Verified Senior Professional Specialist • Passionate Creative Creator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Greetings! I am ${currentUser.name}, a distinguished branding innovator and solution architect based in ${currentUser.city}, Pakistan.

🎯 CORE EXPERTISE VALUE:
✔ Modern aesthetic visual blueprints & typography systems
✔ Cross-framework component interfaces design (React, Vite, Node)
✔ Escrow transaction pipelines & community live broadcasting analytics

✨ WHY CHOOSE MY FREELANCE PORTFOLIO:
With over ${currentUser.completedJobs || 10}+ successful platform milestones and hold-ups, I help fast-scaling company groups and small businesses monetize their brand networks cleanly. Let's design something stellar together!`;

      setOptimizedBio(generated);
    }, 1800);
  };

  // Pre-seed some mock spam/content moderation alerts detected by our AI safety checker
  const spamDetectionLogs = [
    { id: '1', type: 'Flagged Word Use', content: 'suspicious external payment link payout query transfer', channel: 'Private Chat ID #m21', score: '94% spam risk', action: 'System warning dispatched into thread inbox' },
    { id: '2', type: 'Unapproved Script Link', content: 'http://free-coins-generator-scam-apk.com', channel: 'Stream Lobby @editor_hamza', score: '99% phishing threat', action: 'Phishing domain banned' },
    { id: '3', type: 'Profanity moderation filter', content: 'inappropriate and hostile language in live feed chat', channel: 'Stream Lobby @designer_fatima', score: 'Hostility level: High', action: 'Text censored automatically' }
  ];

  return (
    <div className="space-y-6" id="ai-intelligence-panel">
      {/* Page header intro with glass effects */}
      <div className="bg-gradient-to-tr from-purple-950/25 via-neutral-900 to-amber-500/5 border border-purple-500/20 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-y-0 -right-20 w-80 bg-purple-500/10 blur-3xl pointer-events-none rounded-full"></div>
        <div className="space-y-2">
          <span className="text-[10px] bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center w-fit gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI MatchGig Engine</span>
          </span>
          <h3 className="text-xl font-black text-white leading-tight">Gemini-Powered Talent Intelligence</h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Leverage smart matching matrices to calculate skill correlations against ongoing client postings, optimize your profiles bio copy, or review automated content moderation filters.
          </p>
        </div>
      </div>

      {/* Tabs selectors row */}
      <div className="flex border-b border-neutral-850" id="ai-options-tabs">
        <button
          onClick={() => setActiveTab('matching')}
          className={`flex items-center space-x-2 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition ${
            activeTab === 'matching' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4 text-purple-400" />
          <span>Skill Match Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('optimize')}
          className={`ml-6 flex items-center space-x-2 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition ${
            activeTab === 'optimize' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Profile Optimizer</span>
        </button>

        <button
          onClick={() => setActiveTab('spam')}
          className={`ml-6 flex items-center space-x-2 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition ${
            activeTab === 'spam' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-rose-500" />
          <span>Moderation Logs</span>
        </button>
      </div>

      {/* Dynamic Tab Panel */}
      <div className="min-h-[250px]">
        {/* Tab 1: AI Skill matching */}
        {activeTab === 'matching' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-neutral-900/30 p-4 rounded-xl border border-neutral-850">
              <span className="text-xs text-neutral-400 font-medium">Your current skills profile:</span>
              <div className="flex gap-1.5 flex-wrap">
                {currentUser.skills.map((s, idx) => (
                  <span key={idx} className="bg-neutral-950 font-mono text-[10px] text-purple-300 font-semibold px-2 py-0.5 rounded border border-neutral-850">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gigs.map((g) => {
                const correlation = calculateSkillMatch(g);

                return (
                  <div
                    key={g.id}
                    className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">
                          {g.category}
                        </span>
                        
                        <div className="flex items-center space-x-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          <span>{correlation}% AI MATCH SCORE</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-black text-white">{g.title}</h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
                        {g.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-850 flex justify-between items-center">
                      <span className="text-xs font-bold text-white">{g.price} Coins value</span>
                      <div className="w-24 bg-neutral-950 rounded-full h-1.5 border border-neutral-855 overflow-hidden">
                        <div
                          style={{ width: `${correlation}%` }}
                          className={`h-full rounded-full ${
                            correlation > 80 ? 'bg-emerald-500' : correlation > 50 ? 'bg-amber-500' : 'bg-neutral-700'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Profile Optimizer */}
        {activeTab === 'optimize' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-3">Optimize My Brand Statement</h4>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Let Gemini rewrite, refine, and optimize your Profile bio copy. It analyzes your city, ratings, skills matrix list, and completed orders to output verified marketing text.
              </p>

              <form onSubmit={handleOptimizeBioSim} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  placeholder="Paste or write your raw bio..."
                  value={inputBio}
                  onChange={(e) => setInputBio(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 p-3 rounded-xl text-neutral-300 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={optimizing}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold text-xs rounded-lg transition"
                  >
                    {optimizing ? (
                      <span className="flex items-center space-x-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Optimization Copy...</span>
                      </span>
                    ) : (
                      <span>Optimize Profile Bio</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Generated output */}
            <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Gemini Output Copy</span>
                
                {optimizedBio ? (
                  <pre className="text-xs text-purple-300 whitespace-pre-wrap font-mono leading-relaxed bg-neutral-900 border border-neutral-850 p-4 rounded-xl mt-3 select-all">
                    {optimizedBio}
                  </pre>
                ) : (
                  <p className="text-xs text-neutral-600 italic mt-6 text-center">
                    {optimizing ? 'Generating professional copywriting blueprint...' : 'Enter raw bio and click Optimize button to display generated response.'}
                  </p>
                )}
              </div>

              {optimizedBio && (
                <button
                  onClick={() => {
                    alert('Bio optimized! Settings saved.');
                    setOptimizedBio('');
                  }}
                  className="w-full mt-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold uppercase rounded-lg rounded tracking-wider"
                >
                  Save Optimization to Profile
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: AI Fraud & spam checks */}
        {activeTab === 'spam' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/40 flex justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
              <span>Security Event Type</span>
              <span>Matching Action Taken</span>
            </div>
            
            <div className="divide-y divide-neutral-850">
              {spamDetectionLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-rose-400">{log.type}</span>
                      <span className="text-[8px] font-mono font-bold bg-neutral-950 px-1.5 py-0.2 rounded border border-neutral-850 text-neutral-500">
                        {log.score}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 mt-1 leading-snug font-mono select-all select-none">
                      Flagted text content: <span className="text-red-400 italic">"{log.content}"</span>
                    </p>
                    <span className="text-[9px] text-neutral-500 font-mono mt-1 block">In: {log.channel}</span>
                  </div>

                  <div className="text-xs text-neutral-400 font-mono">
                    🛡️ {log.action}
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
