import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AppButton } from './AppButton';

/**
 * Quick action buttons for common tasks
 */
export const QuickActions = ({
    onAddExpense,
    onAddIncome,
    onAddBill,
}) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <AppButton
                title="Add Expense"
                onPress={onAddExpense}
                variant="danger"
                style={styles.button}
            />
            <AppButton
                title="Add Income"
                onPress={onAddIncome}
                variant="success"
                style={styles.button}
            />
            <AppButton
                title="Add Bill"
                onPress={onAddBill}
                variant="secondary"
                style={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 8,
    },
    button: {
        flex: 1,
        minWidth: '30%',
    },
});
