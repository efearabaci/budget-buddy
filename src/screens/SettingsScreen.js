import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppCard, AppText } from '../components';

/**
 * Settings screen
 */
export default function SettingsScreen({ navigation }) {
    const { theme, toggleTheme, isDark } = useTheme();

    const handleLogout = () => {
        // TODO: Implement logout
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
    };

    const SettingRow = ({ icon, title, value, onPress, isSwitch, switchValue }) => (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            disabled={isSwitch}
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
                    <SettingRow icon="person-outline" title="Profile" onPress={() => { }} />
                    <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
                        <AppText variant="body" color={theme.colors.danger} style={{ marginLeft: 12 }}>
                            Log Out
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
    sectionLabel: { marginBottom: 12, fontWeight: '600' },
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    iconContainer: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    settingTitle: { flex: 1 },
    logoutRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    version: { textAlign: 'center', marginVertical: 24 },
});
