import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../hooks/useCurrency';
import { AppCard, AppText, ProgressBar, EmptyState } from '../components';
import { SummaryRow, RemainingCard } from '../components/SummaryCard';
import { QuickActions } from '../components/QuickActions';
import { MonthSelector } from '../components/MonthSelector';
import { BudgetProgressBar } from '../components/BudgetProgressBar';
import { getMonthlyTotals, getTopCategories } from '../services/analytics';
import { getBudget } from '../services/budgets';
import { listenBills } from '../services/bills';
import { getMonthKey, getPreviousMonth, getNextMonth } from '../utils/month';
import { getBillStatus, formatDueDate } from '../utils/bills';

/**
 * Dashboard/Home screen
 * Shows summary, budgets, top spending, upcoming bills
 */
export default function HomeScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();

    const [monthKey, setMonthKey] = useState(getMonthKey());
    const [totals, setTotals] = useState({ income: 0, expense: 0, net: 0 });
    const [budget, setBudget] = useState(null);
    const [topSpending, setTopSpending] = useState([]);
    const [upcomingBills, setUpcomingBills] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load month-specific data
    const loadMonthData = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            const [totalsData, budgetData, categoriesData] = await Promise.all([
                getMonthlyTotals(user.uid, monthKey),
                getBudget(user.uid, monthKey),
                getTopCategories(user.uid, monthKey, 3),
            ]);

            setTotals(totalsData);
            setBudget(budgetData);
            setTopSpending(categoriesData);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [user, monthKey]);

    useFocusEffect(
        useCallback(() => {
            loadMonthData();
        }, [loadMonthData])
    );

    // Subscribe to bills (filtered locally to next 30 days)
    useEffect(() => {
        if (!user) return;

        const unsubscribe = listenBills(user.uid, (bills) => {
            const now = new Date();
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

            // Filter to unpaid bills due within next 30 days
            const upcoming = bills
                .filter((bill) => {
                    if (bill.paidAt) return false;
                    const dueDate = bill.dueDate?.toDate ? bill.dueDate.toDate() : new Date(bill.dueDate);
                    return dueDate >= now && dueDate <= thirtyDaysFromNow;
                })
                .slice(0, 3); // Show max 3

            setUpcomingBills(upcoming);
        });

        return unsubscribe;
    }, [user]);

    const hasBudget = budget?.overallLimit > 0;

    // Navigation handlers
    const handleAddExpense = () => navigation.navigate('Add', { type: 'expense' });
    const handleAddIncome = () => navigation.navigate('Add', { type: 'income' });
    const handleAddBill = () => navigation.navigate('Bills', { screen: 'AddEditBill' });

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
                <MonthSelector
                    monthKey={monthKey}
                    onPrevious={() => setMonthKey(getPreviousMonth(monthKey))}
                    onNext={() => setMonthKey(getNextMonth(monthKey))}
                    style={styles.monthSelector}
                />

                {/* Summary Cards */}
                {/* Note: SummaryRow and RemainingCard are passed raw totals. 
                    They need to be updated to use useCurrency internally OR accept formatted strings.
                    Assuming component encapsulation, better to update them.
                    However, for speed, I might check them. */}
                <SummaryRow income={totals.income} expense={totals.expense} />
                <RemainingCard income={totals.income} expense={totals.expense} />

                {/* Monthly Budget */}
                <TouchableOpacity onPress={() => navigation.navigate('Budgets')}>
                    <AppCard>
                        <View style={styles.cardHeader}>
                            <AppText variant="h2">Monthly Budget</AppText>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.mutedText} />
                        </View>
                        {hasBudget ? (
                            <BudgetProgressBar
                                spent={totals.expense}
                                limit={budget.overallLimit}
                            />
                        ) : (
                            <View style={styles.noBudget}>
                                <AppText variant="body" muted>No budget set</AppText>
                                <AppText variant="caption" color={theme.colors.primary}>
                                    Tap to set one
                                </AppText>
                            </View>
                        )}
                    </AppCard>
                </TouchableOpacity>

                {/* Top Spending */}
                <AppCard>
                    <AppText variant="h2" style={styles.sectionTitle}>Top Spending</AppText>
                    {topSpending.length > 0 ? (
                        topSpending.map((item, index) => (
                            <View key={item.categoryId} style={styles.spendingRow}>
                                <View style={[styles.spendingIcon, { backgroundColor: theme.colors.chipBg }]}>
                                    <Ionicons name="pricetag-outline" size={18} color={theme.colors.primary} />
                                </View>
                                <View style={styles.spendingInfo}>
                                    <AppText variant="body">{item.categoryName}</AppText>
                                    <AppText variant="caption" muted>{item.percentage.toFixed(1)}%</AppText>
                                </View>
                                <AppText variant="body" color={theme.colors.danger}>
                                    -{formatPrice(item.amount)}
                                </AppText>
                            </View>
                        ))
                    ) : (
                        <AppText variant="body" muted style={styles.emptyText}>
                            No expenses this month
                        </AppText>
                    )}
                </AppCard>

                {/* Upcoming Bills */}
                <AppCard>
                    <View style={styles.cardHeader}>
                        <AppText variant="h2">Upcoming Bills</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate('Bills')}>
                            <AppText variant="caption" color={theme.colors.primary}>View All</AppText>
                        </TouchableOpacity>
                    </View>
                    {upcomingBills.length > 0 ? (
                        upcomingBills.map((bill) => (
                            <View key={bill.id} style={styles.billRow}>
                                <View style={[styles.billIcon, { backgroundColor: theme.colors.chipBg }]}>
                                    <Ionicons name="receipt-outline" size={18} color={theme.colors.primary} />
                                </View>
                                <View style={styles.billInfo}>
                                    <AppText variant="body">{bill.name}</AppText>
                                    <AppText variant="caption" muted>{formatDueDate(bill.dueDate)}</AppText>
                                </View>
                                <AppText variant="body">{formatPrice(bill.amount)}</AppText>
                            </View>
                        ))
                    ) : (
                        <AppText variant="body" muted style={styles.emptyText}>
                            No upcoming bills
                        </AppText>
                    )}
                </AppCard>

                {/* Quick Actions */}
                <QuickActions
                    onAddExpense={handleAddExpense}
                    onAddIncome={handleAddIncome}
                    onAddBill={handleAddBill}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    settingsButton: { padding: 4 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
    monthSelector: { marginBottom: 16 },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    noBudget: { alignItems: 'center', paddingVertical: 12 },
    sectionTitle: { marginBottom: 12 },
    spendingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    spendingIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    spendingInfo: { flex: 1 },
    billRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    billIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    billInfo: { flex: 1 },
    emptyText: { textAlign: 'center', paddingVertical: 16 },
});
