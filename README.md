# Consistent Being

Personal strength-progression & workout-consistency tracker — an offline-first
progressive web app (PWA) built to run a structured 5-day split while
stabilizing body weight (~73 kg) and rebuilding core lift metrics (e.g. back to
a 60 kg bench press for 5–6 reps).

## Features

- **Dashboard & analytics** — weekly heatmap (5 train / 2 rest), Recharts line
  chart of max working weight for Bench / Deadlift / Squat, level + XP bar,
  weekly volume, and the daily 300 kcal buffer-snack checklist.
- **Workout logger** — 5-day split (Push / Pull / Legs / Upper / Lower) with
  ghosting (last session's weight × reps shown as input placeholders),
  auto-save to `localStorage` on every keystroke (survives closing the browser),
  and integrated rest timers (60s / 90s / 3m) with visual + haptic feedback.
- **Exercise swaps** — modal with biomechanically equivalent movements;
  ghosting dynamically follows the *new* exercise's history.
- **XP & leveling** — +50 session · +20 core lift at the upper rep limit (all
  sets) · +15 daily buffer snack · +100 full 5-day split in a calendar week.
  Every 200 XP levels you up, with rank titles; consecutive split weeks build a
  streak.
- **Data management** — export/import the entire state as `.json`, sample data,
  and full reset.

## Tech stack

React 18 · Vite · Tailwind CSS 4 · React Context API · `localStorage`
(key `workout_tracker_state`) · Recharts · `vite-plugin-pwa` (Workbox).

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (dist/) + PWA service worker
npm run preview  # preview the production build
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel: *Add New → Project* → import the repo.
3. Vercel auto-detects Vite (build `npm run build`, output `dist`). No
   `vercel.json` needed.
4. Deploy, open the live URL on your phone, and use **Add to Home Screen** to
   verify offline logging.

## Data model

Single JSON object under `localStorage['workout_tracker_state']`:

```json
{
  "userProfile": { "currentLevel": 3, "currentXP": 450, "xpToNextLevel": 600, "streakWeeks": 2 },
  "workoutHistory": [
    {
      "sessionId": "1719823450",
      "date": "2026-09-01",
      "splitDay": "Day 1 - Push",
      "calorieBufferConsumed": true,
      "exercises": [
        {
          "name": "Flat Barbell Bench Press",
          "targetReps": "6-8",
          "sets": [
            { "setNumber": 1, "weight": 60, "reps": 6 },
            { "setNumber": 2, "weight": 60, "reps": 5 },
            { "setNumber": 3, "weight": 55, "reps": 7 }
          ]
        }
      ]
    }
  ],
  "bufferLog": { "2026-09-01": true },
  "completedSplitWeeks": ["2026-W35"],
  "activeDraft": null
}
```

`bufferLog` and `completedSplitWeeks` are idempotency ledgers so the +15 XP
snack bonus and the +100 XP split-week bonus are awarded exactly once;
`activeDraft` is the auto-saved in-progress session.
