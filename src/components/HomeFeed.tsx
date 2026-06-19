/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Play, 
  Heart, 
  MessageSquare, 
  Coins, 
  Share2, 
  Sparkles, 
  Award, 
  UserCheck, 
  Flame, 
  ShieldAlert, 
  Send,
  Sliders,
  Tv,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { User, Gig, Gift } from '../types';
import { VIRTUAL_GIFTS } from '../data';

interface HomeFeedProps {
  currentUser: User;
  users: User[];
  gigs: Gig[];
  onCoinsTransfer: (amount: number, targetId: string, description: string) => boolean;
  onSendGiftCelebration: (gift: Gift) => void;
  onOrderPlaced: (order: any) => void;
  onOpenWallet: () => void;
}

interface FeedItem {
  id: string;
  type: 'video' | 'post' | 'gig' | 'update';
  authorId: string;
  title: string;
  body?: string;
  mediaUrl?: string;
  duration?: string;
  views?: string;
  category?: string;
  price?: number;
  likes: number;
  comments: { id: string; authorName: string; text: string }[];
  timestamp: string;
}

export default function HomeFeed({
  currentUser,
  users,
  gigs,
  onCoinsTransfer,
  onSendGiftCelebration,
  onOrderPlaced,
  onOpenWallet
}: HomeFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'video' | 'post' | 'gig' | 'update'>('all');
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const [tickerNotification, setTickerNotification] = useState<string | null>(null);

  // Comments support
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  // High-fidelity Feed Data
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: 'feed_1',
      type: 'video',
      authorId: 'user_1', // Fatima Malik
      title: '🎥 Vertical Re-branding Highlight: Lahore local Chai Stall packaging mockup!',
      body: 'Transforming a traditional dhaba theme into an eye-catching modern beverage visual identity. Look at those patterns!',
      mediaUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600',
      duration: '42s',
      views: '2.4K',
      likes: 124,
      comments: [
        { id: '1', authorName: 'Zain Ali', text: 'This grading is insane Fatima! Absolute fire UI patterns' }
      ],
      timestamp: '2 hours ago'
    },
    {
      id: 'feed_2',
      type: 'post',
      authorId: 'user_2', // Hamza Siddiqui
      title: '📝 Premiere Pro Pakistan Hack: Cut lag by 50% using SSD proxy drives',
      body: 'Fellow editors, do not use your default local system C drive cache. Always partition a secondary solid-state run path and route scratch disks straight there. This avoids thermal bottlenecks during 10-bit color grading pipeline steps.',
      likes: 56,
      comments: [
        { id: '1', authorName: 'Usman Shah', text: 'Saving this now, was getting sick of render frame drops.' }
      ],
      timestamp: '4 hours ago'
    },
    {
      id: 'feed_3',
      type: 'gig',
      authorId: 'user_3', // Zain Ali
      title: '💼 Single-Screen React & Tailwind Rapid MVP Prototype',
      body: 'Get a clean, high-contrast digital utility or dashboard built in React. Safe coin milestones escrow system guarantee included.',
      price: 850,
      category: 'Programming',
      likes: 42,
      comments: [],
      timestamp: '6 hours ago'
    },
    {
      id: 'feed_4',
      type: 'update',
      authorId: 'user_4', // Imran Khan
      title: '🚀 Creator Hired & Contract Deposited: UI Re-skin Milestone 1 Active',
      body: 'Formally closed a contract of 5,000 Coins with Fatima Malik for PeakScale branding refresh. Coins are securely held in the MatchGig custody vault.',
      likes: 98,
      comments: [
        { id: 'c1', authorName: 'Admin Raza', text: 'Safe escrow log recorded matching regulations' }
      ],
      timestamp: 'Today, 10:15 AM'
    },
    {
      id: 'feed_5',
      type: 'video',
      authorId: 'user_2', // Hamza
      title: '🎥 Video Production Hack: Kinetic text overlay presets in After Effects',
      body: 'Quick setup rules for Urdu and English graphic title structures to retain high user retention metrics.',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
      duration: '58s',
      views: '1.8K',
      likes: 92,
      comments: [],
      timestamp: 'Yesterday'
    }
  ]);

  // Gifting helper modal inside each item
  const [giftingTargetItemId, setGiftingTargetItemId] = useState<string | null>(null);

  const handleLikeItem = (id: string) => {
    setFeedItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    }));
  };

  const handleAddComment = (itemId: string, e: FormEvent) => {
    e.preventDefault();
    const text = commentInputs[itemId]?.trim();
    if (!text) return;

    setFeedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          comments: [...item.comments, {
            id: 'comment_' + Date.now().toString(36),
            authorName: currentUser.name,
            text
          }]
        };
      }
      return item;
    }));

    setCommentInputs(prev => ({ ...prev, [itemId]: '' }));
  };

  const handleDirectGiftItem = (creatorId: string, gift: Gift, itemName: string) => {
    // 6. Anti self gifting safeguard checks
    if (creatorId === currentUser.id) {
      alert("⚠️ Anti-Self Gifting Rule: You cannot send virtual gifts to yourself or alternative profiles on your own device framework.");
      return;
    }

    const creator = users.find(u => u.id === creatorId);
    if (!creator) return;

    const currentFeePct = (creator.subscription === 'Pro' || creator.subscription === 'VIP') ? 20 : 30; // matched standard rule
    const creatorKeepPct = 100 - currentFeePct; 

    const success = onCoinsTransfer(
      gift.cost, 
      creatorId, 
      `Rewarded virtual gift milestone: ${gift.icon} ${gift.name} on post "${itemName}"`
    );

    if (success) {
      onSendGiftCelebration(gift);
      setGiftingTargetItemId(null);
      setTickerNotification(`Sent ${gift.icon} ${gift.name} to @${creator.username}! Net recipient gain: ${Math.floor(gift.cost * creatorKeepPct / 100)} 🪙, Platform Fee: ${currentFeePct}%`);
      setTimeout(() => setTickerNotification(null), 6000);
    } else {
      alert("❌ Insufficient Coins! Open your wallet to refill PKR packages immediately.");
      onOpenWallet();
    }
  };

  const handleBookFeedGig = (item: FeedItem) => {
    if (!item.price) return;
    if (currentUser.coins < item.price) {
      alert("❌ Insufficient coins in your account balance! Please refill immediately.");
      onOpenWallet();
      return;
    }

    const confirmBooking = window.confirm(`Are you sure you want to purchase "${item.title}" for ${item.price} Coins?`);
    if (!confirmBooking) return;

    // Simulate order placement
    const newOrder = {
      id: 'ord_feed_' + Math.random().toString(36).substring(2, 9),
      gigId: 'f_gig_' + item.id,
      title: item.title,
      buyerId: currentUser.id,
      sellerId: item.authorId,
      price: item.price,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    };

    onOrderPlaced(newOrder);
    setTickerNotification(`🎉 Escrow active! booked "${item.title}" for ${item.price} Coins successfully!`);
    setTimeout(() => setTickerNotification(null), 5000);
  };

  // Filter list
  const filteredFeed = feedItems.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.type === selectedFilter;
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="unified-home-feed">
      
      {/* Ticker notifier bar */}
      {tickerNotification && (
        <div className="bg-gradient-to-r from-teal-950 via-neutral-900 to-indigo-950 text-teal-300 px-4 py-3 rounded-2xl border border-teal-500/20 text-xs font-mono font-semibold flex items-center justify-between text-left animate-fadeIn">
          <span>{tickerNotification}</span>
          <span className="text-[10px] font-bold text-teal-400">REALTIME TRANSACTION LOG APPROVED</span>
        </div>
      )}

      {/* Hero Welcome banner */}
      <div className="bg-gradient-to-tr from-neutral-950 via-neutral-900 to-amber-950/20 p-6 rounded-3xl border border-neutral-850 flex flex-col md:flex-row items-center justify-between gap-4 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 bg-amber-500/5 blur-3xl pointer-events-none rounded-full"></div>
        <div>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono font-black tracking-widest px-2.5 py-1 rounded-full uppercase border border-amber-500/20">
            🇵🇰 Pakistan Live Feed Hub
          </span>
          <h2 className="text-2xl font-black text-white mt-2 tracking-tight">Main Stream Community</h2>
          <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
            All in one single timeline. Enjoy immersive vertical video previews, design community posts, direct freelance gigs, and contract updates in one safe place!
          </p>
        </div>
        <button
          onClick={onOpenWallet}
          className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-neutral-950 font-mono text-xs font-black rounded-xl transition shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-1"
        >
          <Coins className="w-4 h-4 text-neutral-950" />
          <span>REFILL CREDITS</span>
        </button>
      </div>

      {/* Feed Filters Tabs Bar */}
      <div className="flex bg-neutral-950 p-1.5 rounded-2xl border border-neutral-850/80 overflow-x-auto scrollbar-none gap-1">
        {[
          { key: 'all', label: '📱 All Feed', desc: 'Unified Storyline' },
          { key: 'video', label: '🎬 Videos/Reels', desc: 'Vertical Streams' },
          { key: 'post', label: '📝 Posts', desc: 'Creative Hacks' },
          { key: 'gig', label: '💼 Gigs', desc: 'Hire Freelancers' },
          { key: 'update', label: '🚀 Updates', desc: 'Escrows Audit' }
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setSelectedFilter(btn.key as any)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap text-left flex flex-col justify-center min-w-[100px] ${
              selectedFilter === btn.key
                ? 'bg-neutral-900 border border-neutral-800 text-amber-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            <span className="font-extrabold">{btn.label}</span>
            <span className="text-[8px] text-neutral-500 font-normal block mt-0.5">{btn.desc}</span>
          </button>
        ))}
      </div>

      {/* Stream Timeline */}
      <div className="space-y-6">
        {filteredFeed.map((item) => {
          const author = users.find(u => u.id === item.authorId) || currentUser;
          const isMe = author.id === currentUser.id;
          
          return (
            <div
              key={item.id}
              className="bg-neutral-90 border border-neutral-850 bg-neutral-900/60 rounded-3xl p-5 md:p-6 text-left relative transition hover:border-neutral-800"
            >
              {/* Type Category upper header pill */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-neutral-800"
                  />
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center space-x-1.5">
                      <span>{author.name}</span>
                      {author.subscription === 'VIP' && (
                        <span className="bg-indigo-500/10 text-indigo-400 text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase border border-indigo-500/30">VIP</span>
                      )}
                      {author.subscription === 'Pro' && (
                        <span className="bg-amber-500/10 text-amber-500 text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase border border-amber-500/30">Pro</span>
                      )}
                    </h4>
                    <span className="text-[10px] text-neutral-500 font-mono">@{author.username} • {item.timestamp}</span>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  item.type === 'video' ? 'text-rose-400 bg-rose-500/5 border-rose-500/15' :
                  item.type === 'post' ? 'text-teal-400 bg-teal-500/5 border-teal-500/15' :
                  item.type === 'gig' ? 'text-amber-400 bg-amber-500/5 border-amber-500/15' :
                  'text-purple-400 bg-purple-500/5 border-purple-500/15'
                }`}>
                  {item.type}
                </span>
              </div>

              {/* Body and content text */}
              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-black text-white leading-snug">{item.title}</h3>
                {item.body && (
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">{item.body}</p>
                )}
              </div>

              {/* Video Element Player block if type video */}
              {item.type === 'video' && item.mediaUrl && (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-4 group select-none">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  
                  {activeMediaId === item.id ? (
                    <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-3xl animate-bounce">🎬</span>
                      <p className="text-emerald-400 text-xs font-mono mt-1 font-bold">MATCHGIG LIVE VIDEO STREAM ACTIVE</p>
                      <p className="text-xs text-neutral-400 mt-2 max-w-sm">Simulating dynamic 1080p stream transmission on port 3000 local nodes safely.</p>
                      <button
                        onClick={() => setActiveMediaId(null)}
                        className="mt-4 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:text-white text-xs font-mono rounded-lg transition text-neutral-400"
                      >
                        Stop Stream Mock
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent">
                      <span className="self-end bg-neutral-950/70 p-1 px-2 rounded-md text-[9px] font-mono tracking-widest text-[#00e676] font-bold">
                        {item.duration} • {item.views} views
                      </span>
                      <button
                        onClick={() => setActiveMediaId(item.id)}
                        className="self-center p-4 bg-amber-500/90 group-hover:bg-amber-400 hover:scale-110 text-neutral-950 rounded-full transition duration-300 cursor-pointer shadow-lg shadow-amber-500/20"
                      >
                        <Play className="w-6 h-6 fill-neutral-950 text-neutral-950" />
                      </button>
                      <span className="text-[10px] text-neutral-400 font-mono">Click play to simulate interactive stream transmission.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Freelance Offer specifications and prices card block if type gig */}
              {item.type === 'gig' && item.price && (
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 flex items-center justify-between mb-4 text-left">
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase block tracking-wider">Premium Service Offer</span>
                    <p className="text-base font-black text-white font-mono mt-0.5">{item.price.toLocaleString()} Coins <span className="text-xs font-bold text-neutral-400">(~{item.price} PKR)</span></p>
                    <span className="text-[10px] text-neutral-400 mt-1 block">Category classification: {item.category}</span>
                  </div>
                  <button
                    onClick={() => handleBookFeedGig(item)}
                    className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-black uppercase rounded-xl transition"
                  >
                    Hire Creator Directly
                  </button>
                </div>
              )}

              {/* Action Toolbar buttons panel (React, Comment, Tip/Gift) */}
              <div className="flex items-center space-x-6 border-t border-neutral-850 pt-4">
                <button
                  onClick={() => handleLikeItem(item.id)}
                  className="flex items-center space-x-2 text-xs text-neutral-400 hover:text-rose-400 transition"
                >
                  <Heart className="w-4 h-4 hover:scale-110 transition-transform" />
                  <span>{item.likes} Likes</span>
                </button>
                <div className="flex items-center space-x-2 text-xs text-neutral-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>{item.comments.length} Comments</span>
                </div>
                
                {/* Gifting portal button */}
                <button
                  onClick={() => setGiftingTargetItemId(item.id)}
                  className="flex items-center space-x-1.5 text-xs text-yellow-500 hover:text-yellow-400 font-extrabold uppercase font-mono tracking-wide ml-auto bg-amber-500/5 px-3 py-1.5 rounded-xl border border-amber-500/10 hover:bg-amber-500/10 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gift Creator (تحفہ بھیجیں)</span>
                </button>
              </div>

              {/* Expanded Gift panel popover for matching element */}
              {giftingTargetItemId === item.id && (
                <div className="mt-4 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 animate-slideUp">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-[#00e676] tracking-wider uppercase block font-bold">MatchGig instant transmission portal</span>
                      <h4 className="text-xs font-black text-white">Award Virtual Gift to @{author.username}</h4>
                    </div>
                    <button
                      onClick={() => setGiftingTargetItemId(null)}
                      className="text-xs text-neutral-500 hover:text-white"
                    >
                      Dismiss
                    </button>
                  </div>

                  {/* Warning if trying to gift self */}
                  {isMe ? (
                    <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-xl text-xs text-red-300">
                      ⚠️ Anti-Self Gifting check enforced. Senders cannot gift themselves under system anti-fraud policies.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {VIRTUAL_GIFTS.map(gift => (
                          <button
                            key={gift.id}
                            title={`${gift.name} - ${gift.cost} Coins`}
                            onClick={() => handleDirectGiftItem(author.id, gift, item.title)}
                            className="bg-neutral-900 border border-neutral-850 hover:border-pink-500 p-2.5 rounded-xl text-center flex flex-col justify-center items-center transition duration-200 group relative"
                          >
                            <span className="text-lg group-hover:scale-125 transition-transform">{gift.icon}</span>
                            <span className="text-[8px] font-bold text-white mt-1 uppercase block truncate max-w-full">{gift.name}</span>
                            <span className="text-[9px] text-amber-400 font-mono font-bold block mt-0.5">{gift.cost}🪙</span>
                          </button>
                        ))}
                      </div>
                      <p className="text-[9px] text-neutral-500 mt-2.5">
                        *System split: Creator gathers <span className="text-white font-bold">{(author.subscription === 'Pro' || author.subscription === 'VIP') ? '80%' : '70%'}</span> share net values, while Platform fee holds the remainder.
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Comments block system */}
              <div className="mt-4 pt-4 border-t border-neutral-850/40 space-y-3">
                {item.comments.length > 0 && (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {item.comments.map(c => (
                      <div key={c.id} className="bg-neutral-950 p-2.5 rounded-xl text-xs leading-normal">
                        <span className="font-extrabold whitespace-nowrap text-white mr-1.5">{c.authorName}:</span>
                        <span className="text-neutral-300 text-[11px]">{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={(e) => handleAddComment(item.id, e)} className="flex items-center space-x-2 mt-3">
                  <input
                    type="text"
                    required
                    placeholder="Write a comment / appreciate creator..."
                    value={commentInputs[item.id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                    className="flex-1 bg-neutral-950 text-xs border border-neutral-850 text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-neutral-800 text-neutral-300 hover:text-white rounded-xl transition"
                    title="Publish comment"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>
          );
        })}
      </div>
      
    </div>
  );
}
