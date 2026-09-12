// "Ghosting": look up the most recently recorded session for an exercise
// and return its working set (weight + reps) as the progressive-overload
// placeholder target. Supports weighted, bodyweight (0 kg), and rep-focused exercises.

export function getGhost(exerciseName, workoutHistory) {
  if (!exerciseName || !Array.isArray(workoutHistory)) return null;

  for (let i = workoutHistory.length - 1; i >= 0; i -= 1) {
    const session = workoutHistory[i];
    const exercise = session?.exercises?.find((e) => e.name === exerciseName);
    if (!exercise?.sets?.length) continue;

    // Find sets that have either weight > 0 or reps > 0
    const validSets = exercise.sets.filter(
      (s) => (Number(s.weight) || 0) > 0 || (Number(s.reps) || 0) > 0
    );
    if (validSets.length === 0) continue;

    // Pick top working set (highest weight; if weights equal, highest reps)
    const topSet = validSets.reduce((best, cur) => {
      const wBest = Number(best.weight) || 0;
      const wCur = Number(cur.weight) || 0;
      if (wCur > wBest) return cur;
      if (wCur === wBest && (Number(cur.reps) || 0) > (Number(best.reps) || 0)) return cur;
      return best;
    }, validSets[0]);

    const weight = Number(topSet.weight) || 0;
    const reps = Number(topSet.reps) || 0;

    return {
      weight,
      reps,
      isBodyweight: weight === 0 && reps > 0,
      date: session.date,
    };
  }

  return null;
}
