import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

/**
 * Quick action buttons for common tasks
 */
export const QuickActions = ({
    onAddExpense,
    onAddIncome,
    onAddBill,
}) => {
    const { theme } = useTheme();

    const ActionButton = ({ title, icon, color, onPress, style }) => (
        <TouchableOpacity
            style={[
                styles.actionButton,
                { backgroundColor: color + '15', borderColor: color + '30' }, // Tinted background
                style
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ActionButton
                title="Add Expense"
                icon="arrow-down-circle"
                color={theme.colors.danger}
                onPress={onAddExpense}
            />
            <ActionButton
                title="Add Income"
                icon="arrow-up-circle"
                color={theme.colors.success}
                onPress={onAddIncome}
            />
            <ActionButton
                title="Add Bill"
                icon="receipt"
                color={theme.colors.primary}
                onPress={onAddBill}
                style={{ backgroundColor: '#FFFFFF', borderColor: theme.colors.border, borderWidth: 1 }} // Explicit white for Bill as requested
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 16,
        borderWidth: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});
