import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { AddTransactionScreen } from '../screens';

const RootStack = createNativeStackNavigator();

/**
 * Root navigation container
 * Switches between Auth stack and Main app
 */
export default function RootNavigation() {
    // TODO: Add auth state check to conditionally show Auth or MainApp
    const isAuthenticated = false;

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="Auth" component={AuthStack} />
                <RootStack.Screen name="MainApp" component={AppTabs} />
                <RootStack.Screen
                    name="AddTransaction"
                    component={AddTransactionScreen}
                    options={{ presentation: 'modal' }}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}
