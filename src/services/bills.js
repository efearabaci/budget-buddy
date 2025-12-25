/**
 * Bills Service
 * CRUD operations and listeners for bills
 */

import {
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    Timestamp,
    serverTimestamp,
    query,
    orderBy,
} from 'firebase/firestore';
import { colRef, docRef } from './firestore';
import { getNextMonthlyDueDate } from '../utils/bills';

/**
 * Create a new bill
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<string>}
 */
export const createBill = async (uid, data) => {
    const ref = colRef(uid, 'bills');
    const doc = await addDoc(ref, {
        ...data,
        dueDate: data.dueDate instanceof Date ? Timestamp.fromDate(data.dueDate) : data.dueDate,
        paidAt: null,
        lastPaidAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return doc.id;
};

/**
 * Update a bill
 * @param {string} uid
 * @param {string} billId
 * @param {Object} data
 */
export const updateBill = async (uid, billId, data) => {
    const ref = docRef(uid, 'bills', billId);
    const updateData = { ...data, updatedAt: serverTimestamp() };

    if (data.dueDate instanceof Date) {
        updateData.dueDate = Timestamp.fromDate(data.dueDate);
    }

    await updateDoc(ref, updateData);
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
 * Mark bill as paid
 * For recurring bills: advance dueDate by 1 month and clear paidAt
 * For non-recurring: just set paidAt
 * @param {string} uid
 * @param {string} billId
 * @param {Object} bill - Current bill data
 */
export const markBillPaid = async (uid, billId, bill) => {
    const ref = docRef(uid, 'bills', billId);
    const now = Timestamp.now();

    if (bill.recurring === 'monthly') {
        // Recurring: advance due date and clear paidAt
        const currentDueDate = bill.dueDate?.toDate ? bill.dueDate.toDate() : new Date(bill.dueDate);
        const nextDueDate = getNextMonthlyDueDate(currentDueDate);

        await updateDoc(ref, {
            dueDate: Timestamp.fromDate(nextDueDate),
            paidAt: null,
            lastPaidAt: now,
            updatedAt: now,
        });
    } else {
        // Non-recurring: just mark as paid
        await updateDoc(ref, {
            paidAt: now,
            updatedAt: now,
        });
    }
};

/**
 * Mark bill as unpaid
 * @param {string} uid
 * @param {string} billId
 */
export const markBillUnpaid = async (uid, billId) => {
    const ref = docRef(uid, 'bills', billId);
    await updateDoc(ref, {
        paidAt: null,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Listen to all bills for a user
 * @param {string} uid
 * @param {(bills: Array) => void} callback
 * @returns {() => void} Unsubscribe function
 */
export const listenBills = (uid, callback) => {
    const q = query(colRef(uid, 'bills'), orderBy('dueDate', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const bills = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(bills);
    });
};
