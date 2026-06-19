/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import {
  MapPin,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  Gem,
  Coins,
  TrendingUp,
  LineChart,
  Eye,
  Gift,
  MousePointerClick,
  Users2,
  UserPlus
} from 'lucide-react';
import { User, PortfolioItem, Gig } from '../types';

interface ProfilesProps {
  currentUser: User;
  users: User[];
  gigs: Gig[];
  onAddPortfolio: (userId: string, item: PortfolioItem) => void;
  onRemovePortfolio: (userId: string, itemId: string) => void;
}

export default function Profiles({
  currentUser,
  users,
  gigs,
  onAddPortfolio,
  onRemovePortfolio,
}: ProfilesProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [activeTab, setActiveTab] = useState<'about' | 'analytics' | 'portfolio' | 'gigs'>('about');

  // Follower system states (keep in local view memory or simulated storage block)
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    'user_2': true, // Hamza
    'user_3': false, // Zain
    'user_4': false, // Imran
  });

  // Portfolio additions
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const selectedUser = users.find((u) => u.id === selectedUserId) || currentUser;
  const userGigs = gigs.filter((g) => g.creatorId === selectedUser.id);

  const isFollowing = followingMap[selectedUser.id] || false;
  const simulatedFollowersCount = selectedUser.completedJobs * 3 + (isFollowing ? 13 : 12);

  const handleToggleFollow = () => {
    setFollowingMap((prev) => ({
      ...prev,
      [selectedUser.id]: !isFollowing,
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newItem: PortfolioItem = {
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      title: newTitle,
      imageUrl: newUrl,
    };

    onAddPortfolio(selectedUser.id, newItem);
    setNewTitle('');
    setNewUrl('');
    setShowAddForm(false);
  };

  // Mock Reviews
  const reviewsList = [
    { id: '1', name: 'Imran Khan', rating: 5, comment: 'Incredibly detailed delivery. Understood exactly our branding vibe with modern minimalist concepts.', date: '2026-06-10' },
    { id: '2', name: 'Usman Shah', rating: 4.8, comment: 'Solid motion graphics work. Revisions were made quickly as requested.', date: '2026-05-24' }
  ];

  // Specific Creator Analytics metric values
  const getSimulatedAnalytics = (uid: string) => {
    switch (uid) {
      case 'user_1': // Fatima Malik
        return { visits: 1450, gigViews: 3200, giftEarned: 1800, coinEarned: 5200, clientConvRate: 14.5 };
      case 'user_2': // Hamza Siddiqui
        return { visits: 890, gigViews: 1980, giftEarned: 750, coinEarned: 3100, clientConvRate: 11.2 };
      case 'user_3': // Zain Ali
        return { visits: 520, gigViews: 940, giftEarned: 50, coinEarned: 1400, clientConvRate: 18.0 };
      default:
        return { visits: 240, gigViews: 410, giftEarned: 0, coinEarned: 250, clientConvRate: 8.5 };
    }
  };

  const analytics = getSimulatedAnalytics(selectedUser.id);

  return (
    <div className="space-y-8" id="profiles-lobby">
      {/* Directory Selector Bar */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-mono font-bold text-neutral-400">SELECT ACCOUNT PROFILE TO DEMO:</span>
        <div className="flex gap-2 flex-wrap">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                setSelectedUserId(u.id);
                setActiveTab('about');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedUserId === u.id
                  ? 'bg-amber-500 text-neutral-950 font-extrabold shadow'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {u.name} ({u.role})
            </button>
          ))}
        </div>
      </div>

      {/* Main Profile Board */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Cover image header */}
        <div className="h-44 sm:h-56 relative bg-neutral-950">
          <img
            src={selectedUser.coverImage}
            alt="profile cover"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent"></div>

          {/* Sub plans & pricing badge triggers */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <span className="bg-neutral-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-amber-400 border border-amber-500/30 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedUser.subscription} TIER</span>
            </span>
            {selectedUser.badge !== 'None' && (
              <span className="bg-purple-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-extrabold text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{selectedUser.badge}</span>
              </span>
            )}
          </div>
        </div>

        {/* User Card Avatar and Details block */}
        <div className="px-6 pb-6 relative z-10 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-neutral-900 object-cover shadow-xl bg-neutral-800"
              />
              <div className="pb-2">
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start space-x-1.5">
                  <span>{selectedUser.name}</span>
                </h3>
                <p className="text-sm font-semibold text-neutral-400 font-mono">@{selectedUser.username}</p>
                <div className="flex flex-wrap gap-x-3 items-center justify-center sm:justify-start mt-1 font-mono text-xs text-neutral-500">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedUser.city}, {selectedUser.country}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 text-purple-400 font-bold">
                    <Users2 className="w-4 h-4 mr-0.5" />
                    <span>{simulatedFollowersCount} Followers</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive follow buttons, only if NOT the logged in user profile */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              {currentUser.id !== selectedUser.id && (
                <button
                  onClick={handleToggleFollow}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all uppercase ${
                    isFollowing
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black shadow shadow-amber-500/10'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-current" />
                  <span>{isFollowing ? 'Following ✓' : 'Follow Creator'}</span>
                </button>
              )}

              {/* Basic analytics quick count panel */}
              <div className="flex items-center justify-center gap-6 bg-neutral-950 p-4 rounded-2xl border border-neutral-800/80 shadow-inner">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">Rating score</span>
                  <span className="text-base font-black text-amber-400">★ {selectedUser.rating || 'N/A'}</span>
                </div>
                <div className="w-px h-8 bg-neutral-850"></div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">Completed</span>
                  <span className="text-base font-black text-white">{selectedUser.completedJobs} Jobs</span>
                </div>
                <div className="w-px h-8 bg-neutral-850"></div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">System Coins</span>
                  <span className="text-base font-black text-white flex items-center justify-center space-x-1">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>{selectedUser.coins}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab layout switches */}
        <div className="flex border-t border-b border-neutral-800 px-6 bg-neutral-950/40" id="profile-tabs">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition ${
              activeTab === 'about' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            About & Experiences
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 ml-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition ${
              activeTab === 'analytics' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <LineChart className="w-4 h-4 mr-1 inline-block" />
            <span>Core Analytics Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-4 ml-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition ${
              activeTab === 'portfolio' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Portfolio Gallery ({selectedUser.portfolio.length})
          </button>
          {selectedUser.role === 'Freelancer' && (
            <button
              onClick={() => setActiveTab('gigs')}
              className={`py-4 ml-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition ${
                activeTab === 'gigs' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Services Listed ({userGigs.length})
            </button>
          )}
        </div>

        {/* Tab content boards */}
        <div className="p-6">
          {activeTab === 'about' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Bio & matching tag items */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mb-2">My Biography</h4>
                  <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-950 p-4 rounded-2xl border border-neutral-900 shadow-inner">
                    {selectedUser.bio || 'This user has not listed a customized biography statement.'}
                  </p>
                </div>

                {/* Experience History log list */}
                {selectedUser.experiences && selectedUser.experiences.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mb-3">Employment & Experience</h4>
                    <div className="space-y-3">
                      {selectedUser.experiences.map((exp, idx) => (
                        <div
                          key={idx}
                          className="bg-neutral-950 p-4 rounded-xl border border-neutral-900/60 flex justify-between"
                        >
                          <div>
                            <h5 className="text-sm font-bold text-white">{exp.role}</h5>
                            <span className="text-xs text-neutral-500">{exp.company}</span>
                          </div>
                          <span className="text-xs font-mono font-medium text-neutral-400">{exp.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client ratings logs list */}
                {selectedUser.role === 'Freelancer' && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mb-3 block">
                      Recent Reviews Under Marketplace
                    </h4>
                    <div className="space-y-4">
                      {reviewsList.map((rev) => (
                        <div key={rev.id} className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-white">{rev.name}</span>
                            <span className="text-xs font-mono text-amber-400">★ {rev.rating}</span>
                          </div>
                          <p className="text-xs text-neutral-400 italic">"{rev.comment}"</p>
                          <span className="text-[10px] text-neutral-500 font-mono block text-right">{rev.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Associated team members - Business traits */}
                {(selectedUser.badge === 'Business' || selectedUser.role === 'Client') && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mb-3 block">
                      Multi-Team Management & Associated Talent
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'Fatima Malik', role: 'Chief Brand Designer Partner', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Hamza Siddiqui', role: 'Cinematographer Lead Editor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
                      ].map((member, idx) => (
                        <div key={idx} className="bg-neutral-950 p-3.5 border border-neutral-850 rounded-xl flex items-center space-x-3">
                          <img src={member.avatar} alt={member.name} className="w-9 h-9 object-cover rounded-lg" />
                          <div>
                            <span className="text-xs font-bold text-white block">{member.name}</span>
                            <span className="text-[10px] text-neutral-500 font-mono uppercase">{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Skills and tools stack panel */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mb-3">Professional Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skills && selectedUser.skills.length > 0 ? (
                      selectedUser.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-neutral-950 border border-neutral-800 text-neutral-300 font-semibold px-3 py-1.5 rounded-lg text-xs"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-neutral-500 italic">No custom skills tags created.</span>
                    )}
                  </div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-1">
                  <h5 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>MatchGig Verified Status</span>
                  </h5>
                  <p className="text-[11px] text-neutral-400">
                    This profile is fully secured with verified credentials and identity token.
                  </p>
                </div>
              </div>
            </div>
          ) : activeTab === 'analytics' ? (
            /* Interactive Creator Economy Analytics Dashboard */
            <div className="space-y-6" id="creator-analytics">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">Live Creator Performance Metrics</h4>
                <span className="text-[10px] font-mono font-bold bg-neutral-950 text-neutral-400 border border-neutral-850 px-2.5 py-0.5 rounded">
                  UPDATED REALTIME (UTC)
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 relative overflow-hidden">
                  <Eye className="w-5 h-5 text-blue-400 absolute top-4 right-4" />
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">Profile Visits</span>
                  <p className="text-xl font-mono font-black text-white mt-1.5">{analytics.visits.toLocaleString()}</p>
                  <span className="text-[9px] text-emerald-400 font-mono block mt-1">↑ 18% week/week</span>
                </div>

                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 relative overflow-hidden">
                  <Eye className="w-5 h-5 text-purple-400 absolute top-4 right-4" />
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">Marketplace Views</span>
                  <p className="text-xl font-mono font-black text-white mt-1.5">{analytics.gigViews.toLocaleString()}</p>
                  <span className="text-[9px] text-emerald-400 font-mono block mt-1">↑ 24% week/week</span>
                </div>

                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 relative overflow-hidden">
                  <Gift className="w-5 h-5 text-amber-500 absolute top-4 right-4" />
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">Gift Earnings</span>
                  <p className="text-xl font-mono font-black text-amber-400 mt-1.5">{analytics.giftEarned.toLocaleString()} 🪙</p>
                  <span className="text-[9px] text-neutral-500 font-mono block mt-1">Equivalent: ${(analytics.giftEarned / 100).toFixed(2)} USD</span>
                </div>

                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 relative overflow-hidden">
                  <Coins className="w-5 h-5 text-emerald-400 absolute top-4 right-4" />
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">Gig Profits</span>
                  <p className="text-xl font-mono font-black text-emerald-400 mt-1.5">{analytics.coinEarned.toLocaleString()} 🪙</p>
                  <span className="text-[9px] text-emerald-300 font-mono block mt-1">Platform Commission check passed</span>
                </div>

                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 relative overflow-hidden col-span-2 md:col-span-1">
                  <MousePointerClick className="w-5 h-5 text-indigo-400 absolute top-4 right-4" />
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">Conversion rate</span>
                  <p className="text-xl font-mono font-black text-white mt-1.5">{analytics.clientConvRate}%</p>
                  <span className="text-[9px] text-emerald-400 font-mono block mt-1">Standard target: 12%</span>
                </div>
              </div>

              {/* Graphic charts mock using inline HTML block representation */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-4">
                <h5 className="text-xs font-bold text-white">Daily Coin Accumulation Trend (Simulated)</h5>
                <div className="flex items-end justify-between h-32 pt-4 border-b border-neutral-800 gap-2">
                  {[20, 35, 40, 30, 60, 45, 95].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        style={{ height: `${val}%` }}
                        className="w-full bg-gradient-to-t from-purple-600 to-amber-500 rounded-t-md hover:opacity-85 transition-all cursor-pointer"
                        title={`Day ${idx + 1}: ${val * 10} Coins`}
                      ></div>
                      <span className="text-[9px] text-neutral-500 font-mono mt-2">Day {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'portfolio' ? (
            /* Portfolio Showcase card deck */
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">Creative Portfolios</h4>
                {selectedUser.id === currentUser.id && (
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center space-x-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Project</span>
                  </button>
                )}
              </div>

              {/* Add portfolio form trigger */}
              {showAddForm && (
                <form
                  onSubmit={handleAddSubmit}
                  className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl max-w-lg space-y-4"
                >
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Post New Creative Showcase</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Project Title (e.g. Modern Web Dashboard UI)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="url"
                      placeholder="Showcase Image URL"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="py-1.5 px-3 bg-transparent text-neutral-400 text-xs font-semibold hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-1.5 px-4 bg-amber-500 text-neutral-950 rounded-lg text-xs font-bold hover:bg-amber-400 transition"
                      >
                        Save Showcase
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Portfolio grid display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedUser.portfolio.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-neutral-950 rounded-2xl text-neutral-500 text-xs font-mono">
                    No portfolio projects uploaded.
                  </div>
                ) : (
                  selectedUser.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-850 flex flex-col justify-between"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-neutral-900">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-white tracking-tight leading-tight block">
                          {item.title}
                        </span>
                        {selectedUser.id === currentUser.id && (
                          <button
                            onClick={() => onRemovePortfolio(selectedUser.id, item.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-neutral-900 rounded-lg transition"
                            title="Delete showcase project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Active listed gigs/products */
            <div className="space-y-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">Service Listings Offered</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {userGigs.map((g) => (
                  <div
                    key={g.id}
                    className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-amber-500 font-mono font-bold tracking-wider uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {g.category}
                      </span>
                      <h4 className="font-extrabold text-white text-sm mt-3 leading-snug">{g.title}</h4>
                      <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{g.description}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-900 mt-4 pt-3">
                      <span className="text-xs text-neutral-500 font-mono">Delivery: {g.deliveryTime} days</span>
                      <span className="text-sm font-black text-amber-400 font-mono">{g.price} Coins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
