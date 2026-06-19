/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Regular' | 'Freelancer' | 'Client' | 'Admin';
export type BadgeType = 'None' | 'Verified' | 'Business' | 'Creator';
export type SubscriptionType = 'Free' | 'Pro' | 'VIP';

export interface Experience {
  role: string;
  company: string;
  duration: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  coverImage: string;
  role: UserRole;
  bio: string;
  skills: string[];
  city: string;
  country: string;
  coins: number;
  rating: number;
  completedJobs: number;
  badge: BadgeType;
  experiences: Experience[];
  portfolio: PortfolioItem[];
  subscription: SubscriptionType;
  isBanned?: boolean;
}

export interface Gig {
  id: string;
  title: string;
  creatorId: string;
  description: string;
  price: number;
  deliveryTime: number; // in days
  revisions: number;
  portfolioImages: string[];
  category: string;
  rating: number;
  reviewsCount: number;
}

export type MessageType = 'text' | 'image' | 'file' | 'paid_call' | 'gift';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  type: MessageType;
  mediaUrl?: string;
  giftType?: string;
  coinsCount?: number;
  timestamp: string;
  status?: string; // 'sent' | 'paid' | 'declined'
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  cost: number;
  color: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'purchase' | 'spend_gift' | 'receive_gift' | 'order_earn' | 'order_pay' | 'withdrawal' | 'subscription' | 'bonus' | 'adjustment';
  amount: number; // positive or negative
  description: string;
  timestamp: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  amount: number;
  method: string;
  accountNumber: string;
  accountName: string;
  status: 'Pending' | 'Approved' | 'Declined';
  date: string;
  rejectionReason?: string;
  feeDeducted?: number;
  netPayout?: number;
}

export interface CoinPackage {
  id: string;
  amount: number;
  price: number;
  bonus: number;
  currency: string;
  isActive: boolean;
}

export interface CoinEconomySettings {
  coinName: string;
  coinSymbol: string;
  pkrRate: number; // PKR exchange rate, 1 Cent = X PKR or 1 Coin = 1 PKR
  standardFee: number; // platform fee % for regular users (e.g. 20)
  premiumFee: number; // platform fee % for Pro/VIP users (e.g. 10)
  maxDailyTransaction: number; // max per transaction
  escrowCommission: number; // platform commission % on jobs (e.g. 15)
}

export interface GigOrder {
  id: string;
  gigId: string;
  title: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  deliveryDate: string;
  ratingGiven?: number;
}
