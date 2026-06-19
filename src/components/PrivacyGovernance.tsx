/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText, 
  Globe, 
  UserCheck, 
  Settings, 
  Sliders, 
  Video, 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Check, 
  AlertTriangle, 
  UserX, 
  MessageSquare, 
  VolumeX, 
  Filter, 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  BookOpen, 
  Database, 
  Coins, 
  Gift, 
  Sparkles, 
  HelpCircle,
  FileSpreadsheet,
  Terminal,
  Scale
} from 'lucide-react';
import { User, Gig } from '../types';

interface PrivacyGovernanceProps {
  currentUser: User;
  users: User[];
  gigs: Gig[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
}

// Simulated types for Posts, Videos, and Gigs Drafts
interface ContentItem {
  id: string;
  type: 'video' | 'gig' | 'post';
  authorId: string;
  title: string;
  visibility: 'Public' | 'FollowersOnly' | 'Private' | 'Draft' | 'Scheduled';
  scheduledTime?: string;
  mediaSummary?: string;
  contentBody?: string;
}

export default function PrivacyGovernance({ currentUser, users, gigs, onUpdateUser }: PrivacyGovernanceProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile_privacy' | 'draft_system' | 'safety_tools' | 'admin_governance' | 'trust_score'>('profile_privacy');

  // Load and persist drafts from localStorage or default
  const [drafts, setDrafts] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('matchgig_drafts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'dr_1', type: 'video', authorId: currentUser.id, title: 'Ultimate Motion Design Reel 2026', visibility: 'Draft', mediaSummary: 'Duration: 45s, Format: Vertical MP4' },
      { id: 'dr_2', type: 'gig', authorId: 'user_2', title: 'Cinema Video Editing + Dolby Sound Masterclass', visibility: 'Scheduled', scheduledTime: '2026-06-20T10:00:00Z', mediaSummary: 'Target Price: 350 Coins' },
      { id: 'dr_3', type: 'post', authorId: currentUser.id, title: '5 Critical Pitfalls of Portfolio Building in Pakistan', visibility: 'Draft', contentBody: 'Building wireframes looks too simple... here are the core secrets!' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('matchgig_drafts', JSON.stringify(drafts));
  }, [drafts]);

  // Privacy parameters mapped to local state with default fallbacks
  const [privacyMode, setPrivacyMode] = useState<'Public' | 'Private' | 'Professional'>(() => {
    return (localStorage.getItem(`privacy_mode_${currentUser.id}`) as any) || 'Public';
  });

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`privacy_toggles_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return {
      hidePhone: true,
      hideEmail: false,
      hideEarnings: true,
      hideFollowerCount: false,
      hideOnlineStatus: false,
      hideLastSeen: true,
      hidePortfolioNonFollowers: false,
      spamProtection: true
    };
  });

  const [messagingPrivacy, setMessagingPrivacy] = useState<'Everyone' | 'FollowersOnly' | 'VerifiedOnly' | 'PremiumOnly' | 'None'>(() => {
    return (localStorage.getItem(`messaging_privacy_${currentUser.id}`) as any) || 'Everyone';
  });

  const [commentControls, setCommentControls] = useState<'Allow' | 'FollowersOnly' | 'VerifiedOnly' | 'Disable'>(() => {
    return (localStorage.getItem(`comment_controls_${currentUser.id}`) as any) || 'Allow';
  });

  const [livePrivacy, setLivePrivacy] = useState<'Public' | 'FollowersOnly' | 'PremiumOnly' | 'InviteOnly'>(() => {
    return (localStorage.getItem(`live_privacy_${currentUser.id}`) as any) || 'Public';
  });

  // Track state changes and save in localStorage
  useEffect(() => {
    localStorage.setItem(`privacy_mode_${currentUser.id}`, privacyMode);
  }, [privacyMode, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`privacy_toggles_${currentUser.id}`, JSON.stringify(toggles));
  }, [toggles, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`messaging_privacy_${currentUser.id}`, messagingPrivacy);
  }, [messagingPrivacy, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`comment_controls_${currentUser.id}`, commentControls);
  }, [commentControls, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`live_privacy_${currentUser.id}`, livePrivacy);
  }, [livePrivacy, currentUser.id]);

  // Safety lists
  const [blockedList, setBlockedList] = useState<string[]>(['abuse_bot99', 'spam_spreader']);
  const [mutedList, setMutedList] = useState<string[]>(['annoy_marketer', 'talkative_user']);
  const [restrictedList, setRestrictedList] = useState<string[]>(['suspicious_bidder']);
  const [keywordFilters, setKeywordFilters] = useState<string[]>(['crypto investment', 'win free prize', 'easy cash quick', 'cheapest follower']);
  const [newKeyword, setNewKeyword] = useState('');
  const [targetUserAction, setTargetUserAction] = useState('');

  // Sandbox log output
  const [safetyLog, setSafetyLog] = useState<string[]>([
    'Shield: Core privacy daemon monitoring active sessions.',
    'Shield: Safe viewport render context initiated for Pakistan geocodes.'
  ]);

  // Draft Creation
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [newDraftType, setNewDraftType] = useState<'video' | 'gig' | 'post'>('video');
  const [newDraftTitle, setNewDraftTitle] = useState('');
  const [newDraftDetail, setNewDraftDetail] = useState('');

  // Draft Editing Modal State
  const [editingDraft, setEditingDraft] = useState<ContentItem | null>(null);

  // Trust & Safety Simulator
  const [badgeIdentityVerified, setBadgeIdentityVerified] = useState(true);
  const [orderCountBonus, setOrderCountBonus] = useState(currentUser.completedJobs);
  const [numFakeFlags, setNumFakeFlags] = useState(0);
  const [hasVpnViolation, setHasVpnViolation] = useState(false);

  // Calculated dynamic Trust & Safety Score
  const calculateTrustScore = () => {
    let base = 75;
    if (badgeIdentityVerified) base += 15;
    if (orderCountBonus > 20) base += 10;
    else if (orderCountBonus > 5) base += 5;
    
    // Penalize
    base -= numFakeFlags * 12;
    if (hasVpnViolation) base -= 20;

    // Boundary check
    return Math.max(5, Math.min(100, base));
  };

  const currentTrustScore = calculateTrustScore();

  // Admin Controls override and telemetry
  const [adminBypassReason, setAdminBypassReason] = useState<'abuse' | 'legal' | 'security' | null>(null);
  const [adminCertifiedAuthorized, setAdminCertifiedAuthorized] = useState(false);
  const [draftScanResult, setDraftScanResult] = useState<string>('');
  const [adminDraftQueryRequested, setAdminDraftQueryRequested] = useState(false);
  const [adminAuditEvents, setAdminAuditEvents] = useState<string[]>(() => {
    const saved = localStorage.getItem('matchgig_admin_compliance_audit');
    return saved ? JSON.parse(saved) : [
      'SYSTEM INITIALIZED: Admins blocked from standard message records. End-to-end encryption active.',
      'COMPLIANCE ALERT: Zero access allowed without active user report or certified national subpoena.'
    ];
  });

  const saveAuditLogs = (newLogs: string[]) => {
    setAdminAuditEvents(newLogs);
    localStorage.setItem('matchgig_admin_compliance_audit', JSON.stringify(newLogs));
  };

  // Add items
  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    if (keywordFilters.includes(newKeyword.trim())) return;
    const word = newKeyword.trim().toLowerCase();
    setKeywordFilters(prev => [...prev, word]);
    setNewKeyword('');
    setSafetyLog(prev => [
      `Keyword suppression activated: "${word}" matches will be systematically redacted.`,
      ...prev
    ]);
  };

  const handleRemoveKeyword = (word: string) => {
    setKeywordFilters(prev => prev.filter(w => w !== word));
    setSafetyLog(prev => [`Keyword filter removed: "${word}"`, ...prev]);
  };

  const handleAddBlockedUser = (e: FormEvent) => {
    e.preventDefault();
    if (!targetUserAction.trim()) return;
    const name = targetUserAction.trim().replace('@', '');
    if (!blockedList.includes(name)) {
      setBlockedList(prev => [...prev, name]);
      setSafetyLog(prev => [`Security Tool: Blocked @${name}. They can no longer search or message you.`, ...prev]);
    }
    setTargetUserAction('');
  };

  const handleToggleMute = (username: string) => {
    if (mutedList.includes(username)) {
      setMutedList(prev => prev.filter(u => u !== username));
      setSafetyLog(prev => [`Security: Unmuted @${username}`, ...prev]);
    } else {
      setMutedList(prev => [...prev, username]);
      setSafetyLog(prev => [`Security: Muted @${username}. Notifications silenced.`, ...prev]);
    }
  };

  const handleToggleRestrict = (username: string) => {
    if (restrictedList.includes(username)) {
      setRestrictedList(prev => prev.filter(u => u !== username));
      setSafetyLog(prev => [`Security: Unrestricted @${username}`, ...prev]);
    } else {
      setRestrictedList(prev => [...prev, username]);
      setSafetyLog(prev => [`Security: Restricted @${username}. Comments require manual approval.`, ...prev]);
    }
  };

  // Draft Actions
  const handleAddNewDraft = (e: FormEvent) => {
    e.preventDefault();
    if (!newDraftTitle.trim()) return;

    const key = newDraftType === 'gig' ? 'Target Price' : newDraftType === 'video' ? 'Format' : 'Intro Text';
    const detailValue = newDraftDetail.trim() || `${key}: Simulated default properties`;

    const item: ContentItem = {
      id: 'dr_' + Math.random().toString(36).substring(3, 9),
      type: newDraftType,
      authorId: currentUser.id,
      title: newDraftTitle,
      visibility: 'Draft',
      mediaSummary: newDraftType === 'video' || newDraftType === 'gig' ? detailValue : undefined,
      contentBody: newDraftType === 'post' ? detailValue : undefined
    };

    setDrafts(prev => [item, ...prev]);
    setNewDraftTitle('');
    setNewDraftDetail('');
    setShowDraftForm(false);
    alert(`✓ Master Draft initialized successfully! You can modify or publish it anytime. Under MatchGig policy, Draft videos are private by default and visible only to the creator.`);
  };

  const handlePublishDraftNow = (id: string) => {
    setDrafts(prev =>
      prev.map(d => (d.id === id ? { ...d, visibility: 'Public' } : d))
    );
    alert('🎉 Draft converted to Live Public content! Synchronized across marketplace indexers.');
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const handleOpenEditModal = (d: ContentItem) => {
    setEditingDraft({ ...d });
  };

  const handleSaveEditDraft = (e: FormEvent) => {
    e.preventDefault();
    if (!editingDraft) return;

    setDrafts(prev =>
      prev.map(d => (d.id === editingDraft.id ? { ...editingDraft } : d))
    );
    setEditingDraft(null);
    alert('✓ Draft revisions updated in structural memory.');
  };

  // Admin security bypass request compliance logs
  const handleTriggerAdminBypass = () => {
    if (!adminBypassReason) {
      alert("Select a lawful certified override reason to request decrypt flags.");
      return;
    }
    setAdminCertifiedAuthorized(true);
    const logMsg = `[LAW COMPLIANCE AUDIT] Admin @${currentUser.username} bypassed message encryption on suspect channel. Reason: ${adminBypassReason.toUpperCase()}. Remote certificate generated: cert_mg_${Math.random().toString(36).substring(3, 8)}`;
    saveAuditLogs([logMsg, ...adminAuditEvents]);
    alert("🔐 TEMPORARY BYPASS DECRYPT KEY ISSUED: Access log written dynamically to persistent storage compliance logs.");
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="privacy-governance-lobby">
      
      {/* Dynamic Upper Hero Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-indigo-950/20 p-6 md:p-8 rounded-3xl border border-neutral-800 text-left relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-96 bg-purple-500/5 blur-3xl pointer-events-none rounded-full"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-widest inline-flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Compliance, Privacy & Safety Core
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Privacy, Control & Governance Studio
            </h2>
            <p className="text-neutral-400 text-xs max-w-2xl leading-relaxed">
              Equip your freelance profiles with robust identity masks, manage pre-publication content drafts, 
              silence fraudulent actors, and audit lawful administration access criteria.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-850 shrink-0">
            <div className="text-left">
              <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 block">Trust & Safety Rating</span>
              <span className={`text-xl font-bold font-mono ${
                currentTrustScore > 85 ? 'text-emerald-400' : currentTrustScore > 60 ? 'text-amber-500' : 'text-red-500'
              }`}>{currentTrustScore}% Trust Score</span>
              <span className="text-[10px] block text-neutral-400 mt-0.5">Status: {privacyMode} Profile</span>
            </div>
            <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
              <Lock className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Global tab options */}
        <div className="flex border-b border-neutral-850 mt-8 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('profile_privacy')}
            className={`pb-2.5 px-3 text-xs font-mono font-extrabold uppercase tracking-wide transition whitespace-nowrap ${
              activeSubTab === 'profile_privacy' ? 'border-b-2 border-indigo-400 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            🔒 Visibility & Toggles
          </button>
          <button
            onClick={() => setActiveSubTab('draft_system')}
            className={`pb-2.5 px-3 text-xs font-mono font-extrabold uppercase tracking-wide transition whitespace-nowrap ${
              activeSubTab === 'draft_system' ? 'border-b-2 border-indigo-400 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            📝 Pre-Publication Drafts
          </button>
          <button
            onClick={() => setActiveSubTab('safety_tools')}
            className={`pb-2.5 px-3 text-xs font-mono font-extrabold uppercase tracking-wide transition whitespace-nowrap ${
              activeSubTab === 'safety_tools' ? 'border-b-2 border-indigo-400 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            🛡️ Safety & Blocking
          </button>
          <button
            onClick={() => setActiveSubTab('trust_score')}
            className={`pb-2.5 px-3 text-xs font-mono font-extrabold uppercase tracking-wide transition whitespace-nowrap ${
              activeSubTab === 'trust_score' ? 'border-b-2 border-indigo-400 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            📊 Trust Score Engine
          </button>
          <button
            onClick={() => setActiveSubTab('admin_governance')}
            className={`pb-2.5 px-3 text-xs font-mono font-extrabold uppercase tracking-wide transition whitespace-nowrap ${
              activeSubTab === 'admin_governance' ? 'border-b-2 border-indigo-400 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            💼 Admin Governance
          </button>
        </div>
      </div>

      {/* RENDER VIEW 1: PRIVACY PROFILE MODE & METADATA TOGGLES */}
      {activeSubTab === 'profile_privacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Main profile privacy choices */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Profile Modes */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Account Visibility Mode</h3>
                <p className="text-xs text-neutral-400 mt-1">Specify who can view and interact with your freelance profile.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Public */}
                <button
                  onClick={() => setPrivacyMode('Public')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    privacyMode === 'Public' 
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg' 
                      : 'bg-neutral-950 border-neutral-850 hover:border-neutral-700 text-neutral-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    {privacyMode === 'Public' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <h4 className="text-xs font-extrabold text-white">Public Profile</h4>
                  <p className="text-[10px] text-neutral-500 mt-1 font-mono">Visible to everyone on the internet.</p>
                </button>

                {/* Private */}
                <button
                  onClick={() => setPrivacyMode('Private')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    privacyMode === 'Private' 
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg' 
                      : 'bg-neutral-950 border-neutral-850 hover:border-neutral-700 text-neutral-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <EyeOff className="w-4 h-4 text-purple-400" />
                    {privacyMode === 'Private' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <h4 className="text-xs font-extrabold text-white">Private Profile</h4>
                  <p className="text-[10px] text-neutral-500 mt-1 font-mono">Visible only to approved followers.</p>
                </button>

                {/* Professional */}
                <button
                  onClick={() => setPrivacyMode('Professional')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    privacyMode === 'Professional' 
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg' 
                      : 'bg-neutral-950 border-neutral-850 hover:border-neutral-700 text-neutral-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    {privacyMode === 'Professional' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <h4 className="text-xs font-extrabold text-white">Professional</h4>
                  <p className="text-[10px] text-neutral-500 mt-1 font-mono">Public service offers, private profile metadata.</p>
                </button>

              </div>
            </div>

            {/* Privacy Controls Checkbox list */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Dynamic Masking Toggles</h3>
                <p className="text-xs text-neutral-400 mt-1">Conceal secure metadata from public queries and search results.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'hidePhone', label: 'Hide phone number from search results' },
                  { key: 'hideEmail', label: 'Hide email address on client dashboards' },
                  { key: 'hideEarnings', label: 'Conceal total balance / order earnings stats' },
                  { key: 'hideFollowerCount', label: 'Hide follower lists and count metrics' },
                  { key: 'hideOnlineStatus', label: 'Conceal active green online status' },
                  { key: 'hideLastSeen', label: 'Hide exact last seen local timestamp' },
                  { key: 'hidePortfolioNonFollowers', label: 'Require following to view active portfolio works' }
                ].map((item) => (
                  <label 
                    key={item.key} 
                    className="flex items-center space-x-3.5 p-3.5 bg-neutral-950 rounded-2xl border border-neutral-850 cursor-pointer hover:bg-neutral-900 transition"
                  >
                    <input
                      type="checkbox"
                      checked={toggles[item.key] || false}
                      onChange={() => {
                        setToggles(prev => ({
                          ...prev,
                          [item.key]: !prev[item.key]
                        }));
                      }}
                      className="rounded border-neutral-800 text-indigo-600 focus:ring-indigo-500 bg-neutral-900"
                    />
                    <span className="text-xs text-neutral-300 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Messaging, Comments & Live control selectors */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Messaging Privacy */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-3">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Direct Message Inboxes</span>
              <h4 className="text-sm font-extrabold text-white leading-tight">Who can message you?</h4>
              
              <div className="space-y-2 pt-2">
                {[
                  { key: 'Everyone', label: 'Everyone (Public Messaging)' },
                  { key: 'FollowersOnly', label: 'Followers & Clients only' },
                  { key: 'VerifiedOnly', label: 'Verified badge owners only' },
                  { key: 'PremiumOnly', label: 'Pro & VIP elite members only' },
                  { key: 'None', label: 'None (Block all Incoming chat corridors)' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setMessagingPrivacy(option.key as any)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                      messagingPrivacy === option.key 
                        ? 'bg-indigo-600/15 border-indigo-500/45 text-white' 
                        : 'bg-neutral-950 border-neutral-850 hover:bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Controls */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-3">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Feed & Portfolio Comments</span>
              <h4 className="text-sm font-extrabold text-white leading-tight">Allow Comments & Peer reviews</h4>
              
              <div className="space-y-2 pt-2">
                {[
                  { key: 'Allow', label: 'Allow comments globally' },
                  { key: 'FollowersOnly', label: 'Allow followers only' },
                  { key: 'VerifiedOnly', label: 'Only verified users can critique' },
                  { key: 'Disable', label: 'Disable comments' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setCommentControls(option.key as any)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                      commentControls === option.key 
                        ? 'bg-purple-600/15 border-purple-500/45 text-white' 
                        : 'bg-neutral-950 border-neutral-850 hover:bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live streaming privacy */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-3">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Broadcast & Consult Rules</span>
              <h4 className="text-sm font-extrabold text-white leading-tight">Video Room Access Level</h4>
              
              <div className="space-y-2 pt-2">
                {[
                  { key: 'Public', label: 'Public Live Broadcast' },
                  { key: 'FollowersOnly', label: 'Approved followers only' },
                  { key: 'PremiumOnly', label: 'Premium tier members only' },
                  { key: 'InviteOnly', label: 'Invite-only video consultations' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setLivePrivacy(option.key as any)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                      livePrivacy === option.key 
                        ? 'bg-amber-500/10 border-amber-500/30 text-white' 
                        : 'bg-neutral-950 border-neutral-850 hover:bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RENDER VIEW 2: PRE-PUBLICATION DRAFT SYSTEM */}
      {activeSubTab === 'draft_system' && (
        <div className="space-y-6 text-left">
          
          {/* Strict Platform Privacy Rules Banner */}
          <div className="bg-neutral-950 border border-indigo-900/40 p-5 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider font-mono">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>🔐 MatchGig Dynamic Content Protection Rules</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-neutral-900/60 rounded-2xl border border-neutral-850">
                <span className="font-extrabold text-white block mb-1">🎥 Videos Draft Protection</span>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Draft videos are private by default and <span className="text-[#00e676] font-bold">only visible to the creator</span>. No other user profiles or public scrapers can view unpublished assets.
                </p>
              </div>

              <div className="p-3 bg-neutral-900/60 rounded-2xl border border-neutral-850">
                <span className="font-extrabold text-white block mb-1">📝 Private Posts Scope</span>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Private posts are <span className="text-indigo-400 font-bold font-mono">only visible to approved users</span>. Restrict access paths to confirmed followers or client contract entities dynamically.
                </p>
              </div>

              <div className="p-3 bg-neutral-900/60 rounded-2xl border border-neutral-850">
                <span className="font-extrabold text-[#ff1744] block mb-1">🛑 Admin Isolation Policy</span>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Administrators cannot freely access user drafts. Review authorizations require strict report milestones, legal subpoenas, or active fraud investigations.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-neutral-900 p-5 rounded-3xl border border-neutral-850">
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider">MatchGig Content Draft Engine</h3>
              <p className="text-xs text-neutral-400 mt-1">Review, revise, delete, or organize future scheduled publish releases.</p>
            </div>
            
            <button
              onClick={() => setShowDraftForm(!showDraftForm)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition text-white font-mono text-xs font-bold rounded-xl flex items-center space-x-1 justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Initialize New Draft</span>
            </button>
          </div>

          {/* New Draft Form overlay/drawer */}
          {showDraftForm && (
            <form onSubmit={handleAddNewDraft} className="bg-neutral-900 border border-indigo-900/40 p-6 rounded-3xl space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Interactive Draft Draft Setup</span>
                <span className="text-neutral-500 text-xs italic">Saves client-side</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Content Format Type:</label>
                  <select
                    value={newDraftType}
                    onChange={(e) => setNewDraftType(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="video">Portfolio Video / Reels Draft</option>
                    <option value="gig">Skill Marketplace Service Gig</option>
                    <option value="post">Community & Tutorial Post</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Draft Item Title:</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Modern Cinematic Real-estate edit"
                    value={newDraftTitle}
                    onChange={(e) => setNewDraftTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">
                  {newDraftType === 'video' ? 'Video Duration / Spec detail:' : newDraftType === 'gig' ? 'Target gig price (coins):' : 'Post Body Copy content:'}
                </label>
                <textarea
                  rows={2}
                  value={newDraftDetail}
                  placeholder={newDraftType === 'post' ? 'Full post markdown contents...' : 'Details ...'}
                  onChange={(e) => setNewDraftDetail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 transition text-white font-mono text-[11px] font-bold rounded-xl"
                >
                  Save to Draft Vault
                </button>
                <button
                  type="button"
                  onClick={() => setShowDraftForm(false)}
                  className="px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Draft lists GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drafts.filter(d => d.authorId === currentUser.id).map((d) => (
              <div 
                key={d.id} 
                className={`bg-neutral-900 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                  d.visibility === 'Public' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-neutral-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      d.type === 'video' 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : d.type === 'gig' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {d.type} {d.visibility === 'Public' ? '• Live' : '• Draft'}
                    </span>

                    <span className="text-[10px] font-mono text-neutral-500">
                      ID: {d.id}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white mt-4 leading-snug">{d.title}</h4>
                  
                  <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-850 mt-3 text-[11px] text-neutral-400 font-mono min-h-[44px]">
                    {d.type === 'post' ? d.contentBody : d.mediaSummary}
                  </div>

                  {d.visibility === 'Scheduled' && (
                    <div className="mt-3 flex items-center space-x-1 text-[11px] text-indigo-400 font-mono font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Scheduled Publish Later: 10:00 AM</span>
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-neutral-850 mt-5 flex gap-2 justify-between">
                  <button
                    onClick={() => handleOpenEditModal(d)}
                    className="flex-1 py-2 border border-neutral-800 hover:border-neutral-700 bg-neutral-950 hover:bg-neutral-900 transition text-[11px] font-mono font-bold rounded-xl text-neutral-300 flex items-center justify-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Edit Draft</span>
                  </button>

                  {d.visibility !== 'Public' ? (
                    <button
                      onClick={() => handlePublishDraftNow(d.id)}
                      className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold rounded-xl transition flex items-center justify-center space-x-1"
                    >
                      <span>Publish Live</span>
                    </button>
                  ) : (
                    <span className="flex-1 py-1 px-2.5 bg-neutral-950 border border-neutral-850 text-neutral-400 rounded-xl text-[10px] font-mono text-center flex items-center justify-center">
                      ✓ Published Publicly
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteDraft(d.id)}
                    title="Delete Draft"
                    className="p-2 bg-rose-950/20 border border-rose-900/30 text-rose-400 hover:bg-rose-950 hover:text-white rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Editing Draft Modal Dialog */}
          {editingDraft && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-6 max-w-lg w-full text-left space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
                  <h4 className="text-sm font-extrabold text-white font-mono uppercase tracking-widest flex items-center">
                    <Edit3 className="w-4 h-4 mr-1.5 text-indigo-400" />
                    <span>Edit Action System Draft: {editingDraft.id}</span>
                  </h4>
                  <button onClick={() => setEditingDraft(null)} className="text-neutral-500 hover:text-white transition">
                    &times;
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase block mb-1">Revised Title:</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white font-medium"
                      value={editingDraft.title}
                      onChange={(e) => setEditingDraft({ ...editingDraft, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase block mb-1">Draft Visibility Preference:</label>
                    <select
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-xs text-white rounded-xl"
                      value={editingDraft.visibility}
                      onChange={(e) => setEditingDraft({ ...editingDraft, visibility: e.target.value as any })}
                    >
                      <option value="Draft">Draft (Private Cache)</option>
                      <option value="Scheduled">Scheduled Publish (Later release)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase block mb-1">Content Parameters & Text Copy:</label>
                    <textarea
                      rows={4}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white font-mono"
                      value={editingDraft.type === 'post' ? editingDraft.contentBody : editingDraft.mediaSummary}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingDraft.type === 'post') {
                          setEditingDraft({ ...editingDraft, contentBody: val });
                        } else {
                          setEditingDraft({ ...editingDraft, mediaSummary: val });
                        }
                      }}
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-neutral-850">
                  <button
                    onClick={handleSaveEditDraft}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingDraft(null)}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 rounded-xl transition"
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* RENDER VIEW 3: SAFETY TOOLS, KEYWORD SUPPRESSION, BLOCKED LISTS */}
      {activeSubTab === 'safety_tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* List and manage actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Blocking & Restricting Form */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Mute, Block, or Restrict Users</h3>
                <p className="text-xs text-neutral-400 mt-1">Directly suppress specific user interactions. Blocked profiles cannot see your online presence, posts, or direct chats.</p>
              </div>

              <form onSubmit={handleAddBlockedUser} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="flex-1">
                    <label className="text-[10px] text-neutral-500 font-mono block mb-1">Target Account Username:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. spammer_account_username"
                      value={targetUserAction}
                      onChange={(e) => setTargetUserAction(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 text-white p-2 w-full text-xs rounded-xl focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold px-4 py-3 rounded-xl transition sm:self-end text-center flex items-center justify-center"
                  >
                    <UserX className="w-3.5 h-3.5 mr-1" />
                    Block User
                  </button>
                </div>
              </form>

              {/* Display Lists items */}
              <div className="space-y-3.5 pt-2">
                
                {/* Block list */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase font-black">Active Blocked List ({blockedList.length})</span>
                  {blockedList.length === 0 ? (
                    <p className="text-neutral-600 text-xs mt-2 italic">0 blocked users.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {blockedList.map((user) => (
                        <span key={user} className="bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          <span>@{user}</span>
                          <button
                            onClick={() => {
                              setBlockedList(prev => prev.filter(u => u !== user));
                              setSafetyLog(prev => [`Security: Unblocked @${user}`, ...prev]);
                            }}
                            className="text-red-400 hover:text-white font-bold font-mono ml-1"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Muted users list */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase font-black">
                    <span>Muted Accounts list ({mutedList.length})</span>
                    <span className="text-indigo-400">Silences feed feeds & logs</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {mutedList.map((user) => (
                      <span key={user} className="bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <span>@{user}</span>
                        <button
                          onClick={() => handleToggleMute(user)}
                          className="text-indigo-400 font-mono text-[10px] hover:text-white"
                        >
                          Unmute
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Restricted Users */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase font-black">
                    <span>Restricted Account Corridors ({restrictedList.length})</span>
                    <span className="text-amber-500">Manual review comments</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {restrictedList.map((user) => (
                      <span key={user} className="bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <span>@{user}</span>
                        <button
                          onClick={() => handleToggleRestrict(user)}
                          className="text-amber-400 font-mono text-[10px] hover:text-white"
                        >
                          Unrestrict
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Keyword suppress filter and dynamic terminal log */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Keyword block filters */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4">
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
                  <Filter className="w-4 h-4 text-indigo-400" />
                  <span>Interactive Keyword Suppression</span>
                </h4>
                <p className="text-neutral-500 text-[11px] mt-1">Comments, messages, or bid applications containing these words will be dynamically blocked on your screen.</p>
              </div>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. crypto scheme"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddKeyword(); }}
                  className="bg-neutral-950 border border-neutral-850 p-2.5 pr-8 rounded-xl font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1"
                />
                <button
                  onClick={handleAddKeyword}
                  className="bg-indigo-650 hover:bg-indigo-600 transition p-2.5 rounded-xl text-xs font-mono font-bold text-white uppercase"
                >
                  Add Filter
                </button>
              </div>

              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 font-mono tracking-wider block mb-2 font-bold uppercase">Filtered Keywords:</span>
                <div className="flex flex-wrap gap-1.5">
                  {keywordFilters.map((word) => (
                    <span 
                      key={word} 
                      className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5 group"
                    >
                      <span>"{word}"</span>
                      <button 
                        onClick={() => handleRemoveKeyword(word)} 
                        className="text-red-400 hover:text-white font-bold font-mono"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Shield Event Output */}
            <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Live Shield Filter Auditor Logs</span>
                <p className="text-[11px] text-neutral-500 font-mono mb-3 uppercase">Continuous monitoring results</p>
                
                <div className="font-mono text-[10px] text-zinc-400 space-y-1.5 max-h-[160px] overflow-y-auto">
                  {safetyLog.map((log, idx) => (
                    <div key={idx} className="leading-snug">
                      <span className="text-zinc-600">&gt;</span> {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-900 pt-2 text-[9px] font-mono text-neutral-500 mt-4 flex justify-between items-center">
                <span>Core: Privacy Guardian Daemon</span>
                <span className="text-emerald-400">✓ SECURE SHIELD ACTIVE</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RENDER VIEW 4: TRUST & SAFETY SCORE SIMULATOR */}
      {activeSubTab === 'trust_score' && (
        <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-3xl text-left max-w-3xl mx-auto space-y-8 animate-fadeIn">
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span>Interactive Trust & Safety Score Engine</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-normal">
              Every user receives a trust score. We evaluate identity verification states, review logs, and detect spam 
              to keep MatchGig secure. Undergo tests in the simulator below to inspect response indexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-neutral-950 p-6 rounded-2xl border border-neutral-850">
            
            {/* Interactive sliders/controls */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest block">Sandbox Score Modulated Parameters</span>
              
              {/* Identity Verified Toggle */}
              <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
                <span className="text-xs text-neutral-300 font-bold">1. Verified Identity (Badge)</span>
                <button
                  type="button"
                  onClick={() => setBadgeIdentityVerified(!badgeIdentityVerified)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition ${
                    badgeIdentityVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {badgeIdentityVerified ? 'Verified (+15%)' : 'None (+0%)'}
                </button>
              </div>

              {/* Order Count Bonus Slider */}
              <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-300 font-bold">
                  <span>2. Completed Escrow Orders:</span>
                  <span className="font-mono text-indigo-400">{orderCountBonus} jobs</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={orderCountBonus}
                  onChange={(e) => setOrderCountBonus(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Spam/Fake Flag input count */}
              <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-300 font-bold">
                  <span>3. Spam / Fake engagement flags:</span>
                  <span className="font-mono text-red-400 font-bold">{numFakeFlags} alerts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={numFakeFlags}
                  onChange={(e) => setNumFakeFlags(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <span className="text-[10px] text-neutral-500 font-mono block">We suppress ratings on match flags! (-12% each)</span>
              </div>

              {/* VPN or Multiaccounting violations */}
              <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
                <span className="text-xs text-neutral-300 font-bold">4. VPN / Duplicate Account Violation</span>
                <button
                  type="button"
                  onClick={() => setHasVpnViolation(!hasVpnViolation)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition ${
                    hasVpnViolation ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {hasVpnViolation ? 'Violating (-20%)' : 'Clean (No deductions)'}
                </button>
              </div>

            </div>

            {/* Simulated Score Gauge output */}
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-mono font-black text-neutral-500 uppercase tracking-widest block">Recalculated Trust Safety Meter</span>
              
              <div className="relative py-4 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-4 border-neutral-900 flex flex-col items-center justify-center bg-gradient-to-tr from-neutral-950 to-neutral-900 shadow-2xl relative">
                  <span className={`text-5xl font-black font-mono transition-colors duration-200 ${
                    currentTrustScore > 85 ? 'text-emerald-400' : currentTrustScore > 60 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {currentTrustScore}%
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 mt-1 block">Account rating</span>
                </div>
              </div>

              <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-850/60 space-y-2 text-left">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">Status Summary Report:</span>
                <ul className="text-[11px] text-neutral-400 space-y-1 font-mono">
                  <li className="flex items-center space-x-1 leading-tighter">
                    <span className={badgeIdentityVerified ? 'text-emerald-400' : 'text-neutral-500'}>✓ Identity verification multiplier: {badgeIdentityVerified ? 'PASS (+15)' : 'NONE (+0)'}</span>
                  </li>
                  <li className="flex items-center space-x-1 leading-tighter">
                    <span className={orderCountBonus > 0 ? 'text-emerald-400' : 'text-neutral-500'}>✓ Freelance Order loyalty: {orderCountBonus > 20 ? '+10' : orderCountBonus > 5 ? '+5' : '+0'}</span>
                  </li>
                  <li className="flex items-center space-x-1 leading-tighter">
                    <span className={numFakeFlags > 0 ? 'text-red-400' : 'text-neutral-500'}>⚠ Engagement farm flags check: {numFakeFlags > 0 ? `FAIL (-${numFakeFlags * 12}%)` : 'PASS'}</span>
                  </li>
                  <li className="flex items-center space-x-1 leading-tighter">
                    <span className={hasVpnViolation ? 'text-red-400 font-bold' : 'text-neutral-500'}>⚠ Device Collision Checks: {hasVpnViolation ? 'FAIL (-20%)' : 'PASS'}</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
              <span className="text-xs font-bold text-white block mb-1">✓ Sustainable Growth Actions</span>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                Build trust points authentically! Verified identity uploads, continuous escrow handshakes, and older account profiles 
                naturally escalate metrics to higher score brackets.
              </p>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
              <span className="text-xs font-bold text-white block mb-1">⚠ Penalized Abusive Activity</span>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                Avoid instant farm setups! Spamming messaging canals, executing VPN sweeps, or launching bot view farms decreases rating metrics instantly, 
                eventually triggering warning locks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW 5: ADMIN GOVERNANCE, LAWFUL BYPASS & DECISIONS */}
      {activeSubTab === 'admin_governance' && (
        <div className="space-y-6 text-left" id="admin-governance-section">
          
          {/* Important Security Warning Banner */}
          <div className="bg-rose-950/30 border border-rose-500/40 p-6 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="absolute right-4 top-4 text-rose-500/20 pointer-events-none">
              <Scale className="w-20 h-20" />
            </div>
            
            <div className="flex items-center space-x-2 text-rose-400 font-black text-sm uppercase tracking-wider font-mono">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span>Critical Security Compliance Directive</span>
            </div>

            <p className="text-xs text-neutral-300 max-w-3xl leading-relaxed">
              Platform administrators and platform governors <span className="text-white font-bold underline">cannot read user private messages directly</span>. 
              Private messages remain safe, protected, and encrypted. Bypassing encryption requires active legal subpoena certifications or official 
              user abuse reviews. Bypasses are permanently audited.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Decrypt bypass console sandbox */}
            <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6">
              
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Interactive Administrative Override Panel</h3>
                <p className="text-xs text-neutral-400 mt-1">Simulate administrative overrides matching strict security compliance requirements.</p>
              </div>

              {adminCertifiedAuthorized ? (
                <div className="bg-neutral-950 p-5 rounded-2xl border border-emerald-500/20 space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-emerald-400 font-extrabold">🔓 TEMP ADMINISTRATIVE DECRYPT ACTIVE</span>
                    <span className="text-neutral-500">Bypass temporary</span>
                  </div>

                  <p className="text-xs text-neutral-300 font-mono">
                    Session authorized for Admin ID: #{currentUser.id}. Bypassing client channel encryption key: <span className="text-amber-400">rsa_aes_256:mg_dec_429b8s1</span>.
                  </p>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-[11px] font-mono text-indigo-300 space-y-1.5">
                    <p className="text-neutral-500 uppercase font-bold text-[9px] mb-1">Bypassed message review snapshot:</p>
                    <p>&gt; [Fatima] "Assalam-o-Alaikum Imran! Mockups sent."</p>
                    <p>&gt; [Imran] "Walaikum Assalam Fatima! These mockups look gorgeous."</p>
                  </div>

                  <button
                    onClick={() => {
                      setAdminCertifiedAuthorized(false);
                      setAdminBypassReason(null);
                      const closeLg = `[AUDIT REGISTER] Admin decrypted session closed cleanly. Encryption rules restored.`;
                      saveAuditLogs([closeLg, ...adminAuditEvents]);
                    }}
                    className="w-full py-2 bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700 transition font-mono text-xs font-bold rounded-xl"
                  >
                    Restore Encryption Constraints
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase block">Step 1: Certified Compliance Grounds</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminBypassReason('abuse');
                          setAdminDraftQueryRequested(false);
                        }}
                        className={`p-3.5 rounded-xl border text-center transition font-mono text-[10px] font-bold leading-normal ${
                          adminBypassReason === 'abuse' 
                            ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Content is reported
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminBypassReason('legal');
                          setAdminDraftQueryRequested(false);
                        }}
                        className={`p-3.5 rounded-xl border text-center transition font-mono text-[10px] font-bold leading-normal ${
                          adminBypassReason === 'legal' 
                            ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Legal compliance is required
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminBypassReason('security');
                          setAdminDraftQueryRequested(false);
                        }}
                        className={`p-3.5 rounded-xl border text-center transition font-mono text-[10px] font-bold leading-normal ${
                          adminBypassReason === 'security' 
                            ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Fraud investigation is required
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase block">Step 2: Sign-off bypass declaration</span>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      By triggering administrative override, you confirm that this decision maps strictly to compliance targets. 
                      An audited verification message will be written immediately.
                    </p>
                    
                    <button
                      disabled={!adminBypassReason}
                      onClick={handleTriggerAdminBypass}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 transition text-white font-mono text-xs font-bold uppercase rounded-xl tracking-wider text-center"
                    >
                      Certify & Decrypt Session
                    </button>
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-neutral-500 font-mono uppercase block">Step 3: Private Drafts Retrieval Checker</span>
                      <span className="text-amber-500 text-[10px] font-mono leading-none">Strict Access Control</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      Core privacy agreements mandate that <span className="text-white font-bold">administrators cannot freely access user drafts</span>. Verify security rules below:
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminDraftQueryRequested(true);
                          if (!adminBypassReason) {
                            setDraftScanResult('error');
                            const failMsg = `[COMPLIANCE ALERT] Unauthorized attempt to retrieve private drafts without legal certification. Denied automatically by security controller.`;
                            saveAuditLogs([failMsg, ...adminAuditEvents]);
                          } else {
                            setDraftScanResult('success');
                            const groundsLabel = adminBypassReason === 'abuse' ? 'CONTENT_REPORT' : adminBypassReason === 'legal' ? 'LEGAL_COMPLIANCE' : 'FRAUD_INVESTIGATION';
                            const successMsg = `[BYPASS APPROVED] Private draft review authorized for Admin under active grounds: ${groundsLabel}. Signature registered in central ledger.`;
                            saveAuditLogs([successMsg, ...adminAuditEvents]);
                          }
                        }}
                        className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition rounded-xl font-mono text-xs text-neutral-300"
                      >
                        Try Retrieve User Drafts
                      </button>
                      
                      {adminBypassReason && (
                        <button
                          type="button"
                          onClick={() => {
                            setAdminBypassReason(null);
                            setAdminDraftQueryRequested(false);
                            setDraftScanResult('');
                          }}
                          className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-mono rounded-xl border border-neutral-800 transition"
                        >
                          Reset Certified Grounds
                        </button>
                      )}
                    </div>

                    {adminDraftQueryRequested && (
                      <div className={`p-3.5 rounded-xl border text-xs font-mono font-medium leading-relaxed ${
                        draftScanResult === 'error'
                          ? 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                          : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {draftScanResult === 'error' ? (
                          <div className="flex items-start space-x-2">
                            <span className="text-base leading-none">🛑</span>
                            <span>
                              <strong>Access Denied:</strong> Administrators cannot freely access user drafts. Access is strictly blocked unless Content is reported, Fraud investigation is required, or Legal compliance is required.
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-start space-x-2">
                            <span className="text-base leading-none">✓</span>
                            <span>
                              <strong>Access Authorized:</strong> Under secure access protocols, retrieval permitted for grounds: <u>{
                                adminBypassReason === 'abuse' ? 'Content is reported' : adminBypassReason === 'legal' ? 'Legal compliance is required' : 'Fraud investigation is required'
                              }</u>. 1 draft returned for investigation under user privacy trust parameters.
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Compliance dynamic audit log timeline */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4">
                
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                    <span>Compliance Governance Ledger</span>
                  </h4>
                  <p className="text-neutral-500 text-[11px] mt-1">This log tracks all admin decisions, verification grants, and security overrides in persistent storage.</p>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 h-52 overflow-y-auto scrollbar-thin space-y-3 font-mono text-[9px] text-neutral-400">
                  {adminAuditEvents.map((event, index) => (
                    <div key={index} className="border-b border-neutral-900 pb-1.5 leading-normal">
                      <span className="text-zinc-650 text-neutral-500 font-mono">⚡ Event {adminAuditEvents.length - index}:</span> {event}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (confirm("Reset local compliance ledger history?")) {
                      const fresh = [
                        'SYSTEM RESET: Logged out decryption histories.',
                        'COMPLIANCE ALERT: Zero access allowed without active user report or certified national subpoena.'
                      ];
                      saveAuditLogs(fresh);
                    }
                  }}
                  className="w-full text-center text-[10px] font-mono text-neutral-500 hover:text-rose-400 transition"
                >
                  Clear Governance History Logs
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
