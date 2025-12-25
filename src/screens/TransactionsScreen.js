import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppText, AppInput, Chip } from '../components';

/**
 * Transactions list screen
 * Shows all transactions with search and filter
 * @param {{ navigation: Object }} props
 */
export default function TransactionsScreen({ navigation }) {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');

    const filters = ['All', 'Income', 'Expense', 'This Month'];

    // Placeholder transaction data
    const transactions = [
        { id: '1', title: 'Grocery Store', category: 'Food & Dining', amount: -85.50, type: 'expense', date: 'Today', time: '2:30 PM', icon: 'cart-outline' },
        { id: '2', title: 'Salary Deposit', category: 'Income', amount: 3500.00, type: 'income', date: 'Today', time: '9:00 AM', icon: 'cash-outline' },
        { id: '3', title: 'Coffee Shop', category: 'Food & Dining', amount: -6.50, type: 'expense', date: 'Yesterday', time: '8:15 AM', icon: 'cafe-outline' },
        { id: '4', title: 'Gas Station', category: 'Transport', amount: -45.00, type: 'expense', date: 'Yesterday', time: '6:00 PM', icon: 'car-outline' },
        { id: '5', title: 'Freelance Payment', category: 'Income', amount: 750.00, type: 'income', date: 'Dec 22', time: '11:30 AM', icon: 'briefcase-outline' },
        { id: '6', title: 'Amazon Purchase', category: 'Shopping', amount: -129.99, type: 'expense', date: 'Dec 21', time: '3:45 PM', icon: 'bag-outline' },
    ];

    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {});

    const renderTransaction = (item) => (
        <View style={styles.transactionRow} key={item.id}>
            <View style={[styles.transactionIcon, { backgroundColor: theme.colors.chipBg }]}>
                <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.type === 'income' ? theme.colors.success : theme.colors.danger}
                />
            </View>
            <View style={styles.transactionInfo}>
                <AppText variant="body">{item.title}</AppText>
                <AppText variant="caption" muted>{item.category} • {item.time}</AppText>
            </View>
            <AppText
                variant="body"
                color={item.type === 'income' ? theme.colors.success : theme.colors.danger}
            >
                {item.type === 'income' ? '+' : ''}{item.amount.toFixed(2)}
            </AppText>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="h2">Transactions</AppText>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <Ionicons name="search-outline" size={20} color={theme.colors.mutedText} />
                    <AppInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search transactions..."
                        style={styles.searchInput}
                    />
                </View>
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

            {/* Transactions List */}
            <ScrollView
                style={styles.listContainer}
                showsVerticalScrollIndicator={false}
            >
                {Object.entries(groupedTransactions).map(([date, items]) => (
                    <View key={date}>
                        <AppText variant="caption" muted style={styles.dateHeader}>
                            {date.toUpperCase()}
                        </AppText>
                        <AppCard>
                            {items.map(renderTransaction)}
                        </AppCard>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginBottom: 0,
        marginLeft: 8,
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
    dateHeader: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    transactionInfo: {
        flex: 1,
    },
});
