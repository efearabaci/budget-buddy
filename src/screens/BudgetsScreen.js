import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { AppCard, AppText, AppButton, ProgressBar } from '../components';
import { BudgetProgressBar } from '../components/BudgetProgressBar';
import { MonthSelector } from '../components/MonthSelector';
import { getBudget, upsertBudget } from '../services/budgets';
import { getMonthlyTotals, getTopCategories } from '../services/analytics';
import { getMonthKey, getPreviousMonth, getNextMonth } from '../utils/month';
import { formatCurrency } from '../utils/format';

/**
 * Budgets screen with monthly budget setting and progress
 */
export default function BudgetsScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();

    const [monthKey, setMonthKey] = useState(getMonthKey());
    const [budget, setBudget] = useState(null);
    const [totals, setTotals] = useState({ income: 0, expense: 0, net: 0 });
    const [topCategories, setTopCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [limitInput, setLimitInput] = useState('');
    const [saving, setSaving] = useState(false);

    const loadData = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            const [budgetData, totalsData, categoriesData] = await Promise.all([
                getBudget(user.uid, monthKey),
                getMonthlyTotals(user.uid, monthKey),
                getTopCategories(user.uid, monthKey, 5),
            ]);

            setBudget(budgetData);
            setTotals(totalsData);
            setTopCategories(categoriesData);
            setLimitInput(budgetData?.overallLimit?.toString() || '');
        } catch (err) {
            console.error('Failed to load budget data:', err);
        } finally {
            setLoading(false);
        }
    }, [user, monthKey]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveBudget = async () => {
        if (!user || !limitInput) return;

        const limit = parseFloat(limitInput);
        if (isNaN(limit) || limit <= 0) {
            Alert.alert('Invalid', 'Please enter a valid budget amount');
            return;
        }

        setSaving(true);
        try {
            await upsertBudget(user.uid, monthKey, { overallLimit: limit });
            setBudget({ ...budget, overallLimit: limit });
            setEditing(false);
        } catch (err) {
            Alert.alert('Error', 'Failed to save budget');
        } finally {
            setSaving(false);
        }
    };

    const hasBudget = budget?.overallLimit > 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText variant="h2">Budget</AppText>
                <View style={{ width: 24 }} />
            </View>

            {/* Month Selector */}
            <MonthSelector
                monthKey={monthKey}
                onPrevious={() => setMonthKey(getPreviousMonth(monthKey))}
                onNext={() => setMonthKey(getNextMonth(monthKey))}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Summary Card */}
                <AppCard style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <AppText variant="caption" muted>Income</AppText>
                            <AppText variant="h2" color={theme.colors.success}>
                                {formatCurrency(totals.income)}
                            </AppText>
                        </View>
                        <View style={[styles.summaryItem, styles.centerItem]}>
                            <AppText variant="caption" muted>Expense</AppText>
                            <AppText variant="h2" color={theme.colors.danger}>
                                {formatCurrency(totals.expense)}
                            </AppText>
                        </View>
                        <View style={[styles.summaryItem, styles.rightItem]}>
                            <AppText variant="caption" muted>Net</AppText>
                            <AppText
                                variant="h2"
                                color={totals.net >= 0 ? theme.colors.success : theme.colors.danger}
                            >
                                {formatCurrency(totals.net)}
                            </AppText>
                        </View>
                    </View>
                </AppCard>

                {/* Budget Progress */}
                <AppCard>
                    <View style={styles.budgetHeader}>
                        <AppText variant="h2">Monthly Budget</AppText>
                        <TouchableOpacity onPress={() => setEditing(!editing)}>
                            <Ionicons
                                name={editing ? 'close' : 'pencil'}
                                size={20}
                                color={theme.colors.primary}
                            />
                        </TouchableOpacity>
                    </View>

                    {editing ? (
                        <View style={styles.editForm}>
                            <View style={[styles.inputRow, { borderColor: theme.colors.border }]}>
                                <AppText variant="h2" color={theme.colors.mutedText}>$</AppText>
                                <TextInput
                                    style={[styles.input, { color: theme.colors.text }]}
                                    value={limitInput}
                                    onChangeText={setLimitInput}
                                    placeholder="0.00"
                                    placeholderTextColor={theme.colors.mutedText}
                                    keyboardType="decimal-pad"
                                />
                            </View>
                            <AppButton
                                title="Save Budget"
                                onPress={handleSaveBudget}
                                loading={saving}
                                style={styles.saveButton}
                            />
                        </View>
                    ) : hasBudget ? (
                        <BudgetProgressBar
                            spent={totals.expense}
                            limit={budget.overallLimit}
                        />
                    ) : (
                        <View style={styles.noBudget}>
                            <Ionicons name="wallet-outline" size={48} color={theme.colors.mutedText} />
                            <AppText variant="body" muted style={styles.noBudgetText}>
                                No budget set for this month
                            </AppText>
                            <AppButton
                                title="Set Budget"
                                onPress={() => setEditing(true)}
                                variant="secondary"
                            />
                        </View>
                    )}
                </AppCard>

                {/* Top Spending Categories */}
                {topCategories.length > 0 && (
                    <AppCard>
                        <AppText variant="h2" style={styles.sectionTitle}>Top Spending</AppText>
                        {topCategories.map((cat, index) => (
                            <View key={cat.categoryId} style={styles.categoryRow}>
                                <View style={styles.categoryInfo}>
                                    <AppText variant="body">{cat.categoryName}</AppText>
                                    <AppText variant="caption" muted>
                                        {cat.percentage.toFixed(1)}%
                                    </AppText>
                                </View>
                                <AppText variant="body" style={styles.categoryAmount}>
                                    {formatCurrency(cat.amount)}
                                </AppText>
                            </View>
                        ))}
                    </AppCard>
                )}

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    content: { flex: 1, paddingHorizontal: 16 },
    summaryCard: { marginTop: 8 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryItem: {},
    centerItem: { alignItems: 'center' },
    rightItem: { alignItems: 'flex-end' },
    budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    editForm: {},
    inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 16 },
    input: { flex: 1, fontSize: 24, fontWeight: '600', padding: 12 },
    saveButton: {},
    noBudget: { alignItems: 'center', paddingVertical: 24 },
    noBudgetText: { marginVertical: 12, textAlign: 'center' },
    sectionTitle: { marginBottom: 16 },
    categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    categoryInfo: {},
    categoryAmount: { fontWeight: '600' },
    bottomPadding: { height: 24 },
});
