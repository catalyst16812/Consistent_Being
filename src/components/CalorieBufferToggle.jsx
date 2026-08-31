import React from 'react';

/**
 * Daily protocol checklist widget: check off the 300 kcal buffer snack
 * that offsets the 5 km daily walking commute (+15 XP once per day).
 */
export default function CalorieBufferToggle({ checked, onChange, dateLabel }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
          checked
            ? 'border-emerald-500/50 bg-emerald-500/10'
            : 'border-slate-700 bg-slate-800/50 active:bg-slate-800'
        }`}
      >
        <span>
          <span className="block text-sm font-bold text-slate-100">
            300 kcal buffer snack{dateLabel ? ` · ${dateLabel}` : ''}
          </span>
          <span className="mt-0.5 block text-xs text-slate-400">
            Daily check-in — offsets the 5 km commute (+15 XP)
          </span>
        </span>
        <span
          className={`ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
            checked
              ? 'border-emerald-400 bg-emerald-500 text-slate-950'
              : 'border-slate-600 text-transparent'
          }`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 0 1 0 1.415l-7.5 7.5a1 1 0 0 1-1.415 0l-3.5-3.5a1 1 0 1 1 1.415-1.415L8.5 12.086l6.79-6.796a1 1 0 0 1 1.414 0Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>
    </section>
  );
}
