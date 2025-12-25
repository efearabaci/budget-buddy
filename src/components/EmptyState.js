import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppText } from './AppText';

/**
 * Empty state placeholder component
 * @param {{ 
 *   icon?: string,
 *   title: string,
 *   subtitle?: string,
 *   style?: Object
 * }} props
 */
export const EmptyState = ({
    icon = 'document-text-outline',
    title,
    subtitle,
    style
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, style]}>
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.chipBg },
                ]}
            >
                <Ionicons
                    name={icon}
                    size={40}
                    color={theme.colors.mutedText}
                />
            </View>
            <AppText variant="h2" style={styles.title}>
                {title}
            </AppText>
            {subtitle && (
                <AppText variant="body" muted style={styles.subtitle}>
                    {subtitle}
                </AppText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
    },
});
