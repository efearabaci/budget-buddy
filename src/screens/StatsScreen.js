import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppText, Chip, ProgressBar } from '../components';

/**
 * Stats/Analytics screen
 */
export default function StatsScreen({ navigation }) {
    const { theme } = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState('This Month');

    const periods = ['This Week', 'This Month', 'This Year'];
    const totalSpending = 3120.50;

    const categoryBreakdown = [
        { name: 'Food & Dining', amount: 850, percentage: 0.27, color: '#FF6B6B' },
        { name: 'Shopping', amount: 620, percentage: 0.20, color: '#4ECDC4' },
        { name: 'Transport', amount: 380, percentage: 0.12, color: '#45B7D1' },
        { name: 'Bills', amount: 650, percentage: 0.21, color: '#FFEAA7' },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            <View style={styles.header}>
                <AppText variant="h2">Statistics</AppText>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {periods.map((period) => (
                        <Chip
                            key={period}
                            label={period}
                            selected={selectedPeriod === period}
                            onPress={() => setSelectedPeriod(period)}
                        />
                    ))}
                </ScrollView>

                <AppCard style={styles.statCard}>
                    <AppText variant="caption" muted>Total Spent</AppText>
                    <AppText variant="h2" color={theme.colors.danger}>${totalSpending.toFixed(2)}</AppText>
                </AppCard>

                <AppCard>
                    <AppText variant="h2" style={styles.sectionTitle}>By Category</AppText>
                    {categoryBreakdown.map((category, index) => (
                        <View key={index} style={styles.categoryRow}>
                            <AppText variant="body" style={{ flex: 1 }}>{category.name}</AppText>
                            <AppText variant="body">${category.amount.toFixed(2)}</AppText>
                        </View>
                    ))}
                </AppCard>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingVertical: 12 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
    statCard: { marginTop: 16 },
    sectionTitle: { marginBottom: 16 },
    categoryRow: { flexDirection: 'row', paddingVertical: 8 },
});
