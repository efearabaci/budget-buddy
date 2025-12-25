/**
 * Bills utilities for status computation
 */

/**
 * @typedef {'paid' | 'overdue' | 'dueSoon' | 'upcoming'} BillStatus
 */

/**
 * Compute bill status
 * @param {Object} bill
 * @returns {BillStatus}
 */
export const getBillStatus = (bill) => {
    // Paid if paidAt exists
    if (bill.paidAt) {
        return 'paid';
    }

    const now = new Date();
    const dueDate = bill.dueDate?.toDate ? bill.dueDate.toDate() : new Date(bill.dueDate);

    // Set to start of day for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    // Overdue if past due and unpaid
    if (due < today) {
        return 'overdue';
    }

    // Due soon if within next 7 days
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    if (due <= sevenDaysFromNow) {
        return 'dueSoon';
    }

    return 'upcoming';
};

/**
 * Get status badge info (color, label)
 * @param {BillStatus} status
 * @param {Object} theme
 */
export const getStatusBadge = (status, theme) => {
    switch (status) {
        case 'paid':
            return { color: theme.colors.success, label: 'Paid', bgColor: theme.colors.success + '20' };
        case 'overdue':
            return { color: theme.colors.danger, label: 'Overdue', bgColor: theme.colors.danger + '20' };
        case 'dueSoon':
            return { color: theme.colors.warning, label: 'Due Soon', bgColor: theme.colors.warning + '20' };
        default:
            return { color: theme.colors.primary, label: 'Upcoming', bgColor: theme.colors.primary + '20' };
    }
};

/**
 * Group bills by status
 * @param {Array} bills
 * @returns {{ overdue: Array, dueSoon: Array, upcoming: Array, paid: Array }}
 */
export const groupBillsByStatus = (bills) => {
    const groups = {
        overdue: [],
        dueSoon: [],
        upcoming: [],
        paid: [],
    };

    bills.forEach((bill) => {
        const status = getBillStatus(bill);
        groups[status].push(bill);
    });

    // Sort each group by due date
    const sortByDueDate = (a, b) => {
        const dateA = a.dueDate?.toDate ? a.dueDate.toDate() : new Date(a.dueDate);
        const dateB = b.dueDate?.toDate ? b.dueDate.toDate() : new Date(b.dueDate);
        return dateA - dateB;
    };

    groups.overdue.sort(sortByDueDate);
    groups.dueSoon.sort(sortByDueDate);
    groups.upcoming.sort(sortByDueDate);
    groups.paid.sort((a, b) => {
        const dateA = a.paidAt?.toDate ? a.paidAt.toDate() : new Date(a.paidAt);
        const dateB = b.paidAt?.toDate ? b.paidAt.toDate() : new Date(b.paidAt);
        return dateB - dateA; // Most recent first
    });

    return groups;
};

/**
 * Get next due date for recurring bill (add 1 month)
 * @param {Date} currentDueDate
 * @returns {Date}
 */
export const getNextMonthlyDueDate = (currentDueDate) => {
    const date = new Date(currentDueDate);
    date.setMonth(date.getMonth() + 1);
    return date;
};

/**
 * Format due date for display
 * @param {Date | import('firebase/firestore').Timestamp} dueDate
 * @returns {string}
 */
export const formatDueDate = (dueDate) => {
    const date = dueDate?.toDate ? dueDate.toDate() : new Date(dueDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (due.getTime() === today.getTime()) {
        return 'Due Today';
    }
    if (due.getTime() === tomorrow.getTime()) {
        return 'Due Tomorrow';
    }

    return `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};
