import { useState, useEffect, createContext, useContext } from 'react';
import { subscribeAuth } from '../services/auth';

/**
 * @typedef {Object} AuthContextValue
 * @property {import('firebase/auth').User | null} user
 * @property {boolean} loading
 * @property {boolean} isAuthenticated
 */

/** @type {React.Context<AuthContextValue>} */
const AuthContext = createContext({
    user: null,
    loading: true,
    isAuthenticated: false,
});

/**
 * Auth provider component
 * Wraps app and provides auth state
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeAuth((authUser) => {
            setUser(authUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to access auth context
 * @returns {AuthContextValue}
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
