import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../context/TransactionContext';
import { CATEGORIES, validateTransaction } from '../utils/helpers';

const TransactionModal = ({ transaction, onClose }) => {
    const { addTransaction, updateTransaction } = useTransactions();
    const isEdit = !!transaction;

    const [formData, setFormData] = useState({
        title: transaction?.title || '',
        amount: transaction?.amount || '',
        type: transaction?.type || 'expense',
        category: transaction?.category || '',
        date: transaction?.date || new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        setFormData(prev => ({ ...prev, amount: value }));
        if (errors.amount) {
            setErrors(prev => ({ ...prev, amount: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validation = validateTransaction(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        if (isEdit) {
            updateTransaction(transaction.id, formData);
        } else {
            addTransaction(formData);
        }

        onClose();
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
                    padding: '2rem'
                }}
            >
                <h2 className="text-2xl font-display font-bold mb-8" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {isEdit ? 'Edit Transaction' : 'Add Transaction'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-l font-semibold mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
                            Transaction Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            style={{
                                borderColor: errors.title ? 'var(--danger)' : 'var(--border)',
                                boxShadow: errors.title ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined
                            }}
                            placeholder="e.g., Grocery Shopping, Monthly Salary"
                        />
                        {errors.title && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm mt-2 flex items-center space-x-1"
                                style={{ color: 'var(--danger)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{errors.title}</span>
                            </motion.p>
                        )}
                    </div>

                    <div>
                        <label className="block text-l font-semibold mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
                            Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold" style={{ color: 'var(--text-muted)' }}>
                                ₹
                            </span>
                            <input
                                type="text"
                                name="amount"
                                value={formData.amount}
                                onChange={handleAmountChange}
                                className="input-field text-right pr-4"
                                style={{
                                    paddingLeft: '2.5rem',
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    borderColor: errors.amount ? 'var(--danger)' : 'var(--border)',
                                    boxShadow: errors.amount ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined
                                }}
                                placeholder="0.00"
                            />
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.01em' }}>
                            Enter exact amount in INR
                        </p>
                        {errors.amount && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm mt-2 flex items-center space-x-1"
                                style={{ color: 'var(--danger)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{errors.amount}</span>
                            </motion.p>
                        )}
                    </div>

                    <div>
                        <label className="block text-l font-semibold mb-3" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
                            Transaction Type
                        </label>
                        <div className="grid grid-cols-2 gap-6">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                                className="px-6 py-5 rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center space-y-3"
                                style={{
                                    background: formData.type === 'income' ? 'var(--success-soft)' : 'var(--bg-elevated)',
                                    border: formData.type === 'income' ? '2px solid var(--success)' : '1px solid var(--border)',
                                    color: formData.type === 'income' ? 'var(--success)' : 'var(--text-secondary)',
                                    boxShadow: formData.type === 'income' ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : undefined,
                                    transform: formData.type === 'income' ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                                <span>Income</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                                className="px-6 py-5 rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center space-y-3"
                                style={{
                                    background: formData.type === 'expense' ? 'var(--danger-soft)' : 'var(--bg-elevated)',
                                    border: formData.type === 'expense' ? '2px solid var(--danger)' : '1px solid var(--border)',
                                    color: formData.type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)',
                                    boxShadow: formData.type === 'expense' ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined,
                                    transform: formData.type === 'expense' ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                                <span>Expense</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-l font-semibold mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="input-field"
                            style={{
                                borderColor: errors.category ? 'var(--danger)' : 'var(--border)',
                                boxShadow: errors.category ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined
                            }}
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm mt-2 flex items-center space-x-1"
                                style={{ color: 'var(--danger)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{errors.category}</span>
                            </motion.p>
                        )}
                    </div>

                    <div>
                        <label className="block text-l font-semibold mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="input-field"
                            style={{
                                borderColor: errors.date ? 'var(--danger)' : 'var(--border)',
                                boxShadow: errors.date ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined
                            }}
                        />
                        {errors.date && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm mt-2 flex items-center space-x-1"
                                style={{ color: 'var(--danger)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{errors.date}</span>
                            </motion.p>
                        )}
                    </div>

                    <div className="flex space-x-10 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            style={{ padding: '0.875rem 1.5rem' }}
                        >
                            {isEdit ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default TransactionModal;
