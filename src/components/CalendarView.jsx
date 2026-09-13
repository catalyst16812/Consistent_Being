import React, { useState, useMemo } from 'react';
import { useAppState } from '../context/AppStateContext.jsx';
import {
  todayISO,
  formatLong,
  formatDateWithYear,
  dayLetter,
} from '../utils/dates.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CalendarView() {
  const {
    state,
    activeSplit,
    markAttendance,
    unmarkAttendance,
  } = useAppState();

  const today = todayISO();
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed
  const monthName = MONTH_NAMES[month];

  // Navigate months
  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setViewDate(new Date());
    setSelectedDate(today);
  };

  // Pre-index records by date string ('YYYY-MM-DD') for O(1) lookups
  const workoutMap = useMemo(() => {
    const map = new Map();
    (state.workoutHistory || []).forEach((session) => {
      const list = map.get(session.date) || [];
      list.push(session);
      map.set(session.date, list);
    });
    return map;
  }, [state.workoutHistory]);

  const attendanceMap = useMemo(() => {
    const map = new Map();
    (state.attendanceHistory || []).forEach((att) => {
      map.set(att.date, att);
    });
    return map;
  }, [state.attendanceHistory]);

  const cardioMap = useMemo(() => {
    const map = new Map();
    (state.cardioHistory || []).forEach((c) => {
      const list = map.get(c.date) || [];
      list.push(c);
      map.set(c.date, list);
    });
    return map;
  }, [state.cardioHistory]);

  const weightMap = useMemo(() => {
    const map = new Map();
    (state.weightHistory || []).forEach((w) => {
      map.set(w.date, w.weight);
    });
    return map;
  }, [state.weightHistory]);

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

    const days = [];

    // Empty cells before day 1
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }

    // Days 1..daysInMonth
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const workouts = workoutMap.get(dateStr) || [];
      const attendance = attendanceMap.get(dateStr) || null;
      const cardios = cardioMap.get(dateStr) || [];
      const weight = weightMap.get(dateStr) || null;
      const isToday = dateStr === today;
      const isFuture = dateStr > today;
      const isActive = workouts.length > 0 || Boolean(attendance) || cardios.length > 0;

      days.push({
        empty: false,
        key: dateStr,
        dayNumber: d,
        date: dateStr,
        workouts,
        attendance,
        cardios,
        weight,
        isToday,
        isFuture,
        isActive,
      });
    }

    return days;
  }, [year, month, today, workoutMap, attendanceMap, cardioMap, weightMap]);

  // Consistency & Patterns Analytics for this month
  const monthAnalytics = useMemo(() => {
    const realDays = calendarDays.filter((d) => !d.empty);
    const pastOrTodayDays = realDays.filter((d) => !d.isFuture);
    const activeDaysCount = realDays.filter((d) => d.isActive).length;

    // Estimate monthly target days based on active split
    const splitLength = activeSplit.length || 5;
    // Estimated target workouts for this month: (daysInMonth / 7) * splitLength
    const daysInMonth = realDays.length || 30;
    const targetDaysCount = Math.round((daysInMonth / 7) * splitLength);
    const consistencyPct = targetDaysCount > 0
      ? Math.min(100, Math.round((activeDaysCount / targetDaysCount) * 100))
      : 0;

    // Day of week distribution (Monday = 0 ... Sunday = 6)
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayOfWeekTotals = [0, 0, 0, 0, 0, 0, 0];

    realDays.forEach((d) => {
      const dayIdx = (new Date(d.date).getDay() + 6) % 7;
      dayOfWeekTotals[dayIdx] += 1;
      if (d.isActive) {
        dayOfWeekCounts[dayIdx] += 1;
      }
    });

    return {
      activeDaysCount,
      targetDaysCount,
      consistencyPct,
      pastDaysCount: pastOrTodayDays.length,
      dayOfWeekCounts,
      dayOfWeekTotals,
    };
  }, [calendarDays, activeSplit]);

  // Selected date details
  const selectedDetails = useMemo(() => {
    const dateStr = selectedDate;
    const workouts = workoutMap.get(dateStr) || [];
    const attendance = attendanceMap.get(dateStr) || null;
    const cardios = cardioMap.get(dateStr) || [];
    const weight = weightMap.get(dateStr) || null;
    const isToday = dateStr === today;
    const isAttended = Boolean(attendance);

    return {
      date: dateStr,
      isToday,
      workouts,
      attendance,
      isAttended,
      cardios,
      weight,
      unit: state.userProfile?.unit || 'kg',
    };
  }, [selectedDate, today, workoutMap, attendanceMap, cardioMap, weightMap, state.userProfile]);

  return (
    <div className="space-y-4 px-4 pt-5 pb-8">
      {/* Page Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-50">Calendar</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Consistency tracking, patterns &amp; daily presence
          </p>
        </div>
        <button
          type="button"
          onClick={goToToday}
          className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
        >
          Today
        </button>
      </header>

      {/* Month Navigation Card */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-sm font-black text-slate-300 hover:bg-slate-700 active:scale-90"
        >
          ‹
        </button>

        <div className="text-center">
          <h2 className="text-base font-black text-slate-100">
            {monthName} {year}
          </h2>
          <p className="text-[11px] font-medium text-slate-400">
            {monthAnalytics.activeDaysCount} active days · {monthAnalytics.consistencyPct}% consistency
          </p>
        </div>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-sm font-black text-slate-300 hover:bg-slate-700 active:scale-90"
        >
          ›
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 shadow-sm">
        {/* Weekday Labels (Mon-Sun) */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAY_NAMES.map((name, i) => (
            <div
              key={name}
              className="py-1 text-[11px] font-bold uppercase text-slate-500"
            >
              {dayLetter(i)}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="mt-1.5 grid grid-cols-7 gap-1">
          {calendarDays.map((cell) => {
            if (cell.empty) {
              return <div key={cell.key} className="h-13 rounded-xl" />;
            }

            const isSelected = cell.date === selectedDate;
            const hasWorkout = cell.workouts.length > 0;
            const hasAttendance = Boolean(cell.attendance);
            const hasCardio = cell.cardios.length > 0;

            // Highlight border and background styles
            let cellStyle = 'border border-slate-800 bg-slate-950/50 text-slate-400';
            if (hasWorkout) {
              cellStyle = 'border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-bold';
            } else if (hasAttendance) {
              cellStyle = 'border border-violet-500/40 bg-violet-500/15 text-violet-300 font-bold';
            } else if (hasCardio) {
              cellStyle = 'border border-sky-500/40 bg-sky-500/15 text-sky-300 font-bold';
            } else if (cell.isToday) {
              cellStyle = 'border border-amber-400/60 bg-amber-400/10 text-amber-300';
            } else if (cell.isFuture) {
              cellStyle = 'border border-slate-900 bg-transparent text-slate-700';
            }

            const ringStyle = isSelected ? ' ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : '';

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelectedDate(cell.date)}
                className={`relative flex h-13 flex-col items-center justify-between rounded-xl p-1 transition ${cellStyle}${ringStyle} active:scale-95`}
              >
                <div className="flex w-full items-center justify-between px-0.5">
                  <span className="text-[11px] leading-none">
                    {cell.dayNumber}
                  </span>
                  {cell.weight ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title={`Weighed in: ${cell.weight}`} />
                  ) : null}
                </div>

                {/* Day Content Badges / Indicators */}
                <div className="flex w-full flex-col items-center justify-center gap-0.5">
                  {hasWorkout ? (
                    <span className="w-full truncate rounded bg-emerald-500/30 px-0.5 text-center text-[8px] font-black uppercase text-emerald-200">
                      {cell.workouts[0].splitDay?.split('-')[1]?.trim() || 'Lift'}
                    </span>
                  ) : hasAttendance ? (
                    <span className="rounded bg-violet-500/30 px-1 text-[9px] font-black text-violet-200">
                      📍 Gym
                    </span>
                  ) : hasCardio ? (
                    <span className="rounded bg-sky-500/30 px-1 text-[9px] font-black text-sky-200">
                      🏃 {cell.cardios[0].duration}m
                    </span>
                  ) : (
                    <span className="h-2" />
                  )}
                </div>

                {/* Bottom status dots */}
                <div className="flex items-center gap-0.5 pb-0.5">
                  {cell.isToday && (
                    <span className="h-1 w-1 rounded-full bg-amber-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Workout
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-400" /> Attendance
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400" /> Cardio
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Today / BW
          </span>
        </div>
      </div>

      {/* Selected Day Details Inspector */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-100">
              {formatLong(selectedDetails.date)}
            </h3>
            <p className="text-[11px] text-slate-400">
              {formatDateWithYear(selectedDetails.date)}
              {selectedDetails.isToday ? ' · Today' : ''}
            </p>
          </div>

          {/* Quick attendance toggle for this day */}
          {selectedDetails.isAttended ? (
            <button
              type="button"
              onClick={() => unmarkAttendance(selectedDetails.date)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-95"
            >
              Unmark Attendance
            </button>
          ) : (
            <button
              type="button"
              onClick={() => markAttendance(selectedDetails.date)}
              className="rounded-xl border border-violet-500/40 bg-violet-500/20 px-2.5 py-1 text-xs font-bold text-violet-300 hover:bg-violet-500/30 active:scale-95"
            >
              + Mark Attendance
            </button>
          )}
        </div>

        {/* Details Content */}
        <div className="mt-3 space-y-2.5">
          {/* Workouts */}
          {selectedDetails.workouts.length > 0 ? (
            selectedDetails.workouts.map((w, idx) => {
              const totalSets = w.exercises.reduce((sum, e) => sum + e.sets.length, 0);
              const totalVolume = w.exercises.reduce(
                (sum, e) =>
                  sum + e.sets.reduce((x, s) => x + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0),
                0
              );
              return (
                <div key={idx} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300">
                      🏋️ {w.splitDay}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      {Math.round(totalVolume)} {selectedDetails.unit} · {totalSets} sets
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {w.exercises.map((e, eIdx) => (
                      <span
                        key={eIdx}
                        className="rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                      >
                        {e.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          ) : null}

          {/* Cardio */}
          {selectedDetails.cardios.length > 0 ? (
            selectedDetails.cardios.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-500/10 p-2.5 text-xs text-sky-200">
                <span className="font-bold">🏃 {c.type || 'Cardio'}</span>
                <span>{c.duration} mins {c.distance ? `· ${c.distance} ${selectedDetails.unit === 'lbs' ? 'mi' : 'km'}` : ''}</span>
              </div>
            ))
          ) : null}

          {/* Attendance indicator if attended */}
          {selectedDetails.isAttended && (
            <div className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 p-2.5 text-xs text-violet-200">
              <span>📍 Gym Attendance Logged</span>
              <span className="text-[10px] opacity-75">(Recorded presence)</span>
            </div>
          )}

          {/* Bodyweight */}
          {selectedDetails.weight ? (
            <div className="flex items-center justify-between rounded-xl border border-amber-400/30 bg-amber-400/10 p-2.5 text-xs text-amber-200">
              <span className="font-bold">⚖️ Bodyweight</span>
              <span className="font-bold">{selectedDetails.weight} {selectedDetails.unit}</span>
            </div>
          ) : null}

          {/* If completely empty */}
          {selectedDetails.workouts.length === 0 &&
           !selectedDetails.isAttended &&
           selectedDetails.cardios.length === 0 &&
           !selectedDetails.weight && (
            <p className="py-2 text-center text-xs text-slate-500">
              Rest or non-training day. No logs recorded for this date.
            </p>
          )}
        </div>
      </section>

      {/* Consistency & Training Patterns Analytics */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200">Weekly Consistency Pattern</h3>
          <span className="text-xs font-bold text-emerald-400">
            {monthAnalytics.consistencyPct}% Consistency
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Showing which days of the week you train or attend most frequently this month:
        </p>

        {/* Day-of-week frequency bars */}
        <div className="space-y-2 pt-1">
          {WEEKDAY_NAMES.map((name, i) => {
            const activeCount = monthAnalytics.dayOfWeekCounts[i] || 0;
            const totalPossible = monthAnalytics.dayOfWeekTotals[i] || 1;
            const pct = Math.round((activeCount / totalPossible) * 100);

            return (
              <div key={name} className="flex items-center gap-2 text-xs">
                <span className="w-8 font-bold text-slate-400">
                  {dayLetter(i)}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 75
                        ? 'bg-emerald-500'
                        : pct >= 50
                          ? 'bg-amber-400'
                          : pct > 0
                            ? 'bg-sky-400'
                            : 'bg-transparent'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-16 text-right text-[11px] font-semibold text-slate-400">
                  {activeCount}/{totalPossible} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
