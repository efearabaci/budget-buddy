import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

/**
 * Firebase configuration from environment variables
 * These are loaded from app.config.js extra field
 */
const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey || '',
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || '',
    projectId: Constants.expoConfig?.extra?.firebaseProjectId || '',
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || '',
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || '',
    appId: Constants.expoConfig?.extra?.firebaseAppId || '',
};

// Initialize Firebase only if not already initialized
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
