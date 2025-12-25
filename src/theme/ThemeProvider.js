import React, { createContext, useState, useMemo } from 'react';
import { lightColors, darkColors } from './colors';
import { spacing } from './spacing';
import { typography, fontSizes, fontWeights } from './typography';
import { radii, shadows } from './index';

/**
 * @typedef {'light' | 'dark'} ThemeMode
 */

/**
 * @typedef {Object} Theme
 * @property {ThemeMode} mode
 * @property {typeof lightColors} colors
 * @property {typeof spacing} spacing
 * @property {typeof typography} typography
 * @property {typeof fontSizes} fontSizes
 * @property {typeof fontWeights} fontWeights
 * @property {typeof radii} radii
 * @property {typeof shadows} shadows
 */

/**
 * @typedef {Object} ThemeContextValue
 * @property {Theme} theme
 * @property {() => void} toggleTheme
 * @property {boolean} isDark
 */

/** @type {React.Context<ThemeContextValue | null>} */
export const ThemeContext = createContext(null);

/**
 * ThemeProvider component
 * Provides theme context to the entire app
 * @param {{ children: React.ReactNode }} props
 */
export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('light');

    const toggleTheme = () => {
        setMode(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => ({
        mode,
        colors: mode === 'light' ? lightColors : darkColors,
        spacing,
        typography,
        fontSizes,
        fontWeights,
        radii,
        shadows,
    }), [mode]);

    const value = useMemo(() => ({
        theme,
        toggleTheme,
        isDark: mode === 'dark',
    }), [theme, mode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
