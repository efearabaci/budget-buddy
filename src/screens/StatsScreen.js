import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { AppCard, AppText, EmptyState } from '../components';
import { MonthSelector } from '../components/MonthSelector';
import { getMonthlyTotals, getMonthlySpentByCategory } from '../services/analytics';
import { getMonthKey, getPreviousMonth, getNextMonth } from '../utils/month';
import { useCurrency } from '../hooks/useCurrency';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Stats/Analytics screen
 */
export default function StatsScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();

    const [monthKey, setMonthKey] = useState(getMonthKey());
    const [totals, setTotals] = useState({ income: 0, expense: 0, net: 0 });
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            const [totalsData, categoriesData] = await Promise.all([
                getMonthlyTotals(user.uid, monthKey),
                getMonthlySpentByCategory(user.uid, monthKey),
            ]);

            setTotals(totalsData);

            // Process category data for PieChart
            const colors = [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFEAA7', '#A8D8EA',
                '#FF9FF3', '#FDCB6E', '#55E6C1', '#D6A2E8', '#FDA7DF'
            ];

            const chartData = categoriesData.map((cat, index) => ({
                name: cat.categoryName,
                population: cat.amount,
                color: colors[index % colors.length],
                legendFontColor: theme.colors.text,
                legendFontSize: 12,
                percentage: cat.percentage
            }));

            setCategoryData(chartData);

        } catch (err) {
            console.error('Failed to load stats data:', err);
        } finally {
            setLoading(false);
        }
    }, [user, monthKey, theme.colors.text]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const chartConfig = {
        backgroundGradientFrom: theme.colors.bg,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: theme.colors.bg,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            <View style={styles.header}>
                <AppText variant="h2">Statistics</AppText>
            </View>

            <MonthSelector
                monthKey={monthKey}
                onPrevious={() => setMonthKey(getPreviousMonth(monthKey))}
                onNext={() => setMonthKey(getNextMonth(monthKey))}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
                ) : (
                    <>
                        <AppCard style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <View style={styles.summaryCol}>
                                    <AppText variant="caption" muted>Income</AppText>
                                    <AppText variant="h2" color={theme.colors.success}>
                                        {formatPrice(totals.income)}
                                    </AppText>
                                </View>
                                <View style={[styles.summaryCol, styles.rightAlign]}>
                                    <AppText variant="caption" muted>Expense</AppText>
                                    <AppText variant="h2" color={theme.colors.danger}>
                                        {formatPrice(totals.expense)}
                                    </AppText>
                                </View>
                            </View>
                        </AppCard>

                        {totals.expense > 0 ? (
                            <AppCard style={{ paddingHorizontal: 0 }}>
                                <AppText variant="h2" style={styles.sectionTitle}>Spending by Category</AppText>
                                <PieChart
                                    data={categoryData}
                                    width={SCREEN_WIDTH - 64}
                                    height={220}
                                    chartConfig={chartConfig}
                                    accessor={'population'}
                                    backgroundColor={"transparent"}
                                    paddingLeft={"15"}
                                    center={[0, 0]}
                                    absolute={false}
                                />
                                <View style={styles.legendContainer}>
                                    {categoryData.map((item, index) => (
                                        <View key={index} style={styles.legendRow}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                                <AppText variant="body" numberOfLines={1} style={{ marginLeft: 8 }}>
                                                    {item.name}
                                                </AppText>
                                            </View>
                                            <AppText variant="body" style={{ fontWeight: '600' }}>
                                                {item.percentage.toFixed(1)}%
                                            </AppText>
                                        </View>
                                    ))}
                                </View>
                            </AppCard>
                        ) : (
                            <EmptyState
                                icon="pie-chart-outline"
                                title="No expenses yet"
                                subtitle="Add expenses to see analytics"
                            />
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingVertical: 12 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
    summaryCard: { marginBottom: 16 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryCol: { flex: 1 },
    rightAlign: { alignItems: 'flex-end' },
    sectionTitle: { marginLeft: 16, marginBottom: 8 },
    legendContainer: { paddingHorizontal: 16, marginTop: 8 },
    legendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
    colorDot: { width: 12, height: 12, borderRadius: 6 },
});
