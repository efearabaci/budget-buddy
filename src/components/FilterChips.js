import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip } from './Chip';

/**
 * Filter chips component for transactions
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

const styles = StyleSheet.create({
    container: {
        maxHeight: 50,
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
