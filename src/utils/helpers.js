export const CATEGORIES = [
    'Food',
    'Rent',
    'Travel',
    'Shopping',
    'Salary',
    'Investment',
    'Healthcare',
    'Entertainment',
    'Education',
    'Utilities',
    'Others',
];

export const CATEGORY_COLORS = {
    Food: '#f59e0b',
    Rent: '#8b5cf6',
    Travel: '#06b6d4',
    Shopping: '#ec4899',
    Salary: '#10b981',
    Investment: '#3b82f6',
    Healthcare: '#ef4444',
    Entertainment: '#f97316',
    Education: '#6366f1',
    Utilities: '#14b8a6',
    Others: '#6b7280',
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

export const getMonthOptions = () => {
    const options = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const monthNum = String(date.getMonth() + 1).padStart(2, '0');
        const value = `${year}-${monthNum}`; const label = new Intl.DateTimeFormat('en-IN', {
            month: 'long',
            year: 'numeric',
        }).format(date);

        options.push({ value, label });
    }

    return options;
};

export const validateTransaction = (transaction) => {
    const errors = {};

    if (!transaction.title || transaction.title.trim() === '') {
        errors.title = 'Title is required';
    }

    if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
        errors.amount = 'Amount must be greater than 0';
    }

    if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
        errors.type = 'Type must be income or expense';
    }

    if (!transaction.category) {
        errors.category = 'Category is required';
    }

    if (!transaction.date) {
        errors.date = 'Date is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const getMonthlyTrend = (transactions) => {
    const monthlyData = {};

    transactions.forEach(transaction => {
        const month = transaction.date.slice(0, 7);

        if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expense: 0 };
        }

        if (transaction.type === 'income') {
            monthlyData[month].income += parseFloat(transaction.amount);
        } else {
            monthlyData[month].expense += parseFloat(transaction.amount);
        }
    });

    return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, data]) => ({
            month: new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(new Date(month + '-01')),
            ...data,
        }));
};

export const getDailyTrend = (transactions, month) => {
    const dailyData = {};

    transactions
        .filter(t => (t.monthKey || t.date.slice(0, 7)) === month && t.type === 'expense')
        .forEach(transaction => {
            const day = parseInt(transaction.date.split('-')[2]);
            dailyData[day] = (dailyData[day] || 0) + parseFloat(transaction.amount);
        });

    const daysInMonth = new Date(month.split('-')[0], month.split('-')[1], 0).getDate();
    const result = [];

    for (let i = 1; i <= daysInMonth; i++) {
        result.push({
            day: i,
            amount: dailyData[i] || 0,
        });
    }

    return result;
};
