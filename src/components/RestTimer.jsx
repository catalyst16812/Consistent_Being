import React, { useEffect, useRef, useState } from 'react';

const PRESETS = [
  { label: '60s', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '3m', seconds: 180 },
];

function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    /* no haptics available (desktop) */
  }
}

function beep(ctx) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch {
    /* audio blocked */
  }
}

/**
 * Actionable rest countdown (60s / 90s / 3m) with visual pulse + haptic
 * (and audio) feedback on completion.
 */
export default function RestTimer() {
  const [running, setRunning] = useState(null); // { endAt, total, label }
  const [remaining, setRemaining] = useState(0);
  const [flash, setFlash] = useState(false);
  const audioRef = useRef(null);
  const flashTimer = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    const compute = () =>
      Math.max(0, Math.ceil((running.endAt - Date.now()) / 1000));
    setRemaining(compute());

    const finish = () => {
      setRunning(null);
      setFlash(true);
      vibrate([120, 60, 120, 60, 240]);
      beep(audioRef.current);
      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(false), 2500);
    };

    const id = setInterval(() => {
      if (compute() <= 0) finish();
      else setRemaining(compute());
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const start = (preset) => {
    try {
      if (!audioRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioRef.current = new Ctx();
      }
      if (audioRef.current?.state === 'suspended') {
        audioRef.current.resume().catch(() => {});
      }
    } catch {
      /* no audio */
    }
    setRunning({
      endAt: Date.now() + preset.seconds * 1000,
      total: preset.seconds,
      label: preset.label,
    });
    setRemaining(preset.seconds);
  };

  const cancel = () => {
    setRunning(null);
    setRemaining(0);
  };

  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <section
      className={`rounded-2xl border p-3 transition-colors ${
        flash
          ? 'animate-pulse border-emerald-400 bg-emerald-500/15'
          : running
            ? 'border-amber-400/50 bg-slate-900/70'
            : 'border-slate-800 bg-slate-900/70'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Rest Timer
        </span>
        {flash && (
          <span className="text-xs font-black text-emerald-300">
            Rest done — next set!
          </span>
        )}
        {running && !flash && (
          <button
            type="button"
            onClick={cancel}
            className="text-xs font-semibold text-slate-500 active:text-rose-400"
          >
            Cancel
          </button>
        )}
      </div>

      {running ? (
        <div className="mt-2 flex items-center justify-center">
          <span className="text-4xl font-black tabular-nums text-amber-300">
            {mm}:{ss}
          </span>
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => start(p)}
              className={`rounded-xl py-2.5 text-sm font-black transition ${
                flash
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800 text-slate-200 active:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
