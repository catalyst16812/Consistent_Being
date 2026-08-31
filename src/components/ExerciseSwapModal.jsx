import React from 'react';
import { SWAP_MAP } from '../data/exercises.js';
import { getGhost } from '../utils/ghost.js';
import { useAppState } from '../context/AppStateContext.jsx';

/**
 * Bottom-sheet modal listing biomechanically equivalent movements for the
 * selected exercise. Selecting one renames the exercise in the draft —
 * entered sets carry over, and ghosting immediately follows the NEW
 * exercise's history (queried from localStorage-backed state).
 */
export default function ExerciseSwapModal({ open, currentName, onClose, onSelect }) {
  const { state } = useAppState();
  if (!open) return null;

  const alternatives = (SWAP_MAP[currentName] || []).filter(
    (n) => n !== currentName
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl border-t border-slate-700 bg-slate-900 p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-700" />
        <h2 className="text-base font-extrabold text-slate-50">Swap exercise</h2>
        <p className="mt-0.5 text-xs text-slate-400">
          Replacing{' '}
          <span className="font-semibold text-slate-200">{currentName}</span>
        </p>

        {alternatives.length === 0 ? (
          <p className="mt-4 rounded-xl bg-slate-800/60 p-3 text-sm text-slate-400">
            No mapped alternatives for this exercise.
          </p>
        ) : (
          <div className="mt-3 max-h-[50vh] space-y-2 overflow-y-auto">
            {alternatives.map((name) => {
              const ghost = getGhost(name, state.workoutHistory);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onSelect(name)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-left transition active:border-emerald-500/60 active:bg-emerald-500/10"
                >
                  <span className="block text-sm font-bold text-slate-100">
                    {name}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-400">
                    {ghost
                      ? `Last: ${ghost.weight} kg × ${ghost.reps} — ghost updates to this history`
                      : 'No history yet'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-3 text-[11px] text-slate-500">
          Entered set values carry over. Data tracking continues under the new
          movement.
        </p>
      </div>
    </div>
  );
}
