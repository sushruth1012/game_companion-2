import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Settings, Shield, Scroll, Coins, Sparkles, Zap } from 'lucide-react';
import RiddleCard from '../../components/cards/RiddleCard';
import { nextTurn } from '../../services/turnService';
import { addPoints, deductPoints } from '../../services/pointService';
import { recordGameActivity } from '../../services/gameService';
import { STARTING_MUDRAS } from '../../lib/gameLogic';
import './LiveCompanion.css';

export const LiveCompanionPage = () => {
  const navigate = useNavigate();

  // Initialize 4 players with Member 2 STARTING_MUDRAS (8000) & secondary hero titles
  const defaultPlayers = [
    { id: 'p_1', name: 'Arjun', uid: 'CHB001', heroSecondaryTitle: 'GANDIVA', points: STARTING_MUDRAS, mudras: STARTING_MUDRAS, shieldColor: '#2ECC71', avatar: '👦', num: 1, advantages: [] },
    { id: 'p_2', name: 'Diya', uid: 'CHB002', heroSecondaryTitle: 'SURYAKAVACHA', points: STARTING_MUDRAS, mudras: STARTING_MUDRAS, shieldColor: '#3498DB', avatar: '👧', num: 2, advantages: [] },
    { id: 'p_3', name: 'Kabir', uid: 'CHB003', heroSecondaryTitle: 'DYUTA MAYA', points: STARTING_MUDRAS, mudras: STARTING_MUDRAS, shieldColor: '#E74C3C', avatar: '👦', num: 3, advantages: [] },
    { id: 'p_4', name: 'Myra', uid: 'CHB004', heroSecondaryTitle: 'MAYA SHAKTI', points: STARTING_MUDRAS, mudras: STARTING_MUDRAS, shieldColor: '#9B59B6', avatar: '👧', num: 4, advantages: [] },
  ];

  const [players, setPlayers] = useState(defaultPlayers);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [themeKey, setThemeKey] = useState('rajya');
  const [worldThemeName, setWorldThemeName] = useState('KINGDOMS');
  const [eventLogText, setEventLogText] = useState('A new story event has been triggered!');

  useEffect(() => {
    // Read configured players from setup & hero assignment
    const storedPlayers = sessionStorage.getItem('activeGamePlayers');
    if (storedPlayers) {
      try {
        const parsed = JSON.parse(storedPlayers);
        if (parsed.length > 0) {
          const fallbackTitles = ['GANDIVA', 'SURYAKAVACHA', 'DYUTA MAYA', 'MAYA SHAKTI'];
          const mapped = parsed.map((p, idx) => ({
            id: p.id || `p_${idx + 1}`,
            name: p.name || `Player ${idx + 1}`,
            uid: p.uid || `CHB00${idx + 1}`,
            heroSecondaryTitle: p.heroSecondaryTitle || (p.hero?.secondaryTitle) || fallbackTitles[idx % 4],
            heroName: p.heroName || (p.hero?.name) || 'HERO',
            points: typeof p.mudras === 'number' ? p.mudras : (typeof p.points === 'number' ? p.points : STARTING_MUDRAS),
            mudras: typeof p.mudras === 'number' ? p.mudras : (typeof p.points === 'number' ? p.points : STARTING_MUDRAS),
            shieldColor: ['#2ECC71', '#3498DB', '#E74C3C', '#9B59B6'][idx % 4],
            avatar: idx % 2 === 0 ? '👦' : '👧',
            num: idx + 1,
            advantages: p.advantages || [],
          }));
          setPlayers(mapped);
        }
      } catch (e) {
        console.error('Error parsing stored players:', e);
      }
    }

    // Read active theme
    const storedTheme = localStorage.getItem('selectedTheme') || sessionStorage.getItem('activeTheme');
    if (storedTheme) {
      setThemeKey(storedTheme);
      const names = {
        rajya: 'KINGDOMS',
        navarasa: 'NAVARASA',
        panchabootha: 'PANCHABOOTHA',
        kala_yuga: 'KALA & YUGA',
        kshetra_devalaya: 'KSHETRA & DEVALAYA',
      };
      setWorldThemeName(names[storedTheme] || 'KINGDOMS');
    }
  }, []);

  const activePlayer = players[activePlayerIndex] || players[0];

  // Handle Player Banner Tap: Directly switches turn to that player
  const handlePlayerTap = (index) => {
    setActivePlayerIndex(index);
    const selected = players[index];
    setEventLogText(`Turn switched to ${selected.name} (${selected.heroSecondaryTitle}).`);
    recordGameActivity?.().catch(() => {});
  };

  // Next Turn Button Action
  const handleNextTurn = async () => {
    await nextTurn('chowkabara_live_session');
    setActivePlayerIndex((prev) => {
      const nextIdx = (prev + 1) % players.length;
      setEventLogText(`Turn passed to ${players[nextIdx].name} (${players[nextIdx].heroSecondaryTitle}).`);
      return nextIdx;
    });
    recordGameActivity?.().catch(() => {});
  };

  // Point/Mudras updates when buying riddle
  const handlePointsDeducted = async (updatedMudrasOrCost) => {
    const updatedPoints = typeof updatedMudrasOrCost === 'number' && updatedMudrasOrCost <= 1500
      ? Math.max(0, activePlayer.points - updatedMudrasOrCost)
      : updatedMudrasOrCost;

    await deductPoints(activePlayer.id, activePlayer.points - updatedPoints);
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, points: updatedPoints, mudras: updatedPoints } : p
      )
    );
    recordGameActivity?.().catch(() => {});
  };

  // Riddle Reward Handlers: Update points & attach unlocked Advantage
  const handleSolveSuccess = async (rewardPts, advantage) => {
    await addPoints(activePlayer.id, rewardPts);
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex
          ? {
              ...p,
              points: p.points + rewardPts,
              mudras: p.points + rewardPts,
              advantages: advantage ? [...(p.advantages || []), advantage] : p.advantages,
            }
          : p
      )
    );
    recordGameActivity?.().catch(() => {});
  };

  const handleSolveFail = async (penalty) => {
    if (penalty > 0) {
      await deductPoints(activePlayer.id, penalty);
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? { ...p, points: Math.max(0, p.points - penalty), mudras: Math.max(0, p.points - penalty) }
            : p
        )
      );
    }
    recordGameActivity?.().catch(() => {});
  };

  return (
    <div className="live-companion-screen page-transition-fade">
      {/* Dynamic Atmospheric Blurred Background */}
      <div className="live-ambient-blurred-bg" />
      <div className="live-bg-board-watermark" />

      {/* ===== TOP APP BAR ===== */}
      <header className="live-top-bar">
        {/* World Badge */}
        <div className="world-theme-badge">
          <Crown size={15} color="#D9A441" />
          <div className="world-badge-text">
            <span className="world-label">World</span>
            <span className="world-name">{worldThemeName}</span>
          </div>
        </div>

        {/* Chapter Title */}
        <div className="chapter-banner">
          <span className="chapter-title">Chapter 1: The Young Heir 📜</span>
        </div>

        {/* Right Header Status & Settings */}
        <div className="top-right-group">
          <div className="progress-badge">
            <span>Game in Progress ⏳</span>
          </div>
          <button
            type="button"
            className="settings-gear-btn"
            onClick={() => navigate('/settings')}
            aria-label="Settings"
          >
            <Settings size={17} />
          </button>
        </div>
      </header>

      {/* ===== MAIN PLAY AREA: 2 COLUMNS OF PLAYERS + CENTER RIDDLE CARD ===== */}
      <main className="live-main-arena">
        {/* LEFT COLUMN: Player 1 & Player 3 */}
        <div className="players-column players-column--left">
          {players.filter((_, idx) => idx % 2 === 0).map((player, filteredIdx) => {
            const originalIndex = filteredIdx * 2;
            const isActive = originalIndex === activePlayerIndex;

            return (
              <div
                key={player.id}
                className={`player-side-card ${isActive ? 'player-side-card--active' : ''}`}
                onClick={() => handlePlayerTap(originalIndex)}
                title="Tap to make active turn"
              >
                {/* Number Badge */}
                <div className="player-num-pill">{player.num}</div>

                {/* Avatar */}
                <div className="player-avatar-circle">
                  <span className="player-emoji-avatar">{player.avatar}</span>
                </div>

                {/* Player Name */}
                <h3 className="player-side-name">{player.name}</h3>

                {/* Hero Secondary Title (e.g. GANDIVA, SURYAKAVACHA, DYUTA MAYA, MAYA SHAKTI) */}
                <div className="player-hero-title-tag">
                  <span>{player.heroSecondaryTitle}</span>
                </div>

                <span className="player-side-uid">UID: {player.uid}</span>

                {/* Points / Mudras */}
                <div className="player-side-points">
                  <Coins size={12} className="points-coin-icon" />
                  <span>{player.points}</span>
                </div>
                <span className="points-label">Mudras</span>

                {/* Active Advantages Badges */}
                {player.advantages && player.advantages.length > 0 && (
                  <div className="player-advantages-tag" title={player.advantages.map(a => typeof a === 'object' ? a.name : a).join(', ')}>
                    <Zap size={10} color="#D9A441" />
                    <span>{player.advantages.length} Adv</span>
                  </div>
                )}

                {/* Shield / Pawn Icon */}
                <div className="player-shield-wrap" style={{ color: player.shieldColor }}>
                  <Shield size={16} fill="currentColor" fillOpacity={0.25} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER COLUMN: 3D Flip Riddle Card */}
        <div className="arena-center-card">
          <RiddleCard
            activePlayer={activePlayer}
            themeKey={themeKey}
            onPointsDeducted={handlePointsDeducted}
            onSolveSuccess={handleSolveSuccess}
            onSolveFail={handleSolveFail}
            onEventLog={setEventLogText}
          />
        </div>

        {/* RIGHT COLUMN: Player 2 & Player 4 */}
        <div className="players-column players-column--right">
          {players.filter((_, idx) => idx % 2 !== 0).map((player, filteredIdx) => {
            const originalIndex = filteredIdx * 2 + 1;
            const isActive = originalIndex === activePlayerIndex;

            return (
              <div
                key={player.id}
                className={`player-side-card ${isActive ? 'player-side-card--active' : ''}`}
                onClick={() => handlePlayerTap(originalIndex)}
                title="Tap to make active turn"
              >
                {/* Number Badge */}
                <div className="player-num-pill">{player.num}</div>

                {/* Avatar */}
                <div className="player-avatar-circle">
                  <span className="player-emoji-avatar">{player.avatar}</span>
                </div>

                {/* Player Name */}
                <h3 className="player-side-name">{player.name}</h3>

                {/* Hero Secondary Title (e.g. GANDIVA, SURYAKAVACHA, DYUTA MAYA, MAYA SHAKTI) */}
                <div className="player-hero-title-tag">
                  <span>{player.heroSecondaryTitle}</span>
                </div>

                <span className="player-side-uid">UID: {player.uid}</span>

                {/* Points / Mudras */}
                <div className="player-side-points">
                  <Coins size={12} className="points-coin-icon" />
                  <span>{player.points}</span>
                </div>
                <span className="points-label">Mudras</span>

                {/* Active Advantages Badges */}
                {player.advantages && player.advantages.length > 0 && (
                  <div className="player-advantages-tag" title={player.advantages.map(a => typeof a === 'object' ? a.name : a).join(', ')}>
                    <Zap size={10} color="#D9A441" />
                    <span>{player.advantages.length} Adv</span>
                  </div>
                )}

                {/* Shield / Pawn Icon */}
                <div className="player-shield-wrap" style={{ color: player.shieldColor }}>
                  <Shield size={16} fill="currentColor" fillOpacity={0.25} />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ===== BOTTOM COMPANION CONTROLS ===== */}
      <footer className="live-bottom-panel">
        {/* CURRENT TURN BANNER */}
        <div
          className="current-turn-banner"
          onClick={handleNextTurn}
          title="Click to advance to next player's turn"
        >
          <div className="turn-banner-header">
            <Crown size={18} color="#D9A441" />
            <span className="turn-label">CURRENT TURN</span>
          </div>
          <h2 className="active-turn-player-name">
            {activePlayer.name}’s Turn
            {activePlayer.heroSecondaryTitle && (
              <span className="turn-hero-title"> · {activePlayer.heroSecondaryTitle}</span>
            )}
          </h2>

          {/* Active Advantages List for current player */}
          {activePlayer.advantages && activePlayer.advantages.length > 0 && (
            <div className="active-player-adv-chips">
              {activePlayer.advantages.map((adv, i) => (
                <span key={i} className="adv-chip">
                  <Sparkles size={11} color="#D9A441" />
                  {typeof adv === 'object' ? adv.name : adv}
                </span>
              ))}
            </div>
          )}

          <p className="turn-sub-instruction">
            Tap banner to pass turn or select another player on the board
          </p>
          <div className="turn-tap-hint">Tap banner to pass turn ➔</div>
        </div>

        {/* EVENT LOG BANNER */}
        <div className="event-log-banner">
          <div className="event-log-text-wrap">
            <span className="event-log-label">EVENT LOG</span>
            <p className="event-log-content">{eventLogText}</p>
          </div>
          <div className="event-log-scroll-icon">
            <Scroll size={22} color="#8C642A" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LiveCompanionPage;