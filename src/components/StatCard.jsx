import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/helpers';

const StatCard = ({ title, amount, type, trend, icon }) => {
    const getColorClasses = () => {
        switch (type) {
            case 'income':
                return {
                    iconBg: 'rgba(16, 185, 129, 0.1)',
                    iconColor: 'var(--success)',
                };
            case 'expense':
                return {
                    iconBg: 'rgba(239, 68, 68, 0.1)',
                    iconColor: 'var(--danger)',
                };
            case 'balance':
                return {
                    iconBg: 'var(--accent-soft)',
                    iconColor: 'var(--accent-primary)',
                };
            default:
                return {
                    iconBg: 'rgba(255, 255, 255, 0.05)',
                    iconColor: 'var(--text-muted)',
                };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'income':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                );
            case 'expense':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                );
            case 'balance':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const colors = getColorClasses();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`stat-card ${type} group cursor-default`}
        >
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>{title}</p>
                    <h3 className="text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(amount)}
                    </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: colors.iconBg }}>
                    <div style={{ color: colors.iconColor }}>
                        {getIcon()}
                    </div>
                </div>
            </div>

            {trend && (
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: colors.iconBg, color: colors.iconColor }}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>vs last month</span>
                </div>
            )}
        </motion.div>
    );
};

export default StatCard;
