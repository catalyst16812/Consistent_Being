import React, { useState } from 'react';
import { usePwaInstall } from '../hooks/usePwaInstall.js';

function ShareIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function PlusSquareIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export default function InstallPwaPrompt() {
  const {
    canInstall,
    isStandalone,
    isInstalled,
    isIOS,
    isDismissed,
    promptInstall,
    dismiss,
  } = usePwaInstall();

  const [installing, setInstalling] = useState(false);

  // If already standalone, installed, or user dismissed prompt, don't show
  if (isStandalone || isInstalled || isDismissed) {
    return null;
  }

  // Handle Chrome / Android native install prompt
  const handleInstallClick = async () => {
    setInstalling(true);
    await promptInstall();
    setInstalling(false);
  };

  // Case 1: Chrome Android / Chromium beforeinstallprompt available
  if (canInstall) {
    return (
      <aside
        aria-label="Install App Prompt"
        className="fixed bottom-18 inset-x-3 z-40 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="rounded-2xl border border-emerald-500/50 bg-slate-900/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-lg">
              💪
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-sm font-black text-slate-100">
                  Install Consistent Being
                </h3>
                <button
                  type="button"
                  onClick={() => dismiss(5)}
                  aria-label="Close install prompt"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                >
                  ✕
                </button>
              </div>
              <p className="mt-0.5 text-xs text-slate-300 leading-snug">
                Add to your Home Screen for instant offline access and distraction-free full-screen workouts.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  disabled={installing}
                  onClick={handleInstallClick}
                  className="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-black text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  {installing ? 'Adding…' : 'Add to Home Screen'}
                </button>
                <button
                  type="button"
                  onClick={() => dismiss(5)}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 active:scale-95"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Case 2: iOS Safari on iPhone / iPad (Safari does not fire beforeinstallprompt)
  if (isIOS) {
    return (
      <aside
        aria-label="Install App on iOS"
        className="fixed bottom-18 inset-x-3 z-40 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="rounded-2xl border border-sky-500/40 bg-slate-900/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-base">
                📲
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100">
                  Install on iPhone / iPad
                </h3>
                <p className="text-[11px] text-slate-400">
                  Run as a standalone app in 3 simple steps:
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dismiss(7)}
              aria-label="Close install prompt"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-black text-slate-300">
                1
              </span>
              <span>
                Tap the <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 font-bold text-sky-400"><ShareIcon className="h-3.5 w-3.5" /> Share</span> icon in Safari's toolbar.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-black text-slate-300">
                2
              </span>
              <span>
                Scroll down and select <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 font-bold text-emerald-300"><PlusSquareIcon className="h-3.5 w-3.5" /> Add to Home Screen</span>.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-black text-slate-300">
                3
              </span>
              <span>
                Tap <strong className="text-slate-100">Add</strong> in the top right corner.
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[10px] text-slate-500">Works 100% offline once added</p>
            <button
              type="button"
              onClick={() => dismiss(7)}
              className="rounded-xl bg-sky-500/20 border border-sky-500/40 px-3.5 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/30 active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}
