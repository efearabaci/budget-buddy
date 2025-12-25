import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeProvider';

/**
 * Hook to access theme context
 * @returns {{ theme: import('../theme/ThemeProvider').Theme, toggleTheme: () => void, isDark: boolean }}
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
