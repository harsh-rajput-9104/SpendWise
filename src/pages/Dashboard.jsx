import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '../context/TransactionContext';
import StatCard from '../components/StatCard';
import TransactionCard from '../components/TransactionCard';
import Filters from '../components/Filters';
import TransactionModal from '../components/TransactionModal';

const Dashboard = () => {
    const { transactions: allTransactions, filters } = useTransactions();
    const [showAddModal, setShowAddModal] = useState(false);

    const transactions = useMemo(() => {
        return allTransactions.filter(transaction => {
            const monthMatch = transaction.date.slice(0, 7) === filters.month;
            const typeMatch = filters.type === 'all' || transaction.type === filters.type;
            const searchMatch =
                filters.search === '' ||
                transaction.title.toLowerCase().includes(filters.search.toLowerCase());

            return monthMatch && typeMatch && searchMatch;
        });
    }, [allTransactions, filters.month, filters.type, filters.search]);

    const stats = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const balance = income - expense;

        return { income, expense, balance };
    }, [transactions]);

    const categoryStats = useMemo(() => {
        const filtered = transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};

        filtered.forEach(transaction => {
            const category = transaction.category || 'Others';
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount);
        });

        const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

        return Object.entries(categoryTotals).map(([category, amount]) => ({
            category,
            amount,
            percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0,
        })).sort((a, b) => b.amount - a.amount);
    }, [transactions]);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Track your expenses and manage your finances
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        title="Total Income"
                        amount={stats.income}
                        type="income"
                        icon="💰"
                    />
                    <StatCard
                        title="Total Expense"
                        amount={stats.expense}
                        type="expense"
                        icon="💸"
                    />
                    <StatCard
                        title="Balance"
                        amount={stats.balance}
                        type="balance"
                        icon="📊"
                    />
                </div>

                <div className="mb-8">
                    <Filters />
                </div>

                {categoryStats.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card mb-8"
                    >
                        <h2 className="text-xl font-display font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                            Category Breakdown
                        </h2>
                        <div className="space-y-3">
                            {categoryStats.map((cat, index) => (
                                <motion.div
                                    key={cat.category}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                                {cat.category}
                                            </span>
                                            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                                {cat.percentage}%
                                            </span>
                                        </div>
                                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${cat.percentage}%` }}
                                                transition={{ duration: 0.8, delay: index * 0.05 }}
                                                className="h-full rounded-full"
                                                style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-hover))' }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold min-w-[80px] text-right" style={{ color: 'var(--text-primary)' }}>
                                        ₹{cat.amount.toLocaleString('en-IN')}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                        Recent Transactions
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary"
                    >
                        + Add Transaction
                    </button>
                </div>

                {transactions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="card text-center py-20"
                    >
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--bg-elevated)' }}>
                            <svg className="w-12 h-12" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                            No transactions yet
                        </h3>
                        <p className="mb-8 text-base" style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            Start tracking your expenses by adding your first transaction
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary text-base px-8 py-3"
                        >
                            Add Your First Transaction
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-5">
                        <AnimatePresence mode="popLayout">
                            {transactions.map(transaction => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <TransactionModal onClose={() => setShowAddModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
