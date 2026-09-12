import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext.jsx';
import { todayISO, formatLong } from '../utils/dates.js';
import { getGhost } from '../utils/ghost.js';
import DayCard from './DayCard.jsx';

export default function WorkoutListView() {
  const { state, activeSplit, clearDraft } = useAppState();
  const navigate = useNavigate();
  const today = todayISO();
  const unit = state.userProfile?.unit || 'kg';
  const [expandedSession, setExpandedSession] = useState(null);

  const sortedHistory = [...state.workoutHistory].sort((a, b) =>
    b.date.localeCompare(a.date) || b.sessionId.localeCompare(a.sessionId)
  );

  return (
    <div className="space-y-5 px-4 pt-5 pb-8">
      <header>
        <h1 className="text-2xl font-black text-slate-50">{activeSplit.length}-Day Split</h1>
        <p className="mt-0.5 text-xs text-slate-400">
          {formatLong(today)} — select a workout day
        </p>
      </header>

      {/* In-Progress Session Notification Banner */}
      {state.activeDraft && (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                In-Progress Session
              </p>
              <p className="text-sm font-bold text-slate-100">
                {state.activeDraft.splitDay}
              </p>
              <p className="text-[11px] text-amber-200/70">
                {formatLong(state.activeDraft.date)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(`/workout/${state.activeDraft.splitKey}`)}
                className="rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 active:scale-95"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Discard the in-progress session?')) {
                    clearDraft();
                  }
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-95"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {activeSplit.map((split) => {
          const firstExercise = split.exercises[0];
          const ghost = firstExercise ? getGhost(firstExercise.name, state.workoutHistory) : null;
          const loggedToday = state.workoutHistory.some(
            (s) => s.date === today && s.splitDay === split.label
          );
          const inProgress = state.activeDraft?.splitKey === split.key;
          return (
            <DayCard
              key={split.key}
              split={split}
              ghost={ghost}
              firstExerciseName={firstExercise.name}
              loggedToday={loggedToday}
              inProgress={inProgress}
              onOpen={() => navigate(`/workout/${split.key}`)}
            />
          );
        })}
      </div>

      {/* Past Workout History & Log Management */}
      <section className="mt-8 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-200">Session History</h2>
          <span className="text-xs font-semibold text-slate-400">
            {state.workoutHistory.length} logged
          </span>
        </div>

        {sortedHistory.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center text-xs text-slate-500">
            No completed workouts yet. Choose a split above to log your first session!
          </p>
        ) : (
          <div className="mt-3 space-y-2.5">
            {sortedHistory.slice(0, 15).map((session) => {
              const isExpanded = expandedSession === session.sessionId;
              const totalVolume = session.exercises.reduce(
                (sum, ex) =>
                  sum +
                  ex.sets.reduce((x, s) => x + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0),
                0
              );

              return (
                <div
                  key={session.sessionId}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() =>
                        setExpandedSession(isExpanded ? null : session.sessionId)
                      }
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-100">
                          {session.splitDay}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          {formatLong(session.date)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {session.exercises.length} exercises · {Math.round(totalVolume)} {unit} volume
                        {session.cardio && ` · ${session.cardio.duration}m cardio`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSession(isExpanded ? null : session.sessionId)
                      }
                      className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:bg-slate-700"
                    >
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>
                  </div>

                  {/* Expanded Session Breakdown */}
                  {isExpanded && (
                    <div className="mt-3 border-t border-slate-800/80 pt-3 space-y-2">
                      {session.exercises.map((ex, idx) => (
                        <div key={idx} className="rounded-xl bg-slate-800/40 p-2.5">
                          <p className="text-xs font-bold text-slate-200">{ex.name}</p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {ex.sets.map((s) => (
                              <span
                                key={s.setNumber}
                                className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300"
                              >
                                S{s.setNumber}: {s.weight > 0 ? `${s.weight} ${unit} × ` : ''}{s.reps} reps
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}

                      {session.cardio && (
                        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-2.5">
                          <p className="text-xs font-bold text-sky-200">
                            Cardio: {session.cardio.type}
                          </p>
                          <p className="text-[11px] text-sky-300/80">
                            {session.cardio.duration} mins
                            {session.cardio.distance ? ` · ${session.cardio.distance} ${unit === 'lbs' ? 'mi' : 'km'}` : ''}
                            {session.cardio.intensity ? ` · ${session.cardio.intensity} Intensity` : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
