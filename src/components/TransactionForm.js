import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../hooks/useTheme';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { AppInput } from './AppInput';
import { formatDate } from '../utils/format';

/**
 * Transaction form component (reusable for add/edit)
 */
export const TransactionForm = ({
    initialData = {},
    categories = [],
    onSubmit,
    onCancel,
    loading = false,
    submitLabel = 'Save',
}) => {
    const { theme } = useTheme();

    const [type, setType] = useState(initialData.type || 'expense');
    const [amount, setAmount] = useState(initialData.amount?.toString() || '');
    const [categoryId, setCategoryId] = useState(initialData.categoryId || '');
    const [date, setDate] = useState(
        initialData.date?.toDate?.() || initialData.date || new Date()
    );
    const [note, setNote] = useState(initialData.note || '');
    const [paymentMethod, setPaymentMethod] = useState(initialData.paymentMethod || 'card');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const isValid = amount && parseFloat(amount) > 0 && categoryId;

    const handleSubmit = () => {
        if (!isValid) return;

        const selectedCategory = categories.find(c => c.id === categoryId);

        onSubmit({
            type,
            amount: parseFloat(amount),
            categoryId,
            categoryNameSnapshot: selectedCategory?.name || '',
            date,
            note,
            paymentMethod,
        });
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Type Toggle */}
            <View style={styles.typeToggle}>
                <TouchableOpacity
                    style={[
                        styles.typeButton,
                        { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
                        type === 'expense' && { backgroundColor: theme.colors.danger },
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
                        { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
                        type === 'income' && { backgroundColor: theme.colors.success },
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

            {/* Amount */}
            <AppCard style={styles.amountCard}>
                <AppText variant="caption" muted>Amount</AppText>
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

            {/* Category Selection */}
            <AppCard>
                <AppText variant="h2" style={styles.sectionTitle}>Category</AppText>
                <View style={styles.categoryGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryItem,
                                {
                                    backgroundColor: categoryId === cat.id
                                        ? theme.colors.primary
                                        : theme.colors.chipBg
                                },
                            ]}
                            onPress={() => setCategoryId(cat.id)}
                        >
                            <Ionicons
                                name={cat.icon || 'ellipsis-horizontal-outline'}
                                size={24}
                                color={categoryId === cat.id ? '#FFFFFF' : theme.colors.text}
                            />
                            <AppText
                                variant="caption"
                                color={categoryId === cat.id ? '#FFFFFF' : theme.colors.text}
                                style={styles.categoryLabel}
                                numberOfLines={1}
                            >
                                {cat.name}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            </AppCard>

            {/* Date */}
            <AppCard>
                <AppText variant="caption" muted style={styles.label}>Date</AppText>
                <TouchableOpacity
                    style={[styles.dateButton, { borderColor: theme.colors.border }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Ionicons name="calendar-outline" size={20} color={theme.colors.mutedText} />
                    <AppText variant="body" style={styles.dateText}>{formatDate(date)}</AppText>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </AppCard>

            {/* Payment Method */}
            <AppCard>
                <AppText variant="caption" muted style={styles.label}>Payment Method</AppText>
                <View style={styles.paymentRow}>
                    <TouchableOpacity
                        style={[
                            styles.paymentButton,
                            {
                                backgroundColor: paymentMethod === 'card'
                                    ? theme.colors.primary
                                    : theme.colors.chipBg
                            },
                        ]}
                        onPress={() => setPaymentMethod('card')}
                    >
                        <Ionicons
                            name="card-outline"
                            size={20}
                            color={paymentMethod === 'card' ? '#FFFFFF' : theme.colors.text}
                        />
                        <AppText
                            variant="body"
                            color={paymentMethod === 'card' ? '#FFFFFF' : theme.colors.text}
                            style={{ marginLeft: 8 }}
                        >
                            Card
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.paymentButton,
                            {
                                backgroundColor: paymentMethod === 'cash'
                                    ? theme.colors.primary
                                    : theme.colors.chipBg,
                                marginLeft: 12,
                            },
                        ]}
                        onPress={() => setPaymentMethod('cash')}
                    >
                        <Ionicons
                            name="cash-outline"
                            size={20}
                            color={paymentMethod === 'cash' ? '#FFFFFF' : theme.colors.text}
                        />
                        <AppText
                            variant="body"
                            color={paymentMethod === 'cash' ? '#FFFFFF' : theme.colors.text}
                            style={{ marginLeft: 8 }}
                        >
                            Cash
                        </AppText>
                    </TouchableOpacity>
                </View>
            </AppCard>

            {/* Note */}
            <AppCard>
                <AppInput
                    label="Note (optional)"
                    value={note}
                    onChangeText={setNote}
                    placeholder="Add a note..."
                />
            </AppCard>

            {/* Buttons */}
            <View style={styles.buttons}>
                <AppButton
                    title={submitLabel}
                    onPress={handleSubmit}
                    disabled={!isValid}
                    loading={loading}
                    style={styles.submitButton}
                />
                {onCancel && (
                    <AppButton
                        title="Cancel"
                        onPress={onCancel}
                        variant="secondary"
                        style={styles.cancelButton}
                    />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    typeToggle: { flexDirection: 'row', marginBottom: 16 },
    typeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#E5E7EB' },
    amountCard: { alignItems: 'center', paddingVertical: 24 },
    amountRow: { flexDirection: 'row', alignItems: 'center' },
    amountInput: { marginBottom: 0, fontSize: 32, fontWeight: '700', minWidth: 100 },
    sectionTitle: { marginBottom: 16 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
    categoryItem: { width: '23%', margin: '1%', aspectRatio: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 8 },
    categoryLabel: { marginTop: 4, textAlign: 'center', fontSize: 11 },
    label: { marginBottom: 8 },
    dateButton: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1 },
    dateText: { marginLeft: 8 },
    paymentRow: { flexDirection: 'row' },
    paymentButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
    buttons: { marginVertical: 24 },
    submitButton: { marginBottom: 12 },
    cancelButton: {},
});
