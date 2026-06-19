/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { Video, PhoneCall, Calendar, Clock, AlertTriangle, CheckCircle2, User as UserIcon, ShieldAlert, FileText } from 'lucide-react';
import { User } from '../types';

interface ConsultationCenterProps {
  currentUser: User;
  users: User[];
  onCoinsTransfer: (amount: number, targetId: string, description: string) => boolean;
}

interface ConsultBooking {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  type: 'Voice Call' | 'Video Meeting' | 'Instant Call';
  price: number;
  date: string;
  timeSlot: string;
  status: 'Scheduled' | 'Completed' | 'In Progress';
  meetingLink?: string;
}

export default function ConsultationCenter({
  currentUser,
  users,
  onCoinsTransfer,
}: ConsultationCenterProps) {
  // Preseed consultant lists
  const consultants = users.filter((u) => u.role === 'Freelancer');

  const [selectedConsultantId, setSelectedConsultantId] = useState<string>(consultants[0]?.id || '');
  const [consultType, setConsultType] = useState<'Voice Call' | 'Video Meeting' | 'Instant Call'>('Video Meeting');
  const [bookingDate, setBookingDate] = useState('2026-06-20');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('02:00 PM - 02:30 PM (UTC)');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [bookings, setBookings] = useState<ConsultBooking[]>([
    {
      id: 'cons_1',
      creatorId: 'user_1',
      creatorName: 'Fatima Malik',
      creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      type: 'Video Meeting',
      price: 150,
      date: '2026-06-19',
      timeSlot: '11:00 AM - 11:30 AM (UTC)',
      status: 'Scheduled',
      meetingLink: 'https://meet.google.com/matchgig-demo-call'
    },
    {
      id: 'cons_2',
      creatorId: 'user_2',
      creatorName: 'Hamza Siddiqui',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      type: 'Voice Call',
      price: 75,
      date: '2026-06-12',
      timeSlot: '04:00 PM - 04:30 PM (UTC)',
      status: 'Completed',
    }
  ]);

  const selectedConsultant = consultants.find((c) => c.id === selectedConsultantId) || consultants[0];

  // Helper matching price list
  const getConsultationPrice = (type: string) => {
    switch (type) {
      case 'Instant Call': return 200;
      case 'Video Meeting': return 150;
      case 'Voice Call': return 100;
      default: return 100;
    }
  };

  const currentPrice = getConsultationPrice(consultType);

  const handleBookSession = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedConsultant) {
      setErrorMessage('Please select a verified top consultant creator first.');
      return;
    }

    if (currentUser.id === selectedConsultant.id) {
      setErrorMessage('You cannot book a consultation session with your own profile.');
      return;
    }

    if (currentUser.coins < currentPrice) {
      setErrorMessage(`Insufficient Coin balance inside wallet. You need at least ${currentPrice} Coins for booking.`);
      return;
    }

    // Process coins transfer using App's core coins handler
    const coinDeductionStatus = onCoinsTransfer(
      currentPrice,
      selectedConsultant.id,
      `Booked professional consultative session (${consultType}) with @${selectedConsultant.username}`
    );

    if (!coinDeductionStatus) {
      setErrorMessage('Verification error: Transaction rejected by secure payment processor.');
      return;
    }

    // Record session transaction
    const newBooking: ConsultBooking = {
      id: 'cons_' + Math.random().toString(36).substring(2, 9),
      creatorId: selectedConsultant.id,
      creatorName: selectedConsultant.name,
      creatorAvatar: selectedConsultant.avatar,
      type: consultType,
      price: currentPrice,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      status: 'Scheduled',
      meetingLink: `https://meet.google.com/matchgig-${Math.random().toString(36).substring(2, 7)}`
    };

    setBookings([newBooking, ...bookings]);
    setSuccessMessage(`🎉 Successfully booked a consultative ${consultType}! Meeting invite has been logged under Calendar integration below.`);
  };

  const triggerMeetingAlert = (meetingLink?: string) => {
    if (!meetingLink) {
      alert('This consulting session has completed.');
      return;
    }
    alert(`📅 CALENDAR INVITATION & ZOOM LINK:\nJoin consultation now:\n${meetingLink}\n\nMatching codes and automated guidelines have been distributed into chat inboxes.`);
  };

  return (
    <div className="space-y-8" id="consultation-marketplace-hub">
      {/* Intro Banner */}
      <div className="bg-gradient-to-tr from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-neutral-400 opacity-20 pointer-events-none">
          <Calendar className="w-24 h-24 stroke-1" />
        </div>
        <span className="text-xs font-mono font-bold tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/25 uppercase">
          Pre-Paid Audio & Video Consults
        </span>
        <h3 className="text-2xl font-black text-white mt-3 tracking-tight">On-Demand Private Consultation Portal</h3>
        <p className="text-xs text-neutral-400 mt-1 max-w-xl">
          Instantly connect with freelance coding mentors, digital consultants, design auditors, or cinematic soundscapes directors. Set calendar dates, schedule time slot availabilities, and release pre-payouts using safe secure wallet coins escrow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form Layout Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Book Premium Consultation Session</h4>

            <div className="space-y-4">
              {/* Consultant listing selector list */}
              <div>
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400 block mb-2">Available Top Creators</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {consultants.map((con) => (
                    <button
                      key={con.id}
                      onClick={() => setSelectedConsultantId(con.id)}
                      className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                        selectedConsultantId === con.id
                          ? 'bg-purple-600/10 border-purple-500'
                          : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <img
                        src={con.avatar}
                        alt={con.name}
                        className="w-10 h-10 rounded-lg object-cover ring-2 ring-neutral-900 grayscale-0 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold block truncate text-white">{con.name}</span>
                        <span className="text-[9px] text-neutral-500 font-mono">★ {con.rating} Rating</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Channel options selectors */}
              <div>
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400 block mb-2">Consultation Medium Channel</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Video Meeting', text: 'Video Consultation', price: 150, icon: <Video className="w-4 h-4 text-purple-400" /> },
                    { id: 'Voice Call', text: 'Voice Consultation', price: 100, icon: <PhoneCall className="w-4 h-4 text-blue-400" /> },
                    { id: 'Instant Call', text: 'Instant Chat Call', price: 200, icon: <Clock className="w-4 h-4 text-amber-500 text-purple-400 shrink-0 animate-pulse" /> }
                  ].map((medium) => (
                    <button
                      key={medium.id}
                      onClick={() => setConsultType(medium.id as any)}
                      className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                        consultType === medium.id
                          ? 'bg-purple-600/10 border-purple-500 text-purple-300'
                          : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="p-1 px-2.5 bg-neutral-900 rounded-lg border border-neutral-800">
                        {medium.icon}
                      </div>
                      <span className="text-xs font-bold block">{medium.text}</span>
                      <span className="text-[10px] font-mono text-neutral-500">{medium.price} Coins / half-hr</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendars Availability Scheduler Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400 block mb-2">Set Calendar Meeting Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs font-mono font-semibold bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-neutral-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400 block mb-2">Schedule Available slots</label>
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-neutral-300"
                  >
                    <option value="11:00 AM - 11:30 AM (UTC)">11:00 AM - 11:30 AM (UTC)</option>
                    <option value="02:00 PM - 02:30 PM (UTC)">02:00 PM - 02:30 PM (UTC)</option>
                    <option value="04:00 PM - 04:30 PM (UTC)">04:00 PM - 04:30 PM (UTC)</option>
                    <option value="07:30 PM - 08:00 PM (UTC)">07:30 PM - 08:00 PM (UTC)</option>
                  </select>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-xs flex items-center space-x-1.5 font-mono">
                <ShieldAlert className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-xs flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="border-t border-neutral-800 pt-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest block">Summary Booking Fee</span>
                <p className="text-xl font-black text-white">
                  {currentPrice} <span className="text-xs text-amber-500 font-bold">Coins</span>
                </p>
              </div>
              <button
                onClick={handleBookSession}
                className="py-2.5 px-6 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition"
              >
                Schedule Consultation Session
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Reminders and consultations active list */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Interactive Session Logs</h4>
              <p className="text-[11px] text-neutral-500 mt-1">Calendar invitations and meeting links are updated upon booking approval.</p>
            </div>

            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={booking.creatorAvatar}
                        alt={booking.creatorName}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-neutral-800"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">{booking.creatorName}</span>
                        <span className="text-[9px] text-neutral-500 font-mono uppercase font-bold text-purple-400">
                          {booking.type}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-amber-500 font-mono font-bold">
                      {booking.price} 🪙
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-[10px] text-neutral-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{booking.date} • {booking.timeSlot}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-900">
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      booking.status === 'Completed'
                        ? 'bg-neutral-900 text-neutral-500'
                        : 'bg-emerald-500/10 text-emerald-400 animate-pulse'
                    }`}>
                      {booking.status}
                    </span>

                    {booking.status === 'Scheduled' && (
                      <button
                        onClick={() => triggerMeetingAlert(booking.meetingLink)}
                        className="px-2.5 py-1 bg-purple-600/15 hover:bg-purple-600 text-purple-300 hover:text-white rounded text-[10px] font-bold font-mono transition border border-purple-500/20"
                      >
                        Enter Virtual Zoom
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
