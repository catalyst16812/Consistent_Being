import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import DashboardView from './components/DashboardView.jsx';
import WorkoutListView from './components/WorkoutListView.jsx';
import ActiveWorkoutView from './components/ActiveWorkoutView.jsx';
import SettingsView from './components/SettingsView.jsx';
import HistoryInsightsView from './components/HistoryInsightsView.jsx';
import InstallPwaPrompt from './components/InstallPwaPrompt.jsx';
import XpToast from './components/XpToast.jsx';

export default function App() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-950">
      <main className="flex-1 pb-24">
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/workouts" element={<WorkoutListView />} />
          <Route path="/workout/:splitKey" element={<ActiveWorkoutView />} />
          <Route path="/insights" element={<HistoryInsightsView />} />
          <Route path="/history" element={<HistoryInsightsView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="*" element={<DashboardView />} />
        </Routes>
      </main>
      <InstallPwaPrompt />
      <Navigation />
      <XpToast />
    </div>
  );
}
