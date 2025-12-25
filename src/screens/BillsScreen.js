import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppText, Chip } from '../components';

/**
 * Bills tracking screen
 * Shows upcoming, overdue, and paid bills
 * @param {{ navigation: Object }} props
 */
export default function BillsScreen({ navigation }) {
    const { theme } = useTheme();
    const [selectedFilter, setSelectedFilter] = useState('Upcoming');

    const filters = ['Upcoming', 'Overdue', 'Paid'];

    // Placeholder bill data
    const bills = [
        { id: '1', name: 'Netflix', amount: 15.99, dueDate: 'Dec 28', status: 'upcoming', recurring: true, icon: 'play-circle-outline' },
        { id: '2', name: 'Electricity', amount: 95.00, dueDate: 'Jan 1', status: 'upcoming', recurring: true, icon: 'flash-outline' },
        { id: '3', name: 'Internet', amount: 59.99, dueDate: 'Jan 5', status: 'upcoming', recurring: true, icon: 'wifi-outline' },
        { id: '4', name: 'Phone Bill', amount: 45.00, dueDate: 'Dec 20', status: 'overdue', recurring: true, icon: 'phone-portrait-outline' },
        { id: '5', name: 'Gym Membership', amount: 29.99, dueDate: 'Dec 15', status: 'paid', recurring: true, icon: 'fitness-outline' },
        { id: '6', name: 'Car Insurance', amount: 150.00, dueDate: 'Dec 10', status: 'paid', recurring: false, icon: 'car-outline' },
    ];

    const filteredBills = bills.filter(bill =>
        selectedFilter.toLowerCase() === bill.status
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'overdue':
                return theme.colors.danger;
            case 'paid':
                return theme.colors.success;
            default:
                return theme.colors.warning;
        }
    };

    const renderBill = (bill) => (
        <View key={bill.id} style={styles.billRow}>
            <View style={[styles.billIcon, { backgroundColor: theme.colors.chipBg }]}>
                <Ionicons name={bill.icon} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.billInfo}>
                <View style={styles.billHeader}>
                    <AppText variant="body">{bill.name}</AppText>
                    {bill.recurring && (
                        <Ionicons name="repeat" size={14} color={theme.colors.mutedText} style={styles.recurringIcon} />
                    )}
                </View>
                <AppText variant="caption" muted>
                    Due {bill.dueDate}
                </AppText>
            </View>
            <View style={styles.billAmount}>
                <AppText variant="body">${bill.amount.toFixed(2)}</AppText>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) + '20' }]}>
                    <AppText variant="caption" color={getStatusColor(bill.status)} style={styles.statusText}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </AppText>
                </View>
            </View>
        </View>
    );

    // Calculate summary stats
    const totalUpcoming = bills
        .filter(b => b.status === 'upcoming')
        .reduce((sum, b) => sum + b.amount, 0);
    const overdueCount = bills.filter(b => b.status === 'overdue').length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="h2">Bills</AppText>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add-circle-outline" size={28} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
                <AppCard style={[styles.summaryCard, { flex: 1, marginRight: 8 }]}>
                    <AppText variant="caption" muted>Due This Month</AppText>
                    <AppText variant="h2">${totalUpcoming.toFixed(2)}</AppText>
                </AppCard>
                <AppCard style={[styles.summaryCard, { flex: 1, marginLeft: 8 }]}>
                    <AppText variant="caption" muted>Overdue</AppText>
                    <AppText variant="h2" color={overdueCount > 0 ? theme.colors.danger : theme.colors.text}>
                        {overdueCount} {overdueCount === 1 ? 'bill' : 'bills'}
                    </AppText>
                </AppCard>
            </View>

            {/* Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                {filters.map((filter) => (
                    <Chip
                        key={filter}
                        label={filter}
                        selected={selectedFilter === filter}
                        onPress={() => setSelectedFilter(filter)}
                    />
                ))}
            </ScrollView>

            {/* Bills List */}
            <ScrollView
                style={styles.listContainer}
                showsVerticalScrollIndicator={false}
            >
                <AppCard>
                    {filteredBills.length > 0 ? (
                        filteredBills.map(renderBill)
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-circle-outline" size={48} color={theme.colors.success} />
                            <AppText variant="body" muted style={styles.emptyText}>
                                No {selectedFilter.toLowerCase()} bills
                            </AppText>
                        </View>
                    )}
                </AppCard>
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
    addButton: {
        padding: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    summaryCard: {
        marginBottom: 8,
    },
    filterContainer: {
        maxHeight: 50,
        marginBottom: 8,
    },
    filterContent: {
        paddingHorizontal: 16,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    billRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    billIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    billInfo: {
        flex: 1,
    },
    billHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recurringIcon: {
        marginLeft: 6,
    },
    billAmount: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        marginTop: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        marginTop: 12,
    },
});
