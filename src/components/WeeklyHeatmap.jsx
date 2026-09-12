import React from 'react';
import { SPLIT_DAYS } from '../data/exercises.js';
import {
  todayISO,
  weekStartISO,
  addDaysISO,
  dayLetter,
  formatShort,
} from '../utils/dates.js';

const shortOf = (splitDay) =>
  SPLIT_DAYS.find((d) => d.label === splitDay)?.short || splitDay;

/** 7-day (Mon–Sun) grid: trained days, active rest days, today, future days. */
export default function WeeklyHeatmap({ history }) {
  const today = todayISO();
  const start = weekStartISO(today);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDaysISO(start, i);
    const sessions = (history || []).filter((s) => s.date === date);
    return { date, sessions, isToday: date === today, isFuture: date > today };
  });
  const trainedCount = days.filter((d) => d.sessions.length > 0).length;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200">This Week</h2>
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
            trainedCount >= 5
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-slate-700 bg-slate-800/60 text-slate-300'
          }`}
        >
          {trainedCount}/5 split days
        </span>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const base = d.sessions.length
            ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
            : d.isToday
              ? 'border-amber-400/70 bg-amber-400/10 text-amber-300'
              : d.isFuture
                ? 'border-dashed border-slate-800 text-slate-600'
                : 'border-slate-800 bg-slate-800/40 text-slate-500';
          const ring = d.isToday
            ? d.sessions.length
              ? ' ring-2 ring-emerald-400/60'
              : ' ring-2 ring-amber-400/60'
            : '';
          return (
            <div
              key={d.date}
              className={`rounded-xl border px-0.5 py-2 text-center${base}${ring}`}
            >
              <p className="text-[10px] font-bold uppercase">{dayLetter(i)}</p>
              <p className="text-[10px] opacity-70">{formatShort(d.date)}</p>
              <p className="mt-1 truncate text-[10px] font-semibold leading-tight">
                {d.sessions.length > 0
                  ? d.sessions.length > 1
                    ? `×${d.sessions.length}`
                    : shortOf(d.sessions[0].splitDay)
                  : d.isFuture
                    ? ''
                    : 'Rest'}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-[11px] text-slate-500">
        5-day split · 2 rest days. Green = trained · amber = today.
      </p>
    </section>
  );
}
