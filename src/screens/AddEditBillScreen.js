import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { AppCard, AppButton, AppText, AppInput } from '../components';
import { createBill, updateBill, deleteBill } from '../services/bills';
import { formatDate } from '../utils/format';

/**
 * Add/Edit Bill screen
 */
export default function AddEditBillScreen({ navigation, route }) {
    const existingBill = route.params?.bill;
    const isEditing = !!existingBill;

    const { theme } = useTheme();
    const { user } = useAuth();

    const [name, setName] = useState(existingBill?.name || '');
    const [amount, setAmount] = useState(existingBill?.amount?.toString() || '');
    const [dueDate, setDueDate] = useState(
        existingBill?.dueDate?.toDate?.() || existingBill?.dueDate || new Date()
    );
    const [recurring, setRecurring] = useState(existingBill?.recurring || 'none');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValid = name.trim() && amount && parseFloat(amount) > 0;

    const handleSubmit = async () => {
        if (!isValid || !user) return;

        setLoading(true);
        try {
            const data = {
                name: name.trim(),
                amount: parseFloat(amount),
                dueDate,
                recurring,
            };

            if (isEditing) {
                await updateBill(user.uid, existingBill.id, data);
            } else {
                await createBill(user.uid, data);
            }
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'create'} bill`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Bill',
            'Are you sure you want to delete this bill?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteBill(user.uid, existingBill.id);
                            navigation.goBack();
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete bill');
                        }
                    },
                },
            ]
        );
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDueDate(selectedDate);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText variant="h2">{isEditing ? 'Edit Bill' : 'Add Bill'}</AppText>
                {isEditing ? (
                    <TouchableOpacity onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={24} color={theme.colors.danger} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} />
                )}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <AppCard>
                    <AppInput
                        label="Bill Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g., Netflix, Electricity"
                    />

                    <AppInput
                        label="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                    />
                </AppCard>

                <AppCard>
                    <AppText variant="caption" muted style={styles.label}>Due Date</AppText>
                    <TouchableOpacity
                        style={[styles.dateButton, { borderColor: theme.colors.border }]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color={theme.colors.mutedText} />
                        <AppText variant="body" style={styles.dateText}>{formatDate(dueDate)}</AppText>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dueDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </AppCard>

                <AppCard>
                    <AppText variant="caption" muted style={styles.label}>Recurring</AppText>
                    <View style={styles.recurringRow}>
                        <TouchableOpacity
                            style={[
                                styles.recurringButton,
                                {
                                    backgroundColor: recurring === 'none'
                                        ? theme.colors.primary
                                        : theme.colors.chipBg
                                },
                            ]}
                            onPress={() => setRecurring('none')}
                        >
                            <AppText
                                variant="body"
                                color={recurring === 'none' ? '#FFFFFF' : theme.colors.text}
                            >
                                One-time
                            </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.recurringButton,
                                {
                                    backgroundColor: recurring === 'monthly'
                                        ? theme.colors.primary
                                        : theme.colors.chipBg,
                                    marginLeft: 12,
                                },
                            ]}
                            onPress={() => setRecurring('monthly')}
                        >
                            <Ionicons
                                name="repeat"
                                size={16}
                                color={recurring === 'monthly' ? '#FFFFFF' : theme.colors.text}
                                style={{ marginRight: 6 }}
                            />
                            <AppText
                                variant="body"
                                color={recurring === 'monthly' ? '#FFFFFF' : theme.colors.text}
                            >
                                Monthly
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </AppCard>

                <AppButton
                    title={isEditing ? 'Update Bill' : 'Add Bill'}
                    onPress={handleSubmit}
                    disabled={!isValid}
                    loading={loading}
                    style={styles.submitButton}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    content: { flex: 1, paddingHorizontal: 16 },
    label: { marginBottom: 8 },
    dateButton: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1 },
    dateText: { marginLeft: 8 },
    recurringRow: { flexDirection: 'row' },
    recurringButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
    submitButton: { marginVertical: 24 },
});
