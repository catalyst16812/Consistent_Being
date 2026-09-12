import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useAppState } from '../context/AppStateContext.jsx';
import { formatShort, formatLong } from '../utils/dates.js';
import { getExerciseDetails } from '../data/exercises.js';

// Standard bodyweight strength ratios for working sets (for 6–10 reps)
const STRENGTH_BW_RATIOS = {
  'Flat Barbell Bench Press': { min: 0.85, max: 1.05, note: '85%–105% BW' },
  'Incline Barbell Bench Press': { min: 0.70, max: 0.85, note: '70%–85% BW' },
  'Flat Dumbbell Press': { min: 0.35, max: 0.45, note: '35%–45% BW (per dumbbell)' },
  'Incline Dumbbell Press': { min: 0.30, max: 0.40, note: '30%–40% BW (per dumbbell)' },
  'Machine Chest Press': { min: 0.80, max: 1.00, note: '80%–100% BW' },
  'Barbell Squat': { min: 1.10, max: 1.35, note: '110%–135% BW' },
  'Front Squat': { min: 0.80, max: 1.00, note: '80%–100% BW' },
  'Leg Press': { min: 1.80, max: 2.50, note: '180%–250% BW' },
  'Hack Squat': { min: 1.20, max: 1.50, note: '120%–150% BW' },
  'Barbell Deadlift': { min: 1.30, max: 1.65, note: '130%–165% BW' },
  'Trap Bar Deadlift': { min: 1.35, max: 1.70, note: '135%–170% BW' },
  'Romanian Deadlift': { min: 0.85, max: 1.10, note: '85%–110% BW' },
  'Overhead Press': { min: 0.55, max: 0.65, note: '55%–65% BW' },
  'Seated Dumbbell Shoulder Press': { min: 0.25, max: 0.35, note: '25%–35% BW (per hand)' },
  'Machine Shoulder Press': { min: 0.55, max: 0.70, note: '55%–70% BW' },
  'Barbell Bent-Over Row': { min: 0.75, max: 0.90, note: '75%–90% BW' },
  'Seated Cable Row': { min: 0.70, max: 0.85, note: '70%–85% BW' },
  'Lat Pulldown': { min: 0.75, max: 0.90, note: '75%–90% BW' },
  'Barbell Curl': { min: 0.30, max: 0.40, note: '30%–40% BW' },
  'Dumbbell Curl': { min: 0.15, max: 0.20, note: '15%–20% BW (per hand)' },
  'Cable Triceps Pushdown': { min: 0.35, max: 0.45, note: '35%–45% BW' },
  'Standing Calf Raise': { min: 0.70, max: 1.00, note: '70%–100% BW' },
};

function getSuggestedWorkingWeight(exerciseName, bodyweight, isCompound) {
  const bw = Number(bodyweight) || 0;
  if (bw <= 0) return null;

  const standard = STRENGTH_BW_RATIOS[exerciseName] || (isCompound
    ? { min: 0.75, max: 0.95, note: '75%–95% BW' }
    : { min: 0.25, max: 0.35, note: '25%–35% BW' });

  const low = Math.round(bw * standard.min * 2) / 2;
  const high = Math.round(bw * standard.max * 2) / 2;
  return { low, high, note: standard.note };
}

export default function HistoryInsightsView() {
  const { state, deleteSession, deleteBodyweightEntry } = useAppState();
  const [activeTab, setActiveTab] = useState('exercises'); // 'exercises' | 'bodyweight' | 'cardio'
  const unit = state.userProfile?.unit || 'kg';
  const currentWeight = Number(state.userProfile?.currentWeight) || 0;
  const goalWeight = Number(state.userProfile?.goalWeight) || 0;

  // Distinct exercises with recorded history
  const distinctExercises = useMemo(() => {
    const names = new Set();
    state.workoutHistory.forEach((s) => {
      s.exercises?.forEach((e) => {
        if (e.sets?.some((set) => Number(set.weight) > 0 || Number(set.reps) > 0)) {
          names.add(e.name);
        }
      });
    });
    return Array.from(names).sort();
  }, [state.workoutHistory]);

  const [selectedExercise, setSelectedExercise] = useState('');

  // Auto-select first exercise if available
  React.useEffect(() => {
    if (distinctExercises.length > 0 && !distinctExercises.includes(selectedExercise)) {
      setSelectedExercise(distinctExercises[0]);
    }
  }, [distinctExercises, selectedExercise]);

  // Exercise analytics
  const exerciseInsights = useMemo(() => {
    if (!selectedExercise) return null;

    const sessionPoints = [];
    let peakWeight = 0;
    let peakRepsAtPeak = 0;
    let totalWeightSum = 0;
    let totalSetsCount = 0;
    let minWeight = Infinity;
    let bestEstimated1RM = 0;
    const historyLogs = [];

    // Traverse oldest to newest
    const sorted = [...state.workoutHistory].sort((a, b) => a.date.localeCompare(b.date));

    sorted.forEach((session) => {
      const ex = session.exercises?.find((e) => e.name === selectedExercise);
      if (!ex) return;

      const validSets = ex.sets.filter((s) => Number(s.weight) > 0 || Number(s.reps) > 0);
      if (validSets.length === 0) return;

      let sessionMaxWeight = 0;
      let sessionVolume = 0;

      validSets.forEach((s) => {
        const w = Number(s.weight) || 0;
        const r = Number(s.reps) || 0;
        sessionVolume += w * r;

        if (w > 0) {
          totalWeightSum += w;
          totalSetsCount += 1;
          if (w < minWeight) minWeight = w;
        }

        if (w > sessionMaxWeight) sessionMaxWeight = w;
        if (w > peakWeight || (w === peakWeight && r > peakRepsAtPeak)) {
          peakWeight = w;
          peakRepsAtPeak = r;
        }

        // Epley formula: 1RM = weight * (1 + reps/30)
        const e1rm = w * (1 + r / 30);
        if (e1rm > bestEstimated1RM) bestEstimated1RM = e1rm;
      });

      sessionPoints.push({
        date: session.date,
        label: formatShort(session.date),
        maxWeight: sessionMaxWeight,
        volume: Math.round(sessionVolume),
      });

      historyLogs.push({
        sessionId: session.sessionId,
        date: session.date,
        splitDay: session.splitDay,
        sets: validSets,
        volume: sessionVolume,
      });
    });

    const avgWeight = totalSetsCount > 0 ? (totalWeightSum / totalSetsCount).toFixed(1) : 0;
    const details = getExerciseDetails(selectedExercise);
    const suggested = getSuggestedWorkingWeight(selectedExercise, currentWeight, details.type === 'compound');

    return {
      peakWeight,
      peakRepsAtPeak,
      avgWeight,
      minWeight: minWeight === Infinity ? 0 : minWeight,
      estimated1RM: Math.round(bestEstimated1RM),
      suggested,
      sessionPoints,
      historyLogs: historyLogs.reverse(), // newest first
    };
  }, [selectedExercise, state.workoutHistory, currentWeight]);

  // Bodyweight analytics
  const bodyweightInsights = useMemo(() => {
    const list = [...(state.weightHistory || [])].sort((a, b) => a.date.localeCompare(b.date));
    if (list.length === 0) return null;

    const weights = list.map((w) => w.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const startingWeight = list[0].weight;
    const latestWeight = list[list.length - 1].weight;
    const totalChange = (latestWeight - startingWeight).toFixed(1);

    const chartPoints = list.map((w) => ({
      date: w.date,
      label: formatShort(w.date),
      weight: w.weight,
      goal: goalWeight > 0 ? goalWeight : undefined,
    }));

    return {
      startingWeight,
      latestWeight,
      minWeight,
      maxWeight,
      totalChange,
      chartPoints,
      logs: [...list].reverse(),
    };
  }, [state.weightHistory, goalWeight]);

  // Cardio analytics
  const cardioInsights = useMemo(() => {
    const list = [...(state.cardioHistory || [])].sort((a, b) => a.date.localeCompare(b.date));
    if (list.length === 0) return null;

    const totalMinutes = list.reduce((sum, c) => sum + (Number(c.duration) || 0), 0);
    const totalDistance = list.reduce((sum, c) => sum + (Number(c.distance) || 0), 0);
    const maxDuration = Math.max(...list.map((c) => Number(c.duration) || 0));
    const avgDuration = Math.round(totalMinutes / list.length);

    const chartPoints = list.map((c) => ({
      date: c.date,
      label: formatShort(c.date),
      duration: Number(c.duration) || 0,
      distance: Number(c.distance) || 0,
    }));

    return {
      totalSessions: list.length,
      totalMinutes,
      totalDistance: totalDistance.toFixed(1),
      maxDuration,
      avgDuration,
      chartPoints,
      logs: [...list].reverse(),
    };
  }, [state.cardioHistory]);

  return (
    <div className="space-y-4 px-4 pt-5 pb-8">
      <header>
        <h1 className="text-2xl font-black text-slate-50">History &amp; Insights</h1>
        <p className="mt-0.5 text-xs text-slate-400">
          Analytics, progression trends &amp; bodyweight targets
        </p>
      </header>

      {/* Navigation Sub-tabs */}
      <div className="flex rounded-2xl border border-slate-800 bg-slate-900/90 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 rounded-xl py-2 text-xs font-black transition ${
            activeTab === 'exercises'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Exercises
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bodyweight')}
          className={`flex-1 rounded-xl py-2 text-xs font-black transition ${
            activeTab === 'bodyweight'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Bodyweight
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cardio')}
          className={`flex-1 rounded-xl py-2 text-xs font-black transition ${
            activeTab === 'cardio'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Cardio
        </button>
      </div>

      {/* ===================== TAB 1: EXERCISES ===================== */}
      {activeTab === 'exercises' && (
        <div className="space-y-4">
          {distinctExercises.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
              <p className="text-sm font-bold text-slate-300">No workout history yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Log your first training session to view exercise metrics and charts.
              </p>
            </div>
          ) : (
            <>
              {/* Exercise Dropdown Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Tracked Exercise
                </label>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm font-extrabold text-slate-100 focus:border-emerald-500 focus:outline-none"
                >
                  {distinctExercises.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {exerciseInsights && (
                <>
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Peak</p>
                      <p className="mt-0.5 text-base font-black text-slate-100">
                        {exerciseInsights.peakWeight}
                        <span className="text-[10px] text-slate-400 font-semibold ml-0.5">{unit}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {exerciseInsights.peakRepsAtPeak > 0 ? `× ${exerciseInsights.peakRepsAtPeak}` : ''}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Average</p>
                      <p className="mt-0.5 text-base font-black text-slate-100">
                        {exerciseInsights.avgWeight}
                        <span className="text-[10px] text-slate-400 font-semibold ml-0.5">{unit}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold">working</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Lowest</p>
                      <p className="mt-0.5 text-base font-black text-slate-100">
                        {exerciseInsights.minWeight}
                        <span className="text-[10px] text-slate-400 font-semibold ml-0.5">{unit}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold">baseline</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Est. 1RM</p>
                      <p className="mt-0.5 text-base font-black text-amber-300">
                        {exerciseInsights.estimated1RM}
                        <span className="text-[10px] text-slate-400 font-semibold ml-0.5">{unit}</span>
                      </p>
                      <p className="text-[10px] text-amber-400/80 font-bold">Epley max</p>
                    </div>
                  </div>

                  {/* Suggested Working Weight based on Bodyweight */}
                  <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-black text-slate-950">
                        ⚖️
                      </span>
                      <h3 className="text-xs font-extrabold text-indigo-200">
                        Suggested Working Weight for Your Bodyweight
                      </h3>
                    </div>

                    {currentWeight > 0 && exerciseInsights.suggested ? (
                      <div className="mt-2">
                        <p className="text-base font-black text-indigo-100">
                          {exerciseInsights.suggested.low} – {exerciseInsights.suggested.high} {unit}
                          <span className="ml-2 text-xs font-semibold text-indigo-300/80">
                            (Target: {exerciseInsights.suggested.note})
                          </span>
                        </p>
                        <p className="mt-1 text-[11px] text-indigo-200/80">
                          Calculated for your current bodyweight of{' '}
                          <span className="font-bold text-white">{currentWeight} {unit}</span>.
                          {exerciseInsights.peakWeight > 0 && (
                            <span>
                              {' '}Your peak working set is currently{' '}
                              <span className="font-bold text-emerald-300">
                                {Math.round((exerciseInsights.peakWeight / currentWeight) * 100)}% of BW
                              </span>.
                            </span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-indigo-200/80">
                        Log your current bodyweight on the dashboard to calculate tailored strength standards.
                      </p>
                    )}
                  </div>

                  {/* Recharts Progression Chart */}
                  <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Working Weight Progression ({unit})
                    </h3>
                    <div className="mt-2 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={exerciseInsights.sessionPoints} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis
                            dataKey="label"
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={{ stroke: '#334155' }}
                            tickLine={false}
                          />
                          <YAxis
                            domain={['auto', 'auto']}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={44}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              border: '1px solid #334155',
                              borderRadius: 12,
                              fontSize: 12,
                            }}
                            labelStyle={{ color: '#e2e8f0' }}
                            formatter={(value) => [`${value} ${unit}`, 'Max Weight']}
                          />
                          <Line
                            type="monotone"
                            dataKey="maxWeight"
                            stroke="#34d399"
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: '#34d399', strokeWidth: 0 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  {/* History Logs Table */}
                  <section className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Session Logs ({exerciseInsights.historyLogs.length})
                    </h3>
                    <div className="space-y-2">
                      {exerciseInsights.historyLogs.map((log, idx) => (
                        <div
                          key={`${log.sessionId}-${idx}`}
                          className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">
                              {formatLong(log.date)}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-400">
                              {Math.round(log.volume)} {unit} volume
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {log.sets.map((s) => (
                              <span
                                key={s.setNumber}
                                className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300"
                              >
                                Set {s.setNumber}: {s.weight > 0 ? `${s.weight} ${unit} × ` : ''}{s.reps} reps
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ===================== TAB 2: BODYWEIGHT ===================== */}
      {activeTab === 'bodyweight' && (
        <div className="space-y-4">
          {!bodyweightInsights ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
              <p className="text-sm font-bold text-slate-300">No bodyweight records yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Log your bodyweight on the homepage to start tracking your weight trajectory.
              </p>
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Current</p>
                  <p className="mt-0.5 text-lg font-black text-slate-50">
                    {bodyweightInsights.latestWeight}
                    <span className="text-xs text-slate-400 font-semibold ml-0.5">{unit}</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Goal</p>
                  <p className="mt-0.5 text-lg font-black text-slate-200">
                    {goalWeight > 0 ? `${goalWeight}` : '—'}
                    {goalWeight > 0 && <span className="text-xs text-slate-400 font-semibold ml-0.5">{unit}</span>}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Net Change</p>
                  <p
                    className={`mt-0.5 text-lg font-black ${
                      Number(bodyweightInsights.totalChange) >= 0 ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {Number(bodyweightInsights.totalChange) > 0 ? `+${bodyweightInsights.totalChange}` : bodyweightInsights.totalChange}
                    <span className="text-xs font-semibold ml-0.5">{unit}</span>
                  </p>
                </div>
              </div>

              {/* Bodyweight Chart with Goal Reference Line */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Bodyweight Trend ({unit})
                </h3>
                <div className="mt-2 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bodyweightInsights.chartPoints} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={['dataMin - 1', 'dataMax + 1']}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={44}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: '#e2e8f0' }}
                        formatter={(val) => [`${val} ${unit}`, 'Weight']}
                      />
                      {goalWeight > 0 && (
                        <ReferenceLine
                          y={goalWeight}
                          stroke="#38bdf8"
                          strokeDasharray="4 4"
                          label={{ value: `Goal (${goalWeight})`, fill: '#38bdf8', fontSize: 10, position: 'insideTopRight' }}
                        />
                      )}
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#fbbf24"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#fbbf24', strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Weight Entries Log */}
              <section className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Logged Weigh-Ins ({bodyweightInsights.logs.length})
                </h3>
                <div className="space-y-1.5">
                  {bodyweightInsights.logs.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-200">{formatLong(item.date)}</p>
                        <p className="text-sm font-black text-amber-300">
                          {item.weight} <span className="text-xs text-slate-400 font-semibold">{unit}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete weight entry for ${item.date}?`)) {
                            deleteBodyweightEntry(item.id);
                          }
                        }}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-300 hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      )}

      {/* ===================== TAB 3: CARDIO ===================== */}
      {activeTab === 'cardio' && (
        <div className="space-y-4">
          {!cardioInsights ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
              <p className="text-sm font-bold text-slate-300">No cardio records yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Log a cardio session on the dashboard or during a workout to view aerobic insights.
              </p>
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Sessions</p>
                  <p className="mt-0.5 text-base font-black text-slate-100">
                    {cardioInsights.totalSessions}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Total Time</p>
                  <p className="mt-0.5 text-base font-black text-sky-300">
                    {cardioInsights.totalMinutes}m
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Peak</p>
                  <p className="mt-0.5 text-base font-black text-slate-100">
                    {cardioInsights.maxDuration}m
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Distance</p>
                  <p className="mt-0.5 text-base font-black text-slate-100">
                    {cardioInsights.totalDistance}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold">{unit === 'lbs' ? 'mi' : 'km'}</p>
                </div>
              </div>

              {/* Cardio Chart */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Cardio Duration Over Time (mins)
                </h3>
                <div className="mt-2 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cardioInsights.chartPoints} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={44}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: '#e2e8f0' }}
                        formatter={(val) => [`${val} mins`, 'Duration']}
                      />
                      <Line
                        type="monotone"
                        dataKey="duration"
                        stroke="#38bdf8"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#38bdf8', strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Cardio Log Items */}
              <section className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cardio Log ({cardioInsights.logs.length})
                </h3>
                <div className="space-y-1.5">
                  {cardioInsights.logs.map((item, idx) => (
                    <div
                      key={`${item.id || idx}`}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{item.type}</span>
                        <span className="text-xs font-extrabold text-sky-300">
                          {item.duration} mins
                          {item.distance > 0 ? ` · ${item.distance} ${unit === 'lbs' ? 'mi' : 'km'}` : ''}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatLong(item.date)} · Intensity: <span className="font-semibold text-slate-300">{item.intensity || 'Moderate'}</span>
                        {item.notes ? ` · "${item.notes}"` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
