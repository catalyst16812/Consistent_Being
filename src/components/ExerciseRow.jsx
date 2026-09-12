import React, { useState } from 'react';
import { parseRepsRange } from '../utils/xp.js';
import { CORE_LIFTS } from '../data/exercises.js';
import SetInput from './SetInput.jsx';
import ExerciseInfoModal from './ExerciseInfoModal.jsx';

function SwapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
    </svg>
  );
}

/**
 * One exercise in the active session: name, info modal, swap control, target reps,
 * ghost placeholder, and the set grid (weight + reps per set).
 */
export default function ExerciseRow({
  exercise,
  ghost,
  unit = 'kg',
  onSetChange,
  onAddSet,
  onRemoveSet,
  onSwap,
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const range = parseRepsRange(exercise.targetReps);
  const filledSets = exercise.sets.filter((s) => (Number(s.reps) || 0) > 0);
  const targetHit =
    range &&
    filledSets.length === exercise.sets.length &&
    filledSets.length > 0 &&
    filledSets.every((s) => s.reps >= range.upper);

  const isCore = CORE_LIFTS.includes(exercise.name);

  return (
    <>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-extrabold text-slate-50">
                {exercise.name}
              </h3>
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 text-[10px] font-bold text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                aria-label={`View info for ${exercise.name}`}
              >
                i
              </button>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Target <span className="font-bold text-emerald-300">{exercise.targetReps} reps</span>
              {ghost && (
                <span className="text-slate-500">
                  {' '}
                  · Ghost{' '}
                  <span className="font-semibold text-slate-300">
                    {ghost.isBodyweight ? 'Bodyweight' : `${ghost.weight} ${unit}`} × {ghost.reps}
                  </span>
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onSwap}
            aria-label={`Swap ${exercise.name}`}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-1.5 text-[11px] font-semibold text-slate-300 active:bg-slate-700"
          >
            <SwapIcon />
            Swap
          </button>
        </div>

        {targetHit && (
          <p
            className={`mt-2 rounded-lg border px-2 py-1 text-[11px] font-bold ${
              isCore
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                : 'border-slate-700 bg-slate-800/60 text-slate-300'
            }`}
          >
            {isCore
              ? 'Core Lift target hit on all sets · +20 XP'
              : 'Target rep range completed on all sets ✓'}
          </p>
        )}

        <div className="mt-3 grid grid-cols-[2rem_1fr_1fr_1.75rem] items-center gap-2">
          <span className="text-center text-[10px] font-bold uppercase text-slate-500">
            Set
          </span>
          <span className="text-center text-[10px] font-bold uppercase text-slate-500">
            {unit}
          </span>
          <span className="text-center text-[10px] font-bold uppercase text-slate-500">
            Reps
          </span>
          <span />
          {exercise.sets.map((set) => (
            <React.Fragment key={set.setNumber}>
              <span className="text-center text-xs font-bold text-slate-400">
                {set.setNumber}
              </span>
              <SetInput
                value={set.weight}
                onChange={(v) => onSetChange(set.setNumber, 'weight', v)}
                placeholder={ghost ? String(ghost.weight) : '0'}
                step={unit === 'lbs' ? 5 : 2.5}
                ariaLabel={`${exercise.name} set ${set.setNumber} weight (${unit})`}
              />
              <SetInput
                value={set.reps}
                onChange={(e) => onSetChange(set.setNumber, 'reps', e)}
                placeholder={ghost ? String(ghost.reps) : '0'}
                step={1}
                ariaLabel={`${exercise.name} set ${set.setNumber} reps`}
              />
              <button
                type="button"
                disabled={exercise.sets.length <= 1}
                onClick={() => onRemoveSet(set.setNumber)}
                aria-label={`Remove set ${set.setNumber}`}
                className="text-lg font-bold text-slate-600 disabled:opacity-30 active:text-rose-400"
              >
                ×
              </button>
            </React.Fragment>
          ))}
        </div>

        {exercise.sets.length < 6 && (
          <button
            type="button"
            onClick={onAddSet}
            className="mt-2 w-full rounded-lg border border-dashed border-slate-700 py-1.5 text-[11px] font-semibold text-slate-400 active:border-emerald-500/50 active:text-emerald-300"
          >
            + Add set
          </button>
        )}
      </section>

      <ExerciseInfoModal
        open={infoOpen}
        exerciseName={exercise.name}
        onClose={() => setInfoOpen(false)}
      />
    </>
  );
}
