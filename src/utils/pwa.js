/**
 * Service Worker Registration for SpendWise PWA
 * Handles SW lifecycle, updates, and install prompt
 */

let deferredPrompt = null;

/**
 * Register the service worker
 */
export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then((registration) => {
                    console.log('✅ Service Worker registered successfully:', registration.scope);

                    // Check for updates every hour
                    setInterval(() => {
                        registration.update();
                    }, 60 * 60 * 1000);

                    // Listen for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available
                                console.log('🔄 New version available! Refresh to update.');

                                // Optionally show a notification to the user
                                if (window.confirm('New version available! Reload to update?')) {
                                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                                    window.location.reload();
                                }
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('❌ Service Worker registration failed:', error);
                });

            // Handle controller change (new SW activated)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🔄 Service Worker controller changed');
            });
        });
    } else {
        console.warn('⚠️ Service Workers are not supported in this browser');
    }
};

/**
 * Unregister service worker (for debugging)
 */
export const unregisterServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            await registration.unregister();
            console.log('🗑️ Service Worker unregistered');
        }
    }
};

/**
 * Setup install prompt handler
 * Returns functions to check installability and trigger install
 */
export const setupInstallPrompt = () => {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();

        // Stash the event so it can be triggered later
        deferredPrompt = e;

        console.log('📱 Install prompt available');

        // Dispatch custom event that components can listen to
        window.dispatchEvent(new Event('pwa-installable'));
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA installed successfully');
        deferredPrompt = null;

        // Dispatch custom event
        window.dispatchEvent(new Event('pwa-installed'));
    });

    return {
        /**
         * Check if the app can be installed
         */
        canInstall: () => deferredPrompt !== null,

        /**
         * Trigger the install prompt
         */
        promptInstall: async () => {
            if (!deferredPrompt) {
                console.warn('⚠️ Install prompt not available');
                return { outcome: 'unavailable', platform: null };
            }

            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome, platform } = await deferredPrompt.userChoice;

            console.log(`User response: ${outcome}, Platform: ${platform}`);

            // Clear the deferred prompt
            deferredPrompt = null;

            return { outcome, platform };
        },

        /**
         * Check if app is already installed
         */
        isInstalled: () => {
            // Check if running in standalone mode
            return (
                window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true
            );
        },
    };
};

/**
 * Get install instructions based on browser/platform
 */
export const getInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);

    if (isIOS && isSafari) {
        return {
            platform: 'iOS Safari',
            steps: [
                'Tap the Share button (square with arrow)',
                'Scroll down and tap "Add to Home Screen"',
                'Tap "Add" in the top right corner',
            ],
        };
    }

    if (isAndroid) {
        return {
            platform: 'Android Chrome',
            steps: [
                'Tap the menu button (three dots)',
                'Tap "Add to Home screen" or "Install app"',
                'Tap "Install" or "Add"',
            ],
        };
    }

    return {
        platform: 'Desktop',
        steps: [
            'Click the install icon in the address bar',
            'Or use the browser menu to install',
        ],
    };
};
