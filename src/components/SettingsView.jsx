import React from 'react';
import { useAppState } from '../context/AppStateContext.jsx';
import DataExportImport from './DataExportImport.jsx';

export default function SettingsView() {
  const { state, updateProfile } = useAppState();
  const unit = state.userProfile?.unit || 'kg';
  const goal = state.userProfile?.goal || '';

  return (
    <div className="space-y-4 px-4 pt-5 pb-8">
      <header>
        <h1 className="text-2xl font-black text-slate-50">Settings</h1>
        <p className="mt-0.5 text-xs text-slate-400">Preferences, XP rules &amp; data backup</p>
      </header>

      {/* User Preferences (Units & Personal Goals) */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-sm font-bold text-slate-200">Preferences &amp; Goals</h2>

        {/* Units Selector */}
        <div className="mt-3">
          <label className="block text-[11px] font-bold uppercase text-slate-400">
            Weight Unit
          </label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateProfile({ unit: 'kg' })}
              className={`rounded-xl py-2 text-xs font-black transition ${
                unit === 'kg'
                  ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                  : 'border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Metric (Kilograms / kg)
            </button>
            <button
              type="button"
              onClick={() => updateProfile({ unit: 'lbs' })}
              className={`rounded-xl py-2 text-xs font-black transition ${
                unit === 'lbs'
                  ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                  : 'border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Imperial (Pounds / lbs)
            </button>
          </div>
        </div>

        {/* Personal Goal Target */}
        <div className="mt-3.5">
          <label className="block text-[11px] font-bold uppercase text-slate-400">
            Personal Goal / Focus Banner
          </label>
          <input
            type="text"
            value={goal}
            placeholder="e.g. 75 kg bodyweight · Bench 80 kg × 6"
            onChange={(e) => updateProfile({ goal: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1 text-[10px] text-slate-500">
            This appears as your personal motivation banner on the dashboard.
          </p>
        </div>

        {/* Goal Bodyweight */}
        <div className="mt-3.5">
          <label className="block text-[11px] font-bold uppercase text-slate-400">
            Target Goal Bodyweight ({unit})
          </label>
          <input
            type="number"
            step="0.1"
            min="20"
            max="350"
            value={state.userProfile?.goalWeight || ''}
            placeholder="e.g. 75"
            onChange={(e) =>
              updateProfile({ goalWeight: Number(e.target.value) || '' })
            }
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-bold text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1 text-[10px] text-slate-500">
            Used to calculate your goal progress on the homepage and in history charts.
          </p>
        </div>
      </section>

      {/* How XP Works */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-sm font-bold text-slate-200">How XP &amp; Levels Work</h2>
        <ul className="mt-2 space-y-2 text-xs text-slate-400">
          <li className="flex items-start gap-2">
            <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[11px] font-black text-emerald-300">
              +50 XP
            </span>
            <span>Log a completed workout session</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[11px] font-black text-emerald-300">
              +20 XP
            </span>
            <span>
              Every set of a core compound lift (Bench / Deadlift / Squat) hitting the top of the rep target
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[11px] font-black text-emerald-300">
              +100 XP
            </span>
            <span>Complete all 5 split days inside one calendar week</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 rounded bg-slate-700 px-1.5 py-0.5 text-[11px] font-black text-slate-300">
              0 XP
            </span>
            <span>Cardio activities (tracked purely for endurance &amp; aerobic conditioning)</span>
          </li>
        </ul>
        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
          Every 200 XP levels you up. Consecutive completed split weeks increment your streak.
        </p>
      </section>

      {/* Data Backup & Reset */}
      <DataExportImport />

      {/* About */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-sm font-bold text-slate-200">About Consistent Being</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Consistent Being is an offline-first progressive web app. All data lives securely on this device under localStorage key <code className="text-slate-300">workout_tracker_state</code>. Add the app to your phone’s Home Screen for one-tap access on the gym floor.
        </p>
      </section>
    </div>
  );
}
