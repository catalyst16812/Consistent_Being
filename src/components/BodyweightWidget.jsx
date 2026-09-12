import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext.jsx';
import { todayISO, formatShort } from '../utils/dates.js';

export default function BodyweightWidget() {
  const { state, logBodyweight } = useAppState();
  const unit = state.userProfile?.unit || 'kg';
  const currentWeight = Number(state.userProfile?.currentWeight) || 0;
  const goalWeight = Number(state.userProfile?.goalWeight) || 0;
  const today = todayISO();

  const [weightInput, setWeightInput] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Check if user has already logged a weight today
  const todayEntry = (state.weightHistory || []).find((w) => w.date === today);

  const handleSave = (e) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (!val || val <= 0) return;
    logBodyweight(val, today);
    setIsLogging(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const diff = goalWeight > 0 && currentWeight > 0 ? (goalWeight - currentWeight).toFixed(1) : null;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-200">Bodyweight</h2>
          {todayEntry ? (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Logged Today ✓
            </span>
          ) : (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              Needs Entry
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            if (!isLogging) setWeightInput(currentWeight > 0 ? String(currentWeight) : '');
            setIsLogging(!isLogging);
          }}
          className="rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-95"
        >
          {isLogging ? 'Cancel' : todayEntry ? 'Update Weight' : '+ Log Weight'}
        </button>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-50">
              {currentWeight > 0 ? currentWeight : '—'}
            </span>
            <span className="text-sm font-bold text-slate-400">{unit}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {todayEntry
              ? `Logged at ${todayEntry.weight} ${unit} today`
              : 'Current tracked bodyweight'}
          </p>
        </div>

        {goalWeight > 0 && (
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Goal Target
            </p>
            <p className="mt-0.5 text-base font-black text-slate-200">
              {goalWeight} <span className="text-xs font-semibold text-slate-400">{unit}</span>
            </p>
            {diff !== null && (
              <p
                className={`text-[11px] font-bold ${
                  Math.abs(diff) <= 0.2
                    ? 'text-emerald-400'
                    : Number(diff) > 0
                    ? 'text-sky-300'
                    : 'text-amber-300'
                }`}
              >
                {Math.abs(diff) <= 0.2
                  ? 'Goal reached! 🎯'
                  : Number(diff) > 0
                  ? `+${diff} ${unit} to go`
                  : `${diff} ${unit} to go`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Inline Logging Form */}
      {isLogging && (
        <form onSubmit={handleSave} className="mt-3 flex gap-2 border-t border-slate-800 pt-3">
          <input
            type="number"
            step="0.1"
            min="20"
            max="350"
            autoFocus
            placeholder={`Weight in ${unit}`}
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-bold text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 active:scale-95"
          >
            Save
          </button>
        </form>
      )}

      {savedFeedback && (
        <p className="mt-2 text-center text-xs font-bold text-emerald-400 animate-pulse">
          Weight saved successfully! ✓
        </p>
      )}
    </section>
  );
}
