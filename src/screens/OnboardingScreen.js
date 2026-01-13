import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppButton, AppText } from '../components';

/**
 * Onboarding screen - Entry point for new users
 */
export default function OnboardingScreen({ navigation }) {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            <View style={styles.content}>
                {/* Logo */}
                <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
                    <Ionicons name="wallet-outline" size={64} color="#FFFFFF" />
                </View>

                {/* Main Card */}
                <AppCard style={styles.card}>
                    <AppText variant="title" style={styles.headline}>
                        Track spending.{'\n'}Never miss bills.
                    </AppText>

                    <AppText variant="body" muted style={styles.helperText}>
                        BudgetBuddy helps you take control of your finances with smart tracking, budgeting, and bill reminders.
                    </AppText>

                    <AppButton
                        title="Get Started"
                        onPress={() => navigation.navigate('Signup')}
                        style={styles.primaryButton}
                    />

                    <AppButton
                        title="Log In"
                        onPress={() => navigation.navigate('Login')}
                        variant="secondary"
                        style={styles.secondaryButton}
                    />
                </AppCard>

                <AppText variant="caption" muted style={styles.footer}>
                    By continuing, you agree to our Terms of Service
                </AppText>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
    logoContainer: { width: 120, height: 120, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
    card: { width: '100%', paddingVertical: 32, paddingHorizontal: 24, alignItems: 'center' },
    headline: { textAlign: 'center', marginBottom: 16 },
    helperText: { textAlign: 'center', marginBottom: 32, lineHeight: 22 },
    primaryButton: { width: '100%', marginBottom: 12 },
    secondaryButton: { width: '100%', backgroundColor: '#FFFFFF' },
    footer: { marginTop: 24, textAlign: 'center' },
});
