import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip } from './Chip';
import { useTheme } from '../hooks/useTheme';

/**
 * Filter chips component for transactions
 * @deprecated Use UnifiedFilterList instead
 */
export const FilterChips = ({
    filters,
    activeFilters,
    onFilterChange,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {filters.map((filter) => (
                <Chip
                    key={filter.key}
                    label={filter.label}
                    selected={activeFilters[filter.filterKey] === filter.value}
                    onPress={() => onFilterChange(filter.filterKey, filter.value)}
                />
            ))}
        </ScrollView>
    );
};

/**
 * Type filter chips
 * @deprecated Use UnifiedFilterList instead
 */
export const TypeFilterChips = ({ selected, onSelect }) => {
    const types = [
        { key: 'all', label: 'All', value: 'all' },
        { key: 'income', label: 'Income', value: 'income' },
        { key: 'expense', label: 'Expense', value: 'expense' },
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {types.map((type) => (
                <Chip
                    key={type.key}
                    label={type.label}
                    selected={selected === type.value}
                    onPress={() => onSelect(type.value)}
                />
            ))}
        </ScrollView>
    );
};

/**
 * Payment method filter chips
 * @deprecated Use UnifiedFilterList instead
 */
export const PaymentFilterChips = ({ selected, onSelect }) => {
    const methods = [
        { key: 'all', label: 'All', value: 'all' },
        { key: 'cash', label: 'Cash', value: 'cash' },
        { key: 'card', label: 'Card', value: 'card' },
    ];

    return (
        <View style={styles.row}>
            {methods.map((method) => (
                <Chip
                    key={method.key}
                    label={method.label}
                    selected={selected === method.value}
                    onPress={() => onSelect(method.value)}
                />
            ))}
        </View>
    );
};

const Divider = () => {
    const { theme } = useTheme();
    return (
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
    );
};

/**
 * Unified filter list containing all filter types
 */
export const UnifiedFilterList = ({
    typeFilter,
    setTypeFilter,
    paymentMethod,
    setPaymentMethod,
    categoryId,
    setCategoryId,
    categories = []
}) => {

    // Type definitions
    const types = [
        { key: 'all_type', label: 'All', value: 'all' },
        { key: 'income', label: 'Income', value: 'income' },
        { key: 'expense', label: 'Expense', value: 'expense' },
    ];

    // Payment definitions
    const methods = [
        { key: 'all_payment', label: 'All', value: 'all' },
        { key: 'cash', label: 'Cash', value: 'cash' },
        { key: 'card', label: 'Card', value: 'card' },
    ];

    // Category definitions
    const categoryFilters = [
        { key: 'all_cat', label: 'All Categories', value: null },
        ...categories.map(c => ({
            key: c.id,
            label: c.name,
            value: c.id,
        }))
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {/* Type Filters */}
            {types.map((type) => (
                <Chip
                    key={type.key}
                    label={type.label}
                    selected={typeFilter === type.value}
                    onPress={() => setTypeFilter(type.value)}
                    style={styles.compactChip}
                />
            ))}

            <Divider />

            {/* Payment Filters */}
            {methods.map((method) => (
                <Chip
                    key={method.key}
                    label={method.label}
                    selected={paymentMethod === method.value}
                    onPress={() => setPaymentMethod(method.value)}
                    style={styles.compactChip}
                />
            ))}

            <Divider />

            {/* Category Filters */}
            {categoryFilters.map((cat) => (
                <Chip
                    key={cat.key}
                    label={cat.label}
                    selected={categoryId === cat.value}
                    onPress={() => setCategoryId(cat.value)}
                    style={styles.compactChip}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        maxHeight: 50, // Reduced height
        flexGrow: 0,
        marginBottom: 8,
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 4, // Tighter padding
        alignItems: 'center', // Center vertically
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    divider: {
        width: 1,
        height: 20,
        marginHorizontal: 8,
        marginRight: 16, // Extra space after divider for next group
    },
    compactChip: {
        marginBottom: 0,
        height: 32,
        minHeight: 32,
        minWidth: 72, // Make chips a bit longer
        paddingHorizontal: 16, // Slightly more padding
    }
});
