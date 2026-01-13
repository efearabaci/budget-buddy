import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { AppCard, AppText, AppButton, ProgressBar } from '../components';
import { BudgetProgressBar } from '../components/BudgetProgressBar';
import { MonthSelector } from '../components/MonthSelector';
import { getBudget, upsertBudget } from '../services/budgets';
import { getMonthlyTotals, getMonthlySpentByCategory } from '../services/analytics';
import { getMonthKey, getPreviousMonth, getNextMonth } from '../utils/month';
import { formatCurrency } from '../utils/format';
import { getCategories } from '../services/firestore';
import { useCurrency } from '../hooks/useCurrency';

/**
 * Budgets screen with monthly budget setting and progress
 */
export default function BudgetsScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();

    const [monthKey, setMonthKey] = useState(getMonthKey());
    const [budget, setBudget] = useState(null);
    const [totals, setTotals] = useState({ income: 0, expense: 0, net: 0 });
    const [categorySpending, setCategorySpending] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [limitInput, setLimitInput] = useState('');
    const [categoryLimits, setCategoryLimits] = useState({});
    const [saving, setSaving] = useState(false);

    const loadData = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            const [budgetData, totalsData, spendingData, categoriesData] = await Promise.all([
                getBudget(user.uid, monthKey),
                getMonthlyTotals(user.uid, monthKey),
                getMonthlySpentByCategory(user.uid, monthKey),
                getCategories(user.uid),
            ]);

            setBudget(budgetData);
            setTotals(totalsData);
            setCategorySpending(spendingData);
            setAllCategories(categoriesData);
            setLimitInput(budgetData?.overallLimit?.toString() || '');
            setCategoryLimits(budgetData?.categoryLimits || {});
        } catch (err) {
            console.error('Failed to load budget data:', err);
        } finally {
            setLoading(false);
        }
    }, [user, monthKey]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleSaveBudget = async () => {
        if (!user) return;

        const limit = parseFloat(limitInput);
        // Allow 0 or empty for no overall limit, but let's assume valid overall input is preferred
        const overall = isNaN(limit) ? 0 : limit;

        setSaving(true);
        try {
            const dataToSave = {
                overallLimit: overall,
                categoryLimits: categoryLimits
            };
            await upsertBudget(user.uid, monthKey, dataToSave);
            setBudget({ ...budget, ...dataToSave, monthKey });
            setEditing(false);
        } catch (err) {
            Alert.alert('Error', 'Failed to save budget');
        } finally {
            setSaving(false);
        }
    };

    const handleCategoryLimitChange = (categoryId, value) => {
        const num = parseFloat(value);
        setCategoryLimits(prev => ({
            ...prev,
            [categoryId]: isNaN(num) ? 0 : num
        }));
    };

    const hasBudget = budget?.overallLimit > 0;
    const hasCategoryBudgets = Object.keys(budget?.categoryLimits || {}).some(k => budget.categoryLimits[k] > 0);

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

            {loading ? (
                <View style={[styles.centerContainer, { backgroundColor: theme.colors.bg }]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
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
                                        {formatPrice(totals.income)}
                                    </AppText>
                                </View>
                                <View style={[styles.summaryItem, styles.centerItem]}>
                                    <AppText variant="caption" muted>Expense</AppText>
                                    <AppText variant="h2" color={theme.colors.danger}>
                                        {formatPrice(totals.expense)}
                                    </AppText>
                                </View>
                                <View style={[styles.summaryItem, styles.rightItem]}>
                                    <AppText variant="caption" muted>Net</AppText>
                                    <AppText
                                        variant="h2"
                                        color={totals.net >= 0 ? theme.colors.success : theme.colors.danger}
                                    >
                                        {formatPrice(totals.net)}
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
                                    <AppText variant="caption" muted style={{ marginBottom: 8 }}>Overall Monthly Limit</AppText>
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

                                    <AppText variant="h2" style={{ marginTop: 16, marginBottom: 12 }}>Category Limits</AppText>
                                    {allCategories.map(cat => (
                                        <View key={cat.id} style={styles.categoryLimitRow}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <View style={[styles.miniIcon, { backgroundColor: theme.colors.chipBg }]}>
                                                    <Ionicons name={cat.icon || 'pricetag-outline'} size={14} color={theme.colors.primary} />
                                                </View>
                                                <AppText variant="body">{cat.name}</AppText>
                                            </View>
                                            <TextInput
                                                style={[styles.smallInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                                                value={categoryLimits[cat.id]?.toString() || ''}
                                                onChangeText={(v) => handleCategoryLimitChange(cat.id, v)}
                                                placeholder="No limit"
                                                placeholderTextColor={theme.colors.mutedText}
                                                keyboardType="decimal-pad"
                                            />
                                        </View>
                                    ))}

                                    <AppButton
                                        title="Save Budgets"
                                        onPress={handleSaveBudget}
                                        loading={saving}
                                        style={styles.saveButton}
                                    />
                                </View>
                            ) : (hasBudget || hasCategoryBudgets) ? (
                                <View>
                                    {hasBudget && (
                                        <BudgetProgressBar
                                            spent={totals.expense}
                                            limit={budget.overallLimit}
                                        />
                                    )}

                                    {hasCategoryBudgets && (
                                        <View style={{ marginTop: 24 }}>
                                            <AppText variant="h3" style={{ marginBottom: 12 }}>Category Budgets</AppText>
                                            {allCategories
                                                .filter(cat => (budget.categoryLimits?.[cat.id] || 0) > 0)
                                                .map(cat => {
                                                    const limit = budget.categoryLimits[cat.id];
                                                    const spent = categorySpending.find(s => s.categoryId === cat.id)?.amount || 0;
                                                    return (
                                                        <View key={cat.id} style={{ marginBottom: 16 }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                                                <AppText variant="body">{cat.name}</AppText>
                                                            </View>
                                                            <BudgetProgressBar
                                                                spent={spent}
                                                                limit={limit}
                                                                height={8}
                                                            />
                                                        </View>
                                                    );
                                                })}
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.noBudget}>
                                    <Ionicons name="wallet-outline" size={48} color={theme.colors.mutedText} />
                                    <AppText variant="body" muted style={styles.noBudgetText}>
                                        No budgets set for this month
                                    </AppText>
                                    <AppButton
                                        title="Set Budget"
                                        onPress={() => setEditing(true)}
                                        variant="secondary"
                                    />
                                </View>
                            )}
                        </AppCard>

                        {/* Top Spending Categories (Analytic View) */}
                        {!editing && categorySpending.length > 0 && (
                            <AppCard>
                                <AppText variant="h2" style={styles.sectionTitle}>Spending Breakdown</AppText>
                                {categorySpending.map((cat, index) => (
                                    <View key={cat.categoryId} style={styles.categoryRow}>
                                        <View style={styles.categoryInfo}>
                                            <AppText variant="body">{cat.categoryName}</AppText>
                                            <AppText variant="caption" muted>
                                                {cat.percentage.toFixed(1)}%
                                            </AppText>
                                        </View>
                                        <AppText variant="body" style={styles.categoryAmount}>
                                            {formatPrice(cat.amount)}
                                        </AppText>
                                    </View>
                                ))}
                            </AppCard>
                        )}

                        <View style={styles.bottomPadding} />
                    </ScrollView>
                </View>
            )}
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
    categoryLimitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    miniIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
    smallInput: { borderWidth: 1, borderRadius: 8, padding: 8, width: 100, textAlign: 'right' },
    bottomPadding: { height: 24 },
});
