/**
 * Currency Exchange Service
 * Fetches live rates from open-source API
 */

const API_URL = 'https://open.er-api.com/v6/latest/USD';

/**
 * Fetch latest exchange rates
 * @returns {Promise<Object>} Rates object { USD: 1, EUR: 0.9, ... }
 */
export const fetchExchangeRates = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        return null;
    }
};

export const SUPPORTED_CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];
