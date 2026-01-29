import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TransactionContext = createContext();

const initialState = {
    transactions: [],
    filters: {
        month: new Date().toISOString().slice(0, 7),
        type: 'all',
        search: '',
    },
};

const transactionReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload };

        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
            };

        case 'UPDATE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map(t =>
                    t.id === action.payload.id ? action.payload : t
                ),
            };

        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(t => t.id !== action.payload),
            };

        case 'SET_FILTER':
            return {
                ...state,
                filters: { ...state.filters, ...action.payload },
            };

        case 'RESET_FILTERS':
            return {
                ...state,
                filters: initialState.filters,
            };

        default:
            return state;
    }
};

export const TransactionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(transactionReducer, initialState);

    useEffect(() => {
        const stored = localStorage.getItem('spendwise_transactions');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const migrated = parsed.map(tx => ({
                    ...tx,
                    monthKey: tx.monthKey || tx.date.slice(0, 7)
                }));
                dispatch({ type: 'SET_TRANSACTIONS', payload: migrated });
            } catch (error) {
                console.error('Failed to parse transactions:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (state.transactions.length > 0) {
            localStorage.setItem('spendwise_transactions', JSON.stringify(state.transactions));
        }
    }, [state.transactions]);

    const addTransaction = (transaction) => {
        const dateStr = transaction.date || new Date().toISOString().split('T')[0];

        const newTransaction = {
            ...transaction,
            id: uuidv4(),
            date: dateStr,                 // "YYYY-MM-DD"
            monthKey: dateStr.slice(0, 7)  // "YYYY-MM"
        };

        dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
        return newTransaction;
    };

    const updateTransaction = (id, updates) => {
        const transaction = state.transactions.find(t => t.id === id);
        if (transaction) {
            const updated = {
                ...transaction,
                ...updates,
                monthKey: updates.date ? updates.date.slice(0, 7) : transaction.monthKey
            };
            dispatch({ type: 'UPDATE_TRANSACTION', payload: updated });
            return updated;
        }
        return null;
    };

    const deleteTransaction = (id) => {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    };

    const setFilter = (filterUpdates) => {
        dispatch({ type: 'SET_FILTER', payload: filterUpdates });
    };

    const resetFilters = () => {
        dispatch({ type: 'RESET_FILTERS' });
    };

    const value = {
        transactions: state.transactions,
        filters: state.filters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setFilter,
        resetFilters,
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within TransactionProvider');
    }
    return context;
};
