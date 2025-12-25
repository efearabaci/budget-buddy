import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

const RootStack = createNativeStackNavigator();

/**
 * Root navigation container
 * Switches between Auth and Main app based on auth state
 */
export default function RootNavigation() {
    const { user, loading } = useAuth();
    const { theme } = useTheme();

    // Show loading screen while checking auth state
    if (loading) {
        return (
            <View style={[styles.loading, { backgroundColor: theme.colors.bg }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <RootStack.Screen name="MainApp" component={AppTabs} />
                ) : (
                    <RootStack.Screen name="Auth" component={AuthStack} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
