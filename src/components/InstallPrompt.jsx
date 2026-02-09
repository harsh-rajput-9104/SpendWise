import { useState, useEffect } from 'react';
import { setupInstallPrompt } from '../utils/pwa';

/**
 * PWA Install Prompt Component
 * Shows a beautiful install banner when the app is installable
 */
export default function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [installHandler, setInstallHandler] = useState(null);

    useEffect(() => {
        // Setup install prompt handlers
        const handler = setupInstallPrompt();
        setInstallHandler(handler);

        // Check if already installed
        if (handler.isInstalled()) {
            console.log('✅ App is already installed');
            return;
        }

        // Listen for installable event
        const handleInstallable = () => {
            if (handler.canInstall()) {
                setShowPrompt(true);
            }
        };

        // Listen for installed event
        const handleInstalled = () => {
            setShowPrompt(false);
        };

        window.addEventListener('pwa-installable', handleInstallable);
        window.addEventListener('pwa-installed', handleInstalled);

        return () => {
            window.removeEventListener('pwa-installable', handleInstallable);
            window.removeEventListener('pwa-installed', handleInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installHandler) return;

        const { outcome } = await installHandler.promptInstall();

        if (outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
            setShowPrompt(false);
        } else if (outcome === 'dismissed') {
            console.log('❌ User dismissed the install prompt');
            // Keep showing the prompt for later
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Store dismissal in localStorage to not show again for 7 days
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    // Check if user dismissed recently (within 7 days)
    useEffect(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed, 10);
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - dismissedTime < sevenDays) {
                setShowPrompt(false);
            }
        }
    }, []);

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-4 text-white">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1">Install SpendWise App</h3>
                        <p className="text-sm text-white/90 mb-3">
                            Get quick access to your finances. Install our app for a better experience!
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200 shadow-md"
                            >
                                Install
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                            >
                                Later
                            </button>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
                        aria-label="Close"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
