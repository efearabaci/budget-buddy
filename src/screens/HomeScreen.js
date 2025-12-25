import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppButton, AppText, ProgressBar } from '../components';

/**
 * Dashboard/Home screen
 * Shows summary, budgets, top spending, upcoming bills
 * @param {{ navigation: Object }} props
 */
export default function HomeScreen({ navigation }) {
    const { theme } = useTheme();

    // Placeholder data
    const currentMonth = 'December 2025';
    const income = 5250.00;
    const expense = 3120.50;
    const remaining = income - expense;
    const budget = 4000;
    const budgetSpent = expense;
    const budgetProgress = budgetSpent / budget;

    const topSpending = [
        { category: 'Food & Dining', amount: 850, icon: 'restaurant-outline' },
        { category: 'Shopping', amount: 620, icon: 'cart-outline' },
        { category: 'Transport', amount: 380, icon: 'car-outline' },
    ];

    const upcomingBills = [
        { name: 'Netflix', amount: 15.99, dueDate: 'Dec 28', icon: 'play-circle-outline' },
        { name: 'Electricity', amount: 95.00, dueDate: 'Jan 1', icon: 'flash-outline' },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="h2">Dashboard</AppText>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Settings')}
                    style={styles.settingsButton}
                >
                    <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Month Selector */}
                <View style={styles.monthSelector}>
                    <TouchableOpacity>
                        <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <AppText variant="body" style={styles.monthLabel}>{currentMonth}</AppText>
                    <TouchableOpacity>
                        <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <AppCard style={[styles.summaryCard, { flex: 1, marginRight: 8 }]}>
                        <AppText variant="caption" muted>Income</AppText>
                        <AppText variant="h2" color={theme.colors.success}>
                            ${income.toFixed(2)}
                        </AppText>
                    </AppCard>
                    <AppCard style={[styles.summaryCard, { flex: 1, marginLeft: 8 }]}>
                        <AppText variant="caption" muted>Expense</AppText>
                        <AppText variant="h2" color={theme.colors.danger}>
                            ${expense.toFixed(2)}
                        </AppText>
                    </AppCard>
                </View>

                <AppCard style={styles.remainingCard}>
                    <AppText variant="caption" muted>Remaining</AppText>
                    <AppText variant="title" color={remaining >= 0 ? theme.colors.success : theme.colors.danger}>
                        ${remaining.toFixed(2)}
                    </AppText>
                </AppCard>

                {/* Monthly Budget */}
                <TouchableOpacity onPress={() => navigation.navigate('Budgets')}>
                    <AppCard>
                        <View style={styles.cardHeader}>
                            <AppText variant="h2">Monthly Budget</AppText>
                            <AppText variant="caption" muted>
                                ${budgetSpent.toFixed(0)} / ${budget.toFixed(0)}
                            </AppText>
                        </View>
                        <ProgressBar progress={budgetProgress} style={styles.progressBar} />
                        <AppText variant="caption" muted style={styles.budgetRemaining}>
                            ${(budget - budgetSpent).toFixed(2)} remaining • Tap to manage
                        </AppText>
                    </AppCard>
                </TouchableOpacity>

                {/* Top Spending */}
                <AppCard>
                    <AppText variant="h2" style={styles.sectionTitle}>Top Spending</AppText>
                    {topSpending.map((item, index) => (
                        <View key={index} style={styles.spendingRow}>
                            <View style={[styles.spendingIcon, { backgroundColor: theme.colors.chipBg }]}>
                                <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
                            </View>
                            <AppText variant="body" style={styles.spendingCategory}>{item.category}</AppText>
                            <AppText variant="body" color={theme.colors.danger}>
                                -${item.amount.toFixed(2)}
                            </AppText>
                        </View>
                    ))}
                </AppCard>

                {/* Upcoming Bills */}
                <AppCard>
                    <View style={styles.cardHeader}>
                        <AppText variant="h2">Upcoming Bills</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate('Bills')}>
                            <AppText variant="caption" color={theme.colors.primary}>View All</AppText>
                        </TouchableOpacity>
                    </View>
                    {upcomingBills.map((bill, index) => (
                        <View key={index} style={styles.billRow}>
                            <View style={[styles.billIcon, { backgroundColor: theme.colors.chipBg }]}>
                                <Ionicons name={bill.icon} size={20} color={theme.colors.primary} />
                            </View>
                            <View style={styles.billInfo}>
                                <AppText variant="body">{bill.name}</AppText>
                                <AppText variant="caption" muted>Due {bill.dueDate}</AppText>
                            </View>
                            <AppText variant="body">${bill.amount.toFixed(2)}</AppText>
                        </View>
                    ))}
                </AppCard>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <AppButton
                        title="Add Expense"
                        onPress={() => navigation.navigate('AddTransaction')}
                        variant="danger"
                        style={styles.quickActionButton}
                    />
                    <AppButton
                        title="Add Income"
                        onPress={() => navigation.navigate('AddTransaction')}
                        variant="success"
                        style={styles.quickActionButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    settingsButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    monthLabel: {
        marginHorizontal: 16,
        fontWeight: '600',
    },
    summaryRow: {
        flexDirection: 'row',
    },
    summaryCard: {
        marginBottom: 8,
    },
    remainingCard: {
        alignItems: 'center',
        marginBottom: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressBar: {
        marginBottom: 8,
    },
    budgetRemaining: {
        textAlign: 'right',
    },
    sectionTitle: {
        marginBottom: 16,
    },
    spendingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    spendingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    spendingCategory: {
        flex: 1,
    },
    billRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    billIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    billInfo: {
        flex: 1,
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    quickActionButton: {
        flex: 1,
    },
});
