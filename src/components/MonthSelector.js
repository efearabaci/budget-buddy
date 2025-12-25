import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppText } from './AppText';
import { formatMonthDisplay } from '../utils/month';

/**
 * Reusable month selector component
 */
export const MonthSelector = ({
    monthKey,
    onPrevious,
    onNext,
    style,
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={onPrevious} style={styles.arrow}>
                <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.labelContainer}>
                <AppText variant="body" style={styles.label}>
                    {formatMonthDisplay(monthKey)}
                </AppText>
            </View>
            <TouchableOpacity onPress={onNext} style={styles.arrow}>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrow: {
        padding: 8,
    },
    labelContainer: {
        minWidth: 140,
        alignItems: 'center',
    },
    label: {
        fontWeight: '600',
    },
});
