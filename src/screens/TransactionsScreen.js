import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, SectionList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { AppCard, AppText, TransactionRow, EmptyState } from '../components';
import { UnifiedFilterList } from '../components/FilterChips';
import { listenTransactionsByMonth, deleteTransaction } from '../services/transactions';
import { getCategories } from '../services/firestore';
import { getMonthKey, formatMonthDisplay, getPreviousMonth, getNextMonth } from '../utils/month';
import { groupTransactionsByDay, applyFilters } from '../utils/grouping';

/**
 * Transactions list screen with filtering and search
 */
export default function TransactionsScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();

    const [monthKey, setMonthKey] = useState(getMonthKey());
    const [transactions, setTransactions] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('all');
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    // Load categories
    useEffect(() => {
        if (!user) return;
        getCategories(user.uid).then(setCategories);
    }, [user]);

    // Subscribe to transactions for current month
    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const unsubscribe = listenTransactionsByMonth(user.uid, monthKey, (txs) => {
            setTransactions(txs);
            setLoading(false);
        });

        return unsubscribe;
    }, [user, monthKey]);

    // Get category map for quick lookup
    const categoryMap = useMemo(() => {
        const map = {};
        categories.forEach(c => { map[c.id] = c; });
        return map;
    }, [categories]);

    // Apply filters and group by day
    const filteredTransactions = useMemo(() => {
        return applyFilters(transactions, {
            type: typeFilter,
            search: searchQuery,
            categoryId,
            paymentMethod,
        });
    }, [transactions, typeFilter, searchQuery, categoryId, paymentMethod]);

    const sections = useMemo(() => {
        return groupTransactionsByDay(filteredTransactions);
    }, [filteredTransactions]);

    const handleDelete = (tx) => {
        Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTransaction(user.uid, tx.id);
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete transaction');
                        }
                    },
                },
            ]
        );
    };

    const handleEdit = (tx) => {
        navigation.navigate('EditTransaction', { transaction: tx });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="h2">Transactions</AppText>
            </View>

            {/* Month Selector */}
            <View style={styles.monthSelector}>
                <TouchableOpacity onPress={() => setMonthKey(getPreviousMonth(monthKey))}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText variant="body" style={styles.monthLabel}>
                    {formatMonthDisplay(monthKey)}
                </AppText>
                <TouchableOpacity onPress={() => setMonthKey(getNextMonth(monthKey))}>
                    <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <Ionicons name="search-outline" size={20} color={theme.colors.mutedText} />
                <TextInput
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search transactions..."
                    placeholderTextColor={theme.colors.mutedText}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={theme.colors.mutedText} />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Unified Filter List */}
            <View>
                <UnifiedFilterList
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    categories={categories}
                />
            </View>

            {/* Transactions List */}
            {sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    renderSectionHeader={({ section }) => (
                        <AppText variant="caption" muted style={styles.sectionHeader}>
                            {section.title}
                        </AppText>
                    )}
                    renderItem={({ item }) => {
                        const cat = categoryMap[item.categoryId];
                        return (
                            <AppCard style={styles.txCard}>
                                <TransactionRow
                                    transaction={item}
                                    categoryName={cat?.name || item.categoryNameSnapshot}
                                    categoryIcon={cat?.icon}
                                    onPress={() => handleEdit(item)}
                                    onLongPress={() => handleDelete(item)}
                                />
                            </AppCard>
                        );
                    }}
                />
            ) : (
                <View style={styles.empty}>
                    <EmptyState
                        icon="receipt-outline"
                        title="No transactions"
                        subtitle={loading ? 'Loading...' : 'Add your first transaction'}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingVertical: 12 },
    monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    monthLabel: { marginHorizontal: 16, fontWeight: '600' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
    list: { flex: 1 },
    listContent: { paddingHorizontal: 16, paddingBottom: 24 },
    sectionHeader: { marginTop: 16, marginBottom: 8, fontWeight: '600' },
    txCard: { marginBottom: 8, paddingVertical: 4 },
    empty: { flex: 1, justifyContent: 'center' },
});
