import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Filter/tag chip component
 * @param {{ 
 *   label: string,
 *   selected?: boolean,
 *   onPress?: () => void,
 *   style?: Object
 * }} props
 */
export const Chip = ({ label, selected = false, onPress, style }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.chip,
                {
                    backgroundColor: selected ? theme.colors.primary : theme.colors.chipBg,
                    borderRadius: theme.radii.chip,
                },
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.label,
                    {
                        color: selected ? '#FFFFFF' : (theme.mode === 'dark' ? '#FFFFFF' : '#000000'),
                    },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
        borderRadius: 16,
        minWidth: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
    },
});
