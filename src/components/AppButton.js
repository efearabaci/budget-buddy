import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * @typedef {'primary' | 'secondary' | 'danger' | 'success'} ButtonVariant
 */

/**
 * Primary button component with theme styling
 * @param {{ 
 *   title: string, 
 *   onPress: () => void, 
 *   variant?: ButtonVariant, 
 *   disabled?: boolean,
 *   loading?: boolean,
 *   style?: Object 
 * }} props
 */
export const AppButton = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style
}) => {
    const { theme } = useTheme();

    const getBackgroundColor = () => {
        if (disabled) return theme.colors.border;
        switch (variant) {
            case 'secondary':
                return 'transparent';
            case 'danger':
                return theme.colors.danger;
            case 'success':
                return theme.colors.success;
            default:
                return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.mutedText;
        if (variant === 'secondary') return theme.colors.primary;
        return '#FFFFFF';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderRadius: theme.radii.button,
                    borderWidth: variant === 'secondary' ? 1 : 0,
                    borderColor: theme.colors.primary,
                },
                theme.shadows.button,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
