import { motion } from 'framer-motion';
import { useTransactions } from '../context/TransactionContext';
import { getMonthOptions } from '../utils/helpers';

const Filters = () => {
    const { filters, setFilter, resetFilters } = useTransactions();
    const monthOptions = getMonthOptions();

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: '1.75rem' }}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                    <label className="block text-m font-semibold mb-2.5" style={{ color: 'var(--text-secondary)' }}>
                        Month
                    </label>
                    <select
                        value={filters.month}
                        onChange={(e) => setFilter({ month: e.target.value })}
                        className="input-field"
                    >
                        {monthOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-m font-semibold mb-2.5" style={{ color: 'var(--text-secondary)' }}>
                        Type
                    </label>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilter({ type: e.target.value })}
                        className="input-field"
                    >
                        <option value="all">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div>
                    <label className="block text-m font-semibold mb-2.5" style={{ color: 'var(--text-secondary)' }}>
                        Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => setFilter({ search: e.target.value })}
                            className="input-field pr-10"
                            placeholder="Search transactions..."
                        />
                        {filters.search && (
                            <button
                                onClick={() => setFilter({ search: '' })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {(filters.type !== 'all' || filters.search) && (
                <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all border"
                        style={{
                            color: 'var(--accent-primary)',
                            borderColor: 'var(--border)',
                            background: 'var(--bg-surface)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default Filters;
