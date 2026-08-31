import React from 'react';

export default function DayCard({
  split,
  ghost,
  firstExerciseName,
  loggedToday,
  inProgress,
  onOpen,
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:border-slate-700 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Day {split.day}
          </span>
          <h2 className="text-lg font-extrabold text-slate-50">{split.short}</h2>
        </div>
        {inProgress ? (
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold text-amber-300">
            In progress
          </span>
        ) : loggedToday ? (
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
            Logged today ✓
          </span>
        ) : (
          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-300">
            Start
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-slate-400">
        {split.focus} · {split.exercises.length} exercises
      </p>

      {ghost && (
        <p className="mt-2 text-xs text-slate-500">
          Last {firstExerciseName}:{' '}
          <span className="font-semibold text-slate-300">
            {ghost.weight} kg × {ghost.reps}
          </span>
        </p>
      )}
    </button>
  );
}
