/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SubscriptionType = 'Free' | 'Pro' | 'VIP';
export type BadgeType = 'None' | 'Verified' | 'Business' | 'Creator';
export type UserRole = 'Regular' | 'Freelancer' | 'Client' | 'Admin';

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  coverImage?: string;
  role: UserRole;
  bio: string;
  skills: string[];
  city: string;
  country: string;
  rating: number;
  completedJobs: number;
  badge: BadgeType;
  subscription: SubscriptionType;
  isBanned?: boolean;
  coins: number;
  portfolio: PortfolioItem[];
  experiences?: Experience[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  creatorId: string;
  category: string;
  rating: number;
  deliveryTime: number; // in days
  revisions: number;
  reviewsCount: number;
  portfolioImages: string[];
  createdAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  type?: 'text' | 'gift' | 'paid_call' | 'proposal' | 'contract' | 'image' | 'file';
  giftType?: string;
  coinsCount?: number;
  isAccepted?: boolean;
  createdAt?: string;
  timestamp: string;
  status?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'purchase' | 'spend_gift' | 'receive_gift' | 'order_earn' | 'order_pay' | 'withdrawal' | 'subscription' | 'bonus' | 'adjustment' | 'mint';
  amount: number;
  description: string;
  timestamp: string;
}

export interface GigOrder {
  id: string;
  gigId: string;
  title: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: 'pending' | 'completed' | 'cancelled' | 'active' | 'disputed';
  createdAt: string;
  deliveryDate: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: string;
  accountNumber: string;
  accountName: string;
  status: 'Pending' | 'Approved' | 'Declined';
  rejectionReason?: string;
  feeDeducted: number;
  netPayout: number;
  createdAt?: string;
  updatedAt?: string;
  userName?: string;
  userUsername?: string;
  date?: string;
}

export interface CoinPackage {
  id: string;
  name?: string;
  coins?: number;
  pricePKR?: number;
  badge?: string;
  amount?: number;
  price?: number;
  currency?: string;
  bonus?: number;
  isActive?: boolean;
}

export interface CoinEconomySettings {
  coinName: string;
  coinSymbol: string;
  pkrRate: number;
  standardFee: number;
  premiumFee: number;
  maxDailyTransaction: number;
  escrowCommission: number;
  totalCoinSupply: number;
  circulatingCoins: number;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  cost: number;
  color?: string;
}
