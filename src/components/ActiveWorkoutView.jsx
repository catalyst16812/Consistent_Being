import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext.jsx';
import { SPLIT_DAYS } from '../data/exercises.js';
import { formatLong } from '../utils/dates.js';
import { getGhost } from '../utils/ghost.js';
import ExerciseRow from './ExerciseRow.jsx';
import RestTimer from './RestTimer.jsx';
import ExerciseSwapModal from './ExerciseSwapModal.jsx';
import AddExerciseModal from './AddExerciseModal.jsx';
import CardioLogger from './CardioLogger.jsx';

export default function ActiveWorkoutView() {
  const { state, startDraft, updateDraft, clearDraft, commitSession } =
    useAppState();
  const { splitKey } = useParams();
  const navigate = useNavigate();
  const split = SPLIT_DAYS.find((s) => s.key === splitKey) || SPLIT_DAYS[0];
  const draft = state.activeDraft;
  const unit = state.userProfile?.unit || 'kg';

  const [swapIndex, setSwapIndex] = useState(null);
  const [addExerciseOpen, setAddExerciseOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstRender = useRef(true);

  // No in-progress session for this day? Start one from the template.
  useEffect(() => {
    if (!state.activeDraft) startDraft(split.key);
  }, [state.activeDraft, split.key, startDraft]);

  // Flash a subtle "Saved" indicator whenever inputs auto-save.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }
    if (!draft) return undefined;
    setSavedFlash(true);
    const t = setTimeout(() => setSavedFlash(false), 1500);
    return () => clearTimeout(t);
  }, [draft]);

  // A different split day is already in progress → don't lose it silently.
  if (draft && draft.splitKey !== split.key) {
    return (
      <div className="px-4 pt-5">
        <h1 className="text-2xl font-black text-slate-50">
          {SPLIT_DAYS.find((s) => s.key === draft.splitKey)?.label || draft.splitDay}
        </h1>
        <div className="mt-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">
          <p className="text-sm font-bold text-amber-200">
            You have an in-progress session
          </p>
          <p className="mt-1 text-xs text-amber-200/80">
            {draft.splitDay} · {formatLong(draft.date)} — auto-saved as you type.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/workout/${draft.splitKey}`)}
              className="flex-1 rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-slate-950 active:scale-[0.99]"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Discard the in-progress session?')) clearDraft();
              }}
              className="flex-1 rounded-xl border border-slate-600 py-2.5 text-sm font-bold text-slate-300 active:bg-slate-800"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!draft) {
    return <div className="px-4 pt-5 text-sm text-slate-500">Starting session…</div>;
  }

  const onFinish = () => {
    if (isSubmitting) return;

    const hasSets = draft.exercises.some((ex) =>
      ex.sets.some(
        (s) => (Number(s.weight) || 0) > 0 || (Number(s.reps) || 0) > 0
      )
    );
    if (!hasSets && !draft.cardio) {
      window.alert('Log at least one set or cardio to finish the session.');
      return;
    }

    setIsSubmitting(true);
    const res = commitSession();
    if (res.ok) {
      navigate('/workouts');
    } else {
      setIsSubmitting(false);
      alert(res.reason || 'Failed to complete session.');
    }
  };

  const onDiscard = () => {
    if (window.confirm('Discard this session? Logged sets will be lost.')) {
      clearDraft();
      navigate('/workouts');
    }
  };

  const handleAddNewExercise = ({ name, targetReps, sets }) => {
    updateDraft((d) => ({
      ...d,
      exercises: [
        ...d.exercises,
        {
          name,
          originalName: name,
          targetReps,
          sets: Array.from({ length: sets }, (_, idx) => ({
            setNumber: idx + 1,
            weight: '',
            reps: '',
          })),
        },
      ],
    }));
  };

  return (
    <div className="space-y-4 px-4 pt-3">
      <header className="sticky top-0 z-30 -mx-4 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            aria-label="Back to workouts"
            className="rounded-lg p-1 text-slate-400 active:text-slate-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-50">
              {draft.splitDay}
            </h1>
            <p className="text-[11px] text-slate-400">{formatLong(draft.date)}</p>
          </div>
          <span
            className={`w-16 text-right text-[11px] font-semibold transition-opacity ${
              savedFlash ? 'text-emerald-400 opacity-100' : 'opacity-0'
            }`}
          >
            Saved ✓
          </span>
        </div>
      </header>

      <RestTimer />

      {/* Exercises List */}
      <div className="space-y-3">
        {draft.exercises.map((ex, i) => (
          <ExerciseRow
            key={`${ex.name}-${i}`}
            exercise={ex}
            unit={unit}
            ghost={getGhost(ex.name, state.workoutHistory)}
            onSetChange={(setNumber, field, value) =>
              updateDraft((d) => ({
                ...d,
                exercises: d.exercises.map((e, j) =>
                  j === i
                    ? {
                        ...e,
                        sets: e.sets.map((s) =>
                          s.setNumber === setNumber ? { ...s, [field]: value } : s
                        ),
                      }
                    : e
                ),
              }))
            }
            onAddSet={() =>
              updateDraft((d) => ({
                ...d,
                exercises: d.exercises.map((e, j) =>
                  j === i && e.sets.length < 6
                    ? {
                        ...e,
                        sets: [
                          ...e.sets,
                          {
                            setNumber: e.sets.length + 1,
                            weight: '',
                            reps: '',
                          },
                        ],
                      }
                    : e
                ),
              }))
            }
            onRemoveSet={(setNumber) =>
              updateDraft((d) => ({
                ...d,
                exercises: d.exercises.map((e, j) =>
                  j === i
                    ? {
                        ...e,
                        sets: e.sets
                          .filter((s) => s.setNumber !== setNumber)
                          .map((s, k) => ({ ...s, setNumber: k + 1 })),
                      }
                    : e
                ),
              }))
            }
            onRemoveExercise={() => {
              if (window.confirm(`Remove "${ex.name}" from today's workout?`)) {
                updateDraft((d) => ({
                  ...d,
                  exercises: d.exercises.filter((_, j) => j !== i),
                }));
              }
            }}
            onSwap={() => setSwapIndex(i)}
          />
        ))}

        {/* Add new exercise button */}
        <button
          type="button"
          onClick={() => setAddExerciseOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 py-3 text-xs font-bold text-slate-300 transition hover:border-emerald-500/50 hover:bg-slate-900/80 hover:text-emerald-300 active:scale-[0.99]"
        >
          <span className="text-base leading-none">+</span> Add Exercise to this Session
        </button>
      </div>

      {/* Cardio Finisher Section (0 XP) */}
      <CardioLogger
        unit={unit === 'lbs' ? 'miles' : 'km'}
        initialData={draft.cardio}
        onSave={(cardioData) => updateDraft((d) => ({ ...d, cardio: cardioData }))}
      />

      <div className="space-y-2 pt-1 pb-4">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onFinish}
          className="w-full rounded-2xl bg-emerald-500 py-4 text-base font-black text-slate-950 shadow-lg shadow-emerald-500/20 disabled:opacity-50 active:scale-[0.99]"
        >
          {isSubmitting ? 'Finishing…' : 'Finish Session'}
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="w-full rounded-2xl border border-slate-800 py-3 text-sm font-semibold text-slate-400 active:bg-slate-900"
        >
          Discard session
        </button>
      </div>

      {/* Exercise Swap Modal */}
      <ExerciseSwapModal
        open={swapIndex !== null}
        currentName={swapIndex !== null ? draft.exercises[swapIndex].name : ''}
        originalName={swapIndex !== null ? draft.exercises[swapIndex].originalName : ''}
        onClose={() => setSwapIndex(null)}
        onSelect={(name) => {
          const i = swapIndex;
          updateDraft((d) => ({
            ...d,
            exercises: d.exercises.map((e, j) => (j === i ? { ...e, name } : e)),
          }));
          setSwapIndex(null);
        }}
      />

      {/* Add New Exercise Modal */}
      <AddExerciseModal
        open={addExerciseOpen}
        onClose={() => setAddExerciseOpen(false)}
        onAdd={handleAddNewExercise}
      />
    </div>
  );
}
