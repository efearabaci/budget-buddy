import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AppText } from './AppText';

/**
 * Theme-aware input component
 * @param {{ 
 *   value: string,
 *   onChangeText: (text: string) => void,
 *   placeholder?: string,
 *   label?: string,
 *   secureTextEntry?: boolean,
 *   keyboardType?: string,
 *   error?: string,
 *   style?: Object
 * }} props
 */
export const AppInput = ({
    value,
    onChangeText,
    placeholder,
    label,
    secureTextEntry = false,
    keyboardType = 'default',
    error,
    style
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, style]}>
            {label && (
                <AppText variant="caption" muted style={styles.label}>
                    {label}
                </AppText>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.colors.card,
                        borderColor: error ? theme.colors.danger : theme.colors.border,
                        borderRadius: theme.radii.input,
                        color: theme.colors.text,
                    },
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.mutedText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
            />
            {error && (
                <AppText variant="caption" color={theme.colors.danger} style={styles.error}>
                    {error}
                </AppText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
    },
    input: {
        height: 48,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    error: {
        marginTop: 4,
    },
});
