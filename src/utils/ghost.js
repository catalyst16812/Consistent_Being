// "Ghosting": look up the most recently recorded session for an exercise
// and return its working set (weight + reps) as the progressive-overload
// placeholder target.

export function getGhost(exerciseName, workoutHistory) {
  if (!exerciseName) return null;
  for (let i = workoutHistory.length - 1; i >= 0; i -= 1) {
    const session = workoutHistory[i];
    const exercise = session?.exercises?.find((e) => e.name === exerciseName);
    if (!exercise?.sets?.length) continue;
    const working =
      exercise.sets.find((s) => (Number(s.weight) || 0) > 0) || exercise.sets[0];
    if ((Number(working.weight) || 0) > 0) {
      return {
        weight: Number(working.weight),
        reps: Number(working.reps) || 0,
        date: session.date,
      };
    }
  }
  return null;
}
