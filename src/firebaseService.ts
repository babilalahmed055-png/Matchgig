/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  limit
} from 'firebase/firestore';
import {
  User,
  Gig,
  Message,
  Transaction,
  GigOrder,
  CoinPackage,
  CoinEconomySettings,
  WithdrawalRequest
} from './types';
import { INITIAL_USERS, INITIAL_GIGS } from './data';

// Default Fallback Settings
const DEFAULT_COIN_PACKAGES: CoinPackage[] = [
  { id: 'package_1', name: 'Starter Booster Drop', coins: 100, pricePKR: 100, badge: 'Standard Value' },
  { id: 'package_2', name: 'Silver Wallet Upgrade', coins: 500, pricePKR: 450, badge: 'Popular choice' },
  { id: 'package_3', name: 'Pro Vault Booster', coins: 1500, pricePKR: 1200, badge: '20% Extra free fallback' },
  { id: 'package_4', name: 'VIP Infinite Chest', coins: 5000, pricePKR: 3500, badge: 'Huge bonus value' }
];

const DEFAULT_ECONOMY_SETTINGS: CoinEconomySettings = {
  coinName: 'MatchGig Coin',
  coinSymbol: '🪙',
  pkrRate: 1.0,
  standardFee: 20,
  premiumFee: 10,
  maxDailyTransaction: 10000,
  escrowCommission: 15,
  totalCoinSupply: 100000000,
  circulatingCoins: 124350 // Initial sum of seed balances
};

/**
 * Seeds default data into the Firestore database if it is currently uninitialized.
 */
export async function seedInitialDatabase() {
  try {
    const usersCol = collection(db, 'users');
    const uQuery = query(usersCol, limit(1));
    const userSnap = await getDocs(uQuery);

    if (userSnap.empty) {
      console.log('Seeding initial Firestore database tables with default datasets...');
      
      // 1. Seed initial users
      for (const u of INITIAL_USERS) {
        await saveFirestoreUser(u);
      }

      // 2. Seed initial gigs
      for (const g of INITIAL_GIGS) {
        await saveFirestoreGig(g);
      }

      // 3. Seed initial packages
      for (const p of DEFAULT_COIN_PACKAGES) {
        await saveFirestorePackage(p);
      }

      // 4. Seed initial economy settings
      await saveFirestoreEconomySettings(DEFAULT_ECONOMY_SETTINGS);

      console.log('Firestore initialization seeding completed successfully.');
    }
  } catch (err) {
    console.warn('Silent fallback: Unsuccessful database seeding due to connectivity or permissions:', err);
  }
}

/**
 * USERS COLLECTION GET/SAVE METRICS
 */
export async function getFirestoreUsers(): Promise<User[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as User);
  } catch (e) {
    console.warn('Returning empty users list due to database connectivity:', e);
    return [];
  }
}

export async function saveFirestoreUser(user: User): Promise<void> {
  try {
    await setDoc(doc(db, 'users', user.id), user);
  } catch (e) {
    console.error('Failed to write user to Firestore:', e);
  }
}

/**
 * GIGS COLLECTION GET/SAVE METRICS
 */
export async function getFirestoreGigs(): Promise<Gig[]> {
  try {
    const snap = await getDocs(collection(db, 'gigs'));
    return snap.docs.map(d => d.data() as Gig);
  } catch (e) {
    console.warn('Returning empty gigs list due to database connectivity:', e);
    return [];
  }
}

export async function saveFirestoreGig(gig: Gig): Promise<void> {
  try {
    await setDoc(doc(db, 'gigs', gig.id), gig);
  } catch (e) {
    console.error('Failed to write gig to Firestore:', e);
  }
}

/**
 * MESSAGES COLLECTION GET/SAVE METRICS
 */
export async function getFirestoreMessages(): Promise<Message[]> {
  try {
    const snap = await getDocs(collection(db, 'messages'));
    return snap.docs.map(d => d.data() as Message);
  } catch (e) {
    console.warn('Returning empty messages list due to database connectivity:', e);
    return [];
  }
}

export async function saveFirestoreMessage(msg: Message): Promise<void> {
  try {
    await setDoc(doc(db, 'messages', msg.id), msg);
  } catch (e) {
    console.error('Failed to write message to Firestore:', e);
  }
}

/**
 * TRANSACTIONS COLLECTION GET/SAVE METRICS
 */
export async function getFirestoreTransactions(): Promise<Transaction[]> {
  try {
    const snap = await getDocs(collection(db, 'transactions'));
    return snap.docs.map(d => d.data() as Transaction);
  } catch (e) {
    console.warn('Returning empty transactions list due to database connectivity:', e);
    return [];
  }
}

export async function saveFirestoreTransaction(tx: Transaction): Promise<void> {
  try {
    await setDoc(doc(db, 'transactions', tx.id), tx);
  } catch (e) {
    console.error('Failed to write transaction to Firestore:', e);
  }
}

/**
 * ORDERS COLLECTION GET/SAVE METRICS
 */
export async function getFirestoreOrders(): Promise<GigOrder[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    return snap.docs.map(d => d.data() as GigOrder);
  } catch (e) {
    console.warn('Returning empty orders list due to database connectivity:', e);
    return [];
  }
}

export async function saveFirestoreOrder(order: GigOrder): Promise<void> {
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (e) {
    console.error('Failed to write order to Firestore:', e);
  }
}

/**
 * COIN PACKAGES GET/SAVE METRICS
 */
export async function getFirestorePackages(): Promise<CoinPackage[]> {
  try {
    const snap = await getDocs(collection(db, 'coin_packages'));
    if (snap.empty) return DEFAULT_COIN_PACKAGES;
    return snap.docs.map(d => d.data() as CoinPackage);
  } catch (e) {
    console.warn('Returning default packages list due to database connectivity:', e);
    return DEFAULT_COIN_PACKAGES;
  }
}

export async function saveFirestorePackage(pkg: CoinPackage): Promise<void> {
  try {
    await setDoc(doc(db, 'coin_packages', pkg.id), pkg);
  } catch (e) {
    console.error('Failed to write coin package to Firestore:', e);
  }
}

/**
 * COIN ECONOMY SETTINGS GET/SAVE METRICS
 */
export async function getFirestoreEconomySettings(): Promise<CoinEconomySettings> {
  try {
    const dDoc = await getDoc(doc(db, 'economy_settings', 'current'));
    if (dDoc.exists()) {
      return dDoc.data() as CoinEconomySettings;
    }
    return DEFAULT_ECONOMY_SETTINGS;
  } catch (e) {
    console.warn('Returning default economy settings due to database connectivity:', e);
    return DEFAULT_ECONOMY_SETTINGS;
  }
}

export async function saveFirestoreEconomySettings(settings: CoinEconomySettings): Promise<void> {
  try {
    await setDoc(doc(db, 'economy_settings', 'current'), settings);
  } catch (e) {
    console.error('Failed to write economy settings to Firestore:', e);
  }
}

/**
 * WITHDRAWAL REQUESTS GET/SAVE METRICS
 */
export async function getFirestoreWithdrawals(): Promise<WithdrawalRequest[]> {
  try {
    const snap = await getDocs(collection(db, 'withdrawals'));
    return snap.docs.map(d => d.data() as WithdrawalRequest);
  } catch (e) {
    console.warn('Returning empty withdrawals list due to database connectivity:', e);
    return [];
  }
}

export async function saveFirestoreWithdrawal(request: WithdrawalRequest): Promise<void> {
  try {
    await setDoc(doc(db, 'withdrawals', request.id), request);
  } catch (e) {
    console.error('Failed to write withdrawal request to Firestore:', e);
  }
}

/**
 * NOTIFICATIONS GET/SAVE METRICS
 */
export async function getFirestoreNotifications(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'notifications'));
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.warn('Returning empty notifications list due to database connectivity:', e);
    return [];
  }
}

export async function saveFirestoreNotification(notification: any): Promise<void> {
  try {
    await setDoc(doc(db, 'notifications', notification.id), notification);
  } catch (e) {
    console.error('Failed to write notification to Firestore:', e);
  }
}
