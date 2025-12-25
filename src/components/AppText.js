import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * @typedef {'title' | 'h2' | 'body' | 'caption'} TextVariant
 */

/**
 * Theme-aware text component with variant styles
 * @param {{ 
 *   children: React.ReactNode, 
 *   variant?: TextVariant, 
 *   color?: string,
 *   muted?: boolean,
 *   style?: Object 
 * }} props
 */
export const AppText = ({
    children,
    variant = 'body',
    color,
    muted = false,
    style
}) => {
    const { theme } = useTheme();

    const getTextColor = () => {
        if (color) return color;
        if (muted) return theme.colors.mutedText;
        return theme.colors.text;
    };

    return (
        <Text
            style={[
                styles.base,
                theme.typography[variant],
                { color: getTextColor() },
                style,
            ]}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        // Base styles applied to all text
    },
});
