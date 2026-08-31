import React from 'react';

/**
 * Large-touch number input for weight/reps. Values are kept as strings in
 * local state (pushed to localStorage on every change) and converted to
 * numbers when the session is committed.
 */
export default function SetInput({
  value,
  onChange,
  placeholder,
  step = 1,
  ariaLabel,
  className = '',
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      min="0"
      step={step}
      value={value}
      placeholder={placeholder ?? ''}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border border-slate-700 bg-slate-800/70 px-1 py-2.5 text-center text-base font-bold text-slate-50 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${className}`}
    />
  );
}
