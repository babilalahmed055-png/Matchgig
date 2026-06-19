/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { Briefcase, Users, FileText, CheckCircle2, ShieldCheck, DollarSign, PlusCircle, Trash2, Cpu } from 'lucide-react';
import { User } from '../types';

interface JobPosting {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  skillsRequired: string[];
  duration: number;
  status: 'Open' | 'Matched' | 'Closed';
  date: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: 'Owner' | 'Manager' | 'Viewer';
}

interface BusinessDashboardProps {
  currentUser: User;
  onCoinsTransfer: (amount: number, targetId: string, description: string) => boolean;
}

export default function BusinessDashboard({ currentUser, onCoinsTransfer }: BusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'post_job' | 'team' | 'verify'>('dashboard');
  
  // Pre-seed mock job postings
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    { id: 'job_1', title: 'Need modern premium vector logos for vertical shorts channel', description: 'Seeking a designer who was verified under MatchGig portfolios to formulate custom visual guidelines with source master files.', budget: 500, category: 'Logo Design', skillsRequired: ['Logo Design', 'Adobe Illustrator'], duration: 5, status: 'Open', date: '2026-06-18' },
    { id: 'job_2', title: 'React Node fullstack web dashboard integration', description: 'Assemble an optimized sandbox Express app on Port 3000 containing full state storage, clean dashboards, and responsive modules.', budget: 2500, category: 'Programming', skillsRequired: ['React', 'NodeJS', 'TypeScript'], duration: 10, status: 'Matched', date: '2026-06-14' }
  ]);

  // Pre-seed team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 't_1', name: currentUser.name, email: currentUser.email, role: 'Chief Executive Buyer', permissions: 'Owner' },
    { id: 't_2', name: 'Zeeshan Khan', email: 'zeeshan@matchcorp.com', role: 'Staff Sourcing Recruiter', permissions: 'Manager' },
    { id: 't_3', name: 'Saba Sheikh', email: 'saba@matchcorp.com', role: 'Design Coordinator Auditor', permissions: 'Viewer' }
  ]);

  // Job form variables
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newBudget, setNewBudget] = useState(500);
  const [newCategory, setNewCategory] = useState('Logo Design');
  const [newSkills, setNewSkills] = useState('Logo Design, Illustrator');
  const [newDuration, setNewDuration] = useState(7);

  // New team member variables
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('Staff Sourcing');
  const [memberPerm, setMemberPerm] = useState<'Owner' | 'Manager' | 'Viewer'>('Viewer');

  const [verifyStatus, setVerifyStatus] = useState<'Unverified' | 'Processing' | 'Verified'>('Verified');

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    if (currentUser.coins < newBudget) {
      alert(`Wallet alert: You need at least ${newBudget} Coins in your balance to lock job budget escrow.`);
      return;
    }

    const post: JobPosting = {
      id: 'job_' + Math.random().toString(36).substring(2, 9),
      title: newTitle,
      description: newDesc,
      budget: newBudget,
      category: newCategory,
      skillsRequired: newSkills.split(',').map(s => s.trim()),
      duration: newDuration,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    setJobPostings([post, ...jobPostings]);
    
    // Deduct coins as a simulated job escrow lock!
    onCoinsTransfer(newBudget, 'admin_user', `Locked job post budget escrow code for "${newTitle}"`);

    setNewTitle('');
    setNewDesc('');
    setNewBudget(500);
    alert('🎉 Corporate Job listing posted! Project funds locked securely under platform escrows.');
    setActiveTab('dashboard');
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberEmail) return;

    const newMember: TeamMember = {
      id: 't_' + Math.random().toString(36).substring(2, 9),
      name: memberName,
      email: memberEmail,
      role: memberRole,
      permissions: memberPerm
    };

    setTeamMembers([...teamMembers, newMember]);
    setMemberName('');
    setMemberEmail('');
    alert(`💼 Employee @${memberName} added to multi-team directory permissions!`);
  };

  const handleRemoveMember = (id: string) => {
    if (id === 't_1') {
      alert('You cannot delete the primary owner account credentials.');
      return;
    }
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6" id="business-dashboard-pane">
      {/* Page Header */}
      <div className="bg-gradient-to-tr from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Premium Corporate Portal
          </span>
          <h3 className="text-xl font-black text-white mt-1">Agency & Company Suite</h3>
          <p className="text-xs text-neutral-400">Post pre-budgeted job escrows, hire verified talent teams, and audit corporate credentials.</p>
        </div>

        {/* Corporate badge */}
        <div className="bg-neutral-950 p-3.5 border border-neutral-850 rounded-2xl flex items-center space-x-3 w-fit">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono text-neutral-500 block">Verification check</span>
            <span className="text-xs font-bold text-white uppercase">Corporate Partner Verified</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-850" id="business-panel-tabs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center space-x-2 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition ${
            activeTab === 'dashboard' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4 text-purple-400" />
          <span>Postings & Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('post_job')}
          className={`ml-6 flex items-center space-x-2 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition ${
            activeTab === 'post_job' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Post New Job</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`ml-6 flex items-center space-x-2 pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition ${
            activeTab === 'team' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Corporate Team Directory</span>
        </button>
      </div>

      {/* Dynamic Tab Body */}
      <div className="min-h-[250px]">
        {/* Tab 1: Posted jobs dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase text-neutral-500">Active Job Postings Escrows</h4>
              
              {jobPostings.map((job) => (
                <div
                  key={job.id}
                  className="bg-neutral-905 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-neutral-400 uppercase">
                        Category: {job.category}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        job.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 animate-pulse' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <h5 className="text-sm font-extrabold text-white mt-1 leading-tight">{job.title}</h5>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{job.description}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skillsRequired.map((skill, idx) => (
                        <span key={idx} className="bg-neutral-950 text-neutral-400 font-mono text-[9px] px-2 py-0.5 rounded-full border border-neutral-850">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-850/80 mt-4 pt-3 text-xs text-neutral-500 font-mono">
                    <span>Deadline delivery: {job.duration} days</span>
                    <span className="text-sm font-black text-amber-500">{job.budget.toLocaleString()} Coins</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Dashboard summary stats side */}
            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4">
                <h5 className="text-xs font-bold uppercase text-white">Sourcing Metrics Summary</h5>
                <div className="grid grid-cols-2 gap-4 pb-2">
                  <div className="bg-neutral-950 p-3 rounded-xl text-center">
                    <span className="text-[9px] uppercase font-mono text-neutral-500 block">Open Posts</span>
                    <span className="text-lg font-black text-white">{jobPostings.filter(j => j.status === 'Open').length}</span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl text-center">
                    <span className="text-[9px] uppercase font-mono text-neutral-500 block">Total Budget</span>
                    <span className="text-lg font-black text-amber-400">3k 🪙</span>
                  </div>
                </div>

                <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl space-y-2">
                  <span className="text-[9px] uppercase font-mono text-neutral-500 block">AI Recruiter suggestions match</span>
                  <div className="flex items-center space-x-2.5">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" className="w-8 h-8 rounded-lg object-cover" />
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-white block">Fatima Malik</span>
                      <span className="text-[9px] font-mono text-purple-400 uppercase font-black">98% Match for Logo Design</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Opening consultation portal to schedule design audits.')}
                    className="w-full mt-2 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase rounded-lg tracking-wider"
                  >
                    Negotiate Contract
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Post job form */}
        {activeTab === 'post_job' && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl max-w-xl">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Post New Pre-Budgeted Escrow Job</h4>
            
            <form onSubmit={handlePostJobSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Job Title / Required Service</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. High intensity Cinema Video editor for YouTube"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Project specifications detailed description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain your delivery timeline, expected master edit formats, vector specs..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Coins Budget Escrow lock</label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    placeholder="500"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Max Delivery Timeline (In Days)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="7"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Industry Category Tag</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white"
                  >
                    <option value="Logo Design">Logo Design</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Programming">Programming</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Required Skills tags (comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="Logo Design, Adobe"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition"
              >
                Post Job & Secure Funds Escrow
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Multi team manager */}
        {activeTab === 'team' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase text-neutral-500">Corporate Employee Team Members Directory</h4>
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-850">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-neutral-850/10 transition">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white block">{member.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono block">{member.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 block text-right font-bold uppercase leading-none">{member.role}</span>
                        <span className="text-[9px] text-neutral-500 font-mono block mt-0.5 text-right">{member.permissions} Permission</span>
                      </div>

                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 px-2.5 hover:bg-red-600/10 text-neutral-500 hover:text-red-500 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Team Member form */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl h-fit">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Add Employee Authorized Team User</h4>
              
              <form onSubmit={handleAddTeamMember} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Employee full name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name..."
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Work email address</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g. member@matchcorp.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Corporate Staff Role</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Recruiter Lead"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">Permissions Level</label>
                  <select
                    value={memberPerm}
                    onChange={(e) => setMemberPerm(e.target.value as any)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white font-mono"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase rounded-lg tracking-wider transition"
                >
                  Authorized Sourcing Operator
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
