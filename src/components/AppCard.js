import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Styled card component with theme-aware styling
 * @param {{ children: React.ReactNode, style?: Object }} props
 */
export const AppCard = ({ children, style }) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.card,
                    borderRadius: theme.radii.card,
                    padding: theme.spacing.md,
                },
                theme.shadows.card,
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
});
