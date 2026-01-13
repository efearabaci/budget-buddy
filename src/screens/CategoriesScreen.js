import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { AppCard, AppText, AppButton, AppInput, EmptyState } from '../components';
import { queryCategories, listenCollection, addCategory, deleteCategory } from '../services/firestore';

const ICONS = [
    'basket-outline', 'cart-outline', 'car-outline', 'bus-outline',
    'home-outline', 'restaurant-outline', 'beer-outline', 'pizza-outline',
    'medical-outline', 'fitness-outline', 'game-controller-outline', 'ticket-outline',
    'shirt-outline', 'glasses-outline', 'school-outline', 'book-outline',
    'card-outline', 'cash-outline', 'gift-outline', 'wallet-outline',
    'paw-outline', 'construct-outline', 'bed-outline', 'airplane-outline',
    'wifi-outline', 'phone-portrait-outline', 'desktop-outline', 'bulb-outline'
];

export default function CategoriesScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // Form state
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const q = queryCategories(user.uid);
        const unsubscribe = listenCollection(q, (docs) => {
            setCategories(docs);
            setLoading(false);
        });

        return unsubscribe;
    }, [user]);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            Alert.alert('Error', 'Please enter a category name');
            return;
        }

        setSubmitting(true);
        try {
            await addCategory(user.uid, {
                name: newCategoryName.trim(),
                icon: selectedIcon,
                type: 'expense', // Default to expense for now, or we could add a toggle
                isDefault: false
            });
            setModalVisible(false);
            setNewCategoryName('');
            setSelectedIcon(ICONS[0]);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to add category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (category) => {
        if (category.isDefault) {
            Alert.alert('Cannot Delete', 'Default categories cannot be deleted.');
            return;
        }

        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete "${category.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteCategory(user.uid, category.id);
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete category');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={[styles.itemContainer, { borderBottomColor: theme.colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.chipBg }]}>
                <Ionicons name={item.icon || 'star-outline'} size={20} color={theme.colors.primary} />
            </View>
            <AppText variant="body" style={styles.itemName}>{item.name}</AppText>
            {item.isDefault ? (
                <View style={[styles.badge, { backgroundColor: theme.colors.border }]}>
                    <AppText variant="caption" style={{ fontSize: 10 }}>Default</AppText>
                </View>
            ) : (
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText variant="h2">Categories</AppText>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add" size={28} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    !loading && (
                        <EmptyState
                            icon="list-outline"
                            title="No Categories"
                            subtitle="Add your first custom category"
                        />
                    )
                }
            />

            {/* Add Category Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.bg }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                        <AppText variant="h2">New Category</AppText>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <AppText variant="caption" muted style={styles.label}>Name</AppText>
                        <AppInput
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                            placeholder="e.g. Coffee, Gym"
                        />

                        <AppText variant="caption" muted style={styles.label}>Icon</AppText>
                        <View style={styles.iconGrid}>
                            {ICONS.map(icon => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[
                                        styles.iconItem,
                                        selectedIcon === icon && {
                                            backgroundColor: theme.colors.primary,
                                            borderColor: theme.colors.primary
                                        }
                                    ]}
                                    onPress={() => setSelectedIcon(icon)}
                                >
                                    <Ionicons
                                        name={icon}
                                        size={24}
                                        color={selectedIcon === icon ? '#FFFFFF' : theme.colors.text}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <AppButton
                            title="Create Category"
                            onPress={handleAddCategory}
                            loading={submitting}
                            style={styles.submitButton}
                        />
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    listContent: { paddingHorizontal: 16, paddingBottom: 24 },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    itemName: { flex: 1, fontWeight: '500' },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },
    deleteButton: {
        padding: 8
    },
    modalContainer: { flex: 1 },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1
    },
    modalContent: { padding: 16 },
    label: { marginBottom: 8, marginTop: 16 },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8
    },
    iconItem: {
        width: 48,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 8
    },
    submitButton: { marginTop: 32, marginBottom: 40 }
});
