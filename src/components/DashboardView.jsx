import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext.jsx';
import { todayISO, weekStartISO, formatLong } from '../utils/dates.js';
import LevelProgress from './LevelProgress.jsx';
import WeeklyHeatmap from './WeeklyHeatmap.jsx';
import StrengthChart from './StrengthChart.jsx';
import CalorieBufferToggle from './CalorieBufferToggle.jsx';

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
  const { state, setBuffer } = useAppState();
  const today = todayISO();
  const bufferChecked = state.bufferLog[today] === true;

  const stats = useMemo(() => {
    const weekStart = weekStartISO(today);
    const thisWeek = state.workoutHistory.filter(
      (s) => s.date >= weekStart && s.date <= today
    );
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
    return {
      weekSessions: thisWeek.length,
      volume,
      total: state.workoutHistory.length,
    };
  }, [state.workoutHistory, today]);

  return (
    <div className="space-y-4 px-4 pt-5">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-slate-50">
          Consistent Being
        </h1>
        <p className="mt-0.5 text-xs text-slate-400">
          {formatLong(today)} · Goal: 73 kg stable · Bench 60 kg × 5-6
        </p>
      </header>

      <LevelProgress />

      <div className="grid grid-cols-3 gap-2">
        <Stat label="This week" value={`${stats.weekSessions}/5`} sub="days" />
        <Stat label="Volume" value={nf.format(Math.round(stats.volume))} sub="kg" />
        <Stat label="Sessions" value={stats.total} sub="total" />
      </div>

      <WeeklyHeatmap history={state.workoutHistory} />
      <StrengthChart history={state.workoutHistory} />
      <CalorieBufferToggle
        checked={bufferChecked}
        onChange={(v) => setBuffer(today, v)}
      />

      <Link
        to="/workouts"
        className="block rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center text-sm font-bold text-emerald-300 active:bg-emerald-500/20"
      >
        Start today's workout →
      </Link>
    </div>
  );
}
