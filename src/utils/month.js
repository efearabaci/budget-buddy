/**
 * Month/Date utilities for budget tracking
 */

/**
 * Get month key in YYYY-MM format
 * @param {Date} [date] - Date to convert (defaults to now)
 * @returns {string} Month key like "2025-12"
 */
export const getMonthKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

/**
 * Parse month key back to Date
 * @param {string} monthKey - Format "YYYY-MM"
 * @returns {Date} First day of the month
 */
export const parseMonthKey = (monthKey) => {
    const [year, month] = monthKey.split('-').map(Number);
    return new Date(year, month - 1, 1);
};

/**
 * Get date range for a month (start and end timestamps)
 * @param {string} monthKey - Format "YYYY-MM"
 * @returns {{ start: Date, end: Date }} Start and end of month
 */
export const getMonthRange = (monthKey) => {
    const [year, month] = monthKey.split('-').map(Number);
    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59, 999); // Last day of month
    return { start, end };
};

/**
 * Get previous month key
 * @param {string} monthKey - Current month key
 * @returns {string} Previous month key
 */
export const getPreviousMonth = (monthKey) => {
    const date = parseMonthKey(monthKey);
    date.setMonth(date.getMonth() - 1);
    return getMonthKey(date);
};

/**
 * Get next month key
 * @param {string} monthKey - Current month key
 * @returns {string} Next month key
 */
export const getNextMonth = (monthKey) => {
    const date = parseMonthKey(monthKey);
    date.setMonth(date.getMonth() + 1);
    return getMonthKey(date);
};

/**
 * Format month key for display
 * @param {string} monthKey - Format "YYYY-MM"
 * @returns {string} Formatted like "December 2025"
 */
export const formatMonthDisplay = (monthKey) => {
    const date = parseMonthKey(monthKey);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Check if a date falls within a month
 * @param {Date} date - Date to check
 * @param {string} monthKey - Month key to check against
 * @returns {boolean}
 */
export const isDateInMonth = (date, monthKey) => {
    return getMonthKey(date) === monthKey;
};
