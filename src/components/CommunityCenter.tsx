/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { BookOpen, Users, MessageSquare, Award, PlayCircle, PlusCircle, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface CommunityCenterProps {
  currentUser: User;
}

export default function CommunityCenter({ currentUser }: CommunityCenterProps) {
  const [activeTab, setActiveTab] = useState<'communities' | 'courses' | 'forums'>('communities');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(['course_1']);
  const [forumPosts, setForumPosts] = useState([
    { id: 'p1', author: 'designer_fatima', title: 'Best practices for vertical video thumbnail design in 2026', body: 'With viewers short attention span, keeping a bold title paired with a high-contrast facial cutout raises click-through metrics by over 18% in modern algorithms.', likes: 42, comments: 14 },
    { id: 'p2', author: 'coder_zain', title: 'Why full-stack React enums might break ESM Node build deployments', body: 'Be mindful when packing typescript files that require Node.js relative ESM resolves. Always keep your server scripts bundled inside static outputs using compiler platforms like esbuild for maximum durability.', likes: 28, comments: 7 }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [showForumForm, setShowForumForm] = useState(false);

  const communities = [
    { id: 'c_1', name: 'UI/UX Interactive Designers', desc: 'Expert designers specializing in glassmorphism grids, layouts, and Figma vectors.', members: '4.2k members', category: 'Design' },
    { id: 'c_2', name: 'Cinema Video Producers', desc: 'Documentary, vertical shorts, and cinematic color correction specialists.', members: '2.8k members', category: 'Production' },
    { id: 'c_3', name: 'TypeScript Fullstack Devs', desc: 'Configuring Node TSX servers, database schemas, and modular components.', members: '5.1k members', category: 'Coding' },
  ];

  const courses = [
    { id: 'course_1', title: 'Modern Vertical Reels cinematic Editing Mastery', tutor: 'Hamza Siddiqui', price: 'Free Program (VIP Exclusive)', duration: '8 Lectures (4.5 hours)', logo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400' },
    { id: 'course_2', title: 'Figma Vector Layout Masterclass & Client Pitching', tutor: 'Fatima Malik', price: 'Free Program (Pro Only)', duration: '12 Lectures (8 hours)', logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400' },
    { id: 'course_3', title: 'Certified Google Cloud Run Deployments & Express proxies', tutor: 'Ali Raza', price: '250 Coins', duration: '6 Lectures (3 hours)', logo: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=400' },
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBody) return;

    const post = {
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      author: currentUser.username,
      title: newTitle,
      body: newBody,
      likes: 1,
      comments: 0
    };

    setForumPosts([post, ...forumPosts]);
    setNewTitle('');
    setNewBody('');
    setShowForumForm(false);
  };

  const enrollSim = (id: string, isPaid: boolean, priceVal: number) => {
    if (enrolledCourses.includes(id)) return;
    if (isPaid && currentUser.coins < priceVal) {
      alert('Insufficient wallet coins balance to purchase course.');
      return;
    }
    setEnrolledCourses([...enrolledCourses, id]);
    alert('🎉 Successfully Enrolled! Study materials & webinars certification are unlocked under Learning Hub!');
  };

  return (
    <div className="space-y-6" id="community-hub-panel">
      {/* Selector Tabs */}
      <div className="flex border-b border-neutral-850" id="community-tabs">
        <button
          onClick={() => setActiveTab('communities')}
          className={`flex items-center space-x-2 pb-3.5 text-xs font-extrabold uppercase tracking-widest border-b-2 transition ${
            activeTab === 'communities' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400" />
          <span>Professional Networks</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`ml-6 flex items-center space-x-2 pb-3.5 text-xs font-extrabold uppercase tracking-widest border-b-2 transition ${
            activeTab === 'courses' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Skill Learning Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('forums')}
          className={`ml-6 flex items-center space-x-2 pb-3.5 text-xs font-extrabold uppercase tracking-widest border-b-2 transition ${
            activeTab === 'forums' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Knowledge Forums</span>
        </button>
      </div>

      <div className="min-h-[300px]">
        {/* Tab 1: Communities */}
        {activeTab === 'communities' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {communities.map((c) => (
                <div
                  key={c.id}
                  className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-purple-500/20 transition-all"
                >
                  <div className="space-y-1 pr-6">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {c.category}
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-2">{c.name}</h4>
                    <p className="text-xs text-neutral-400">{c.desc}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-neutral-500 font-mono whitespace-nowrap">{c.members}</span>
                    <button
                      onClick={() => alert(`Joined ${c.name}! Daily group digests have been integrated.`)}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-purple-600 font-bold text-neutral-300 hover:text-white text-[11px] uppercase tracking-wider rounded-lg transition"
                    >
                      Join Chat Room
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel info */}
            <div className="bg-neutral-900/40 border border-neutral-850 p-5 rounded-3xl space-y-4">
              <h5 className="text-xs font-extrabold uppercase tracking-widest text-white">Join Guest Webinars</h5>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Connect directly with digital agency founders, small business buyers, and high level creators in live audio forums. MatchGig premium subscription holds weekly networking panels.
              </p>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 text-xs">
                <p className="font-bold text-white mb-1">🔥 Next Expert Panel is LIVE</p>
                <p className="text-neutral-400 leading-snug">Topic: Raising freelancer conversion margins by 25% using virtual coin gifts inside stream lobbies.</p>
                <button
                  onClick={() => alert('Launching panel live room interface inside streams telemetry.')}
                  className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase rounded-lg rounded tracking-wider"
                >
                  Enter Expert Room Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Skill Courses Learning hub */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => {
              const enrolled = enrolledCourses.includes(course.id);
              const isPaid = course.price !== 'Free Program (VIP Exclusive)' && course.price !== 'Free Program (Pro Only)';

              return (
                <div
                  key={course.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-video w-full bg-neutral-950 relative overflow-hidden">
                    <img src={course.logo} alt={course.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-neutral-950/80 backdrop-blur text-[9px] font-mono text-purple-400 px-2.5 py-1 rounded border border-neutral-900">
                      {course.duration}
                    </span>
                  </div>

                  <div className="p-5 space-y-3.5">
                    <span className="text-[9px] font-mono font-bold tracking-widest bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                      Approved Tutor: {course.tutor}
                    </span>
                    <h4 className="text-sm font-extrabold text-white leading-tight">{course.title}</h4>
                    <span className="text-xs text-neutral-400 font-mono block">Program Entry value: <span className="text-amber-400 font-semibold">{course.price}</span></span>

                    <button
                      onClick={() => enrollSim(course.id, isPaid, 250)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center space-x-1.5 ${
                        enrolled
                          ? 'bg-neutral-950 text-neutral-500 cursor-default border border-neutral-800'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black'
                      }`}
                    >
                      {enrolled ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Lecture Materials Unlocked</span>
                        </>
                      ) : (
                        <span>Enroll & Certify Now 🎓</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Knowledge Forums */}
        {activeTab === 'forums' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">Knowledge sharing threads</h4>
              <button
                onClick={() => setShowForumForm(!showForumForm)}
                className="px-3.5 py-1.5 bg-neutral-800 hover:bg-purple-600 text-xs font-bold rounded-lg transition"
              >
                {showForumForm ? '✕ Close Form' : '+ New Thread'}
              </button>
            </div>

            {/* Create Thread Form */}
            {showForumForm && (
              <form onSubmit={handleCreatePost} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Thread Subject Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter short title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Body Statement Content</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your design, editing, and deployment queries..."
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    className="w-full text-xs bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl text-white"
                  />
                </div>
                <button type="submit" className="py-2 px-5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition">
                  Create Thread
                </button>
              </form>
            )}

            <div className="space-y-4">
              {forumPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl space-y-3"
                >
                  <div className="flex justify-between font-mono text-[10px] text-neutral-500 font-bold">
                    <span>Topic created by @{post.author}</span>
                    <span>Verified Poster</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white leading-tight">{post.title}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/40 p-4 rounded-xl border border-neutral-900/80">
                    {post.body}
                  </p>
                  <div className="flex space-x-4 font-mono text-[10px] text-neutral-500 pt-1">
                    <span>👍 {post.likes} appreciation coins</span>
                    <span>💬 {post.comments} responses</span>
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
