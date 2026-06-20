import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  query,
  where,
  orderBy
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
import { 
  INITIAL_USERS, 
  INITIAL_GIGS 
} from './data';

// Standard interfaces for auxiliary states
export interface SupportTicket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  category: string;
  description: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
  updates: Array<{ sender: string; text: string; date: string }>;
}

export interface FeedDraft {
  id: string;
  title: string;
  content: string;
  tags: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  text: string;
  date: string;
  unread: boolean;
}

// Collections Definitions
const USERS_COL = 'users';
const GIGS_COL = 'gigs';
const MESSAGES_COL = 'messages';
const TRANSACTIONS_COL = 'transactions';
const ORDERS_COL = 'orders';
const PACKAGES_COL = 'coin_packages';
const ECONOMY_COL = 'economy_settings';
const WITHDRAWALS_COL = 'withdrawals';
const NOTIFICATIONS_COL = 'notifications';
const TICKETS_COL = 'support_tickets';
const FEED_DRAFTS_COL = 'feed_drafts';

// Generic fetch list helper
async function fetchCollectionList<T>(collectionName: string): Promise<T[]> {
  try {
    const qSnapshot = await getDocs(collection(db, collectionName));
    const list: T[] = [];
    qSnapshot.forEach((doc) => {
      list.push({ ...doc.data() } as T);
    });
    return list;
  } catch (error) {
    console.error(`Error loading collection ${collectionName}:`, error);
    return [];
  }
}

// Seeder checks and implementation
export async function seedInitialDatabase() {
  try {
    // 1. Seed Users
    const usersSnap = await getDocs(collection(db, USERS_COL));
    if (usersSnap.empty) {
      console.log("Seeding initial users to Firestore...");
      const batch = writeBatch(db);
      INITIAL_USERS.forEach((user) => {
        const uDoc = doc(db, USERS_COL, user.id);
        batch.set(uDoc, user);
      });
      await batch.commit();
    }

    // 2. Seed Gigs
    const gigsSnap = await getDocs(collection(db, GIGS_COL));
    if (gigsSnap.empty) {
      console.log("Seeding initial gigs to Firestore...");
      const batch = writeBatch(db);
      INITIAL_GIGS.forEach((gig) => {
        const gDoc = doc(db, GIGS_COL, gig.id);
        batch.set(gDoc, gig);
      });
      await batch.commit();
    }

    // 3. Seed coin packages (standard configured packages)
    const pkgsSnap = await getDocs(collection(db, PACKAGES_COL));
    if (pkgsSnap.empty) {
      console.log("Seeding initial coin packages to Firestore...");
      const defaultPkgs: CoinPackage[] = [
        { id: 'coin_p1', amount: 100, price: 100, bonus: 0, currency: 'PKR', isActive: true },
        { id: 'coin_p2', amount: 500, price: 450, bonus: 25, currency: 'PKR', isActive: true },
        { id: 'coin_p3', amount: 1000, price: 850, bonus: 100, currency: 'PKR', isActive: true },
        { id: 'coin_p4', amount: 5000, price: 4000, bonus: 750, currency: 'PKR', isActive: true }
      ];
      const batch = writeBatch(db);
      defaultPkgs.forEach((pkg) => {
        const pDoc = doc(db, PACKAGES_COL, pkg.id);
        batch.set(pDoc, pkg);
      });
      await batch.commit();
    }

    // 4. Seed economic settings
    const ecoDocRef = doc(db, ECONOMY_COL, 'main');
    const ecoDoc = await getDoc(ecoDocRef);
    if (!ecoDoc.exists()) {
      console.log("Seeding economy parameters...");
      const defaultEconomy: CoinEconomySettings = {
        coinName: 'MatchGig Coin',
        coinSymbol: '🪙',
        pkrRate: 1,
        standardFee: 20,
        premiumFee: 10,
        maxDailyTransaction: 10000,
        escrowCommission: 15,
        totalCoinSupply: 100000000,
        circulatingCoins: 0
      };
      await setDoc(ecoDocRef, defaultEconomy);
    }

    // 5. Seed initial transactions list if empty
    const txSnap = await getDocs(collection(db, TRANSACTIONS_COL));
    if (txSnap.empty) {
      console.log("Seeding initial transactions ledger...");
      const initialTx: Transaction[] = [
        {
          id: 't1',
          userId: 'user_4',
          type: 'purchase',
          amount: 25000,
          description: 'Refilled Wallet Coins using Stripe simulated payment sandbox',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      const batch = writeBatch(db);
      initialTx.forEach((tx) => {
        const tDoc = doc(db, TRANSACTIONS_COL, tx.id);
        batch.set(tDoc, tx);
      });
      await batch.commit();
    }

    // 6. Seed initial message history
    const msgSnap = await getDocs(collection(db, MESSAGES_COL));
    if (msgSnap.empty) {
      console.log("Seeding initial conversations history...");
      const initialMessages: Message[] = [
        {
          id: 'm1',
          senderId: 'user_1',
          receiverId: 'user_4',
          text: 'Assalam-o-Alaikum Imran! I updated the modern UI retro guidelines mockup deck. Let me know if you would like custom adjustments.',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'm2',
          senderId: 'user_4',
          receiverId: 'user_1',
          text: 'Walaikum Assalam Fatima! These mockups look gorgeous. I want to hire you to scale our SaaS branding guidelines logo immediately.',
          type: 'text',
          timestamp: new Date(Date.now() - 3000000).toISOString()
        }
      ];
      const batch = writeBatch(db);
      initialMessages.forEach((msg) => {
        const mDoc = doc(db, MESSAGES_COL, msg.id);
        batch.set(mDoc, msg);
      });
      await batch.commit();
    }

    // 7. Seed default withdrawals list
    const withSnap = await getDocs(collection(db, WITHDRAWALS_COL));
    if (withSnap.empty) {
      console.log("Seeding default withdrawal records...");
      const defaultWiths: WithdrawalRequest[] = [
        { id: 'w_1', userId: 'user_1', userName: 'Fatima Malik', userUsername: 'designer_fatima', amount: 500, method: 'Easypaisa', accountNumber: '03001234567', accountName: 'Fatima Malik', status: 'Pending' as const, date: '2026-06-17', feeDeducted: 100, netPayout: 400 },
        { id: 'w_2', userId: 'user_2', userName: 'Hamza Siddiqui', userUsername: 'editor_hamza', amount: 1000, method: 'Bank Transfer', accountNumber: 'PK00MEZN00123456789', accountName: 'Hamza Siddiqui', status: 'Pending' as const, date: '2026-06-18', feeDeducted: 200, netPayout: 800 }
      ];
      const batch = writeBatch(db);
      defaultWiths.forEach((wt) => {
        const wtDoc = doc(db, WITHDRAWALS_COL, wt.id);
        batch.set(wtDoc, wt);
      });
      await batch.commit();
    }

    // 8. Seed default notifications list if empty
    const notifSnap = await getDocs(collection(db, NOTIFICATIONS_COL));
    if (notifSnap.empty) {
      console.log("Seeding default notifications...");
      const initialNotifications: NotificationItem[] = [
        { id: 'n1', userId: 'user_1', title: 'Gig Match Found 🎯', text: 'AI matched your skills profile to Project Request: Vertical YouTube short audits!', date: 'Just Now', unread: true },
        { id: 'n2', userId: 'user_1', title: 'Gift Received (+25 Coins) 🌹', text: 'Regular user usman_pk sent you a live Rose virtual gift.', date: '12 mins ago', unread: true },
        { id: 'n3', userId: 'user_1', title: 'Secure Escrow Deposited 💼', text: 'Client Imran initialized contract budget escrow funds in order #ord_92f.', date: '2 hrs ago', unread: false },
        { id: 'n4', userId: 'user_1', title: 'Live Creator Broadcast 🎥', text: 'Fatima Malik is going live with real-time UI/UX wireframing!', date: '3 hrs ago', unread: false },
        { id: 'n5', userId: 'user_1', title: 'VIP Expiration Alert 👑', text: 'Premium verified validation status expires in 25 days.', date: '1 day ago', unread: false }
      ];
      const batch = writeBatch(db);
      initialNotifications.forEach((n) => {
        const nDoc = doc(db, NOTIFICATIONS_COL, n.id);
        batch.set(nDoc, n);
      });
      await batch.commit();
    }

  } catch (error) {
    console.error("Critical error seeding Firestore:", error);
  }
}

// CRUD Access API wrappers

// 1. Users
export async function getFirestoreUsers(): Promise<User[]> {
  return fetchCollectionList<User>(USERS_COL);
}

export async function saveFirestoreUser(user: User): Promise<void> {
  const docRef = doc(db, USERS_COL, user.id);
  await setDoc(docRef, user);
}

// 2. Gigs
export async function getFirestoreGigs(): Promise<Gig[]> {
  return fetchCollectionList<Gig>(GIGS_COL);
}

export async function saveFirestoreGig(gig: Gig): Promise<void> {
  const docRef = doc(db, GIGS_COL, gig.id);
  await setDoc(docRef, gig);
}

// 3. Messages
export async function getFirestoreMessages(): Promise<Message[]> {
  return fetchCollectionList<Message>(MESSAGES_COL);
}

export async function saveFirestoreMessage(msg: Message): Promise<void> {
  const docRef = doc(db, MESSAGES_COL, msg.id);
  await setDoc(docRef, msg);
}

// 4. Transactions
export async function getFirestoreTransactions(): Promise<Transaction[]> {
  return fetchCollectionList<Transaction>(TRANSACTIONS_COL);
}

export async function saveFirestoreTransaction(tx: Transaction): Promise<void> {
  const docRef = doc(db, TRANSACTIONS_COL, tx.id);
  await setDoc(docRef, tx);
}

// 5. Orders
export async function getFirestoreOrders(): Promise<GigOrder[]> {
  return fetchCollectionList<GigOrder>(ORDERS_COL);
}

export async function saveFirestoreOrder(order: GigOrder): Promise<void> {
  const docRef = doc(db, ORDERS_COL, order.id);
  await setDoc(docRef, order);
}

// 6. Coin Packages
export async function getFirestorePackages(): Promise<CoinPackage[]> {
  return fetchCollectionList<CoinPackage>(PACKAGES_COL);
}

export async function saveFirestorePackage(pkg: CoinPackage): Promise<void> {
  const docRef = doc(db, PACKAGES_COL, pkg.id);
  await setDoc(docRef, pkg);
}

// 7. Coin Economy Settings
export async function getFirestoreEconomySettings(): Promise<CoinEconomySettings> {
  const docRef = doc(db, ECONOMY_COL, 'main');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as CoinEconomySettings;
  }
  const defaultEco: CoinEconomySettings = {
    coinName: 'MatchGig Coin',
    coinSymbol: '🪙',
    pkrRate: 1,
    standardFee: 20,
    premiumFee: 10,
    maxDailyTransaction: 10000,
    circulatingCoins: 0,
    escrowCommission: 15,
    totalCoinSupply: 100000000
  };
  return defaultEco;
}

export async function saveFirestoreEconomySettings(settings: CoinEconomySettings): Promise<void> {
  const docRef = doc(db, ECONOMY_COL, 'main');
  await setDoc(docRef, settings);
}

// 8. Withdrawals
export async function getFirestoreWithdrawals(): Promise<WithdrawalRequest[]> {
  return fetchCollectionList<WithdrawalRequest>(WITHDRAWALS_COL);
}

export async function saveFirestoreWithdrawal(wt: WithdrawalRequest): Promise<void> {
  const docRef = doc(db, WITHDRAWALS_COL, wt.id);
  await setDoc(docRef, wt);
}

// 9. Notifications
export async function getFirestoreNotifications(): Promise<NotificationItem[]> {
  return fetchCollectionList<NotificationItem>(NOTIFICATIONS_COL);
}

export async function saveFirestoreNotification(n: NotificationItem): Promise<void> {
  const docRef = doc(db, NOTIFICATIONS_COL, n.id);
  await setDoc(docRef, n);
}

// 10. Support Tickets (helps replace standard localStorage for Support Hub tickets)
export async function getFirestoreTickets(): Promise<SupportTicket[]> {
  return fetchCollectionList<SupportTicket>(TICKETS_COL);
}

export async function saveFirestoreTicket(ticket: SupportTicket): Promise<void> {
  const docRef = doc(db, TICKETS_COL, ticket.id);
  await setDoc(docRef, ticket);
}

// 11. Feed Drafts / Privacy Audits
export async function getFirestoreFeedDrafts(): Promise<FeedDraft[]> {
  return fetchCollectionList<FeedDraft>(FEED_DRAFTS_COL);
}

export async function saveFirestoreFeedDraft(draft: FeedDraft): Promise<void> {
  const docRef = doc(db, FEED_DRAFTS_COL, draft.id);
  await setDoc(docRef, draft);
}

export async function deleteFirestoreFeedDraft(draftId: string): Promise<void> {
  const docRef = doc(db, FEED_DRAFTS_COL, draftId);
  await deleteDoc(docRef);
}
