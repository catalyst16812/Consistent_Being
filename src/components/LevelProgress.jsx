import React from 'react';
import { useAppState } from '../context/AppStateContext.jsx';
import { levelTitle, levelProgress } from '../utils/xp.js';

export default function LevelProgress() {
  const { state } = useAppState();
  const profile = state.userProfile;
  const { into, span, pct } = levelProgress(profile);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Level {profile.currentLevel} · {levelTitle(profile.currentLevel)}
          </p>
          <p className="mt-1 text-2xl font-black text-slate-50">
            {profile.currentXP}{' '}
            <span className="text-sm font-semibold text-slate-400">
              / {profile.xpToNextLevel} XP
            </span>
          </p>
        </div>
        {profile.streakWeeks > 0 && (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
            {profile.streakWeeks}-week streak
          </span>
        )}
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500"
          style={{ width: `${Math.round(pct * 100)}%` }}
        />
      </div>
      <p className="mt-1.5 text-right text-[11px] text-slate-500">
        {Math.round(into)} / {span} XP to level {profile.currentLevel + 1}
      </p>
    </section>
  );
}
