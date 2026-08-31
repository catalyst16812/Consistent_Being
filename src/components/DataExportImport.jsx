import React, { useRef, useState } from 'react';
import { useAppState } from '../context/AppStateContext.jsx';
import { exportBackup, parseImport } from '../utils/storage.js';

/** JSON backup utilities: export / import / sample data / reset. */
export default function DataExportImport() {
  const { state, replaceState, resetAll, loadDemo } = useAppState();
  const fileRef = useRef(null);
  const [message, setMessage] = useState(null); // { tone: 'ok' | 'err', text }

  const onExport = () => {
    exportBackup(state);
    setMessage({ tone: 'ok', text: 'Backup downloaded.' });
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseImport(String(reader.result));
        if (
          !window.confirm(
            `Import ${parsed.workoutHistory.length} sessions? This replaces the data on this device.`
          )
        )
          return;
        replaceState(parsed);
        setMessage({ tone: 'ok', text: 'Data imported.' });
      } catch (err) {
        setMessage({ tone: 'err', text: `Import failed: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  const onLoadDemo = () => {
    if (
      window.confirm(
        'Load 3 weeks of sample data? This replaces the data on this device.'
      )
    ) {
      loadDemo();
      setMessage({ tone: 'ok', text: 'Sample data loaded.' });
    }
  };

  const onReset = () => {
    if (window.confirm('Delete ALL data? This cannot be undone.')) {
      resetAll();
      setMessage({ tone: 'ok', text: 'All data cleared.' });
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-sm font-bold text-slate-200">Data Backup</h2>
      <p className="mt-1 text-xs text-slate-400">
        {state.workoutHistory.length} session
        {state.workoutHistory.length === 1 ? '' : 's'} stored on this device.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onExport}
          className="rounded-xl bg-slate-800 py-2.5 text-sm font-bold text-slate-100 active:bg-slate-700"
        >
          ⬇ Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-xl bg-slate-800 py-2.5 text-sm font-bold text-slate-100 active:bg-slate-700"
        >
          ⬆ Import JSON
        </button>
        <button
          type="button"
          onClick={onLoadDemo}
          className="rounded-xl bg-slate-800 py-2.5 text-sm font-bold text-slate-100 active:bg-slate-700"
        >
          ✨ Sample data
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-rose-500/40 bg-rose-500/10 py-2.5 text-sm font-bold text-rose-300 active:bg-rose-500/20"
        >
          Reset
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onFile}
      />

      {message && (
        <p
          className={`mt-2 text-xs font-semibold ${
            message.tone === 'ok' ? 'text-emerald-300' : 'text-rose-300'
          }`}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}
