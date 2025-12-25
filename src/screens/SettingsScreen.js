import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { AppCard, AppText } from '../components';
import { logout } from '../services/auth';

/**
 * Settings screen with preferences and logout
 */
export default function SettingsScreen({ navigation }) {
    const { theme, toggleTheme, isDark } = useTheme();
    const { user } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        setLoggingOut(true);
                        try {
                            await logout();
                            // Navigation handled by auth state
                        } catch (err) {
                            Alert.alert('Error', 'Failed to log out');
                            setLoggingOut(false);
                        }
                    },
                },
            ]
        );
    };

    const SettingRow = ({ icon, title, value, onPress, isSwitch, switchValue, disabled }) => (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            disabled={isSwitch || disabled}
        >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.chipBg }]}>
                <Ionicons name={icon} size={20} color={theme.colors.primary} />
            </View>
            <AppText variant="body" style={styles.settingTitle}>{title}</AppText>
            {isSwitch ? (
                <Switch value={switchValue} onValueChange={onPress} />
            ) : (
                <>
                    {value && <AppText variant="body" muted>{value}</AppText>}
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.mutedText} />
                </>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText variant="h2">Settings</AppText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* User Info */}
                <AppCard style={styles.userCard}>
                    <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                        <AppText variant="h2" color="#FFFFFF">
                            {(user?.email?.[0] || 'U').toUpperCase()}
                        </AppText>
                    </View>
                    <AppText variant="body" style={styles.email}>{user?.email}</AppText>
                </AppCard>

                <AppCard>
                    <AppText variant="caption" muted style={styles.sectionLabel}>PREFERENCES</AppText>
                    <SettingRow icon="cash-outline" title="Currency" value="USD ($)" onPress={() => { }} />
                    <SettingRow icon="moon-outline" title="Dark Mode" isSwitch switchValue={isDark} onPress={toggleTheme} />
                    <SettingRow icon="notifications-outline" title="Notifications" onPress={() => { }} />
                </AppCard>

                <AppCard>
                    <AppText variant="caption" muted style={styles.sectionLabel}>DATA</AppText>
                    <SettingRow icon="folder-outline" title="Categories" onPress={() => { }} />
                    <SettingRow icon="download-outline" title="Export Data" onPress={() => { }} />
                </AppCard>

                <AppCard>
                    <AppText variant="caption" muted style={styles.sectionLabel}>ACCOUNT</AppText>
                    <TouchableOpacity
                        style={styles.logoutRow}
                        onPress={handleLogout}
                        disabled={loggingOut}
                    >
                        <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
                        <AppText variant="body" color={theme.colors.danger} style={{ marginLeft: 12 }}>
                            {loggingOut ? 'Logging out...' : 'Log Out'}
                        </AppText>
                    </TouchableOpacity>
                </AppCard>

                <AppText variant="caption" muted style={styles.version}>
                    BudgetBuddy v1.0.0
                </AppText>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    content: { flex: 1, paddingHorizontal: 16 },
    userCard: { alignItems: 'center', paddingVertical: 24 },
    avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    email: { marginTop: 4 },
    sectionLabel: { marginBottom: 12, fontWeight: '600' },
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    iconContainer: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    settingTitle: { flex: 1 },
    logoutRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    version: { textAlign: 'center', marginVertical: 24 },
});
