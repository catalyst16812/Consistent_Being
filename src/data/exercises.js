// The 5-day training split + biomechanically-equivalent swap mappings.

export const SPLIT_DAYS = [
  {
    key: 'push',
    day: 1,
    label: 'Day 1 - Push',
    short: 'Push',
    focus: 'Chest · Shoulders · Triceps',
    exercises: [
      { name: 'Flat Barbell Bench Press', targetReps: '6-8', sets: 4 },
      { name: 'Machine Shoulder Press', targetReps: '8-10', sets: 3 },
      { name: 'Incline Dumbbell Press', targetReps: '8-12', sets: 3 },
      { name: 'Cable Triceps Pushdown', targetReps: '10-12', sets: 3 },
    ],
  },
  {
    key: 'pull',
    day: 2,
    label: 'Day 2 - Pull',
    short: 'Pull',
    focus: 'Back · Biceps',
    exercises: [
      { name: 'Barbell Bent-Over Row', targetReps: '6-10', sets: 4 },
      { name: 'Lat Pulldown', targetReps: '8-12', sets: 3 },
      { name: 'Face Pull', targetReps: '12-15', sets: 3 },
      { name: 'Barbell Curl', targetReps: '10-12', sets: 3 },
    ],
  },
  {
    key: 'legs',
    day: 3,
    label: 'Day 3 - Legs',
    short: 'Legs',
    focus: 'Quads · Hamstrings · Calves',
    exercises: [
      { name: 'Barbell Squat', targetReps: '5-8', sets: 4 },
      { name: 'Leg Press', targetReps: '10-12', sets: 3 },
      { name: 'Romanian Deadlift', targetReps: '8-10', sets: 3 },
      { name: 'Standing Calf Raise', targetReps: '12-15', sets: 3 },
    ],
  },
  {
    key: 'upper',
    day: 4,
    label: 'Day 4 - Upper',
    short: 'Upper',
    focus: 'Full upper body',
    exercises: [
      { name: 'Overhead Press', targetReps: '6-10', sets: 4 },
      { name: 'Seated Cable Row', targetReps: '8-12', sets: 3 },
      { name: 'Dumbbell Lateral Raise', targetReps: '12-15', sets: 3 },
      { name: 'Hammer Curl', targetReps: '10-12', sets: 3 },
    ],
  },
  {
    key: 'lower',
    day: 5,
    label: 'Day 5 - Lower',
    short: 'Lower',
    focus: 'Posterior chain · Calves',
    exercises: [
      { name: 'Barbell Deadlift', targetReps: '4-6', sets: 3 },
      { name: 'Front Squat', targetReps: '6-10', sets: 3 },
      { name: 'Lying Leg Curl', targetReps: '10-15', sets: 3 },
      { name: 'Seated Calf Raise', targetReps: '12-15', sets: 3 },
    ],
  },
];

// Core compound movements tracked on the strength trajectory chart
// and eligible for the "+20 XP · upper rep limit" bonus.
export const CORE_LIFTS = ['Flat Barbell Bench Press', 'Barbell Deadlift', 'Barbell Squat'];

export const LIFT_SHORT = {
  'Flat Barbell Bench Press': 'Bench',
  'Barbell Deadlift': 'Deadlift',
  'Barbell Squat': 'Squat',
};

export const LIFT_COLORS = {
  'Flat Barbell Bench Press': '#34d399',
  'Barbell Deadlift': '#fbbf24',
  'Barbell Squat': '#38bdf8',
};

// Equipment-unavailable / injury workarounds: biomechanically equivalent movements.
export const SWAP_MAP = {
  'Flat Barbell Bench Press': ['Flat Dumbbell Press', 'Machine Chest Press', 'Incline Barbell Bench Press'],
  'Flat Dumbbell Press': ['Machine Chest Press', 'Incline Dumbbell Press', 'Push-Up'],
  'Machine Chest Press': ['Flat Barbell Bench Press', 'Flat Dumbbell Press'],
  'Incline Barbell Bench Press': ['Incline Dumbbell Press', 'Machine Chest Press'],
  'Incline Dumbbell Press': ['Incline Machine Press', 'Machine Chest Press', 'Push-Up'],
  'Incline Machine Press': ['Incline Dumbbell Press', 'Machine Chest Press'],
  'Machine Shoulder Press': ['Seated Dumbbell Shoulder Press', 'Smith Machine Shoulder Press'],
  'Seated Dumbbell Shoulder Press': ['Machine Shoulder Press', 'Smith Machine Shoulder Press'],
  'Smith Machine Shoulder Press': ['Machine Shoulder Press', 'Seated Dumbbell Shoulder Press'],
  'Cable Triceps Pushdown': ['Rope Overhead Triceps Extension', 'Barbell Skull Crusher'],
  'Rope Overhead Triceps Extension': ['Cable Triceps Pushdown', 'Barbell Skull Crusher'],
  'Barbell Bent-Over Row': ['Pendlay Row', 'Chest-Supported Row', 'Dumbbell Row'],
  'Pendlay Row': ['Barbell Bent-Over Row', 'Chest-Supported Row'],
  'Chest-Supported Row': ['Barbell Bent-Over Row', 'Seated Cable Row'],
  'Dumbbell Row': ['Barbell Bent-Over Row', 'Chest-Supported Row'],
  'Lat Pulldown': ['Wide-Grip Lat Pulldown', 'Assisted Pull-Up', 'Lat Pullover'],
  'Wide-Grip Lat Pulldown': ['Lat Pulldown', 'Assisted Pull-Up'],
  'Face Pull': ['Cable Face Pull', 'Band Pull-Apart', 'Dumbbell Lateral Raise'],
  'Cable Face Pull': ['Face Pull', 'Band Pull-Apart'],
  'Barbell Curl': ['Dumbbell Curl', 'Cable Curl', 'Preacher Curl'],
  'Dumbbell Curl': ['Barbell Curl', 'Cable Curl'],
  'Cable Curl': ['Barbell Curl', 'Dumbbell Curl'],
  'Barbell Squat': ['Leg Press', 'Hack Squat', 'Goblet Squat'],
  'Leg Press': ['Hack Squat', 'Smith Machine Squat', 'Barbell Squat'],
  'Hack Squat': ['Leg Press', 'Smith Machine Squat'],
  'Goblet Squat': ['Leg Press', 'Barbell Squat', 'Front Squat'],
  'Romanian Deadlift': ['Dumbbell Romanian Deadlift', 'Lying Leg Curl', 'Seated Leg Curl'],
  'Dumbbell Romanian Deadlift': ['Romanian Deadlift', 'Lying Leg Curl'],
  'Standing Calf Raise': ['Seated Calf Raise', 'Calf Press'],
  'Seated Calf Raise': ['Standing Calf Raise', 'Calf Press'],
  'Overhead Press': ['Seated Dumbbell Shoulder Press', 'Machine Shoulder Press', 'Push Press'],
  'Push Press': ['Overhead Press', 'Seated Dumbbell Shoulder Press'],
  'Seated Cable Row': ['Barbell Bent-Over Row', 'Chest-Supported Row'],
  'Dumbbell Lateral Raise': ['Cable Lateral Raise', 'Machine Lateral Raise'],
  'Cable Lateral Raise': ['Dumbbell Lateral Raise', 'Machine Lateral Raise'],
  'Hammer Curl': ['Cable Hammer Curl', 'Dumbbell Hammer Curl'],
  'Cable Hammer Curl': ['Hammer Curl', 'Dumbbell Hammer Curl'],
  'Dumbbell Hammer Curl': ['Hammer Curl', 'Cable Hammer Curl'],
  'Barbell Deadlift': ['Trap Bar Deadlift', 'Rack Pull', 'Sumo Deadlift', 'Kettlebell Swing'],
  'Trap Bar Deadlift': ['Barbell Deadlift', 'Rack Pull'],
  'Rack Pull': ['Barbell Deadlift', 'Trap Bar Deadlift'],
  'Sumo Deadlift': ['Barbell Deadlift', 'Trap Bar Deadlift'],
  'Kettlebell Swing': ['Trap Bar Deadlift', 'Barbell Deadlift'],
  'Front Squat': ['Goblet Squat', 'Leg Press', 'Hack Squat'],
  'Lying Leg Curl': ['Seated Leg Curl', 'Dumbbell Romanian Deadlift'],
  'Seated Leg Curl': ['Lying Leg Curl', 'Dumbbell Romanian Deadlift'],
  'Push-Up': ['Machine Chest Press', 'Flat Dumbbell Press'],
};
