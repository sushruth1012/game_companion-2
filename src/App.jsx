import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import SplashPage from './pages/Splash';
import GameSelectionPage from './pages/GameSelection';
import ThemeSelectionPage from './pages/ThemeSelection';
import PlayerSetupPage from './pages/PlayerSetup';
import LiveCompanionPage from './pages/LiveCompanion';
import LeaderboardPage from './pages/Leaderboard';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import './styles/theme.css';

export function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          {/* Standard Routes defined in Team Developer Guide */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/game-selection" element={<GameSelectionPage />} />
          <Route path="/theme-selection" element={<ThemeSelectionPage />} />
          <Route path="/player-setup" element={<PlayerSetupPage />} />
          <Route path="/live-game" element={<LiveCompanionPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
