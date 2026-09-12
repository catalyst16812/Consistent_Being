import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext.jsx';
import { PRESET_SPLITS } from '../data/exercises.js';
import DataExportImport from './DataExportImport.jsx';
import CustomSplitBuilderModal from './CustomSplitBuilderModal.jsx';

export default function SettingsView() {
  const {
    state,
    updateProfile,
    selectPresetSplit,
    saveCustomSplit,
    activeSplit,
  } = useAppState();

  const unit = state.userProfile?.unit || 'kg';
  const goal = state.userProfile?.goal || '';
  const activeSplitKey = state.userProfile?.activeSplitKey || 'preset-pplul';
  const customSplit = state.userProfile?.customSplit;

  const [builderOpen, setBuilderOpen] = useState(false);

  return (
    <div className="space-y-4 px-4 pt-5 pb-8">
      <header>
        <h1 className="text-2xl font-black text-slate-50">Settings</h1>
        <p className="mt-0.5 text-xs text-slate-400">Preferences, routine &amp; data backup</p>
      </header>

      {/* Training Routine & Split Selection */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-200">Training Routine &amp; Split</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Active: <span className="font-bold text-emerald-300">{activeSplit.length}-Day Split</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBuilderOpen(true)}
            className="rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-500/25 active:scale-95"
          >
            {customSplit ? '✏️ Edit Custom Split' : '✨ Build Custom Split'}
          </button>
        </div>

        {/* Popular Presets Selector */}
        <div className="mt-3 space-y-2">
          {/* Custom Split Option if exists */}
          {customSplit && (
            <div
              onClick={() => updateProfile({ activeSplitKey: 'custom' })}
              className={`cursor-pointer rounded-xl border p-3 transition ${
                activeSplitKey === 'custom'
                  ? 'border-emerald-500/60 bg-emerald-500/15'
                  : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-100">
                      Custom Split ({customSplit.length} Days)
                    </span>
                    <span className="rounded bg-indigo-500/30 px-1.5 py-0.2 text-[9px] font-bold text-indigo-200">
                      User Defined
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {customSplit.map((d) => d.short).join(' · ')}
                  </p>
                </div>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    activeSplitKey === 'custom'
                      ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-black text-xs'
                      : 'border-slate-600'
                  }`}
                >
                  {activeSplitKey === 'custom' ? '✓' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Popular Built-in Presets */}
          {Object.values(PRESET_SPLITS).map((preset) => {
            const isSelected = activeSplitKey === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => selectPresetSplit(preset.id)}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  isSelected
                    ? 'border-emerald-500/60 bg-emerald-500/15'
                    : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-100">{preset.name}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">{preset.description}</p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {preset.days.map((d) => d.short).join(' · ')}
                    </p>
                  </div>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-black text-xs'
                        : 'border-slate-600'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
            Personal Goal / Motivation Banner
          </label>
          <input
            type="text"
            value={goal}
            placeholder="e.g. 75 kg bodyweight · Bench 80 kg × 6"
            onChange={(e) => updateProfile({ goal: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
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
              Every set of a core compound lift (Bench / Deadlift / Squat) hitting top rep target
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[11px] font-black text-emerald-300">
              +100 XP
            </span>
            <span>Complete all days of your active split inside one calendar week</span>
          </li>
        </ul>
      </section>

      {/* Data Backup & Reset */}
      <DataExportImport />

      {/* Custom Split Builder Modal */}
      <CustomSplitBuilderModal
        open={builderOpen}
        initialSplit={customSplit}
        onClose={() => setBuilderOpen(false)}
        onSave={(customDays) => saveCustomSplit(customDays)}
      />
    </div>
  );
}
