import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Settings, Shield, Coins, Sparkles, Zap, Info, CheckCircle2, X, AlertCircle, Volume2 } from 'lucide-react';
import RiddleCard from '../../components/cards/RiddleCard';
import { nextTurn } from '../../services/turnService';
import { addPoints, deductPoints } from '../../services/pointService';
import { recordGameActivity } from '../../services/gameService';
import { STARTING_MUDRAS } from '../../lib/gameLogic';
import './LiveCompanion.css';

export const LiveCompanionPage = () => {
  const navigate = useNavigate();

  // Initialize 4 players with Member 2 STARTING_MUDRAS (8000), secondary hero titles & hero advantage
  const defaultPlayers = [
    {
      id: 'p_1',
      name: 'Arjun',
      uid: 'CHB001',
      heroName: 'ARJUNA',
      heroSecondaryTitle: 'GANDIVA',
      heroAdvantage: 'Target any one pawn of the opponent and move it back to their house.',
      isHeroAdvantageUsed: false,
      points: STARTING_MUDRAS,
      mudras: STARTING_MUDRAS,
      shieldColor: '#2ECC71',
      avatar: '👦',
      num: 1,
      advantages: [],
    },
    {
      id: 'p_2',
      name: 'Diya',
      uid: 'CHB002',
      heroName: 'KARNA',
      heroSecondaryTitle: 'SURYAKAVACHA',
      heroAdvantage: 'Shield your pawn by moving it to the nearest safe house.',
      isHeroAdvantageUsed: false,
      points: STARTING_MUDRAS,
      mudras: STARTING_MUDRAS,
      shieldColor: '#3498DB',
      avatar: '👧',
      num: 2,
      advantages: [],
    },
    {
      id: 'p_3',
      name: 'Kabir',
      uid: 'CHB003',
      heroName: 'SHAKUNI',
      heroSecondaryTitle: 'DYUTA MAYA',
      heroAdvantage: 'Can choose any result for his dice roll.',
      isHeroAdvantageUsed: false,
      points: STARTING_MUDRAS,
      mudras: STARTING_MUDRAS,
      shieldColor: '#E74C3C',
      avatar: '👦',
      num: 3,
      advantages: [],
    },
    {
      id: 'p_4',
      name: 'Myra',
      uid: 'CHB004',
      heroName: 'GHATOTKACHA',
      heroSecondaryTitle: 'MAYA SHAKTI',
      heroAdvantage: 'Move one’s pawn to any space on the board.',
      isHeroAdvantageUsed: false,
      points: STARTING_MUDRAS,
      mudras: STARTING_MUDRAS,
      shieldColor: '#9B59B6',
      avatar: '👧',
      num: 4,
      advantages: [],
    },
  ];

  const [players, setPlayers] = useState(defaultPlayers);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [themeKey, setThemeKey] = useState('rajya');
  const [worldThemeName, setWorldThemeName] = useState('KINGDOMS');

  // Modals state
  const [selectedInfoPlayer, setSelectedInfoPlayer] = useState(null);
  const [advantageToConfirm, setAdvantageToConfirm] = useState(null);
  const [activeRewardNotification, setActiveRewardNotification] = useState(null);

  useEffect(() => {
    // Read configured players from setup & hero assignment
    const storedPlayers = sessionStorage.getItem('activeGamePlayers');
    if (storedPlayers) {
      try {
        const parsed = JSON.parse(storedPlayers);
        if (parsed.length > 0) {
          const fallbackHeroes = [
            { name: 'ARJUNA', title: 'GANDIVA', adv: 'Target any one pawn of the opponent and move it back to their house.' },
            { name: 'KARNA', title: 'SURYAKAVACHA', adv: 'Shield your pawn by moving it to the nearest safe house.' },
            { name: 'SHAKUNI', title: 'DYUTA MAYA', adv: 'Can choose any result for his dice roll.' },
            { name: 'GHATOTKACHA', title: 'MAYA SHAKTI', adv: 'Move one’s pawn to any space on the board.' },
          ];

          const mapped = parsed.map((p, idx) => {
            const fallback = fallbackHeroes[idx % fallbackHeroes.length];
            return {
              id: p.id || `p_${idx + 1}`,
              name: p.name || `Player ${idx + 1}`,
              uid: p.uid || `CHB00${idx + 1}`,
              heroName: p.heroName || p.hero?.name || fallback.name,
              heroSecondaryTitle: p.heroSecondaryTitle || p.hero?.secondaryTitle || fallback.title,
              heroAdvantage: p.heroAdvantage || p.hero?.advantage || fallback.adv,
              isHeroAdvantageUsed: Boolean(p.isHeroAdvantageUsed),
              points: typeof p.mudras === 'number' ? p.mudras : (typeof p.points === 'number' ? p.points : STARTING_MUDRAS),
              mudras: typeof p.mudras === 'number' ? p.mudras : (typeof p.points === 'number' ? p.points : STARTING_MUDRAS),
              shieldColor: ['#2ECC71', '#3498DB', '#E74C3C', '#9B59B6'][idx % 4],
              avatar: idx % 2 === 0 ? '👦' : '👧',
              num: idx + 1,
              advantages: p.advantages || [],
            };
          });
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

  // Helper to persist updated players
  const updatePlayersState = (updater) => {
    setPlayers((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      sessionStorage.setItem('activeGamePlayers', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Player Banner Tap: Directly switches turn to that player
  const handlePlayerTap = (index) => {
    setActivePlayerIndex(index);
    recordGameActivity?.().catch(() => {});
  };

  // Next Turn Button Action
  const handleNextTurn = async () => {
    await nextTurn('chowkabara_live_session');
    setActivePlayerIndex((prev) => {
      const nextIdx = (prev + 1) % players.length;
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
    updatePlayersState((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, points: updatedPoints, mudras: updatedPoints } : p
      )
    );
    recordGameActivity?.().catch(() => {});
  };

  // Riddle Reward Handlers: Update points & attach unlocked Advantage
  const handleSolveSuccess = async (rewardPts, advantage) => {
    await addPoints(activePlayer.id, rewardPts);
    updatePlayersState((prev) =>
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
      updatePlayersState((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? { ...p, points: Math.max(0, p.points - penalty), mudras: Math.max(0, p.points - penalty) }
            : p
        )
      );
    }
    recordGameActivity?.().catch(() => {});
  };

  // Confirm and Consume Single-Use Hero Advantage
  const handleConfirmUseAdvantage = () => {
    if (!advantageToConfirm) return;

    updatePlayersState((prev) =>
      prev.map((p) =>
        p.id === advantageToConfirm.id
          ? { ...p, isHeroAdvantageUsed: true }
          : p
      )
    );

    setActiveRewardNotification({
      playerName: advantageToConfirm.name,
      heroTitle: advantageToConfirm.heroSecondaryTitle,
      advantage: advantageToConfirm.heroAdvantage,
    });

    setAdvantageToConfirm(null);
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
                {/* Info (i) Button */}
                <button
                  type="button"
                  className="player-info-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfoPlayer(player);
                  }}
                  title={`View ${player.name}'s hero advantages`}
                  aria-label="Player advantages info"
                >
                  <Info size={12} />
                </button>

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

                {/* Advantage Status Tag */}
                <div
                  className={`player-hero-status-pill ${player.isHeroAdvantageUsed ? 'player-hero-status-pill--used' : 'player-hero-status-pill--ready'}`}
                  title={player.isHeroAdvantageUsed ? 'Hero advantage already used' : 'Hero advantage available'}
                >
                  <Zap size={9} />
                  <span>{player.isHeroAdvantageUsed ? 'Adv Used' : 'Adv Ready'}</span>
                </div>

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
                {/* Info (i) Button */}
                <button
                  type="button"
                  className="player-info-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfoPlayer(player);
                  }}
                  title={`View ${player.name}'s hero advantages`}
                  aria-label="Player advantages info"
                >
                  <Info size={12} />
                </button>

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

                {/* Advantage Status Tag */}
                <div
                  className={`player-hero-status-pill ${player.isHeroAdvantageUsed ? 'player-hero-status-pill--used' : 'player-hero-status-pill--ready'}`}
                  title={player.isHeroAdvantageUsed ? 'Hero advantage already used' : 'Hero advantage available'}
                >
                  <Zap size={9} />
                  <span>{player.isHeroAdvantageUsed ? 'Adv Used' : 'Adv Ready'}</span>
                </div>

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
        {/* 1. CURRENT TURN BANNER */}
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

          <p className="turn-sub-instruction">
            Tap banner to pass turn or select another player on the board ➔
          </p>
        </div>

        {/* 2. USE ADVANTAGE ACTION BANNER (Replaces Event Log) */}
        <div className="use-advantage-banner">
          <div className="use-adv-content-wrap">
            <div className="use-adv-header-row">
              <div className="use-adv-badge">
                <Zap size={13} color="#F9D77E" />
                <span className="use-adv-label">HERO ADVANTAGE</span>
              </div>
              <span className="use-adv-hero-name">{activePlayer.heroName}</span>
            </div>

            <h3 className="use-adv-title">
              {activePlayer.heroSecondaryTitle || 'HERO POWER'}
            </h3>
            <p className="use-adv-desc">
              {activePlayer.heroAdvantage || 'Special character power for Chowkabara board advantage.'}
            </p>
          </div>

          <div className="use-adv-action-wrap">
            {activePlayer.isHeroAdvantageUsed ? (
              <div className="adv-used-pill">
                <CheckCircle2 size={14} color="#8C7864" />
                <span>Advantage Used</span>
              </div>
            ) : (
              <button
                type="button"
                className="use-adv-trigger-btn"
                onClick={() => setAdvantageToConfirm(activePlayer)}
              >
                <Sparkles size={14} />
                <span>Use Advantage</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* ===== MODAL 1: PLAYER INFO (i) ADVANTAGES DETAIL POPUP ===== */}
      {selectedInfoPlayer && (
        <div className="live-modal-overlay" onClick={() => setSelectedInfoPlayer(null)}>
          <div className="live-info-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-icon-btn"
              onClick={() => setSelectedInfoPlayer(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="info-modal-header">
              <div className="info-avatar-circle">
                <span className="info-emoji">{selectedInfoPlayer.avatar}</span>
              </div>
              <div className="info-header-titles">
                <h3 className="info-player-name">{selectedInfoPlayer.name}</h3>
                <span className="info-hero-badge">
                  {selectedInfoPlayer.heroName} · {selectedInfoPlayer.heroSecondaryTitle}
                </span>
              </div>
            </div>

            <div className="info-advantage-section">
              <div className="info-section-title">
                <Zap size={15} color="#D9A441" />
                <span>HERO ADVANTAGE</span>
              </div>
              <div className="info-advantage-card">
                <h4 className="info-adv-name">{selectedInfoPlayer.heroSecondaryTitle}</h4>
                <p className="info-adv-text">{selectedInfoPlayer.heroAdvantage}</p>
                <div className="info-adv-status">
                  {selectedInfoPlayer.isHeroAdvantageUsed ? (
                    <span className="status-badge status-badge--used">
                      <CheckCircle2 size={13} /> Already Used in This Game
                    </span>
                  ) : (
                    <span className="status-badge status-badge--ready">
                      <Sparkles size={13} /> Available to Use (1 Time)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {selectedInfoPlayer.advantages && selectedInfoPlayer.advantages.length > 0 && (
              <div className="info-riddle-advantages">
                <div className="info-section-title">
                  <Sparkles size={14} color="#2ECC71" />
                  <span>EARNED RIDDLE ADVANTAGES ({selectedInfoPlayer.advantages.length})</span>
                </div>
                <div className="info-riddle-list">
                  {selectedInfoPlayer.advantages.map((adv, i) => (
                    <div key={i} className="riddle-adv-item">
                      <strong>{typeof adv === 'object' ? adv.name : adv}</strong>
                      {typeof adv === 'object' && adv.description && (
                        <p>{adv.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL 2: CONFIRM USE ADVANTAGE ===== */}
      {advantageToConfirm && (
        <div className="live-modal-overlay">
          <div className="live-confirm-modal-card">
            <div className="confirm-icon-disc">
              <Zap size={24} color="#D9A441" />
            </div>

            <h3 className="confirm-title">Use Hero Advantage?</h3>
            <div className="confirm-hero-chip">
              {advantageToConfirm.name} ({advantageToConfirm.heroSecondaryTitle})
            </div>

            <div className="confirm-effect-box">
              <p className="confirm-effect-text">{advantageToConfirm.heroAdvantage}</p>
            </div>

            <div className="confirm-warning-note">
              <AlertCircle size={14} color="#E74C3C" />
              <span>This hero advantage can only be used <strong>once</strong> per entire match!</span>
            </div>

            <div className="confirm-actions-row">
              <button
                type="button"
                className="confirm-activate-btn"
                onClick={handleConfirmUseAdvantage}
              >
                <Sparkles size={15} /> Confirm & Activate
              </button>
              <button
                type="button"
                className="confirm-cancel-btn"
                onClick={() => setAdvantageToConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== REWARD NOTIFICATION TOAST ===== */}
      {activeRewardNotification && (
        <div className="reward-toast-banner" onClick={() => setActiveRewardNotification(null)}>
          <div className="reward-toast-icon">
            <Sparkles size={18} color="#D9A441" />
          </div>
          <div className="reward-toast-text">
            <strong>Advantage Activated for {activeRewardNotification.playerName}!</strong>
            <p>{activeRewardNotification.heroTitle}: {activeRewardNotification.advantage}</p>
          </div>
          <button type="button" className="toast-dismiss-btn">✕</button>
        </div>
      )}
    </div>
  );
};

export default LiveCompanionPage;