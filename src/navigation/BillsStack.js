import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BillsScreen, AddEditBillScreen } from '../screens';

const Stack = createNativeStackNavigator();

/**
 * Bills stack for list + add/edit
 */
export default function BillsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BillsList" component={BillsScreen} />
            <Stack.Screen name="AddEditBill" component={AddEditBillScreen} />
        </Stack.Navigator>
    );
}
