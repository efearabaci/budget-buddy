import { Platform } from 'react-native';

/**
 * Creates cross-platform shadow styles
 * @param {number} elevation - Shadow intensity (1-5)
 * @param {string} [color='#000'] - Shadow color
 * @returns {Object} Platform-specific shadow styles
 */
export const createShadow = (elevation = 2, color = '#000') => {
    if (Platform.OS === 'ios') {
        return {
            shadowColor: color,
            shadowOffset: {
                width: 0,
                height: elevation,
            },
            shadowOpacity: 0.1 + (elevation * 0.02),
            shadowRadius: elevation * 2,
        };
    }

    // Android
    return {
        elevation: elevation,
        shadowColor: color,
    };
};

/**
 * Checks if platform is iOS
 * @returns {boolean}
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Checks if platform is Android
 * @returns {boolean}
 */
export const isAndroid = Platform.OS === 'android';
