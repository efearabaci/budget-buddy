import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppButton, AppText, AppInput, Chip } from '../components';

/**
 * Add Transaction screen
 * @param {{ navigation: Object, route: Object }} props
 */
export default function AddTransactionScreen({ navigation }) {
    const { theme } = useTheme();
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { id: '1', name: 'Food & Dining', icon: 'restaurant-outline' },
        { id: '2', name: 'Shopping', icon: 'cart-outline' },
        { id: '3', name: 'Transport', icon: 'car-outline' },
        { id: '4', name: 'Entertainment', icon: 'game-controller-outline' },
        { id: '5', name: 'Bills', icon: 'receipt-outline' },
        { id: '6', name: 'Health', icon: 'medical-outline' },
        { id: '7', name: 'Salary', icon: 'cash-outline' },
        { id: '8', name: 'Other', icon: 'ellipsis-horizontal-outline' },
    ];

    const handleSave = () => {
        // TODO: Save to Firestore
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText variant="h2">Add Transaction</AppText>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Type Toggle */}
                <View style={styles.typeToggle}>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            type === 'expense' && { backgroundColor: theme.colors.danger },
                            { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
                        ]}
                        onPress={() => setType('expense')}
                    >
                        <AppText
                            variant="body"
                            color={type === 'expense' ? '#FFFFFF' : theme.colors.text}
                            style={{ fontWeight: '600' }}
                        >
                            Expense
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            type === 'income' && { backgroundColor: theme.colors.success },
                            { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
                        ]}
                        onPress={() => setType('income')}
                    >
                        <AppText
                            variant="body"
                            color={type === 'income' ? '#FFFFFF' : theme.colors.text}
                            style={{ fontWeight: '600' }}
                        >
                            Income
                        </AppText>
                    </TouchableOpacity>
                </View>

                {/* Amount Input */}
                <AppCard style={styles.amountCard}>
                    <AppText variant="caption" muted style={styles.amountLabel}>Amount</AppText>
                    <View style={styles.amountRow}>
                        <AppText variant="title" color={type === 'income' ? theme.colors.success : theme.colors.danger}>
                            $
                        </AppText>
                        <AppInput
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            style={styles.amountInput}
                        />
                    </View>
                </AppCard>

                {/* Details */}
                <AppCard>
                    <AppInput
                        label="Title"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="What was this for?"
                    />
                    <AppInput
                        label="Note (optional)"
                        value={note}
                        onChangeText={setNote}
                        placeholder="Add a note..."
                    />
                </AppCard>

                {/* Category Selection */}
                <AppCard>
                    <AppText variant="h2" style={styles.sectionTitle}>Category</AppText>
                    <View style={styles.categoryGrid}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryItem,
                                    { backgroundColor: selectedCategory === category.id ? theme.colors.primary : theme.colors.chipBg },
                                ]}
                                onPress={() => setSelectedCategory(category.id)}
                            >
                                <Ionicons
                                    name={category.icon}
                                    size={24}
                                    color={selectedCategory === category.id ? '#FFFFFF' : theme.colors.text}
                                />
                                <AppText
                                    variant="caption"
                                    color={selectedCategory === category.id ? '#FFFFFF' : theme.colors.text}
                                    style={styles.categoryLabel}
                                >
                                    {category.name}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </AppCard>

                {/* Save Button */}
                <AppButton
                    title="Save Transaction"
                    onPress={handleSave}
                    style={styles.saveButton}
                />
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
    backButton: {
        padding: 4,
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    typeToggle: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
    },
    amountCard: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    amountLabel: {
        marginBottom: 8,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountInput: {
        marginBottom: 0,
        fontSize: 32,
        fontWeight: '700',
    },
    sectionTitle: {
        marginBottom: 16,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    categoryItem: {
        width: '23%',
        margin: '1%',
        aspectRatio: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    categoryLabel: {
        marginTop: 4,
        textAlign: 'center',
        fontSize: 11,
    },
    saveButton: {
        marginTop: 16,
        marginBottom: 32,
    },
});
