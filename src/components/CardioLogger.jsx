import React, { useState } from 'react';

export const CARDIO_TYPES = [
  'Incline Treadmill Walk',
  'Outdoor Running',
  'Stationary Bike',
  'Rowing Machine',
  'Stairmaster',
  'Jump Rope',
  'Elliptical',
  'HIIT Intervals',
  'Walking / Commute',
  'Custom Cardio'
];

export default function CardioLogger({ onSave, initialData, unit = 'km' }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(initialData?.type || CARDIO_TYPES[0]);
  const [customType, setCustomType] = useState('');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [distance, setDistance] = useState(initialData?.distance || '');
  const [intensity, setIntensity] = useState(initialData?.intensity || 'Moderate');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalType = type === 'Custom Cardio' ? (customType.trim() || 'Custom Cardio') : type;
    const durNum = Number(duration) || 0;
    if (durNum <= 0) {
      alert('Please enter a duration greater than 0 minutes.');
      return;
    }
    onSave({
      type: finalType,
      duration: durNum,
      distance: Number(distance) || 0,
      intensity,
      notes: notes.trim(),
      loggedAt: Date.now(),
    });
    setOpen(false);
    // Reset fields if adding fresh
    if (!initialData) {
      setDuration('');
      setDistance('');
      setNotes('');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-100">Cardio &amp; Conditioning</h3>
            <span className="rounded-md border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
              0 XP
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Track endurance &amp; aerobic work without skewing strength leveling.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 active:scale-[0.98]"
        >
          {open ? 'Cancel' : initialData ? 'Edit Cardio' : '+ Log Cardio'}
        </button>
      </div>

      {/* Display saved data when closed */}
      {!open && initialData && (
        <div className="mt-3 rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-200">{initialData.type}</span>
            <span className="text-xs font-semibold text-sky-300">
              {initialData.duration} mins
              {initialData.distance > 0 ? ` · ${initialData.distance} ${unit}` : ''}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Intensity: <span className="font-semibold text-slate-300">{initialData.intensity}</span>
            {initialData.notes ? ` · "${initialData.notes}"` : ''}
          </p>
        </div>
      )}

      {/* Form modal or inline expansion */}
      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-slate-800 pt-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400">
              Cardio Activity
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-100 focus:border-sky-500 focus:outline-none"
            >
              {CARDIO_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {type === 'Custom Cardio' && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400">
                Custom Activity Name
              </label>
              <input
                type="text"
                placeholder="e.g. Swimming, Boxing, Hill Sprints"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400">
                Duration (mins)*
              </label>
              <input
                type="number"
                min="1"
                placeholder="20"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-bold text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400">
                Distance ({unit})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Optional (e.g. 3.5)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-bold text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400">
              Intensity
            </label>
            <div className="mt-1 grid grid-cols-3 gap-1.5">
              {['Low', 'Moderate', 'High'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setIntensity(lvl)}
                  className={`rounded-lg py-1.5 text-xs font-bold transition ${
                    intensity === lvl
                      ? 'border border-sky-400 bg-sky-500/20 text-sky-200'
                      : 'border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Incline 12%, pace 5 km/h, heart rate..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-sky-500 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 active:scale-[0.98]"
            >
              Save Cardio
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
