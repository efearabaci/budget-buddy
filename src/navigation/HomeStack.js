import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, SettingsScreen, BudgetsScreen, CategoriesScreen } from '../screens';

const Stack = createNativeStackNavigator();

/**
 * Home stack with Settings and Budgets accessible
 */
export default function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Budgets" component={BudgetsScreen} />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
        </Stack.Navigator>
    );
}
