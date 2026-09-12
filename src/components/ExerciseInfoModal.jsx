import React from 'react';
import { getExerciseDetails } from '../data/exercises.js';

/**
 * Information modal detailing the exercise:
 * - Badges: Compound vs Isolation, Equipment, Muscle Groups
 * - Focus guidance (heavy working weight vs high rep mind-muscle pump)
 * - Biomechanical execution cues and form tips
 * - Overview and context
 */
export default function ExerciseInfoModal({ open, exerciseName, onClose }) {
  if (!open || !exerciseName) return null;

  const details = getExerciseDetails(exerciseName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-slate-700 bg-slate-900 p-5 pb-8 sm:rounded-3xl sm:border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-700 sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-50">{details.name}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                  details.type === 'compound'
                    ? 'border border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                    : 'border border-cyan-500/40 bg-cyan-500/20 text-cyan-300'
                }`}
              >
                {details.type}
              </span>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                {details.equipment}
              </span>
              {details.primaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100"
            aria-label="Close details"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Training Focus Card */}
        <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-xs font-black">
              🎯
            </span>
            <p className="text-xs font-extrabold text-amber-200">Recommended Focus</p>
          </div>
          <p className="mt-1 text-xs font-semibold text-amber-100/90 leading-relaxed">
            {details.focus}
          </p>
        </div>

        {/* Description */}
        {details.description && (
          <p className="mt-3.5 text-xs text-slate-300 leading-relaxed">
            {details.description}
          </p>
        )}

        {/* Secondary Muscles */}
        {details.secondaryMuscles && details.secondaryMuscles.length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] font-bold text-slate-400">Secondary Synergists:</p>
            <p className="text-xs text-slate-400">
              {details.secondaryMuscles.join(' · ')}
            </p>
          </div>
        )}

        {/* Form Tips & Biomechanics */}
        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Form Cues &amp; Execution
          </h3>
          <ul className="mt-2 space-y-2">
            {details.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-black text-emerald-400">
                  {idx + 1}
                </span>
                <span className="leading-snug">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-slate-800 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-700 active:scale-[0.99]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
