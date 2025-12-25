/**
 * BudgetBuddy Theme Index
 * Consolidated theme exports
 */

export { lightColors, darkColors } from './colors';
export { spacing } from './spacing';
export { typography, fontSizes, fontWeights } from './typography';

/**
 * Border radii for consistent rounded corners
 */
export const radii = {
    card: 16,
    button: 14,
    chip: 999, // Full rounded for pill shape
    input: 12,
};

/**
 * Shadow presets for elevation
 * Cross-platform compatible
 */
export const shadows = {
    card: {
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        // Android elevation
        elevation: 3,
    },
    button: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
};
