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
    unit: 'kg',
    goal: 'Consistent Strength Progression',
  },
  workoutHistory: [],
  // Standalone and session cardio records (0 XP contribution)
  cardioHistory: [],
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
    userProfile: {
      ...DEFAULT_STATE.userProfile,
      ...(raw.userProfile || {}),
      unit: raw.userProfile?.unit || 'kg',
      goal: raw.userProfile?.goal || 'Consistent Strength Progression',
      streakWeeks: Number(raw.userProfile?.streakWeeks) || 0,
    },
    workoutHistory: Array.isArray(raw.workoutHistory) ? raw.workoutHistory : [],
    cardioHistory: Array.isArray(raw.cardioHistory) ? raw.cardioHistory : [],
    completedSplitWeeks: Array.isArray(raw.completedSplitWeeks)
      ? raw.completedSplitWeeks
      : [],
    // Discard legacy bufferLog if present
  };
}

function buildDraft(split, date) {
  return {
    startedAt: Date.now(),
    date,
    splitKey: split.key,
    splitDay: split.label,
    cardio: null, // Optional in-workout cardio finisher
    exercises: split.exercises.map((ex) => ({
      name: ex.name,
      originalName: ex.name,
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
    // Threshold (cumulative XP) for the NEXT level
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

  /** Update user profile settings (e.g. unit 'kg'/'lbs', personal goal) */
  const updateProfile = useCallback((updates) => {
    setState((s) => ({
      ...s,
      userProfile: { ...s.userProfile, ...updates },
    }));
  }, []);

  /** Create a new in-progress session from the split template. */
  const startDraft = useCallback((splitKey) => {
    const s = stateRef.current;
    if (s.activeDraft) return;
    const split = SPLIT_DAYS.find((d) => d.key === splitKey);
    if (!split) return;
    setState({ ...s, activeDraft: buildDraft(split, todayISO()) });
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

  /** Log standalone cardio (does NOT add XP) */
  const addCardioSession = useCallback((cardioEntry) => {
    setState((s) => ({
      ...s,
      cardioHistory: [
        ...s.cardioHistory,
        {
          id: `cardio-${Date.now()}`,
          date: todayISO(),
          ...cardioEntry,
        },
      ],
    }));
  }, []);

  /**
   * Commit the in-progress session to history and award XP:
   *   +50 session · +20 per core lift at the upper rep limit (all sets)
   *   +100 full 5-day split week
   * Note: Cardio provides 0 XP contribution.
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

    if (exercises.length === 0 && !draft.cardio) {
      return { ok: false, reason: 'Log at least one set or cardio.' };
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

    const session = {
      sessionId: String(Date.now()),
      date,
      splitDay: draft.splitDay,
      exercises,
      cardio: draft.cardio || null,
    };
    const history = [...s.workoutHistory, session];

    const weekKey = isoWeekKey(date);
    const completedSplitWeeks = [...s.completedSplitWeeks];
    let streakWeeks = Number(s.userProfile.streakWeeks) || 0;

    if (!completedSplitWeeks.includes(weekKey) && hasFullSplit(history, weekKey)) {
      completedSplitWeeks.push(weekKey);
      gained += 100;
      const prevWeekKey = isoWeekKey(addDaysISO(date, -7));
      streakWeeks = completedSplitWeeks.includes(prevWeekKey)
        ? streakWeeks + 1
        : 1;
      lines.push('+100 XP · Full 5-day split complete!');
    }

    // Bug Fix: Preserve streakWeeks in updated userProfile
    const profile = bumpProfile(
      { ...s.userProfile, streakWeeks },
      gained,
      lines
    );

    // If session had cardio, also append to cardio history for standalone tracking
    let nextCardioHistory = s.cardioHistory;
    if (draft.cardio) {
      nextCardioHistory = [
        ...s.cardioHistory,
        {
          id: `cardio-${Date.now()}`,
          date,
          sessionId: session.sessionId,
          ...draft.cardio,
        },
      ];
    }

    setState({
      ...s,
      userProfile: profile,
      workoutHistory: history,
      cardioHistory: nextCardioHistory,
      completedSplitWeeks,
      activeDraft: null,
    });
    fireXp(gained, lines);
    return { ok: true, total: gained, lines, session };
  }, [fireXp]);

  /** Delete an accidental or duplicate workout session from history */
  const deleteSession = useCallback((sessionId) => {
    setState((s) => ({
      ...s,
      workoutHistory: s.workoutHistory.filter((sess) => sess.sessionId !== sessionId),
      cardioHistory: s.cardioHistory.filter((c) => c.sessionId !== sessionId),
    }));
  }, []);

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
    updateProfile,
    startDraft,
    updateDraft,
    clearDraft,
    addCardioSession,
    commitSession,
    deleteSession,
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
