/**
 * Analytics Service
 * Calculate spending summaries and insights
 */

import { query, where, getDocs, Timestamp } from 'firebase/firestore';
import { colRef } from './firestore';
import { getMonthRange } from '../utils/month';

/**
 * Get monthly income and expense totals
 * @param {string} uid
 * @param {string} monthKey - Format: "YYYY-MM"
 * @returns {Promise<{income: number, expense: number, net: number}>}
 */
export const getMonthlyTotals = async (uid, monthKey) => {
    const { start, end } = getMonthRange(monthKey);

    const q = query(
        colRef(uid, 'transactions'),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end))
    );

    const snapshot = await getDocs(q);

    let income = 0;
    let expense = 0;

    snapshot.docs.forEach((doc) => {
        const tx = doc.data();
        if (tx.type === 'income') {
            income += tx.amount;
        } else {
            expense += tx.amount;
        }
    });

    return {
        income,
        expense,
        net: income - expense,
    };
};

/**
 * Get spending breakdown by category for a month
 * @param {string} uid
 * @param {string} monthKey
 * @returns {Promise<Array<{categoryId: string, categoryName: string, amount: number, percentage: number}>>}
 */
export const getMonthlySpentByCategory = async (uid, monthKey) => {
    const { start, end } = getMonthRange(monthKey);

    const q = query(
        colRef(uid, 'transactions'),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end)),
        where('type', '==', 'expense')
    );

    const snapshot = await getDocs(q);

    const categoryTotals = {};
    let totalExpense = 0;

    snapshot.docs.forEach((doc) => {
        const tx = doc.data();
        const catId = tx.categoryId || 'other';
        const catName = tx.categoryNameSnapshot || 'Other';

        if (!categoryTotals[catId]) {
            categoryTotals[catId] = { categoryId: catId, categoryName: catName, amount: 0 };
        }
        categoryTotals[catId].amount += tx.amount;
        totalExpense += tx.amount;
    });

    // Convert to array and add percentages
    const result = Object.values(categoryTotals)
        .map((cat) => ({
            ...cat,
            percentage: totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

    return result;
};

/**
 * Get top spending categories for a month
 * @param {string} uid
 * @param {string} monthKey
 * @param {number} limit
 */
export const getTopCategories = async (uid, monthKey, limit = 5) => {
    const categories = await getMonthlySpentByCategory(uid, monthKey);
    return categories.slice(0, limit);
};
