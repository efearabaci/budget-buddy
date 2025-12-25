import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Progress bar component for budget tracking
 * @param {{ 
 *   progress: number,
 *   color?: string,
 *   backgroundColor?: string,
 *   height?: number,
 *   style?: Object
 * }} props
 */
export const ProgressBar = ({
    progress,
    color,
    backgroundColor,
    height = 8,
    style
}) => {
    const { theme } = useTheme();

    // Clamp progress between 0 and 1
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    const bgColor = backgroundColor || theme.colors.chipBg;
    const fillColor = color || (clampedProgress > 0.9 ? theme.colors.danger : theme.colors.primary);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: bgColor,
                    height,
                    borderRadius: height / 2,
                },
                style,
            ]}
        >
            <View
                style={[
                    styles.fill,
                    {
                        backgroundColor: fillColor,
                        width: `${clampedProgress * 100}%`,
                        height,
                        borderRadius: height / 2,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    fill: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
});
