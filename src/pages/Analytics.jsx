import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../context/TransactionContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { CATEGORY_COLORS, getMonthlyTrend, getDailyTrend } from '../utils/helpers';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = () => {
    const { transactions: allTransactions, filters } = useTransactions();

    const filteredTransactions = useMemo(() => {
        return allTransactions.filter(transaction => {
            const monthMatch = transaction.monthKey === filters.month;
            const typeMatch = filters.type === 'all' || transaction.type === filters.type;
            const searchMatch =
                filters.search === '' ||
                transaction.title.toLowerCase().includes(filters.search.toLowerCase());

            return monthMatch && typeMatch && searchMatch;
        });
    }, [allTransactions, filters.month, filters.type, filters.search]);
    const stats = useMemo(() => {
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const balance = income - expense;

        return { income, expense, balance };
    }, [filteredTransactions]);

    const categoryStats = useMemo(() => {
        const filtered = filteredTransactions.filter(t => t.type === 'expense');
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
    }, [filteredTransactions]);

    const monthlyTrend = getMonthlyTrend(allTransactions);
    const dailyTrend = getDailyTrend(allTransactions, filters.month);

    const insights = useMemo(() => {
        if (categoryStats.length === 0) return null;
        const highest = categoryStats.reduce((max, cat) => cat.amount > max.amount ? cat : max, categoryStats[0]);
        const totalExpense = categoryStats.reduce((sum, cat) => sum + cat.amount, 0);
        const avgDaily = dailyTrend.length > 0 ? totalExpense / dailyTrend.length : 0;
        return { highest, totalExpense, avgDaily };
    }, [categoryStats, dailyTrend]);

    const doughnutData = {
        labels: categoryStats.map(cat => cat.category),
        datasets: [
            {
                data: categoryStats.map(cat => cat.amount),
                backgroundColor: categoryStats.map(cat => CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.Others),
                borderWidth: 0,
                borderRadius: 4,
                spacing: 2,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(20, 23, 31, 0.95)',
                padding: 16,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                titleFont: {
                    size: 14,
                    family: 'Outfit',
                    weight: '600',
                },
                bodyFont: {
                    size: 13,
                    family: 'Inter',
                },
                bodyColor: '#adb5bd',
                titleColor: '#f8f9fa',
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        const value = context.parsed || 0;
                        const percentage = categoryStats[context.dataIndex]?.percentage || 0;
                        return `₹${value.toLocaleString('en-IN')} (${percentage}%)`;
                    },
                },
            },
        },
    };

    const barData = {
        labels: monthlyTrend.map(m => m.month),
        datasets: [
            {
                label: 'Income',
                data: monthlyTrend.map(m => m.income),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: 'Expense',
                data: monthlyTrend.map(m => m.expense),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    padding: 16,
                    font: {
                        size: 12,
                        family: 'Inter',
                        weight: '600',
                    },
                    color: '#adb5bd',
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(20, 23, 31, 0.95)',
                padding: 16,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                titleFont: {
                    size: 14,
                    family: 'Outfit',
                    weight: '600',
                },
                bodyFont: {
                    size: 13,
                    family: 'Inter',
                },
                bodyColor: '#adb5bd',
                titleColor: '#f8f9fa',
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN')}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                border: {
                    display: false,
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawTicks: false,
                },
                ticks: {
                    padding: 12,
                    font: {
                        size: 11,
                        family: 'Inter',
                    },
                    color: '#6c757d',
                    callback: (value) => '₹' + (value / 1000) + 'k',
                },
            },
            x: {
                border: {
                    display: false,
                },
                grid: {
                    display: false,
                },
                ticks: {
                    padding: 8,
                    font: {
                        size: 11,
                        family: 'Inter',
                    },
                    color: '#6c757d',
                },
            },
        },
    };

    const lineData = {
        labels: dailyTrend.map(d => d.day),
        datasets: [
            {
                label: 'Daily Spending',
                data: dailyTrend.map(d => d.amount),
                borderColor: '#4c6fff',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(76, 111, 255, 0.2)');
                    gradient.addColorStop(1, 'rgba(76, 111, 255, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#4c6fff',
                pointBorderColor: '#14171f',
                pointBorderWidth: 3,
                borderWidth: 2,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(20, 23, 31, 0.95)',
                padding: 16,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                titleFont: {
                    size: 14,
                    family: 'Outfit',
                    weight: '600',
                },
                bodyFont: {
                    size: 13,
                    family: 'Inter',
                },
                bodyColor: '#adb5bd',
                titleColor: '#f8f9fa',
                displayColors: false,
                callbacks: {
                    title: (context) => `Day ${context[0].label}`,
                    label: (context) => `Spent: ₹${context.parsed.y.toLocaleString('en-IN')}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                border: {
                    display: false,
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawTicks: false,
                },
                ticks: {
                    padding: 12,
                    font: {
                        size: 11,
                        family: 'Inter',
                    },
                    color: '#6c757d',
                    callback: (value) => '₹' + value.toLocaleString('en-IN'),
                },
            },
            x: {
                border: {
                    display: false,
                },
                grid: {
                    display: false,
                },
                ticks: {
                    padding: 8,
                    font: {
                        size: 11,
                        family: 'Inter',
                    },
                    color: '#6c757d',
                    maxTicksLimit: 15,
                },
            },
        },
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-display font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                        Analytics
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Visualize your spending patterns and financial insights
                    </p>
                </motion.div>

                {allTransactions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="card text-center py-20"
                    >
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--bg-elevated)' }}>
                            <svg className="w-12 h-12" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                            No data to analyze
                        </h3>
                        <p className="mb-8 text-base" style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            Add transactions to unlock insights and visualize your spending patterns
                        </p>
                    </motion.div>
                ) : (
                    <>
                        {insights && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="stat-card"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Top Category</p>
                                            <h3 className="text-2xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                                {insights.highest.category}
                                            </h3>
                                            <p className="text-lg font-semibold" style={{ color: 'var(--danger)' }}>
                                                ₹{insights.highest.amount.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                                            <svg className="w-6 h-6" style={{ color: 'var(--danger)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="stat-card"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Total Expense</p>
                                            <h3 className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                                                ₹{insights.totalExpense.toLocaleString('en-IN')}
                                            </h3>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                                            <svg className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="stat-card"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Avg Daily Spend</p>
                                            <h3 className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                                                ₹{Math.round(insights.avgDaily).toLocaleString('en-IN')}
                                            </h3>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                            <svg className="w-6 h-6" style={{ color: 'var(--success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="card"
                                style={{ padding: '2rem' }}
                            >
                                <div className="mb-6">
                                    <h2 className="text-xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                        Expense by Category
                                    </h2>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        Breakdown of spending across categories
                                    </p>
                                </div>
                                <div className="h-80 flex items-center justify-center mb-6">
                                    {categoryStats.length > 0 ? (
                                        <div className="relative w-full h-full">
                                            <Doughnut data={doughnutData} options={doughnutOptions} />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="text-center">
                                                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total</p>
                                                    <p className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                                                        ₹{categoryStats.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center" style={{ color: 'var(--text-muted)' }}>
                                            No expense data available
                                        </div>
                                    )}
                                </div>
                                {categoryStats.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {categoryStats.slice(0, 4).map((cat, idx) => (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <div className="w-3 h-3 rounded-full" style={{ background: CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.Others }}></div>
                                                <span className="text-sm font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{cat.category}</span>
                                                <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{cat.percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="card"
                                style={{ padding: '2rem' }}
                            >
                                <div className="mb-6">
                                    <h2 className="text-xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                        Monthly Overview
                                    </h2>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        Income vs expense comparison
                                    </p>
                                </div>
                                <div className="h-80">
                                    {monthlyTrend.length > 0 ? (
                                        <Bar data={barData} options={barOptions} />
                                    ) : (
                                        <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                                            No monthly data available
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="card"
                            style={{ padding: '2rem' }}
                        >
                            <div className="mb-6">
                                <h2 className="text-xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                    Daily Spending Trend
                                </h2>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    Track your daily expenses over time
                                </p>
                            </div>
                            <div className="h-80">
                                <Line data={lineData} options={lineOptions} />
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Analytics;
