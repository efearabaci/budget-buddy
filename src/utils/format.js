/**
 * Formatting utilities for currency, dates, and amounts
 */

/**
 * Format amount as currency
 * @param {number} amount
 * @param {string} [currency='USD']
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format amount with sign for display
 * @param {number} amount
 * @param {'income' | 'expense'} type
 * @returns {string}
 */
export const formatSignedAmount = (amount, type) => {
    const sign = type === 'income' ? '+' : '-';
    return `${sign}${formatCurrency(Math.abs(amount))}`;
};

/**
 * Format date for display
 * @param {Date | import('firebase/firestore').Timestamp} date
 * @returns {string}
 */
export const formatDate = (date) => {
    const d = date?.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

/**
 * Format time for display
 * @param {Date | import('firebase/firestore').Timestamp} date
 * @returns {string}
 */
export const formatTime = (date) => {
    const d = date?.toDate ? date.toDate() : new Date(date);
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

/**
 * Format date and time together
 * @param {Date | import('firebase/firestore').Timestamp} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
    return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Get relative date label (TODAY, YESTERDAY, or date)
 * @param {Date | import('firebase/firestore').Timestamp} date
 * @returns {string}
 */
export const getRelativeDateLabel = (date) => {
    const d = date?.toDate ? date.toDate() : new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = d.toDateString();

    if (dateStr === today.toDateString()) {
        return 'TODAY';
    }
    if (dateStr === yesterday.toDateString()) {
        return 'YESTERDAY';
    }

    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    }).toUpperCase();
};
