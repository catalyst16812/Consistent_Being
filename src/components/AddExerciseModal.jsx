import React, { useState, useMemo } from 'react';
import { EXERCISE_DATABASE } from '../data/exercises.js';

export default function AddExerciseModal({ open, onClose, onAdd }) {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [customName, setCustomName] = useState('');
  const [sets, setSets] = useState(3);
  const [targetReps, setTargetReps] = useState('8-12');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'custom'

  const muscles = useMemo(() => {
    const list = new Set();
    EXERCISE_DATABASE.forEach((e) => e.primaryMuscles.forEach((m) => list.add(m.split(' ')[0])));
    return ['All', ...Array.from(list).sort()];
  }, []);

  const filtered = useMemo(() => {
    return EXERCISE_DATABASE.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.primaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase()));
      const matchesMuscle =
        selectedMuscle === 'All' ||
        e.primaryMuscles.some((m) => m.toLowerCase().includes(selectedMuscle.toLowerCase()));
      return matchesSearch && matchesMuscle;
    });
  }, [search, selectedMuscle]);

  if (!open) return null;

  const handleAddPredefined = (ex) => {
    onAdd({
      name: ex.name,
      targetReps: ex.focus.match(/\d+–\d+|\d+-\d+/)?.[0]?.replace('–', '-') || targetReps,
      sets: Number(sets) || 3,
    });
    onClose();
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      alert('Please enter an exercise name.');
      return;
    }
    onAdd({
      name: customName.trim(),
      targetReps: targetReps.trim() || '8-12',
      sets: Number(sets) || 3,
    });
    setCustomName('');
    onClose();
  };

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

        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-50">+ Add Exercise to Session</h2>
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

        {/* Tab Selector */}
        <div className="mt-3 flex rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
              activeTab === 'catalog'
                ? 'bg-slate-800 text-emerald-300 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exercise Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
              activeTab === 'custom'
                ? 'bg-slate-800 text-emerald-300 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Custom
          </button>
        </div>

        {activeTab === 'catalog' ? (
          <div className="mt-3 space-y-3">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search exercise by name or muscle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />

            {/* Muscle Group Filter chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              {muscles.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMuscle(m)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 font-semibold transition ${
                    selectedMuscle === m
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="max-h-[45vh] space-y-1.5 overflow-y-auto pr-1">
              {filtered.map((ex) => (
                <div
                  key={ex.name}
                  onClick={() => handleAddPredefined(ex)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-800/50 p-2.5 transition hover:border-emerald-500/50 hover:bg-slate-800"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-xs font-bold text-slate-100 group-hover:text-emerald-300">
                      {ex.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {ex.type} · {ex.equipment} · {ex.primaryMuscles.join(', ')}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-slate-700 px-2 py-1 text-[11px] font-bold text-slate-200 group-hover:bg-emerald-500 group-hover:text-slate-950">
                    + Add
                  </span>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="p-4 text-center text-xs text-slate-500">
                  No matching exercises found. Switch to "Create Custom" tab!
                </p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddCustom} className="mt-4 space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400">
                Exercise Name*
              </label>
              <input
                type="text"
                placeholder="e.g. Incline Cable Flye, Pendlay Row"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400">
                  Number of Sets
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-bold text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400">
                  Target Reps
                </label>
                <input
                  type="text"
                  placeholder="8-12"
                  value={targetReps}
                  onChange={(e) => setTargetReps(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-bold text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 active:scale-[0.98]"
            >
              Add Custom Exercise
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
