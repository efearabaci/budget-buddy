/**
 * BudgetBuddy Firestore Service Layer
 * CRUD operations and query helpers for all collections
 */

import {
    doc,
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { getMonthRange } from '../utils/month';

// ============================================
// Reference Helpers
// ============================================

/**
 * Get user document reference
 * @param {string} uid - User ID
 * @returns {import('firebase/firestore').DocumentReference}
 */
export const userDoc = (uid) => doc(db, 'users', uid);

/**
 * Get collection reference under user
 * @param {string} uid - User ID
 * @param {string} collectionName - Subcollection name
 * @returns {import('firebase/firestore').CollectionReference}
 */
export const colRef = (uid, collectionName) =>
    collection(db, 'users', uid, collectionName);

/**
 * Get document reference under user subcollection
 * @param {string} uid - User ID
 * @param {string} collectionName - Subcollection name
 * @param {string} docId - Document ID
 * @returns {import('firebase/firestore').DocumentReference}
 */
export const docRef = (uid, collectionName, docId) =>
    doc(db, 'users', uid, collectionName, docId);

// ============================================
// Real-time Listener Helper
// ============================================

/**
 * Subscribe to collection/query changes
 * @param {import('firebase/firestore').Query} queryRef - Query to listen to
 * @param {(docs: Array<{id: string, [key: string]: any}>) => void} callback - Callback with docs
 * @returns {() => void} Unsubscribe function
 */
export const listenCollection = (queryRef, callback) => {
    return onSnapshot(queryRef, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(docs);
    });
};

/**
 * Subscribe to a single document
 * @param {import('firebase/firestore').DocumentReference} docRef - Document reference
 * @param {(doc: {id: string, [key: string]: any} | null) => void} callback
 * @returns {() => void} Unsubscribe function
 */
export const listenDocument = (docRef, callback) => {
    return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            callback({ id: snapshot.id, ...snapshot.data() });
        } else {
            callback(null);
        }
    });
};

// ============================================
// User Profile
// ============================================

/**
 * Create or update user profile
 * @param {string} uid
 * @param {Object} data
 */
export const upsertUserProfile = async (uid, data) => {
    const ref = userDoc(uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    } else {
        await updateDoc(ref, {
            uid,
            currency: 'USD',
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }).catch(() => {
            // If doc doesn't exist, create it using setDoc
            const { setDoc } = require('firebase/firestore');
            return setDoc(ref, {
                uid,
                currency: 'USD',
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        });
    }
};

// ============================================
// Transactions
// ============================================

/**
 * Add a new transaction
 * @param {string} uid
 * @param {Omit<import('../types/models').Transaction, 'id' | 'createdAt' | 'updatedAt'>} data
 * @returns {Promise<string>} New document ID
 */
export const addTransaction = async (uid, data) => {
    const ref = colRef(uid, 'transactions');
    const docRef = await addDoc(ref, {
        ...data,
        date: data.date instanceof Date ? Timestamp.fromDate(data.date) : data.date,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

/**
 * Update a transaction
 * @param {string} uid
 * @param {string} txId
 * @param {Partial<import('../types/models').Transaction>} data
 */
export const updateTransaction = async (uid, txId, data) => {
    const ref = docRef(uid, 'transactions', txId);
    const updateData = { ...data, updatedAt: serverTimestamp() };
    if (data.date instanceof Date) {
        updateData.date = Timestamp.fromDate(data.date);
    }
    await updateDoc(ref, updateData);
};

/**
 * Delete a transaction
 * @param {string} uid
 * @param {string} txId
 */
export const deleteTransaction = async (uid, txId) => {
    await deleteDoc(docRef(uid, 'transactions', txId));
};

/**
 * Query transactions by month
 * @param {string} uid
 * @param {string} monthKey - Format: "YYYY-MM"
 * @returns {import('firebase/firestore').Query}
 */
export const queryTransactionsByMonth = (uid, monthKey) => {
    const { start, end } = getMonthRange(monthKey);
    return query(
        colRef(uid, 'transactions'),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end)),
        orderBy('date', 'desc')
    );
};

/**
 * Get all transactions for a month (one-time fetch)
 * @param {string} uid
 * @param {string} monthKey
 * @returns {Promise<Array<import('../types/models').Transaction>>}
 */
export const getTransactionsByMonth = async (uid, monthKey) => {
    const q = queryTransactionsByMonth(uid, monthKey);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ============================================
// Categories
// ============================================

/**
 * Add a category
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<string>}
 */
export const addCategory = async (uid, data) => {
    const ref = colRef(uid, 'categories');
    const docRef = await addDoc(ref, {
        ...data,
        isDefault: data.isDefault || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

/**
 * Update a category
 * @param {string} uid
 * @param {string} categoryId
 * @param {Object} data
 */
export const updateCategory = async (uid, categoryId, data) => {
    await updateDoc(docRef(uid, 'categories', categoryId), {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Delete a category
 * @param {string} uid
 * @param {string} categoryId
 */
export const deleteCategory = async (uid, categoryId) => {
    await deleteDoc(docRef(uid, 'categories', categoryId));
};

/**
 * Get all categories
 * @param {string} uid
 * @returns {Promise<Array<import('../types/models').Category>>}
 */
export const getCategories = async (uid) => {
    const snapshot = await getDocs(colRef(uid, 'categories'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Query categories (for real-time)
 * @param {string} uid
 * @returns {import('firebase/firestore').Query}
 */
export const queryCategories = (uid) => {
    return query(colRef(uid, 'categories'), orderBy('name'));
};

// ============================================
// Budgets
// ============================================

/**
 * Add or update budget for a month
 * @param {string} uid
 * @param {Object} data - Must include monthKey
 * @returns {Promise<string>}
 */
export const upsertBudget = async (uid, data) => {
    // Check if budget exists for this month
    const q = query(colRef(uid, 'budgets'), where('monthKey', '==', data.monthKey));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        const docRef = await addDoc(colRef(uid, 'budgets'), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } else {
        const existingDoc = snapshot.docs[0];
        await updateDoc(existingDoc.ref, {
            ...data,
            updatedAt: serverTimestamp(),
        });
        return existingDoc.id;
    }
};

/**
 * Get budget for a month
 * @param {string} uid
 * @param {string} monthKey
 * @returns {Promise<import('../types/models').Budget | null>}
 */
export const getBudgetByMonth = async (uid, monthKey) => {
    const q = query(colRef(uid, 'budgets'), where('monthKey', '==', monthKey));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
};

/**
 * Delete a budget
 * @param {string} uid
 * @param {string} budgetId
 */
export const deleteBudget = async (uid, budgetId) => {
    await deleteDoc(docRef(uid, 'budgets', budgetId));
};

// ============================================
// Bills
// ============================================

/**
 * Add a bill
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<string>}
 */
export const addBill = async (uid, data) => {
    const ref = colRef(uid, 'bills');
    const docRef = await addDoc(ref, {
        ...data,
        dueDate: data.dueDate instanceof Date ? Timestamp.fromDate(data.dueDate) : data.dueDate,
        paidAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

/**
 * Update a bill
 * @param {string} uid
 * @param {string} billId
 * @param {Object} data
 */
export const updateBill = async (uid, billId, data) => {
    const updateData = { ...data, updatedAt: serverTimestamp() };
    if (data.dueDate instanceof Date) {
        updateData.dueDate = Timestamp.fromDate(data.dueDate);
    }
    if (data.paidAt instanceof Date) {
        updateData.paidAt = Timestamp.fromDate(data.paidAt);
    }
    await updateDoc(docRef(uid, 'bills', billId), updateData);
};

/**
 * Mark bill as paid
 * @param {string} uid
 * @param {string} billId
 */
export const markBillPaid = async (uid, billId) => {
    await updateDoc(docRef(uid, 'bills', billId), {
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

/**
 * Mark bill as unpaid
 * @param {string} uid
 * @param {string} billId
 */
export const markBillUnpaid = async (uid, billId) => {
    await updateDoc(docRef(uid, 'bills', billId), {
        paidAt: null,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Delete a bill
 * @param {string} uid
 * @param {string} billId
 */
export const deleteBill = async (uid, billId) => {
    await deleteDoc(docRef(uid, 'bills', billId));
};

/**
 * Get all bills
 * @param {string} uid
 * @returns {Promise<Array<import('../types/models').Bill>>}
 */
export const getBills = async (uid) => {
    const snapshot = await getDocs(
        query(colRef(uid, 'bills'), orderBy('dueDate', 'asc'))
    );
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Query bills (for real-time)
 * @param {string} uid
 * @returns {import('firebase/firestore').Query}
 */
export const queryBills = (uid) => {
    return query(colRef(uid, 'bills'), orderBy('dueDate', 'asc'));
};

/**
 * Query upcoming unpaid bills
 * @param {string} uid
 * @returns {import('firebase/firestore').Query}
 */
export const queryUpcomingBills = (uid) => {
    return query(
        colRef(uid, 'bills'),
        where('paidAt', '==', null),
        orderBy('dueDate', 'asc')
    );
};
