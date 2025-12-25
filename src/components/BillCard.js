import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppText } from './AppText';
import { formatCurrency } from '../utils/format';
import { getBillStatus, getStatusBadge, formatDueDate } from '../utils/bills';

/**
 * Bill card component with status badge
 */
export const BillCard = ({
    bill,
    onPress,
    onMarkPaid,
    onMarkUnpaid,
}) => {
    const { theme } = useTheme();
    const status = getBillStatus(bill);
    const badge = getStatusBadge(status, theme);
    const isPaid = status === 'paid';

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.colors.card }, theme.shadows.card]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.row}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.chipBg }]}>
                    <Ionicons
                        name={bill.icon || 'receipt-outline'}
                        size={24}
                        color={isPaid ? theme.colors.success : theme.colors.primary}
                    />
                </View>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <AppText variant="body" style={styles.name}>{bill.name}</AppText>
                        {bill.recurring === 'monthly' && (
                            <Ionicons name="repeat" size={14} color={theme.colors.mutedText} style={styles.recurringIcon} />
                        )}
                    </View>
                    <AppText variant="caption" muted>
                        {formatDueDate(bill.dueDate)}
                    </AppText>
                </View>

                <View style={styles.right}>
                    <AppText variant="body" style={styles.amount}>
                        {formatCurrency(bill.amount)}
                    </AppText>
                    <View style={[styles.badge, { backgroundColor: badge.bgColor }]}>
                        <AppText variant="caption" color={badge.color} style={styles.badgeText}>
                            {badge.label}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
                style={[
                    styles.actionButton,
                    {
                        backgroundColor: isPaid ? theme.colors.chipBg : theme.colors.success,
                    },
                ]}
                onPress={isPaid ? onMarkUnpaid : onMarkPaid}
            >
                <Ionicons
                    name={isPaid ? 'close-circle-outline' : 'checkmark-circle-outline'}
                    size={18}
                    color={isPaid ? theme.colors.text : '#FFFFFF'}
                />
                <AppText
                    variant="caption"
                    color={isPaid ? theme.colors.text : '#FFFFFF'}
                    style={styles.actionText}
                >
                    {isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                </AppText>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontWeight: '600',
    },
    recurringIcon: {
        marginLeft: 6,
    },
    right: {
        alignItems: 'flex-end',
    },
    amount: {
        fontWeight: '600',
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 10,
    },
    actionText: {
        marginLeft: 6,
        fontWeight: '600',
    },
});
