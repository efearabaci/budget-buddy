/**
 * BudgetBuddy Data Models
 * JSDoc type definitions for Firestore documents
 */

/**
 * @typedef {'income' | 'expense'} TransactionType
 */

/**
 * @typedef {'cash' | 'card'} PaymentMethod
 */

/**
 * @typedef {'monthly' | 'none'} RecurringType
 */

/**
 * Transaction document
 * Path: users/{uid}/transactions/{txId}
 * 
 * @typedef {Object} Transaction
 * @property {string} id - Document ID
 * @property {TransactionType} type - Income or expense
 * @property {number} amount - Transaction amount (positive)
 * @property {string} categoryId - Reference to category
 * @property {string} [categoryNameSnapshot] - Denormalized category name
 * @property {import('firebase/firestore').Timestamp} date - Transaction date
 * @property {string} [note] - Optional note
 * @property {PaymentMethod} paymentMethod - Cash or card
 * @property {import('firebase/firestore').Timestamp} createdAt
 * @property {import('firebase/firestore').Timestamp} updatedAt
 */

/**
 * Bill document
 * Path: users/{uid}/bills/{billId}
 * 
 * @typedef {Object} Bill
 * @property {string} id - Document ID
 * @property {string} name - Bill name
 * @property {number} amount - Bill amount
 * @property {import('firebase/firestore').Timestamp} dueDate - Due date
 * @property {RecurringType} recurring - Recurring type
 * @property {import('firebase/firestore').Timestamp} [paidAt] - When paid (null if unpaid)
 * @property {import('firebase/firestore').Timestamp} createdAt
 * @property {import('firebase/firestore').Timestamp} updatedAt
 */

/**
 * Budget document
 * Path: users/{uid}/budgets/{budgetId}
 * 
 * @typedef {Object} Budget
 * @property {string} id - Document ID
 * @property {string} monthKey - Format: "YYYY-MM"
 * @property {number} overallLimit - Total budget limit
 * @property {Object.<string, number>} [perCategoryLimits] - Category-specific limits
 * @property {import('firebase/firestore').Timestamp} createdAt
 * @property {import('firebase/firestore').Timestamp} updatedAt
 */

/**
 * Category document
 * Path: users/{uid}/categories/{categoryId}
 * 
 * @typedef {Object} Category
 * @property {string} id - Document ID
 * @property {string} name - Category name
 * @property {string} icon - Icon name (Ionicons)
 * @property {string} color - Hex color code
 * @property {boolean} isDefault - True for seeded defaults
 * @property {import('firebase/firestore').Timestamp} createdAt
 * @property {import('firebase/firestore').Timestamp} updatedAt
 */

/**
 * User profile document
 * Path: users/{uid}
 * 
 * @typedef {Object} UserProfile
 * @property {string} uid - User ID from Auth
 * @property {string} email - User email
 * @property {string} [displayName] - Optional display name
 * @property {string} currency - Currency code (default: USD)
 * @property {import('firebase/firestore').Timestamp} createdAt
 * @property {import('firebase/firestore').Timestamp} updatedAt
 */

/**
 * Default categories to seed
 */
export const DEFAULT_CATEGORIES = [
    { name: 'Food', icon: 'restaurant-outline', color: '#FF6B6B' },
    { name: 'Rent', icon: 'home-outline', color: '#4ECDC4' },
    { name: 'Transport', icon: 'car-outline', color: '#45B7D1' },
    { name: 'Bills', icon: 'receipt-outline', color: '#96CEB4' },
    { name: 'Shopping', icon: 'cart-outline', color: '#FFEAA7' },
    { name: 'Entertainment', icon: 'game-controller-outline', color: '#DDA0DD' },
    { name: 'Health', icon: 'medical-outline', color: '#98D8C8' },
    { name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#B0BEC5' },
];
