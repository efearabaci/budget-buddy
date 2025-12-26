import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AppCard } from './AppCard';
import { AppText } from './AppText';
import { formatCurrency } from '../utils/format';

/**
 * Summary card for displaying a single metric
 */
export const SummaryCard = ({
    label,
    value,
    type = 'neutral', // 'income' | 'expense' | 'neutral'
    style,
}) => {
    const { theme } = useTheme();

    const getColor = () => {
        switch (type) {
            case 'income':
                return theme.colors.success;
            case 'expense':
                return theme.colors.danger;
            default:
                return theme.colors.text;
        }
    };

    return (
        <AppCard style={[styles.card, style]}>
            <AppText variant="caption" muted>{label}</AppText>
            <AppText variant="h2" color={getColor()}>
                {typeof value === 'number' ? formatCurrency(value) : value}
            </AppText>
        </AppCard>
    );
};

/**
 * Summary row with income, expense, and remaining
 */
export const SummaryRow = ({ income, expense }) => {
    const remaining = income - expense;
    const { theme } = useTheme();

    return (
        <View style={styles.row}>
            <SummaryCard
                label="Income"
                value={income}
                type="income"
                style={styles.cardLeft}
            />
            <SummaryCard
                label="Expense"
                value={expense}
                type="expense"
                style={styles.cardRight}
            />
        </View>
    );
};

/**
 * Remaining balance card
 */
export const RemainingCard = ({ income, expense }) => {
    const { theme } = useTheme();
    const remaining = income - expense;

    return (
        <AppCard style={styles.remainingCard}>
            <AppText variant="caption" muted>Remaining</AppText>
            <AppText
                variant="title"
                color={remaining >= 0 ? theme.colors.success : theme.colors.danger}
            >
                {formatCurrency(remaining)}
            </AppText>
        </AppCard>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    cardLeft: {
        marginRight: 6,
        marginBottom: 8,
    },
    cardRight: {
        marginLeft: 6,
        marginBottom: 8,
    },
    remainingCard: {
        alignItems: 'center',
        marginBottom: 8,
    },
});
