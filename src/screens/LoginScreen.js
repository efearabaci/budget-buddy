import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppButton, AppText, AppInput } from '../components';
import { Ionicons } from '@expo/vector-icons';

/**
 * Login screen for existing users
 * @param {{ navigation: Object }} props
 */
export default function LoginScreen({ navigation }) {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
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
                    Welcome Back
                </AppText>
                <AppText variant="body" muted style={styles.subtitle}>
                    Sign in to continue tracking your finances
                </AppText>

                <AppCard style={styles.card}>
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
                        placeholder="Enter your password"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <AppText variant="caption" color={theme.colors.primary}>
                            Forgot Password?
                        </AppText>
                    </TouchableOpacity>

                    <AppButton
                        title="Sign In"
                        onPress={handleLogin}
                        style={styles.loginButton}
                    />
                </AppCard>

                <View style={styles.signupPrompt}>
                    <AppText variant="body" muted>
                        Don't have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <AppText variant="body" color={theme.colors.primary}>
                            Sign Up
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    loginButton: {
        width: '100%',
    },
    signupPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
});
