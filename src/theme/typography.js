/**
 * BudgetBuddy Typography System
 * System fonts with consistent sizes and weights
 */

export const fontSizes = {
    title: 26,
    h2: 20,
    body: 16,
    caption: 13,
};

export const fontWeights = {
    title: '700',
    heading: '600',
    body: '400',
    medium: '500',
};

export const typography = {
    title: {
        fontSize: fontSizes.title,
        fontWeight: fontWeights.title,
    },
    h2: {
        fontSize: fontSizes.h2,
        fontWeight: fontWeights.heading,
    },
    body: {
        fontSize: fontSizes.body,
        fontWeight: fontWeights.body,
    },
    caption: {
        fontSize: fontSizes.caption,
        fontWeight: fontWeights.body,
    },
};
