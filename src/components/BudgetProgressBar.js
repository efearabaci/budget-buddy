import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useCurrency } from '../hooks/useCurrency';
import { AppText } from './AppText';

/**
 * Budget progress bar with warning states
 * >=80% = warning (yellow)
 * >=100% = exceeded (red)
 */
export const BudgetProgressBar = ({
    spent = 0,
    limit = 0,
    showLabels = true,
    height = 12,
}) => {
    const { theme } = useTheme();
    const { formatPrice } = useCurrency();

    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    const clampedPercentage = Math.min(percentage, 100);
    const remaining = Math.max(limit - spent, 0);

    // Determine color based on percentage
    let barColor = theme.colors.success;
    let status = 'good';

    if (percentage >= 100) {
        barColor = theme.colors.danger;
        status = 'exceeded';
    } else if (percentage >= 80) {
        barColor = theme.colors.warning;
        status = 'warning';
    }

    return (
        <View style={styles.container}>
            {showLabels && (
                <View style={styles.labelRow}>
                    <View>
                        <AppText variant="caption" muted>Spent</AppText>
                        <AppText variant="body" color={barColor} style={styles.amount}>
                            {formatPrice(spent)}
                        </AppText>
                    </View>
                    <View style={styles.rightLabel}>
                        <AppText variant="caption" muted>
                            {status === 'exceeded' ? 'Over by' : 'Remaining'}
                        </AppText>
                        <AppText
                            variant="body"
                            color={status === 'exceeded' ? theme.colors.danger : theme.colors.text}
                            style={styles.amount}
                        >
                            {status === 'exceeded'
                                ? formatPrice(spent - limit)
                                : formatPrice(remaining)
                            }
                        </AppText>
                    </View>
                </View>
            )}

            <View style={[styles.track, { height, backgroundColor: theme.colors.chipBg }]}>
                <View
                    style={[
                        styles.bar,
                        {
                            width: `${clampedPercentage}%`,
                            backgroundColor: barColor,
                        }
                    ]}
                />
            </View>

            {showLabels && (
                <View style={styles.bottomRow}>
                    <AppText variant="caption" muted>
                        {percentage.toFixed(0)}% of {formatPrice(limit)}
                    </AppText>
                    {status === 'warning' && (
                        <AppText variant="caption" color={theme.colors.warning}>
                            ⚠️ Approaching limit
                        </AppText>
                    )}
                    {status === 'exceeded' && (
                        <AppText variant="caption" color={theme.colors.danger}>
                            🚫 Budget exceeded
                        </AppText>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    rightLabel: {
        alignItems: 'flex-end',
    },
    amount: {
        fontWeight: '600',
    },
    track: {
        borderRadius: 999,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 999,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});
