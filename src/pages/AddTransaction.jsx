import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTransactions } from '../context/TransactionContext';
import { CATEGORIES, validateTransaction } from '../utils/helpers';

const AddTransaction = () => {
    const navigate = useNavigate();
    const { addTransaction } = useTransactions();

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateTransaction(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            addTransaction(formData);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 800);
        }, 400);
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div className="max-w-xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="mb-8 flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition-all text-sm"
                        style={{
                            color: 'var(--text-secondary)',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            letterSpacing: '0.01em'
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Dashboard</span>
                    </button>
                    <h1 className="font-display font-bold mb-3 text-4xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        Add Transaction
                    </h1>
                    <p className="text-base" style={{ color: 'var(--text-secondary)', letterSpacing: '-0.005em' }}>
                        Record a new income or expense transaction
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card"
                    style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
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
                                autoFocus
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
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
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
                            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
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
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
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
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
                                Date
                            </label>
                            <div className="relative">
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
                            </div>
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

                        <div className="flex space-x-6 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)'
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1 flex items-center justify-center space-x-2"
                                style={{
                                    padding: '0.875rem 1.5rem',
                                    opacity: isSubmitting ? 0.7 : 1,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <span>Add Transaction</span>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-lg flex items-center space-x-3"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--success)' }}
                    >
                        <svg className="w-6 h-6" style={{ color: 'var(--success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Transaction added successfully!</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AddTransaction;
