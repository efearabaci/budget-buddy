import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppButton, AppText, AppInput } from '../components';
import { signUp, getAuthErrorMessage } from '../services/auth';

/**
 * Validate email format
 */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Signup screen for new users
 */
export default function SignupScreen({ navigation }) {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const emailError = email && !isValidEmail(email) ? 'Invalid email format' : '';
    const passwordError = password && password.length < 6 ? 'Min 6 characters' : '';
    const isFormValid = name.trim() && isValidEmail(email) && password.length >= 6;

    const handleSignup = async () => {
        if (!isFormValid) return;

        setLoading(true);
        setError('');

        try {
            await signUp(email, password);
            // Navigation handled by auth state change
        } catch (err) {
            setError(getAuthErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <AppText variant="title" style={styles.title}>Create Account</AppText>
                    <AppText variant="body" muted style={styles.subtitle}>
                        Start your journey to better financial health
                    </AppText>

                    {error ? (
                        <View style={[styles.errorBox, { backgroundColor: theme.colors.danger + '15' }]}>
                            <Ionicons name="alert-circle" size={20} color={theme.colors.danger} />
                            <AppText variant="body" color={theme.colors.danger} style={styles.errorText}>
                                {error}
                            </AppText>
                        </View>
                    ) : null}

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
                            error={emailError}
                        />

                        <AppInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Create a password (min 6 chars)"
                            secureTextEntry
                            error={passwordError}
                        />

                        <AppButton
                            title="Create Account"
                            onPress={handleSignup}
                            loading={loading}
                            disabled={!isFormValid}
                            style={styles.signupButton}
                        />
                    </AppCard>

                    <View style={styles.loginPrompt}>
                        <AppText variant="body" muted>Already have an account? </AppText>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <AppText variant="body" color={theme.colors.primary}>Sign In</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },
    header: { paddingHorizontal: 16, paddingVertical: 8 },
    backButton: { padding: 8 },
    content: { flex: 1, paddingHorizontal: 24 },
    title: { marginBottom: 8 },
    subtitle: { marginBottom: 24 },
    errorBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 16 },
    errorText: { marginLeft: 8, flex: 1 },
    card: { paddingTop: 24 },
    signupButton: { width: '100%', marginTop: 8 },
    loginPrompt: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
