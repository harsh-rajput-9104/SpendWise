import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/add', label: 'Add Transaction', icon: '➕' },
        { path: '/analytics', label: 'Analytics', icon: '📈' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 glass" style={{ borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center space-x-4 group">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))' }}>
                            <span className="text-white text-xl font-bold">₹</span>
                        </div>
                        <span className="text-2xl font-display font-bold" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            SpendWise
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300"
                            >
                                <span className={`relative z-10 ${isActive(item.path)
                                    ? ''
                                    : ''
                                    }`} style={{ color: isActive(item.path) ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                                    {item.label}
                                </span>
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 rounded-xl"
                                        style={{ background: 'var(--accent-soft)', border: '1px solid rgba(76, 111, 255, 0.2)' }}
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="md:hidden flex space-x-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`p-2.5 rounded-xl transition-all duration-300`}
                                style={{
                                    background: isActive(item.path) ? 'var(--accent-soft)' : 'transparent',
                                    border: isActive(item.path) ? '1px solid rgba(76, 111, 255, 0.2)' : '1px solid transparent',
                                    color: isActive(item.path) ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                }}
                            >
                                <span className="text-xl">{item.icon}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
