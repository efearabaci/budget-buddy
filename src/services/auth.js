/**
 * Firebase Authentication Service
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';
import { initializeNewUser } from './seeds';

/**
 * Sign up a new user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').User>}
 */
export const signUp = async (email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Initialize new user with default categories
    await initializeNewUser(credential.user.uid);
    return credential.user;
};

/**
 * Log in existing user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').User>}
 */
export const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    // Ensure categories exist (idempotent)
    await initializeNewUser(credential.user.uid);
    return credential.user;
};

/**
 * Log out current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
    await signOut(auth);
};

/**
 * Subscribe to auth state changes
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {() => void} Unsubscribe function
 */
export const subscribeAuth = (callback) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * Get current user (synchronous, may be null initially)
 * @returns {import('firebase/auth').User | null}
 */
export const getCurrentUser = () => auth.currentUser;

/**
 * Parse Firebase auth error to user-friendly message
 * @param {Error} error
 * @returns {string}
 */
export const getAuthErrorMessage = (error) => {
    const code = error.code || '';
    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try logging in.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        default:
            return error.message || 'An error occurred. Please try again.';
    }
};
