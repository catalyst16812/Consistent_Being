import { useState, useEffect, useCallback } from 'react';

// Module-level cache so we never miss beforeinstallprompt if it fired before React mounted
let globalDeferredPrompt = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    window.dispatchEvent(new Event('cb:pwa-prompt-available'));
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    window.dispatchEvent(new Event('cb:pwa-installed'));
  });
}

export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(() => Boolean(globalDeferredPrompt));
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Standalone detection (PWA already installed and running as an app)
  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );

  // Platform detection
  const isIOS = typeof window !== 'undefined' && (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );

  const isSafari = typeof window !== 'undefined' && (
    /Safari/i.test(navigator.userAgent) &&
    !/CriOS|FxiOS|OPiOS|mercury/i.test(navigator.userAgent)
  );

  const isAndroid = typeof window !== 'undefined' && /Android/i.test(navigator.userAgent);

  useEffect(() => {
    // Check if previously dismissed
    try {
      const dismissedUntil = localStorage.getItem('cb_pwa_dismissed');
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        setIsDismissed(true);
      }
    } catch {
      // ignore storage failures
    }

    const onPromptAvailable = () => {
      setCanInstall(true);
    };

    const onAppInstalled = () => {
      setCanInstall(false);
      setIsInstalled(true);
    };

    window.addEventListener('cb:pwa-prompt-available', onPromptAvailable);
    window.addEventListener('cb:pwa-installed', onAppInstalled);

    return () => {
      window.removeEventListener('cb:pwa-prompt-available', onPromptAvailable);
      window.removeEventListener('cb:pwa-installed', onAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!globalDeferredPrompt) return false;
    try {
      await globalDeferredPrompt.prompt();
      const choice = await globalDeferredPrompt.userChoice;
      globalDeferredPrompt = null;
      setCanInstall(false);
      if (choice?.outcome === 'accepted') {
        setIsInstalled(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error triggering PWA install prompt:', err);
      return false;
    }
  }, []);

  const dismiss = useCallback((days = 5) => {
    try {
      const expiry = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem('cb_pwa_dismissed', String(expiry));
    } catch {
      // ignore
    }
    setIsDismissed(true);
  }, []);

  const resetDismissal = useCallback(() => {
    try {
      localStorage.removeItem('cb_pwa_dismissed');
    } catch {
      // ignore
    }
    setIsDismissed(false);
  }, []);

  return {
    canInstall,
    isStandalone,
    isInstalled,
    isIOS,
    isSafari,
    isAndroid,
    isDismissed,
    promptInstall,
    dismiss,
    resetDismissal,
  };
}
