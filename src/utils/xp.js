// XP & leveling rules.
//
//  +50 XP  — logging a completed training session
//  +20 XP  — hitting the upper limit of the target rep range for ALL sets
//            of a core movement (bench / deadlift / squat) in that session
//  +15 XP  — checking off the daily 300 kcal buffer snack (once per day)
//  +100 XP — completing the full 5-day split within one 7-day calendar week
//
// Rank thresholds: every 200 XP levels the user up.

export const XP_PER_LEVEL = 200;

export const LEVEL_TITLES = {
  1: 'Rebuild Rookie',
  2: 'Returning Lifter',
  3: 'Momentum Builder',
  4: 'Iron Apprentice',
  5: 'Consistency Builder',
  6: 'Strength Restored',
  7: 'Iron Machine',
  8: 'Unshakeable',
  9: 'Second Skin',
  10: 'Consistent Being',
};

/** Cumulative XP -> level (level 1 starts at 0 XP). */
export function levelFromXp(xp) {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

/** Cumulative XP required to reach the given level. */
export function xpToReachLevel(level) {
  return (level - 1) * XP_PER_LEVEL;
}

export function levelTitle(level) {
  return LEVEL_TITLES[level] || 'Legendary Rebuild';
}

/** "6-8" -> { lower: 6, upper: 8 } (null when malformed). */
export function parseRepsRange(range) {
  const m = /^\s*(\d+)\s*-\s*(\d+)\s*$/.exec(range || '');
  if (!m) return null;
  return { lower: Number(m[1]), upper: Number(m[2]) };
}

/** Progress within the current level (for the XP bar). */
export function levelProgress(profile) {
  const base = xpToReachLevel(profile.currentLevel);
  const span = XP_PER_LEVEL;
  const into = Math.max(0, profile.currentXP - base);
  return { base, span, into, pct: Math.min(1, into / span) };
}
