import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext.jsx';
import { todayISO, weekStartISO, addDaysISO, formatLong } from '../utils/dates.js';
import LevelProgress from './LevelProgress.jsx';
import WeeklyHeatmap from './WeeklyHeatmap.jsx';
import StrengthChart from './StrengthChart.jsx';
import CardioLogger from './CardioLogger.jsx';
import BodyweightWidget from './BodyweightWidget.jsx';

const nf = new Intl.NumberFormat('en');

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-black text-slate-50">
        {value}
        {sub ? <span className="ml-1 text-[11px] font-semibold text-slate-400">{sub}</span> : null}
      </p>
    </div>
  );
}

export default function DashboardView() {
  const { state, addCardioSession, activeSplit } = useAppState();
  const splitTargetDays = activeSplit?.length || 5;
  const today = todayISO();
  const unit = state.userProfile?.unit || 'kg';
  const goal = state.userProfile?.goal || 'Consistent Strength Progression';

  const stats = useMemo(() => {
    const weekStart = weekStartISO(today);
    const weekEnd = addDaysISO(weekStart, 6);

    // Bug Fix: Filter entire Mon–Sun week bounds
    const thisWeek = state.workoutHistory.filter(
      (s) => s.date >= weekStart && s.date <= weekEnd
    );

    // Bug Fix: Count unique trained calendar days
    const uniqueTrainedDays = new Set(thisWeek.map((s) => s.date)).size;

    const volume = thisWeek.reduce(
      (sum, s) =>
        sum +
        s.exercises.reduce(
          (exSum, ex) =>
            exSum + ex.sets.reduce((x, set) => x + (set.weight * set.reps), 0),
          0
        ),
      0
    );

    // Weekly Cardio minutes
    const thisWeekCardio = (state.cardioHistory || []).filter(
      (c) => c.date >= weekStart && c.date <= weekEnd
    );
    const cardioMinutes = thisWeekCardio.reduce((sum, c) => sum + (Number(c.duration) || 0), 0);

    return {
      trainedDays: uniqueTrainedDays,
      volume,
      cardioMinutes,
      totalSessions: state.workoutHistory.length,
    };
  }, [state.workoutHistory, state.cardioHistory, today]);

  return (
    <div className="space-y-4 px-4 pt-5">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-slate-50">
          Consistent Being
        </h1>
        <p className="mt-0.5 text-xs text-slate-400">
          {formatLong(today)} · <span className="text-emerald-300 font-semibold">{goal}</span>
        </p>
      </header>

      <LevelProgress />

      <div className="grid grid-cols-3 gap-2">
        <Stat label="This week" value={`${stats.trainedDays}/${splitTargetDays}`} sub="days" />
        <Stat label="Volume" value={nf.format(Math.round(stats.volume))} sub={unit} />
        <Stat label="Cardio" value={stats.cardioMinutes} sub="mins" />
      </div>

      <BodyweightWidget />

      <WeeklyHeatmap history={state.workoutHistory} />

      <StrengthChart history={state.workoutHistory} unit={unit} />

      {/* Standalone Cardio Logging (0 XP) */}
      <CardioLogger
        unit={unit === 'lbs' ? 'miles' : 'km'}
        onSave={addCardioSession}
      />

      <Link
        to="/workouts"
        className="block rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center text-sm font-bold text-emerald-300 active:bg-emerald-500/20"
      >
        Start workout →
      </Link>
    </div>
  );
}
