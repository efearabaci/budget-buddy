/**
 * Grouping utilities for transaction lists
 */

import { getRelativeDateLabel } from './format';

/**
 * Group transactions by day
 * @param {Array<import('../types/models').Transaction>} transactions
 * @returns {Array<{title: string, data: Array}>}
 */
export const groupTransactionsByDay = (transactions) => {
    const groups = {};

    transactions.forEach((tx) => {
        const date = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
        const dateKey = date.toDateString();
        const label = getRelativeDateLabel(date);

        if (!groups[dateKey]) {
            groups[dateKey] = {
                title: label,
                dateKey,
                date,
                data: [],
            };
        }
        groups[dateKey].data.push(tx);
    });

    // Sort groups by date descending
    return Object.values(groups).sort((a, b) => b.date - a.date);
};

/**
 * Filter transactions by type
 * @param {Array} transactions
 * @param {'all' | 'income' | 'expense'} type
 */
export const filterByType = (transactions, type) => {
    if (type === 'all') return transactions;
    return transactions.filter((tx) => tx.type === type);
};

/**
 * Filter transactions by category
 * @param {Array} transactions
 * @param {string | null} categoryId
 */
export const filterByCategory = (transactions, categoryId) => {
    if (!categoryId) return transactions;
    return transactions.filter((tx) => tx.categoryId === categoryId);
};

/**
 * Filter transactions by payment method
 * @param {Array} transactions
 * @param {'all' | 'cash' | 'card'} method
 */
export const filterByPaymentMethod = (transactions, method) => {
    if (method === 'all') return transactions;
    return transactions.filter((tx) => tx.paymentMethod === method);
};

/**
 * Search transactions by title or note
 * @param {Array} transactions
 * @param {string} query
 */
export const searchTransactions = (transactions, query) => {
    if (!query.trim()) return transactions;
    const q = query.toLowerCase();
    return transactions.filter((tx) =>
        tx.categoryNameSnapshot?.toLowerCase().includes(q) ||
        tx.note?.toLowerCase().includes(q)
    );
};

/**
 * Apply all filters to transactions
 * @param {Array} transactions
 * @param {Object} filters
 */
export const applyFilters = (transactions, filters) => {
    let result = [...transactions];

    if (filters.type && filters.type !== 'all') {
        result = filterByType(result, filters.type);
    }
    if (filters.categoryId) {
        result = filterByCategory(result, filters.categoryId);
    }
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        result = filterByPaymentMethod(result, filters.paymentMethod);
    }
    if (filters.search) {
        result = searchTransactions(result, filters.search);
    }

    return result;
};
