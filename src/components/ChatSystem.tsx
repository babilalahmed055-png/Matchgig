/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import {
  Send,
  Video,
  FileCode,
  Image as ImageIcon,
  DollarSign,
  Gift as GiftIcon,
  CheckCircle,
  PlusCircle,
  X,
  PhoneCall,
  Coins
} from 'lucide-react';
import { VIRTUAL_GIFTS } from '../data';
import { User, Message, Gift } from '../types';

interface ChatSystemProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  onSendMessage: (receiverId: string, text: string, type?: Message['type'], options?: Partial<Message>) => void;
  onCoinsTransfer: (amount: number, targetId: string, description: string) => boolean;
  onSendGiftCelebration: (gift: Gift) => void;
}

export default function ChatSystem({
  currentUser,
  users,
  messages,
  onSendMessage,
  onCoinsTransfer,
  onSendGiftCelebration,
}: ChatSystemProps) {
  const [selectedUserIdx, setSelectedUserIdx] = useState(0);
  const [inputText, setInputText] = useState('');
  const [showGiftsBox, setShowGiftsBox] = useState(false);
  const [consultationCost, setConsultationCost] = useState('50');

  // Filter out current logged user for chat list
  const otherUsers = users.filter((u) => u.id !== currentUser.id);
  const activeChatPartner = otherUsers[selectedUserIdx] || otherUsers[0];

  // Messages between current user and selection
  const chatHistory = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activeChatPartner?.id) ||
      (m.senderId === activeChatPartner?.id && m.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(activeChatPartner.id, inputText.trim(), 'text');
    setInputText('');

    // Simulate instant mock recipient response to give a real full-fidelity experience
    setTimeout(() => {
      const isFreelancer = activeChatPartner.role === 'Freelancer';
      const replies = isFreelancer
        ? [
            "Assalam-o-Alaikum! Thanks for reaching out. Yes, I am absolutely available to discuss your customized project requirements. Are we aligned on the budget?",
            "That sounds spectacular. I can deliver the concept preview in 2 days. Would you like me to initiate a customized service proposal?",
            "Thank you so much! Your satisfaction is my absolute top-priority. Let's finalize the credentials so we can kick off."
          ]
        : [
            "Hi! I looked at your portfolio showcases and I am highly impressed. What are your standard hourly consultation rates?",
            "Let's book a paid consultation session. Let me know which workspace timeline suits you best.",
            "Awesome! Payment made securely via active platform escrow. Excited to collaborate."
          ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      onSendMessage(currentUser.id, randomReply, 'text', { senderId: activeChatPartner.id, receiverId: currentUser.id });
    }, 1800);
  };

  const handleSendGift = (gift: Gift) => {
    const success = onCoinsTransfer(gift.cost, activeChatPartner.id, `Sent ${gift.name} Gift inside Chat`);
    if (success) {
      onSendMessage(activeChatPartner.id, `Gave virtual gift: ${gift.icon} ${gift.name}`, 'gift', {
        giftType: gift.icon,
        coinsCount: gift.cost,
      });
      onSendGiftCelebration(gift);
      setShowGiftsBox(false);
    } else {
      alert("Insufficient wallet coins! Go to Wallets & Refill packages.");
    }
  };

  const handlePaidConsultationRequest = () => {
    const cost = parseInt(consultationCost) || 50;
    // Client requesting call - simulated
    onSendMessage(activeChatPartner.id, `Proposed Paid Business Consultation Call`, 'paid_call', {
      coinsCount: cost,
      status: 'sent',
    });
  };

  const handleAcceptConsultation = (msgId: string, price: number, senderId: string) => {
    // Escrow transfer
    const success = onCoinsTransfer(price, currentUser.id, `Approved Business Consultation Session ID: ${msgId}`);
    if (success) {
      // Find and update status in parent or simply send status notification chat bubble
      onSendMessage(senderId, `Consultation Approved! Premium Voice/Video Call Scheduled.`, 'text');
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex h-[70vh]" id="chat-system-lobby">
      {/* Sidebar: Chat list */}
      <div className="w-1/3 border-r border-neutral-800 flex flex-col bg-neutral-950/40">
        <div className="p-4 border-b border-neutral-800">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider block">Inbox Messages</h4>
          <span className="text-[10px] text-neutral-500 font-mono">Simulating real-time socket chats</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
          {otherUsers.map((user, idx) => (
            <button
              key={user.id}
              onClick={() => setSelectedUserIdx(idx)}
              className={`w-full text-left p-4 flex items-center space-x-3 transition-colors ${
                selectedUserIdx === idx ? 'bg-neutral-850' : 'hover:bg-neutral-900/60'
              }`}
            >
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-neutral-900 rounded-full"></span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-white flex items-center space-x-1">
                  <span>{user.name}</span>
                </p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-[10px] font-mono text-neutral-500">@{user.username}</span>
                  <span className="text-[9px] bg-neutral-900 px-1 py-0.2 rounded border border-neutral-800/80 text-neutral-400">
                    {user.role}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Frame */}
      {activeChatPartner ? (
        <div className="flex-1 flex flex-col justify-between bg-neutral-900/40" id="active-chat-container">
          {/* Active Partner bar */}
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
            <div className="flex items-center space-x-3">
              <img src={activeChatPartner.avatar} alt={activeChatPartner.name} className="w-9 h-9 rounded-lg object-cover" />
              <div>
                <h4 className="text-xs font-bold text-white">{activeChatPartner.name}</h4>
                <p className="text-[10px] text-neutral-500">
                  {activeChatPartner.city}, {activeChatPartner.country} • Active Online
                </p>
              </div>
            </div>

            {/* Custom premium action drawers */}
            <div className="flex items-center space-x-2">
              {currentUser.role === 'Client' && (
                <div className="flex items-center space-x-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 px-2">CALL FEE:</span>
                  <input
                    type="number"
                    value={consultationCost}
                    onChange={(e) => setConsultationCost(e.target.value)}
                    className="w-10 bg-neutral-900 text-xs px-1 py-0.5 rounded text-white text-center font-bold font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={handlePaidConsultationRequest}
                    title="Initiate premium paid call proposal with client coin reserve"
                    className="p-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all flex items-center space-x-1"
                  >
                    <Video className="w-3.5 h-3.5 text-neutral-950" />
                    <span>Call Proposal</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowGiftsBox(!showGiftsBox)}
                className="p-2 bg-pink-600/10 hover:bg-pink-600/25 border border-pink-500/20 rounded-xl text-pink-400 transition"
                title="Send active virtual gift trigger"
              >
                <GiftIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages scroll box */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" id="messages-scroll-pane">
            {chatHistory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-neutral-500 text-xs">
                No messaging records found. Type a prompt message below to trigger conversational simulator response.
              </div>
            ) : (
              chatHistory.map((msg) => {
                const isSentByMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                    id={`chat-bubble-${msg.id}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md p-3.5 rounded-2xl shadow-sm text-xs space-y-2 ${
                        isSentByMe
                          ? 'bg-amber-500 text-neutral-950 rounded-tr-none'
                          : 'bg-neutral-950 text-neutral-200 rounded-tl-none border border-neutral-850'
                      }`}
                    >
                      {/* Message standard text */}
                      <p className="font-medium leading-relaxed">{msg.text}</p>

                      {/* Message custom types: Gift or Paid call */}
                      {msg.type === 'gift' && (
                        <div className="bg-black/20 p-2 rounded-xl flex items-center space-x-2 mt-1 border border-black/10">
                          <span className="text-2xl animate-spin">{msg.giftType}</span>
                          <div>
                            <p className="font-bold text-[10px] uppercase">GUEST SYSTEM GIFT</p>
                            <span className="text-[10px] font-mono text-neutral-600">Value: {msg.coinsCount} Coins</span>
                          </div>
                        </div>
                      )}

                      {msg.type === 'paid_call' && (
                        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl space-y-2 mt-1">
                          <div className="flex items-center space-x-1.5">
                            <PhoneCall className="w-4 h-4 text-amber-500 animate-pulse" />
                            <span className="font-extrabold text-[10px] uppercase tracking-wider text-amber-400">
                              Premium Consultation Offer
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400">
                            Required payment of <span className="font-bold text-white">{msg.coinsCount} Coins</span> to resolve live voice stream feed.
                          </p>

                          {!isSentByMe ? (
                            <button
                              onClick={() => handleAcceptConsultation(msg.id, msg.coinsCount || 50, msg.senderId)}
                              className="w-full py-1.5 bg-amber-500 text-neutral-950 font-bold text-[10px] uppercase rounded-lg shadow-sm hover:bg-amber-400 transition"
                            >
                              Approve & Start Discussion
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-neutral-400 italic block">
                              Awaiting Freelancers Acceptance...
                            </span>
                          )}
                        </div>
                      )}

                      <span className="text-[9px] text-neutral-500 font-mono block text-right mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Virtual Gifting Interactive grid box */}
          {showGiftsBox && (
            <div className="bg-neutral-950 border-t border-neutral-800 p-4 animate-fade-in z-25">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono font-bold text-neutral-400 flex items-center space-x-1">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>SELECT VIRTUAL GIFT PACK:</span>
                </span>
                <button
                  onClick={() => setShowGiftsBox(false)}
                  className="p-1 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {VIRTUAL_GIFTS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSendGift(g)}
                    className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded-xl border border-neutral-850 hover:border-pink-500/30 flex flex-col items-center justify-between text-center transition group"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">{g.icon}</span>
                    <span className="text-[10px] font-bold text-white mt-1">{g.name}</span>
                    <span className="text-[9px] text-amber-400 font-mono mt-0.5">{g.cost} 🪙</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Send Input Bar Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-neutral-800 bg-neutral-900 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onSendMessage(activeChatPartner.id, "Shared mockup portfolio template sample.", "image")}
              title="Share visual asset file"
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onSendMessage(activeChatPartner.id, "Transmitted source deliverables blueprint.", "file")}
              title="Transmitted system deliverables/contract source"
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition"
            >
              <FileCode className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder={`Send secure message to ${activeChatPartner.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-neutral-950 text-xs border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-neutral-500"
            />
            <button
              type="submit"
              className="p-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl transition shadow"
            >
              <Send className="w-4 h-4 text-neutral-950" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs text-center">
          Configure initial other users list inside data files.
        </div>
      )}
    </div>
  );
}
