import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext.jsx';
import { SPLIT_DAYS } from '../data/exercises.js';
import { todayISO, formatLong } from '../utils/dates.js';
import { getGhost } from '../utils/ghost.js';
import DayCard from './DayCard.jsx';

export default function WorkoutListView() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const today = todayISO();

  return (
    <div className="space-y-4 px-4 pt-5">
      <header>
        <h1 className="text-2xl font-black text-slate-50">5-Day Split</h1>
        <p className="mt-0.5 text-xs text-slate-400">
          {formatLong(today)} — pick a day to train
        </p>
      </header>

      <div className="space-y-3">
        {SPLIT_DAYS.map((split) => {
          const firstExercise = split.exercises[0];
          const ghost = getGhost(firstExercise.name, state.workoutHistory);
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
    </div>
  );
}
