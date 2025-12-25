import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppText } from './AppText';
import { formatTime, formatSignedAmount } from '../utils/format';

/**
 * Transaction list row component
 */
export const TransactionRow = ({
    transaction,
    categoryName,
    categoryIcon = 'ellipsis-horizontal-outline',
    onPress,
    onLongPress,
}) => {
    const { theme } = useTheme();
    const { type, amount, note, date } = transaction;

    const amountColor = type === 'income' ? theme.colors.success : theme.colors.danger;
    const iconColor = type === 'income' ? theme.colors.success : theme.colors.primary;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.chipBg }]}>
                <Ionicons name={categoryIcon} size={20} color={iconColor} />
            </View>

            <View style={styles.content}>
                <AppText variant="body" numberOfLines={1}>
                    {categoryName || 'Uncategorized'}
                </AppText>
                {note ? (
                    <AppText variant="caption" muted numberOfLines={1}>
                        {note}
                    </AppText>
                ) : null}
            </View>

            <View style={styles.right}>
                <AppText variant="body" color={amountColor} style={styles.amount}>
                    {formatSignedAmount(amount, type)}
                </AppText>
                <AppText variant="caption" muted>
                    {formatTime(date)}
                </AppText>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
        marginRight: 12,
    },
    right: {
        alignItems: 'flex-end',
    },
    amount: {
        fontWeight: '600',
    },
});
