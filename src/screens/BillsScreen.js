import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { AppText, EmptyState } from '../components';
import { BillCard } from '../components/BillCard';
import { listenBills, markBillPaid, markBillUnpaid } from '../services/bills';
import { groupBillsByStatus } from '../utils/bills';

/**
 * Bills screen with sectioned list
 */
export default function BillsScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = listenBills(user.uid, (data) => {
            setBills(data);
            setLoading(false);
        });

        return unsubscribe;
    }, [user]);

    const groups = groupBillsByStatus(bills);

    const handleMarkPaid = async (bill) => {
        try {
            await markBillPaid(user.uid, bill.id, bill);
        } catch (err) {
            console.error('Failed to mark bill paid:', err);
        }
    };

    const handleMarkUnpaid = async (bill) => {
        try {
            await markBillUnpaid(user.uid, bill.id);
        } catch (err) {
            console.error('Failed to mark bill unpaid:', err);
        }
    };

    const handleEdit = (bill) => {
        navigation.navigate('AddEditBill', { bill });
    };

    const handleAdd = () => {
        navigation.navigate('AddEditBill', {});
    };

    const renderSection = (title, billsList, icon, emptyText) => {
        if (billsList.length === 0) return null;

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name={icon} size={18} color={theme.colors.mutedText} />
                    <AppText variant="caption" muted style={styles.sectionTitle}>
                        {title} ({billsList.length})
                    </AppText>
                </View>
                {billsList.map((bill) => (
                    <BillCard
                        key={bill.id}
                        bill={bill}
                        onPress={() => handleEdit(bill)}
                        onMarkPaid={() => handleMarkPaid(bill)}
                        onMarkUnpaid={() => handleMarkUnpaid(bill)}
                    />
                ))}
            </View>
        );
    };

    const totalDue = [...groups.overdue, ...groups.dueSoon, ...groups.upcoming]
        .reduce((sum, b) => sum + b.amount, 0);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="h2">Bills</AppText>
                <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                    <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Summary */}
            <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }, theme.shadows.card]}>
                <View style={styles.summaryRow}>
                    <View>
                        <AppText variant="caption" muted>Total Due</AppText>
                        <AppText variant="title">${totalDue.toFixed(2)}</AppText>
                    </View>
                    <View style={styles.summaryStats}>
                        {groups.overdue.length > 0 && (
                            <View style={[styles.statBadge, { backgroundColor: theme.colors.danger + '20' }]}>
                                <AppText variant="caption" color={theme.colors.danger}>
                                    {groups.overdue.length} Overdue
                                </AppText>
                            </View>
                        )}
                        {groups.dueSoon.length > 0 && (
                            <View style={[styles.statBadge, { backgroundColor: theme.colors.warning + '20' }]}>
                                <AppText variant="caption" color={theme.colors.warning}>
                                    {groups.dueSoon.length} Due Soon
                                </AppText>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Bills List */}
            {bills.length > 0 ? (
                <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                    {renderSection('OVERDUE', groups.overdue, 'alert-circle-outline')}
                    {renderSection('DUE SOON', groups.dueSoon, 'time-outline')}
                    {renderSection('UPCOMING', groups.upcoming, 'calendar-outline')}
                    {renderSection('PAID', groups.paid, 'checkmark-circle-outline')}
                    <View style={styles.bottomPadding} />
                </ScrollView>
            ) : (
                <View style={styles.empty}>
                    <EmptyState
                        icon="receipt-outline"
                        title="No bills yet"
                        subtitle={loading ? 'Loading...' : 'Add your first bill to track'}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    addButton: { padding: 4 },
    summaryCard: { marginHorizontal: 16, padding: 16, borderRadius: 16, marginBottom: 16 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryStats: { flexDirection: 'row', gap: 8 },
    statBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
    list: { flex: 1, paddingHorizontal: 16 },
    section: { marginBottom: 8 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 8 },
    sectionTitle: { marginLeft: 6, fontWeight: '600' },
    empty: { flex: 1, justifyContent: 'center' },
    bottomPadding: { height: 24 },
});
