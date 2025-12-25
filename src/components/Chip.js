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
                        color: selected ? '#FFFFFF' : theme.colors.text,
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
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
});
