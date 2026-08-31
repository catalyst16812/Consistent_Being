// Demo payload: three weeks of 5-day split history (oldest → newest),
// with core lifts in a steady progression — handy for exploring the app.
import { SPLIT_DAYS } from '../data/exercises.js';
import { todayISO, weekStartISO, addDaysISO, isoWeekKey } from './dates.js';
import { parseRepsRange } from './xp.js';

const BASE_WEIGHTS = {
  'Machine Shoulder Press': 35,
  'Incline Dumbbell Press': 20,
  'Cable Triceps Pushdown': 25,
  'Barbell Bent-Over Row': 45,
  'Lat Pulldown': 50,
  'Face Pull': 20,
  'Barbell Curl': 20,
  'Leg Press': 140,
  'Romanian Deadlift': 60,
  'Standing Calf Raise': 40,
  'Overhead Press': 32.5,
  'Seated Cable Row': 55,
  'Dumbbell Lateral Raise': 8,
  'Hammer Curl': 14,
  'Front Squat': 45,
  'Lying Leg Curl': 30,
  'Seated Calf Raise': 60,
};

// 3-week progression for the core lifts (index 0 = oldest week).
const CORE_PROGRESSION = {
  'Flat Barbell Bench Press': [50, 52.5, 55],
  'Barbell Squat': [70, 72.5, 75],
  'Barbell Deadlift': [90, 95, 100],
};

function makeSets(weight, targetReps, setCount) {
  const range = parseRepsRange(targetReps);
  const base = range ? range.lower : 8;
  return Array.from({ length: setCount }, (_, i) => ({
    setNumber: i + 1,
    weight,
    reps: i < setCount - 1 ? base : Math.max(1, base - 1),
  }));
}

export function buildDemoState() {
  const today = todayISO();
  const thisWeekStart = weekStartISO(today);
  const history = [];
  const bufferLog = {};
  const completedSplitWeeks = [];

  [2, 1, 0].forEach((offset) => {
    const weekStart = addDaysISO(thisWeekStart, -7 * offset);
    const weekIndex = 2 - offset; // 0, 1, 2
    let fullWeek = true;
    SPLIT_DAYS.forEach((split, dayIdx) => {
      const date = addDaysISO(weekStart, dayIdx);
      if (date > today) {
        fullWeek = false;
        return;
      }
      const exercises = split.exercises.map((ex) => {
        const weight = CORE_PROGRESSION[ex.name]
          ? CORE_PROGRESSION[ex.name][weekIndex]
          : (BASE_WEIGHTS[ex.name] ?? 20);
        return {
          name: ex.name,
          targetReps: ex.targetReps,
          sets: makeSets(weight, ex.targetReps, ex.sets),
        };
      });
      history.push({
        sessionId: `demo-${date}-${split.key}`,
        date,
        splitDay: split.label,
        calorieBufferConsumed: true,
        exercises,
      });
      bufferLog[date] = true;
    });
    if (fullWeek) completedSplitWeeks.push(isoWeekKey(weekStart));
  });

  history.sort(
    (a, b) => a.date.localeCompare(b.date) || a.sessionId.localeCompare(b.sessionId)
  );

  return {
    userProfile: {
      currentLevel: 3,
      currentXP: 450,
      xpToNextLevel: 600,
      streakWeeks: completedSplitWeeks.length,
    },
    workoutHistory: history,
    bufferLog,
    completedSplitWeeks,
    activeDraft: null,
  };
}
