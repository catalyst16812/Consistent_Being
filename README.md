# Consistent Being

Personal strength-progression & workout-consistency tracker — an offline-first progressive web app (PWA) built to run structured strength splits, track progressive overload, monitor cardiovascular endurance, and gamify training consistency.

## Features

- **Dashboard & Analytics**:
  - Weekly Heatmap (5 train / 2 rest) with unique days trained.
  - Recharts strength trajectory line chart of max working weight for Bench / Deadlift / Squat.
  - Level + XP progression bar and weekly volume metrics.
  - Cardio & conditioning tracker.
- **Workout Logger**:
  - 5-Day Split (Push / Pull / Legs / Upper / Lower) with dynamic set addition/removal.
  - Progressive overload ghosting (previous session's weight and reps shown as input placeholders, supporting both weighted and bodyweight exercises).
  - Auto-save to `localStorage` on every keystroke (survives accidental browser closure).
  - Integrated rest timers (60s / 90s / 3m) with visual pulse, Web Audio tone, and haptic feedback.
  - Cardio Finisher section (duration, distance, intensity — 0 XP contribution).
- **Exercise Library & Form Tips**:
  - Comprehensive database of 75+ exercises with tags (`Compound` vs `Isolation`), equipment, and target muscles.
  - Interactive `(i)` info button with training recommendations (heavy weight vs high-rep volume) and form cues.
  - Bi-directional exercise swaps: easily switch to biomechanically equivalent movements and back to the original movement anytime.
  - Add custom or library exercises to any active workout session.
- **Session History Management**:
  - Browse past logged workouts with full set breakdown and total volume.
  - Safe deletion of accidental or duplicate workouts with immediate metrics update.
- **XP & Leveling**:
  - +50 XP: Session logged.
  - +20 XP: Core compound lift hitting the top rep target on all sets.
  - +100 XP: Completing all 5 split days within a calendar week.
  - Every 200 XP levels you up through 10 rank titles; consecutive split weeks build your streak.
- **Preferences & Data Management**:
  - Toggle between Metric (`kg`) and Imperial (`lbs`) units.
  - Customizable motivation and personal goals banner.
  - Complete JSON backup export / import, sample data, and factory reset.

## Tech Stack

React 18 · Vite · Tailwind CSS 4 · React Context API · `localStorage` (key `workout_tracker_state`) · Recharts · Web Audio API · `vite-plugin-pwa` (Workbox).

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (dist/) + PWA service worker
npm run preview  # preview the production build
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel: *Add New → Project* → import the repo (set Root Directory to `Consistent_Being-main` if using nested folders).
3. Vercel auto-detects Vite (build `npm run build`, output `dist`). No `vercel.json` needed.
4. Open the live URL on your phone and use **Add to Home Screen** for full offline app usage.
