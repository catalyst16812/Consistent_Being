import React, { useState } from 'react';
import { EXERCISE_DATABASE, getEquipmentEmoji, getTypeEmoji } from '../data/exercises.js';

export default function CustomSplitBuilderModal({ open, initialSplit, onClose, onSave }) {
  const [daysCount, setDaysCount] = useState(initialSplit?.length || 4);
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  // Initialize or re-shape custom split days array
  const [days, setDays] = useState(() => {
    if (Array.isArray(initialSplit) && initialSplit.length > 0) {
      return initialSplit;
    }
    return Array.from({ length: 4 }, (_, i) => ({
      key: `custom-day-${i + 1}`,
      day: i + 1,
      label: `Day ${i + 1} - Routine`,
      short: `Day ${i + 1}`,
      focus: 'Strength & Hypertrophy',
      exercises: [],
    }));
  });

  const [addExerciseOpen, setAddExerciseOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');

  if (!open) return null;

  const handleDaysCountChange = (newCount) => {
    setDaysCount(newCount);
    setDays((prev) => {
      const updated = [];
      for (let i = 0; i < newCount; i += 1) {
        if (prev[i]) {
          updated.push({ ...prev[i], day: i + 1 });
        } else {
          updated.push({
            key: `custom-day-${i + 1}`,
            day: i + 1,
            label: `Day ${i + 1} - Routine`,
            short: `Day ${i + 1}`,
            focus: 'Strength & Hypertrophy',
            exercises: [],
          });
        }
      }
      return updated;
    });
    if (activeDayIdx >= newCount) {
      setActiveDayIdx(newCount - 1);
    }
  };

  const currentDay = days[activeDayIdx] || days[0];

  const updateCurrentDay = (field, value) => {
    setDays((prev) =>
      prev.map((d, idx) => (idx === activeDayIdx ? { ...d, [field]: value } : d))
    );
  };

  const handleAddExerciseToDay = (exercise) => {
    const newEx = {
      name: exercise.name,
      targetReps: exercise.focus.match(/\d+–\d+|\d+-\d+/)?.[0]?.replace('–', '-') || '8-12',
      sets: 3,
    };
    setDays((prev) =>
      prev.map((d, idx) =>
        idx === activeDayIdx
          ? { ...d, exercises: [...d.exercises, newEx] }
          : d
      )
    );
    setAddExerciseOpen(false);
  };

  const handleRemoveExerciseFromDay = (exIdx) => {
    setDays((prev) =>
      prev.map((d, idx) =>
        idx === activeDayIdx
          ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) }
          : d
      )
    );
  };

  const handleExerciseChange = (exIdx, field, val) => {
    setDays((prev) =>
      prev.map((d, idx) =>
        idx === activeDayIdx
          ? {
              ...d,
              exercises: d.exercises.map((e, j) =>
                j === exIdx ? { ...e, [field]: val } : e
              ),
            }
          : d
      )
    );
  };

  const handleSaveAll = () => {
    // Validate each day has at least 1 exercise
    const emptyDay = days.find((d) => d.exercises.length === 0);
    if (emptyDay) {
      if (!window.confirm(`"${emptyDay.label}" has no exercises assigned. Save anyway?`)) {
        return;
      }
    }
    onSave(days);
    onClose();
  };

  const filteredCatalog = EXERCISE_DATABASE.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      e.name.toLowerCase().includes(q) ||
      e.primaryMuscles.some((m) => m.toLowerCase().includes(q));
    const matchMuscle =
      selectedMuscle === 'All' ||
      e.primaryMuscles.some((m) => m.toLowerCase().includes(selectedMuscle.toLowerCase()));
    return matchSearch && matchMuscle;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-slate-700 bg-slate-900 p-5 pb-8 sm:rounded-3xl sm:border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-700 sm:hidden" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-50">Custom Split Builder</h2>
            <p className="mt-0.5 text-xs text-slate-400">Design your personalized routine</p>
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

        {/* Step 1: Select Number of Days */}
        <div className="mt-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Step 1: Choose Number of Days per Week
          </label>
          <div className="mt-1.5 grid grid-cols-6 gap-1">
            {[2, 3, 4, 5, 6, 7].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDaysCountChange(num)}
                className={`rounded-xl py-2 text-xs font-black transition ${
                  daysCount === num
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'border border-slate-700 bg-slate-800/70 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {num}d
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Day Selector Tabs */}
        <div className="mt-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Step 2: Configure Day {activeDayIdx + 1} of {daysCount}
          </label>
          <div className="mt-1.5 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {days.map((d, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveDayIdx(idx)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeDayIdx === idx
                    ? 'bg-indigo-500 text-white'
                    : 'border border-slate-700 bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                Day {d.day} ({d.exercises.length} ex)
              </button>
            ))}
          </div>
        </div>

        {/* Day Details Form */}
        <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400">
                Day Label
              </label>
              <input
                type="text"
                value={currentDay.label}
                onChange={(e) => updateCurrentDay('label', e.target.value)}
                placeholder="Day 1 - Push"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400">
                Focus Muscles
              </label>
              <input
                type="text"
                value={currentDay.focus}
                onChange={(e) => updateCurrentDay('focus', e.target.value)}
                placeholder="Chest · Triceps"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Exercises for this day */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                Exercises ({currentDay.exercises.length})
              </span>
              <button
                type="button"
                onClick={() => setAddExerciseOpen(true)}
                className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 active:scale-95"
              >
                + Add Exercise
              </button>
            </div>

            {currentDay.exercises.length === 0 ? (
              <p className="mt-2 rounded-xl border border-dashed border-slate-800 p-3 text-center text-xs text-slate-500">
                No exercises added yet. Tap "+ Add Exercise" above.
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                {currentDay.exercises.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-2.5"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="truncate text-xs font-bold text-slate-100">{ex.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <label className="text-[10px] text-slate-400">Sets:</label>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={ex.sets}
                          onChange={(e) =>
                            handleExerciseChange(exIdx, 'sets', Number(e.target.value) || 3)
                          }
                          className="w-10 rounded border border-slate-700 bg-slate-800 text-center text-[11px] font-bold text-slate-100"
                        />
                        <label className="text-[10px] text-slate-400">Reps:</label>
                        <input
                          type="text"
                          value={ex.targetReps}
                          onChange={(e) =>
                            handleExerciseChange(exIdx, 'targetReps', e.target.value)
                          }
                          className="w-14 rounded border border-slate-700 bg-slate-800 text-center text-[11px] font-bold text-slate-100"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExerciseFromDay(exIdx)}
                      className="rounded p-1 text-slate-500 hover:text-rose-400"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save and activate button */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={handleSaveAll}
            className="flex-1 rounded-2xl bg-emerald-500 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400 active:scale-[0.99]"
          >
            Save &amp; Activate Custom Split
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-700 px-4 py-3 text-xs font-bold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
        </div>

        {/* Nested Exercise Picker Modal */}
        {addExerciseOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/85 p-3">
            <div className="max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-100">Select Exercise</h3>
                <button
                  type="button"
                  onClick={() => setAddExerciseOpen(false)}
                  className="rounded-full bg-slate-800 p-1 text-slate-400"
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />

              <div className="mt-2 max-h-60 space-y-1 overflow-y-auto pr-1">
                {filteredCatalog.map((ex) => (
                  <div
                    key={ex.name}
                    onClick={() => handleAddExerciseToDay(ex)}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 p-2 hover:border-emerald-500/50 hover:bg-slate-800"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-100">{ex.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {getTypeEmoji(ex.type)} {ex.type} · {getEquipmentEmoji(ex.equipment)} {ex.equipment}
                      </p>
                    </div>
                    <span className="rounded bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-200">
                      + Add
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
