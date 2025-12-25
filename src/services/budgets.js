/**
 * Budgets Service
 * CRUD operations for monthly budgets
 */

import {
    doc,
    getDoc,
    setDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';
import { colRef, docRef } from './firestore';

/**
 * Get budget for a specific month
 * @param {string} uid
 * @param {string} monthKey - Format: "YYYY-MM"
 * @returns {Promise<Object|null>}
 */
export const getBudget = async (uid, monthKey) => {
    const q = query(colRef(uid, 'budgets'), where('monthKey', '==', monthKey));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
};

/**
 * Create or update budget for a month
 * @param {string} uid
 * @param {string} monthKey
 * @param {Object} data - { overallLimit, perCategoryLimits? }
 * @returns {Promise<string>} Document ID
 */
export const upsertBudget = async (uid, monthKey, data) => {
    // Check if budget exists for this month
    const existing = await getBudget(uid, monthKey);

    if (existing) {
        // Update existing
        const ref = docRef(uid, 'budgets', existing.id);
        await setDoc(ref, {
            ...data,
            monthKey,
            updatedAt: serverTimestamp(),
        }, { merge: true });
        return existing.id;
    } else {
        // Create new
        const { addDoc } = await import('firebase/firestore');
        const ref = colRef(uid, 'budgets');
        const docRef = await addDoc(ref, {
            ...data,
            monthKey,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
};
