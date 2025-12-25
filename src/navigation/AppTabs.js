import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AddTransactionScreen, BillsScreen, StatsScreen } from '../screens';
import HomeStack from './HomeStack';
import TransactionsStack from './TransactionsStack';

const Tab = createBottomTabNavigator();

/**
 * Custom center tab button for Add Transaction
 */
const AddButton = ({ onPress }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity style={styles.addButton} onPress={onPress}>
            <View style={[styles.addButtonInner, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </View>
        </TouchableOpacity>
    );
};

/**
 * Main app bottom tabs navigator
 */
export default function AppTabs() {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
                    borderTopColor: theme.colors.border,
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.mutedText,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Transactions') iconName = focused ? 'list' : 'list-outline';
                    else if (route.name === 'Add') iconName = 'add';
                    else if (route.name === 'Bills') iconName = focused ? 'receipt' : 'receipt-outline';
                    else if (route.name === 'Stats') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    return <Ionicons name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Transactions" component={TransactionsStack} />
            <Tab.Screen
                name="Add"
                component={AddTransactionScreen}
                options={{
                    tabBarButton: (props) => <AddButton {...props} />,
                    tabBarLabel: () => null,
                }}
            />
            <Tab.Screen name="Bills" component={BillsScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    addButton: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
