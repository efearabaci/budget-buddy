import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionsScreen, EditTransactionScreen } from '../screens';

const Stack = createNativeStackNavigator();

/**
 * Transactions stack for list + edit
 */
export default function TransactionsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TransactionsList" component={TransactionsScreen} />
            <Stack.Screen name="EditTransaction" component={EditTransactionScreen} />
        </Stack.Navigator>
    );
}
