import React from 'react';
import DataExportImport from './DataExportImport.jsx';

export default function SettingsView() {
  return (
    <div className="space-y-4 px-4 pt-5">
      <header>
        <h1 className="text-2xl font-black text-slate-50">Settings</h1>
        <p className="mt-0.5 text-xs text-slate-400">Data, rules &amp; about</p>
      </header>

      <DataExportImport />

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-sm font-bold text-slate-200">How XP works</h2>
        <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
          <li>
            <span className="font-bold text-emerald-300">+50</span> — log a
            completed training session
          </li>
          <li>
            <span className="font-bold text-emerald-300">+20</span> — every set
            of a core lift (bench / deadlift / squat) at the top of the rep
            range
          </li>
          <li>
            <span className="font-bold text-emerald-300">+15</span> — check off
            the daily 300 kcal buffer snack
          </li>
          <li>
            <span className="font-bold text-emerald-300">+100</span> — complete
            all 5 split days inside one calendar week
          </li>
        </ul>
        <p className="mt-2 text-[11px] text-slate-500">
          Every 200 XP levels you up. Consecutive completed split weeks build
          your streak.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-sm font-bold text-slate-200">About</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Consistent Being v1.0 — a local-first progressive web app. All data
          lives in this browser under the localStorage key{' '}
          <code className="text-slate-300">workout_tracker_state</code> and the
          app works fully offline. Use “Add to Home Screen” on your phone for
          one-tap access on the gym floor, and export a JSON backup before
          switching devices.
        </p>
      </section>
    </div>
  );
}
