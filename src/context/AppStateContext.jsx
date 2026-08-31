import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SPLIT_DAYS, CORE_LIFTS } from '../data/exercises.js';
import { todayISO, isoWeekKey, addDaysISO } from '../utils/dates.js';
import {
  levelFromXp,
  xpToReachLevel,
  levelTitle,
  parseRepsRange,
} from '../utils/xp.js';
import { loadState, saveState, clearState } from '../utils/storage.js';
import { buildDemoState } from '../utils/demo.js';

export const DEFAULT_STATE = {
  userProfile: {
    currentLevel: 1,
    currentXP: 0,
    xpToNextLevel: 200,
    streakWeeks: 0,
  },
  workoutHistory: [],
  // { 'YYYY-MM-DD': true } — idempotency ledger for the +15 XP snack bonus
  bufferLog: {},
  // ['2026-W35', ...] — weeks where the full 5-day split was completed (+100 XP)
  completedSplitWeeks: [],
  // Auto-saved in-progress session (survives accidental browser closure)
  activeDraft: null,
};

function withDefaults(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_STATE };
  return {
    ...DEFAULT_STATE,
    ...raw,
    userProfile: { ...DEFAULT_STATE.userProfile, ...(raw.userProfile || {}) },
    workoutHistory: Array.isArray(raw.workoutHistory) ? raw.workoutHistory : [],
    bufferLog:
      raw.bufferLog && typeof raw.bufferLog === 'object' ? raw.bufferLog : {},
    completedSplitWeeks: Array.isArray(raw.completedSplitWeeks)
      ? raw.completedSplitWeeks
      : [],
  };
}

function buildDraft(split, date, bufferLog) {
  return {
    startedAt: Date.now(),
    date,
    splitKey: split.key,
    splitDay: split.label,
    calorieBufferConsumed: bufferLog?.[date] === true,
    exercises: split.exercises.map((ex) => ({
      name: ex.name,
      targetReps: ex.targetReps,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        weight: '',
        reps: '',
      })),
    })),
  };
}

function hasFullSplit(history, weekKey) {
  const logged = new Set(
    history.filter((s) => isoWeekKey(s.date) === weekKey).map((s) => s.splitDay)
  );
  return SPLIT_DAYS.every((s) => logged.has(s.label));
}

function bumpProfile(profile, amount, lines) {
  const nextXP = profile.currentXP + amount;
  const nextLevel = levelFromXp(nextXP);
  if (nextLevel > profile.currentLevel) {
    lines.push(`Level up! Now level ${nextLevel} — ${levelTitle(nextLevel)}`);
  }
  return {
    ...profile,
    currentXP: nextXP,
    currentLevel: nextLevel,
    // Threshold (cumulative XP) for the NEXT level: level 3 -> 600.
    xpToNextLevel: xpToReachLevel(nextLevel + 1),
  };
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, setState] = useState(() => withDefaults(loadState()));
  const [lastXpEvent, setLastXpEvent] = useState(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Persist the full payload to localStorage on every change (auto-save).
  useEffect(() => {
    saveState(state);
  }, [state]);

  const fireXp = useCallback((total, lines) => {
    if (total > 0) {
      setLastXpEvent({ id: Date.now(), ts: Date.now(), total, lines });
    }
  }, []);

  /** Create a new in-progress session from the split template. */
  const startDraft = useCallback((splitKey) => {
    const s = stateRef.current;
    if (s.activeDraft) return;
    const split = SPLIT_DAYS.find((d) => d.key === splitKey);
    if (!split) return;
    setState({ ...s, activeDraft: buildDraft(split, todayISO(), s.bufferLog) });
  }, []);

  /** Patch the in-progress session (pure functional update → safe to batch). */
  const updateDraft = useCallback((updater) => {
    setState((s) => {
      if (!s.activeDraft) return s;
      const nextDraft =
        typeof updater === 'function'
          ? updater(s.activeDraft)
          : { ...s.activeDraft, ...updater };
      return { ...s, activeDraft: nextDraft };
    });
  }, []);

  const clearDraft = useCallback(() => {
    setState((s) => ({ ...s, activeDraft: null }));
  }, []);

  /**
   * Daily 300 kcal buffer snack check-off.
   * Awards +15 XP exactly once per calendar day (bufferLog is the ledger).
   */
  const setBuffer = useCallback(
    (date, value) => {
      const s = stateRef.current;
      const current = s.bufferLog[date] === true;
      if (value === current) return { ok: false };
      const bufferLog = { ...s.bufferLog };
      const lines = [];
      let profile = s.userProfile;
      let gained = 0;
      if (value) {
        bufferLog[date] = true;
        gained = 15;
        lines.push('+15 XP · 300 kcal buffer snack');
      } else {
        delete bufferLog[date];
      }
      if (gained) profile = bumpProfile(profile, gained, lines);
      setState({ ...s, bufferLog, userProfile: profile });
      fireXp(gained, lines);
      return { ok: true, total: gained, lines };
    },
    [fireXp]
  );

  /**
   * Commit the in-progress session to history and award XP:
   *   +50 session · +20 per core lift at the upper rep limit (all sets)
   *   +15 buffer snack (first time for the date) · +100 full 5-day split week
   */
  const commitSession = useCallback(() => {
    const s = stateRef.current;
    const draft = s.activeDraft;
    if (!draft) return { ok: false, reason: 'No active session' };

    const exercises = draft.exercises
      .map((ex) => ({
        name: ex.name,
        targetReps: ex.targetReps,
        sets: ex.sets
          .filter(
            (set) =>
              (Number(set.weight) || 0) > 0 || (Number(set.reps) || 0) > 0
          )
          .map((set, i) => ({
            setNumber: i + 1,
            weight: Number(set.weight) || 0,
            reps: Number(set.reps) || 0,
          })),
      }))
      .filter((ex) => ex.sets.length > 0);

    if (exercises.length === 0) {
      return { ok: false, reason: 'Log at least one set.' };
    }

    const date = draft.date;
    const lines = [`+50 XP · Session logged — ${draft.splitDay}`];
    let gained = 50;

    for (const lift of CORE_LIFTS) {
      const ex = exercises.find((e) => e.name === lift);
      if (!ex) continue;
      const range = parseRepsRange(ex.targetReps);
      if (range && ex.sets.every((set) => set.reps >= range.upper)) {
        gained += 20;
        lines.push(`+20 XP · ${lift} — every set at ${range.upper}+ reps`);
      }
    }

    const bufferLog = { ...s.bufferLog };
    if (draft.calorieBufferConsumed && bufferLog[date] !== true) {
      bufferLog[date] = true;
      gained += 15;
      lines.push('+15 XP · 300 kcal buffer snack');
    }

    const session = {
      sessionId: String(Date.now()),
      date,
      splitDay: draft.splitDay,
      calorieBufferConsumed: bufferLog[date] === true,
      exercises,
    };
    const history = [...s.workoutHistory, session];

    const weekKey = isoWeekKey(date);
    const completedSplitWeeks = [...s.completedSplitWeeks];
    let streakWeeks = s.userProfile.streakWeeks;
    if (!completedSplitWeeks.includes(weekKey) && hasFullSplit(history, weekKey)) {
      completedSplitWeeks.push(weekKey);
      gained += 100;
      streakWeeks = completedSplitWeeks.includes(isoWeekKey(addDaysISO(date, -7)))
        ? streakWeeks + 1
        : 1;
      lines.push('+100 XP · Full 5-day split complete!');
    }

    const profile = bumpProfile(s.userProfile, gained, lines);

    setState({
      ...s,
      userProfile: profile,
      workoutHistory: history,
      bufferLog,
      completedSplitWeeks,
      activeDraft: null,
    });
    fireXp(gained, lines);
    return { ok: true, total: gained, lines, session };
  }, [fireXp]);

  /** Replace the whole state (import / demo). */
  const replaceState = useCallback((next) => {
    setState(withDefaults(next));
    setLastXpEvent(null);
  }, []);

  const resetAll = useCallback(() => {
    clearState();
    setState({ ...DEFAULT_STATE });
    setLastXpEvent(null);
  }, []);

  const loadDemo = useCallback(() => {
    replaceState(buildDemoState());
  }, [replaceState]);

  const value = {
    state,
    lastXpEvent,
    startDraft,
    updateDraft,
    clearDraft,
    setBuffer,
    commitSession,
    replaceState,
    resetAll,
    loadDemo,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}
