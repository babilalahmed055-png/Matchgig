/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, SlidersHorizontal, ShoppingCart, User as UserIcon, CheckCircle2, AlertCircle, Award, Compass, TrendingUp } from 'lucide-react';
import { Gig, User, GigOrder } from '../types';

interface MarketplaceProps {
  gigs: Gig[];
  users: User[];
  currentUser: User;
  onOrderPlaced: (order: GigOrder) => void;
  onOpenWallet: () => void;
}

export default function Marketplace({
  gigs,
  users,
  currentUser,
  onOrderPlaced,
  onOpenWallet,
}: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'poor_funds'>('idle');

  // Advanced search filters states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [skillsFilter, setSkillsFilter] = useState('');

  // Lists
  const categories = ['All', 'Logo Design', 'UI/UX Design', 'Video Editing', 'Programming'];
  const countries = ['All', 'Pakistan', 'USA', 'UK', 'Germany'];

  // Filter algorithmic logic
  const filteredGigs = gigs.filter((g) => {
    const creator = users.find((u) => u.id === g.creatorId);
    
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = g.price <= maxPrice;
    
    const matchesCountry =
      selectedCountry === 'All' ||
      (creator && creator.country.toLowerCase() === selectedCountry.toLowerCase());
    
    const matchesRating = g.rating >= minRating;
    
    const matchesSkills =
      !skillsFilter ||
      g.title.toLowerCase().includes(skillsFilter.toLowerCase()) ||
      g.description.toLowerCase().includes(skillsFilter.toLowerCase());

    return matchesCategory && matchesSearch && matchesPrice && matchesCountry && matchesRating && matchesSkills;
  });

  const selectedGig = gigs.find((g) => g.id === selectedGigId);
  const selectedCreator = selectedGig ? users.find((u) => u.id === selectedGig.creatorId) : null;

  const handleBookGig = (gig: Gig) => {
    const coinCost = gig.price;

    if (currentUser.coins < coinCost) {
      setOrderStatus('poor_funds');
      return;
    }

    // Place simulated order
    const randomId = 'ord_' + Math.random().toString(36).substring(2, 9);
    const newOrder: GigOrder = {
      id: randomId,
      gigId: gig.id,
      title: gig.title,
      buyerId: currentUser.id,
      sellerId: gig.creatorId,
      price: gig.price,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + gig.deliveryTime * 24 * 60 * 60 * 1000).toISOString(),
    };

    onOrderPlaced(newOrder);
    setOrderStatus('success');
  };

  // Static trending creators matching list
  const trendingCreators = users.filter((u) => u.role === 'Freelancer');

  return (
    <div className="space-y-8" id="marketplace-hub">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-br from-purple-950/40 via-neutral-900 to-neutral-950 px-6 py-10 rounded-3xl border border-neutral-800 text-center relative overflow-hidden">
        <div className="absolute inset-x-0 -top-40 h-80 bg-purple-500/10 blur-3xl pointer-events-none rounded-full"></div>
        <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 uppercase tracking-widest">
          Freelance Escrow Economy
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
          Find Professional Freelancers <br className="hidden md:block" /> with Secure Virtual Transactions
        </h2>
        <p className="text-neutral-400 text-sm mt-3 max-w-xl mx-auto">
          Hire verified experts in designs, rendering & programming. Pay securely with integrated coins wallet.
        </p>

        {/* Input Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 max-w-lg mx-auto">
          <div className="relative w-full text-left">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search Logo design, video podcast edits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl border text-xs font-bold font-mono tracking-wider transition flex items-center justify-center space-x-2 ${
              showAdvancedFilters
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Advanced Filters Dropdown Block */}
        {showAdvancedFilters && (
          <div className="mt-6 bg-neutral-950 border border-neutral-850 p-5 rounded-2xl text-left grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fadeIn">
            {/* Price slider */}
            <div className="space-y-1.5Col">
              <label className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider block">Max price ({maxPrice} Coins)</label>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1 bg-neutral-800 rounded"
              />
              <div className="flex justify-between text-[9px] font-mono text-neutral-600">
                <span>100 Coins</span>
                <span>5,000 Coins</span>
              </div>
            </div>

            {/* Country dropdown */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider block mb-1">Freelancer Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full text-xs font-semibold bg-neutral-900 border border-neutral-800 p-2 rounded-xl text-neutral-300 focus:outline-none"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Ratings selection */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider block mb-1">Min Stars Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full text-xs font-semibold bg-neutral-900 border border-neutral-800 p-2 rounded-xl text-neutral-300 focus:outline-none"
              >
                <option value={0}>Any Stars</option>
                <option value={4.5}>4.5★ & Above</option>
                <option value={4.8}>4.8★ & Premium</option>
              </select>
            </div>

            {/* Skills keyword filter */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider block mb-1">Sourcing Skills Keyword</label>
              <input
                type="text"
                placeholder="E.g. React, Premier"
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
                className="w-full text-xs bg-neutral-900 border border-neutral-800 p-2 rounded-xl text-white placeholder-neutral-600 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Trending Creator Showcases horizontal list */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-extrabold text-white">Trending Creator Channels</h3>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none" id="trending-creators-list">
          {trendingCreators.map((creator) => (
            <div
              key={creator.id}
              className="bg-neutral-900 border border-neutral-850 p-4 rounded-2xl min-w-[240px] flex items-center space-x-3 hover:border-purple-500/25 transition cursor-pointer shrink-0"
            >
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-neutral-950"
              />
              <div className="overflow-hidden">
                <span className="text-xs font-extrabold text-white block truncate">{creator.name}</span>
                <span className="text-[10px] text-neutral-500 font-mono uppercase mt-0.5 block truncate">@{creator.username}</span>
                <div className="flex items-center space-x-1 mt-1 text-[10px] font-mono text-amber-400">
                  <span>★ {creator.rating} Rating</span>
                  <span className="text-neutral-500">• {creator.completedJobs} Deliveries</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none" id="category-tabs-container">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600/20 border border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gigs Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gigs-grid">
        {filteredGigs.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl">
            <p className="text-sm text-neutral-500">No matching gigs found. Try adjusting advanced filters.</p>
          </div>
        ) : (
          filteredGigs.map((g) => {
            const creator = users.find((u) => u.id === g.creatorId);
            return (
              <div
                key={g.id}
                className="group bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/85 hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg flex flex-col justify-between"
                id={`gig-card-${g.id}`}
              >
                <div>
                  {/* Gig Showcase Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                    <img
                      src={g.portfolioImages[0]}
                      alt={g.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md text-[10px] uppercase font-mono tracking-wider text-purple-400 px-2.5 py-1 rounded-full border border-neutral-800">
                      {g.category}
                    </div>
                  </div>

                  {/* Gig Info */}
                  <div className="p-5 space-y-3">
                    {/* Creator avatar block */}
                    {creator && (
                      <div className="flex items-center space-x-2">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-md object-cover"
                        />
                        <span className="text-xs text-neutral-400 font-medium hover:text-white transition">
                          {creator.name}
                        </span>
                        {creator.badge !== 'None' && (
                          <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.2 rounded border border-purple-500/20">
                            {creator.badge}
                          </span>
                        )}
                      </div>
                    )}

                    <h4 className="text-sm font-bold text-white leading-snug group-hover:text-purple-400 transition-colors line-clamp-2 text-left">
                      {g.title}
                    </h4>

                    {/* Rating */}
                    <div className="flex items-center space-x-1.5 text-xs text-neutral-400 font-mono">
                      <span className="text-amber-400 font-bold">★ {g.rating}</span>
                      <span>({g.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="px-5 pb-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">Starting At</span>
                    <span className="text-base font-extrabold text-white">
                      {g.price} <span className="text-xs text-amber-400 font-medium">Coins</span>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedGigId(g.id);
                      setOrderStatus('idle');
                    }}
                    className="px-3.5 py-2 bg-neutral-850 hover:bg-purple-600 text-[11px] font-bold tracking-wider uppercase text-neutral-200 hover:text-white rounded-xl transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed View & Purchase Drawer/Modal */}
      {selectedGig && selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div
            className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            id="gig-detail-modal"
          >
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-neutral-800">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedCreator.avatar}
                  alt={selectedCreator.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-neutral-800"
                />
                <div className="text-left">
                  <h3 className="font-extrabold text-white text-lg">{selectedGig.title}</h3>
                  <p className="text-xs text-neutral-400">
                    By {selectedCreator.name} • {selectedCreator.city}, {selectedCreator.country}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGigId(null)}
                className="p-1 px-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Scroll Panel Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Image banner */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 relative">
                <img
                  src={selectedGig.portfolioImages[0]}
                  alt={selectedGig.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Description</h4>
                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-4 rounded-xl border border-neutral-800/40">
                  {selectedGig.description}
                </p>
              </div>

              {/* Features Specs list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/60 flex flex-col justify-center">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Guaranteed Delivery</span>
                  <span className="text-sm font-bold text-white mt-1">{selectedGig.deliveryTime} Days</span>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/60 flex flex-col justify-center">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Revisions Limit</span>
                  <span className="text-sm font-bold text-white mt-1">{selectedGig.revisions} Cycles</span>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/60 flex flex-col justify-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Category Tag</span>
                  <span className="text-sm font-bold text-purple-400 mt-1">{selectedGig.category}</span>
                </div>
              </div>

              <div className="border-t border-neutral-800/80 pt-6 flex items-center justify-between text-left">
                <div>
                  <span className="text-xs text-neutral-400 block font-mono uppercase">Escrow Value Protection</span>
                  <p className="text-2xl font-black text-white">
                    {selectedGig.price} <span className="text-sm text-amber-500 font-bold">Coins</span>
                  </p>
                </div>

                {orderStatus === 'idle' ? (
                  <button
                    onClick={() => handleBookGig(selectedGig)}
                    className="py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition flex items-center space-x-2 shadow-lg shadow-purple-600/10"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Purchase & Engage Gigs</span>
                  </button>
                ) : orderStatus === 'success' ? (
                  <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Order Booked in System!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2 text-amber-500 bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-mono font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>Wallet Balance Insufficient</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedGigId(null);
                        onOpenWallet();
                      }}
                      className="text-xs font-bold text-amber-400 underline hover:text-white transition"
                    >
                      Refill Wallet Now →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
