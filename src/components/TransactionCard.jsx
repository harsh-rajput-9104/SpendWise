import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/helpers';
import { useTransactions } from '../context/TransactionContext';
import TransactionModal from './TransactionModal';

const TransactionCard = ({ transaction }) => {
    const { deleteTransaction } = useTransactions();
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const buttonRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const isIncome = transaction.type === 'income';
    const categoryColor = CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS.Others;

    useEffect(() => {
        if (showMenu && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 8,
                left: rect.right - 180
            });
        }
    }, [showMenu]);

    const handleDelete = () => {
        deleteTransaction(transaction.id);
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card group relative"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${categoryColor}20` }}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: categoryColor }}
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold mb-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
                                {transaction.title}
                            </h4>
                            <div className="flex items-center space-x-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                                <span className="px-2.5 py-1 rounded-lg font-medium" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                                    {transaction.category}
                                </span>
                                <span>{formatDate(transaction.date)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className={`text-lg font-bold`} style={{ color: isIncome ? 'var(--success)' : 'var(--danger)' }}>
                            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>

                        <div className="relative">
                            <button
                                ref={buttonRef}
                                onClick={() => setShowMenu(!showMenu)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                                style={{ background: 'var(--bg-elevated)' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                            >
                                <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {showMenu && createPortal(
                <AnimatePresence>
                    <>
                        <div
                            className="fixed inset-0 z-[9998]"
                            onClick={() => setShowMenu(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="fixed min-w-[180px] rounded-xl z-[9999]"
                            style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
                                padding: '0.5rem'
                            }}
                        >
                            <button
                                onClick={() => {
                                    setShowModal(true);
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm font-medium transition-all duration-150 rounded-lg flex items-center space-x-3"
                                style={{
                                    color: 'var(--text-primary)',
                                    background: 'transparent'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(true);
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm font-medium transition-all duration-150 rounded-lg flex items-center space-x-3"
                                style={{
                                    color: 'var(--danger)',
                                    background: 'transparent'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                            </button>
                        </motion.div>
                    </>
                </AnimatePresence>,
                document.body
            )}

            <AnimatePresence>
                {showModal && (
                    <TransactionModal
                        transaction={transaction}
                        onClose={() => setShowModal(false)}
                    />
                )}

                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-3xl p-8 max-w-sm w-full"
                            style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}
                        >
                            <h3 className="text-xl font-display font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Delete Transaction?</h3>
                            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                                This action cannot be undone. Are you sure you want to delete this transaction?
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn-danger flex-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TransactionCard;
