/**
 * Database seeding utilities
 * Idempotent functions to initialize user data
 */

import { getDocs } from 'firebase/firestore';
import { colRef, addCategory } from './firestore';
import { DEFAULT_CATEGORIES } from '../types/models';

/**
 * Ensure default categories exist for a user
 * This is idempotent - will not create duplicates
 * @param {string} uid - User ID
 * @returns {Promise<void>}
 */
export const ensureDefaultCategories = async (uid) => {
    // Get existing categories
    const snapshot = await getDocs(colRef(uid, 'categories'));
    const existingNames = new Set(
        snapshot.docs.map(doc => doc.data().name.toLowerCase())
    );

    // Add missing default categories
    const promises = DEFAULT_CATEGORIES
        .filter(cat => !existingNames.has(cat.name.toLowerCase()))
        .map(cat => addCategory(uid, {
            ...cat,
            isDefault: true,
        }));

    await Promise.all(promises);

    console.log(`[Seeds] Ensured default categories for user ${uid}`);
};

/**
 * Initialize new user with default data
 * Call this after first signup/login
 * @param {string} uid - User ID
 */
export const initializeNewUser = async (uid) => {
    await ensureDefaultCategories(uid);
    // Add other initialization logic here as needed
};
