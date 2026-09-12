import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CORE_LIFTS, LIFT_SHORT, LIFT_COLORS } from '../data/exercises.js';
import { formatShort } from '../utils/dates.js';

/** Line chart of the max working weight per session for the 3 core lifts. */
export default function StrengthChart({ history, unit = 'kg' }) {
  const data = useMemo(() => {
    const byDate = {};
    for (const session of history) {
      for (const lift of CORE_LIFTS) {
        const ex = session.exercises?.find((e) => e.name === lift);
        if (!ex?.sets?.length) continue;
        const max = Math.max(...ex.sets.map((s) => Number(s.weight) || 0));
        if (max <= 0) continue;
        byDate[session.date] = byDate[session.date] || {
          date: session.date,
          label: formatShort(session.date),
        };
        // Bug Fix: Keep the maximum working weight if multiple sessions occur on the same date
        byDate[session.date][lift] = Math.max(byDate[session.date][lift] || 0, max);
      }
    }
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [history]);

  if (data.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-sm font-bold text-slate-200">Strength Trajectory</h2>
        <p className="mt-3 text-sm text-slate-500">
          Log your first session with Bench Press, Deadlift, or Squat to start tracking
          strength progression over time.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-sm font-bold text-slate-200">
        Strength Trajectory{' '}
        <span className="font-normal text-slate-500">· max working weight ({unit})</span>
      </h2>
      <div className="mt-2 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
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
              formatter={(value, name) => [
                `${value} ${unit}`,
                LIFT_SHORT[name] || name,
              ]}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#94a3b8', fontSize: 12 }}>
                  {LIFT_SHORT[value] || value}
                </span>
              )}
            />
            {CORE_LIFTS.map((lift) => (
              <Line
                key={lift}
                type="monotone"
                dataKey={lift}
                stroke={LIFT_COLORS[lift]}
                strokeWidth={2}
                dot={{ r: 3, fill: LIFT_COLORS[lift], strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
