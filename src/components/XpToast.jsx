import React, { useEffect, useState } from 'react';
import { useAppState } from '../context/AppStateContext.jsx';

// Floating feedback whenever XP is earned (session, target, snack, split week).
export default function XpToast() {
  const { lastXpEvent } = useAppState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastXpEvent) return undefined;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, [lastXpEvent]);

  if (!lastXpEvent || !visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-4 shadow-2xl shadow-emerald-500/10 backdrop-blur">
        <p className="text-sm font-black text-emerald-300">
          +{lastXpEvent.total} XP earned
        </p>
        <ul className="mt-1.5 space-y-1">
          {lastXpEvent.lines.map((line, i) => (
            <li
              key={i}
              className={
                line.startsWith('Level up')
                  ? 'text-xs font-black text-amber-300'
                  : 'text-xs text-slate-300'
              }
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
