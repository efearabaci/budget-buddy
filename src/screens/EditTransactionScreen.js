import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { AppText, TransactionForm } from '../components';
import { updateTransaction, deleteTransaction } from '../services/transactions';
import { getCategories } from '../services/firestore';

/**
 * Edit Transaction screen
 */
export default function EditTransactionScreen({ navigation, route }) {
    const { transaction } = route.params;
    const { theme } = useTheme();
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        getCategories(user.uid).then(setCategories);
    }, [user]);

    const handleSubmit = async (data) => {
        if (!user) return;

        setLoading(true);
        try {
            await updateTransaction(user.uid, transaction.id, data);
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', 'Failed to update transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
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
                            await deleteTransaction(user.uid, transaction.id);
                            navigation.goBack();
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete transaction');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText variant="h2">Edit Transaction</AppText>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={24} color={theme.colors.danger} />
                </TouchableOpacity>
            </View>

            <TransactionForm
                initialData={transaction}
                categories={categories}
                onSubmit={handleSubmit}
                loading={loading}
                submitLabel="Update Transaction"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    closeButton: { padding: 4 },
    deleteButton: { padding: 4 },
});
