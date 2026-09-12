import React, { useState, useMemo } from 'react';
import { getBiDirectionalSwaps, EXERCISE_DATABASE, getExerciseDetails } from '../data/exercises.js';
import { getGhost } from '../utils/ghost.js';
import { useAppState } from '../context/AppStateContext.jsx';
import ExerciseInfoModal from './ExerciseInfoModal.jsx';

/**
 * Exercise Swap Modal:
 * 1. Shows direct biomechanically equivalent swaps (symmetrical & bidirectional).
 * 2. Allows reverting to the original template exercise if it was previously swapped.
 * 3. Includes searchable full-library tab so user can switch to ANY exercise.
 * 4. Includes info (i) button to inspect form and focus before swapping.
 */
export default function ExerciseSwapModal({
  open,
  currentName,
  originalName,
  onClose,
  onSelect,
}) {
  const { state } = useAppState();
  const [activeTab, setActiveTab] = useState('alternatives'); // 'alternatives' | 'all'
  const [search, setSearch] = useState('');
  const [infoModalExercise, setInfoModalExercise] = useState(null);

  const directSwaps = useMemo(() => {
    if (!currentName) return [];
    return getBiDirectionalSwaps(currentName);
  }, [currentName]);

  const allFiltered = useMemo(() => {
    if (!search.trim()) return EXERCISE_DATABASE.filter((e) => e.name !== currentName);
    const q = search.toLowerCase();
    return EXERCISE_DATABASE.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.primaryMuscles.some((m) => m.toLowerCase().includes(q))
    ).filter((e) => e.name !== currentName);
  }, [search, currentName]);

  if (!open) return null;

  const currentDetails = getExerciseDetails(currentName);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={onClose}
      >
        <div
          className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-slate-700 bg-slate-900 p-5 pb-8 sm:rounded-3xl sm:border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-700 sm:hidden" />

          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-slate-50">Swap Exercise</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Replacing <span className="font-semibold text-slate-200">{currentName}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* If swapped away from the default template exercise, offer one-click restore */}
          {originalName && originalName !== currentName && (
            <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-amber-300">Original Plan Exercise</p>
                  <p className="text-xs font-black text-slate-100">{originalName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(originalName)}
                  className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 active:scale-95"
                >
                  ↺ Revert to Original
                </button>
              </div>
            </div>
          )}

          {/* Tab buttons */}
          <div className="mt-3 flex rounded-xl border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('alternatives')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                activeTab === 'alternatives'
                  ? 'bg-slate-800 text-emerald-300 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Equivalent Swaps ({directSwaps.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-emerald-300 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Movements
            </button>
          </div>

          {activeTab === 'alternatives' ? (
            <div className="mt-3 space-y-2">
              {directSwaps.length === 0 ? (
                <div className="rounded-xl bg-slate-800/60 p-4 text-center text-xs text-slate-400">
                  No direct biomechanical swaps found in this family. Switch to the "All Movements" tab to select any exercise.
                </div>
              ) : (
                <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-1">
                  {directSwaps.map((ex) => {
                    const ghost = getGhost(ex.name, state.workoutHistory);
                    return (
                      <div
                        key={ex.name}
                        className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/60 p-3 transition hover:border-emerald-500/60 hover:bg-emerald-500/10"
                      >
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() => onSelect(ex.name)}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="block text-sm font-bold text-slate-100">
                              {ex.name}
                            </span>
                            <span className="rounded px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-slate-700 text-slate-300">
                              {ex.type}
                            </span>
                          </div>
                          <span className="mt-0.5 block text-[11px] text-slate-400">
                            {ghost
                              ? `Last: ${ghost.isBodyweight ? 'Bodyweight' : `${ghost.weight} kg`} × ${ghost.reps}`
                              : 'No history yet'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInfoModalExercise(ex.name);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-600 bg-slate-700/80 text-xs font-bold text-slate-300 hover:bg-slate-600"
                            aria-label={`Info for ${ex.name}`}
                          >
                            i
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelect(ex.name)}
                            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 active:scale-95"
                          >
                            Swap
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="Search any exercise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <div className="max-h-[45vh] space-y-1.5 overflow-y-auto pr-1">
                {allFiltered.map((ex) => {
                  const ghost = getGhost(ex.name, state.workoutHistory);
                  return (
                    <div
                      key={ex.name}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/50 p-2.5 transition hover:border-emerald-500/50 hover:bg-slate-800"
                    >
                      <div
                        className="min-w-0 flex-1 cursor-pointer pr-2"
                        onClick={() => onSelect(ex.name)}
                      >
                        <p className="truncate text-xs font-bold text-slate-100">
                          {ex.name}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {ex.type} · {ex.equipment} · {ex.primaryMuscles.join(', ')}
                          {ghost && ` · Last: ${ghost.isBodyweight ? 'BW' : `${ghost.weight}kg`}×${ghost.reps}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInfoModalExercise(ex.name);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-700 bg-slate-700 text-xs font-bold text-slate-300"
                        >
                          i
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelect(ex.name)}
                          className="rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-bold text-slate-950"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <p className="mt-3 text-[11px] text-slate-500">
            Entered sets carry over. Ghosting automatically follows the chosen exercise's history.
          </p>
        </div>
      </div>

      <ExerciseInfoModal
        open={Boolean(infoModalExercise)}
        exerciseName={infoModalExercise}
        onClose={() => setInfoModalExercise(null)}
      />
    </>
  );
}
