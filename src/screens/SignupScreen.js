import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppButton, AppText, AppInput } from '../components';
import { Ionicons } from '@expo/vector-icons';

/**
 * Signup screen for new users
 * @param {{ navigation: Object }} props
 */
export default function SignupScreen({ navigation }) {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        // TODO: Implement Firebase Auth
        // For now, navigate to main app
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
        });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <AppText variant="title" style={styles.title}>
                    Create Account
                </AppText>
                <AppText variant="body" muted style={styles.subtitle}>
                    Start your journey to better financial health
                </AppText>

                <AppCard style={styles.card}>
                    <AppInput
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                    />

                    <AppInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                    />

                    <AppInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Create a password"
                        secureTextEntry
                    />

                    <AppButton
                        title="Create Account"
                        onPress={handleSignup}
                        style={styles.signupButton}
                    />
                </AppCard>

                <View style={styles.loginPrompt}>
                    <AppText variant="body" muted>
                        Already have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <AppText variant="body" color={theme.colors.primary}>
                            Sign In
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 24,
    },
    card: {
        paddingTop: 24,
    },
    signupButton: {
        width: '100%',
        marginTop: 8,
    },
    loginPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
});
