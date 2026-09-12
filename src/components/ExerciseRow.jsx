import React, { useState } from 'react';
import { parseRepsRange } from '../utils/xp.js';
import {
  CORE_LIFTS,
  getExerciseDetails,
  getEquipmentEmoji,
  getTypeEmoji,
} from '../data/exercises.js';
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

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 text-rose-400"
    >
      <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

/**
 * One exercise in the active session:
 * - Direct emoji tags: 🛠️ Compound vs 🔧 Isolation, 🏋️ Equipment, ⚡ Reps
 * - Remove exercise from today's workout
 * - Swap exercise, target reps, ghost placeholder, and set grid.
 */
export default function ExerciseRow({
  exercise,
  ghost,
  unit = 'kg',
  onSetChange,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
  onSwap,
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const details = getExerciseDetails(exercise.name);
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

            {/* Quick Emoji Tags (Instant recognition without opening info) */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span
                className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${
                  details.type === 'compound'
                    ? 'border border-indigo-500/30 bg-indigo-500/15 text-indigo-300'
                    : 'border border-cyan-500/30 bg-cyan-500/15 text-cyan-300'
                }`}
              >
                {getTypeEmoji(details.type)} {details.type}
              </span>
              <span className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
                {getEquipmentEmoji(details.equipment)} {details.equipment}
              </span>
              <span className="flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                ⚡ {exercise.targetReps} reps
              </span>
            </div>

            {ghost && (
              <p className="mt-1.5 text-[11px] text-slate-500">
                Ghost target:{' '}
                <span className="font-semibold text-slate-300">
                  {ghost.isBodyweight ? 'Bodyweight' : `${ghost.weight} ${unit}`} × {ghost.reps}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onSwap}
              aria-label={`Swap ${exercise.name}`}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-1.5 text-[11px] font-semibold text-slate-300 active:bg-slate-700"
            >
              <SwapIcon />
              Swap
            </button>
            {onRemoveExercise && (
              <button
                type="button"
                onClick={onRemoveExercise}
                aria-label={`Remove ${exercise.name} from today's workout`}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 hover:border-rose-500/50 hover:bg-rose-500/10 active:scale-95"
                title="Remove from today's session"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </div>

        {targetHit && (
          <p
            className={`mt-2.5 rounded-lg border px-2 py-1 text-[11px] font-bold ${
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
