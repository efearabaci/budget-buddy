/**
 * Transactions Service
 * CRUD operations and listeners for transactions
 */

import {
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    Timestamp,
    serverTimestamp,
    query,
    where,
    orderBy,
} from 'firebase/firestore';
import { colRef, docRef } from './firestore';
import { getMonthRange } from '../utils/month';

/**
 * Create a new transaction
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<string>}
 */
export const createTransaction = async (uid, data) => {
    const ref = colRef(uid, 'transactions');
    const doc = await addDoc(ref, {
        ...data,
        date: data.date instanceof Date ? Timestamp.fromDate(data.date) : data.date,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return doc.id;
};

/**
 * Update a transaction
 * @param {string} uid
 * @param {string} txId
 * @param {Object} data
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
 * Listen to transactions for a specific month
 * @param {string} uid
 * @param {string} monthKey - Format: "YYYY-MM"
 * @param {(transactions: Array) => void} callback
 * @returns {() => void} Unsubscribe function
 */
export const listenTransactionsByMonth = (uid, monthKey, callback) => {
    const { start, end } = getMonthRange(monthKey);

    const q = query(
        colRef(uid, 'transactions'),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end)),
        orderBy('date', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(transactions);
    });
};
