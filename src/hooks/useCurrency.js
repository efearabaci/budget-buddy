import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchExchangeRates, SUPPORTED_CURRENCIES } from '../services/currency';
import { useAuth } from './useAuth';
import { upsertUserProfile, userDoc } from '../services/firestore';
import { getDoc } from 'firebase/firestore';

const CurrencyContext = createContext({});

export const CurrencyProvider = ({ children }) => {
    const { user } = useAuth();
    const [currency, setCurrency] = useState('USD');
    const [rates, setRates] = useState({ USD: 1 });
    const [loading, setLoading] = useState(true);

    // Load initial rates
    useEffect(() => {
        const loadRates = async () => {
            console.log('Fetching exchange rates...');
            try {
                const newRates = await fetchExchangeRates();
                if (newRates) {
                    console.log('Rates fetched successfully');
                    setRates(newRates);
                } else {
                    console.warn('Using fallback rates');
                    setRates({
                        USD: 1,
                        EUR: 0.92,
                        TRY: 33.5,
                        GBP: 0.79,
                        JPY: 145.2
                    });
                }
            } catch (e) {
                console.error('Error fetching rates', e);
                setRates({
                    USD: 1,
                    EUR: 0.92,
                    TRY: 33.5,
                    GBP: 0.79,
                    JPY: 145.2
                });
            }
        };
        loadRates();
    }, []);

    // Load user preference
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const loadPreference = async () => {
            try {
                const docSnap = await getDoc(userDoc(user.uid));
                if (docSnap.exists() && docSnap.data().currency) {
                    console.log('Loaded user currency preference:', docSnap.data().currency);
                    setCurrency(docSnap.data().currency);
                }
            } catch (err) {
                console.error('Failed to load currency preference', err);
            } finally {
                setLoading(false);
            }
        };

        loadPreference();
    }, [user]);

    const updateCurrency = async (newCurrency) => {
        console.log('Updating currency to:', newCurrency);
        setCurrency(newCurrency);
        if (user) {
            await upsertUserProfile(user.uid, { currency: newCurrency });
        }
    };

    const getSymbol = (code = currency) => {
        return SUPPORTED_CURRENCIES.find(c => c.code === code)?.symbol || '$';
    };

    const convertPrice = (amount, targetCurrency = currency) => {
        if (!rates || !rates[targetCurrency]) {
            console.warn('Missing rate for:', targetCurrency);
            // Fallback for missing rate: assume USD or 1:1 if really broken
            return amount;
        }
        return amount * rates[targetCurrency];
    };

    const formatPrice = (amount) => {
        const val = convertPrice(amount);
        const symbol = getSymbol(currency);

        // Manual formatting to ensure symbol visibility
        return `${symbol}${val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    };

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency: updateCurrency,
            rates,
            getSymbol,
            formatPrice,
            supportedCurrencies: SUPPORTED_CURRENCIES,
            loading
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
