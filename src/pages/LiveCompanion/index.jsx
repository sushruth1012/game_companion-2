import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Settings,
  Shield,
  Coins,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  Play,
  Pause,
  TimerReset,
  FileSpreadsheet,
  Download,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  Calendar,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import RiddleCard from '../../components/cards/RiddleCard';
import { nextTurn } from '../../services/turnService';
import { addPoints, deductPoints } from '../../services/pointService';
import { recordGameActivity } from '../../services/gameService';
import {
  recordMoveTelemetry,
  getAllSurveyRecords,
  getPlayerGroupedSurveyData,
  generateSurveyTextSummary,
  downloadSurveyCSV,
  openGoogleSheets,
  setGoogleSheetsWebhook,
  getGoogleSheetsWebhook,
  clearSurveyRecords,
} from '../../services/surveyAnalyticsService';
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

  // 1 Riddle Per Move Rule State
  const [hasAnsweredRiddleThisTurn, setHasAnsweredRiddleThisTurn] = useState(false);

  // 1-Minute Chess Timer State
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [turnDropdown, setTurnDropdown] = useState(null);

  // Settings & Survey Header Dropdown State
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  // Synchronized References for Survey Telemetry Logging
  const playersRef = useRef(players);
  const activePlayerIndexRef = useRef(activePlayerIndex);
  const turnStartTimeRef = useRef(Date.now());
  const moveNumberRef = useRef(1);

  // Sync refs on every state change
  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    activePlayerIndexRef.current = activePlayerIndex;
  }, [activePlayerIndex]);

  // Modals state
  const [selectedInfoPlayer, setSelectedInfoPlayer] = useState(null);
  const [advantageToConfirm, setAdvantageToConfirm] = useState(null);
  const [activeRewardNotification, setActiveRewardNotification] = useState(null);

  // Survey Analytics Modal State
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [groupedSurveyData, setGroupedSurveyData] = useState([]);
  const [webhookUrlInput, setWebhookUrlInput] = useState(getGoogleSheetsWebhook());
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Core function to log a player's move telemetry
  const logPlayerMove = (playerIdx, actionType = 'Manual Pass') => {
    const playerList = playersRef.current;
    const player = playerList[playerIdx] || playerList[0];
    if (!player) return;

    const now = Date.now();
    const start = turnStartTimeRef.current;

    recordMoveTelemetry({
      sessionId: sessionStorage.getItem('gameSessionId') || 'chowkabara_survey_session',
      moveNumber: moveNumberRef.current,
      playerUid: player.uid,
      playerName: player.name,
      heroName: player.heroName,
      heroTitle: player.heroSecondaryTitle,
      startTime: start,
      endTime: now,
      actionType,
      mudras: player.points,
    });

    moveNumberRef.current += 1;
    turnStartTimeRef.current = now;
  };

  // Show dropdown notification when turn changes
  const showTurnDropdown = (player, isTimeout = false) => {
    setTurnDropdown({
      playerName: player.name,
      heroTitle: player.heroSecondaryTitle,
      isTimeout,
    });
  };

  // Auto-dismiss turn dropdown banner after 2.6s
  useEffect(() => {
    if (!turnDropdown) return;
    const timer = setTimeout(() => {
      setTurnDropdown(null);
    }, 2600);
    return () => clearTimeout(timer);
  }, [turnDropdown]);

  // 1-Minute Turn Countdown Interval
  useEffect(() => {
    if (isTimerPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerPaused]);

  // Handle Timeout (when timer hits 0)
  useEffect(() => {
    if (timeLeft === 0) {
      const currentIdx = activePlayerIndexRef.current;
      const playerList = playersRef.current;
      
      // 1. Log previous player's move as Timeout
      logPlayerMove(currentIdx, 'Timeout (60s)');

      // 2. Advance to next player and reset 1-riddle-per-move rule
      const nextIdx = (currentIdx + 1) % playerList.length;
      const nextPlayer = playerList[nextIdx];
      setActivePlayerIndex(nextIdx);
      setTimeLeft(60);
      setHasAnsweredRiddleThisTurn(false);
      showTurnDropdown(nextPlayer, true);
    }
  }, [timeLeft]);

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
          playersRef.current = mapped;
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
      playersRef.current = updated;
      return updated;
    });
  };

  // Handle Player Banner Tap: Directly switches turn to that player
  const handlePlayerTap = (index) => {
    if (index !== activePlayerIndex) {
      // 1. Log previous player's move
      logPlayerMove(activePlayerIndexRef.current, 'Manual Switch');

      // 2. Set new active player and reset 1-riddle-per-move rule
      setActivePlayerIndex(index);
      setTimeLeft(60);
      setHasAnsweredRiddleThisTurn(false);
      showTurnDropdown(players[index], false);
      recordGameActivity?.().catch(() => {});
    }
  };

  // Next Turn Button Action
  const handleNextTurn = async () => {
    await nextTurn('chowkabara_live_session');
    
    // 1. Log previous player's move
    logPlayerMove(activePlayerIndexRef.current, 'Manual Pass');

    // 2. Advance to next player and reset 1-riddle-per-move rule
    const nextIdx = (activePlayerIndexRef.current + 1) % players.length;
    const nextPlayer = players[nextIdx];
    setActivePlayerIndex(nextIdx);
    setTimeLeft(60);
    setHasAnsweredRiddleThisTurn(false);
    showTurnDropdown(nextPlayer, false);
    recordGameActivity?.().catch(() => {});
  };

  // Toggle Timer Pause
  const handleTogglePause = (e) => {
    e.stopPropagation();
    setIsTimerPaused((prev) => !prev);
  };

  // Open Survey Analytics Modal
  const handleOpenSurveyModal = () => {
    const thinkingTime = (Date.now() - turnStartTimeRef.current) / 1000;
    if (thinkingTime >= 1.0) {
      logPlayerMove(activePlayerIndexRef.current, 'Current Turn Check');
    }
    setGroupedSurveyData(getPlayerGroupedSurveyData(playersRef.current));
    setIsSurveyModalOpen(true);
  };

  // Handle Log Out
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out? This will end the active game session.')) {
      sessionStorage.clear();
      localStorage.removeItem('active_device_session');
      localStorage.removeItem('activated_box_code');
      navigate('/login');
    }
  };

  // Copy Survey Summary Text to Clipboard
  const handleCopySummary = async () => {
    const text = generateSurveyTextSummary(playersRef.current);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (e) {
      console.warn('Clipboard write notice:', e);
    }
  };

  // Save Google Sheets Webhook
  const handleSaveWebhook = (e) => {
    e.preventDefault();
    setGoogleSheetsWebhook(webhookUrlInput);
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 2500);
  };

  // Clear survey telemetry
  const handleClearSurveyData = () => {
    if (window.confirm('Clear all recorded survey move telemetry for this session?')) {
      clearSurveyRecords();
      setGroupedSurveyData(getPlayerGroupedSurveyData(playersRef.current));
    }
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

  // Riddle Reward Handlers
  const handleSolveSuccess = async (rewardPts, advantage) => {
    logPlayerMove(activePlayerIndexRef.current, 'Riddle Solved');
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
    logPlayerMove(activePlayerIndexRef.current, 'Riddle Failed');
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

    logPlayerMove(activePlayerIndexRef.current, 'Hero Advantage Activated');

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

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="live-companion-screen page-transition-fade" onClick={() => isSettingsMenuOpen && setIsSettingsMenuOpen(false)}>
      {/* Dynamic Atmospheric Blurred Background */}
      <div className="live-ambient-blurred-bg" />
      <div className="live-bg-board-watermark" />

      {/* ===== TOP SLIDE DROPDOWN NOTIFICATION BANNER ===== */}
      {turnDropdown && (
        <div
          className={`turn-dropdown-banner ${turnDropdown.isTimeout ? 'turn-dropdown-banner--timeout' : ''}`}
          onClick={() => setTurnDropdown(null)}
        >
          <div className="dropdown-icon-pill">
            {turnDropdown.isTimeout ? (
              <TimerReset size={16} color="#E74C3C" />
            ) : (
              <Crown size={16} color="#D9A441" />
            )}
          </div>
          <div className="dropdown-text-wrap">
            <span className="dropdown-badge-label">
              {turnDropdown.isTimeout ? "⏳ TIME'S UP! TURN PASSED" : "⚔️ CURRENT TURN"}
            </span>
            <h4 className="dropdown-player-turn">
              {turnDropdown.playerName}’s Turn
              {turnDropdown.heroTitle && (
                <span className="dropdown-hero-sub"> · {turnDropdown.heroTitle}</span>
              )}
            </h4>
          </div>
          <span className="dropdown-dismiss-hint">✕</span>
        </div>
      )}

      {/* ===== TOP APP BAR WITH CONSTANT BACK BUTTON & SETTINGS MENU ===== */}
      <header className="live-top-bar">
        {/* Left Constant Back Button */}
        <button
          type="button"
          className="app-back-btn"
          onClick={() => navigate('/hero-assignment')}
          aria-label="Back to Hero Assignment"
        >
          <ChevronLeft size={20} />
        </button>

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

        {/* Right Settings & Survey Dropdown Menu */}
        <div className="top-right-group">
          <div className="settings-menu-anchor">
            <button
              type="button"
              className={`settings-gear-btn ${isSettingsMenuOpen ? 'settings-gear-btn--active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsMenuOpen((prev) => !prev);
              }}
              aria-label="Settings and Survey Menu"
            >
              <Settings size={17} />
            </button>

            {/* Dropdown Menu Popup & Backdrop */}
            {isSettingsMenuOpen && (
              <>
                <div
                  className="settings-backdrop-overlay"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSettingsMenuOpen(false);
                  }}
                />
                <div
                  className="live-settings-dropdown page-dropdown-slide"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsSettingsMenuOpen(false);
                      handleOpenSurveyModal();
                    }}
                  >
                    <FileSpreadsheet size={17} color="#2ECC71" />
                    <div className="menu-item-text">
                      <strong>Survey & Google Sheets</strong>
                      <small>Timestamps & total time</small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsSettingsMenuOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <Settings size={17} color="#D9A441" />
                    <div className="menu-item-text">
                      <strong>Game Preferences</strong>
                      <small>Audio, vibration & display</small>
                    </div>
                  </button>

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-menu-item dropdown-menu-item--logout"
                    onClick={() => {
                      setIsSettingsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={17} color="#E74C3C" />
                    <div className="menu-item-text">
                      <strong style={{ color: '#E74C3C' }}>Log Out</strong>
                      <small>Return to login screen</small>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
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

                {/* Hero Secondary Title */}
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

        {/* CENTER COLUMN: 3D Flip Riddle Card (1 Riddle Per Move Limit) */}
        <div className="arena-center-card">
          <RiddleCard
            activePlayer={activePlayer}
            themeKey={themeKey}
            hasAnsweredRiddleThisTurn={hasAnsweredRiddleThisTurn}
            onRiddleAnswered={() => setHasAnsweredRiddleThisTurn(true)}
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

                {/* Hero Secondary Title */}
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
        {/* 1. CURRENT TURN BANNER WITH 1-MINUTE CHESS TIMER */}
        <div
          className="current-turn-banner"
          onClick={handleNextTurn}
          title="Click to pass turn to next player"
        >
          <div className="turn-banner-header">
            <div className="turn-header-left">
              <Crown size={17} color="#D9A441" />
              <span className="turn-label">CURRENT TURN</span>
            </div>

            {/* CHESS-STYLE 1-MINUTE TIMER WIDGET */}
            <div
              className={`turn-chess-timer ${timeLeft <= 10 ? 'turn-chess-timer--warning' : ''}`}
              onClick={(e) => e.stopPropagation()}
              title="1-Minute Turn Timer (Auto-passes on timeout)"
            >
              <Clock size={13} className={timeLeft <= 10 ? 'timer-pulse-icon' : ''} />
              <span className="timer-countdown-digits">{formatTime(timeLeft)}</span>
              
              <button
                type="button"
                className="timer-pause-toggle-btn"
                onClick={handleTogglePause}
                title={isTimerPaused ? "Resume Timer" : "Pause Timer"}
                aria-label="Pause or Resume Timer"
              >
                {isTimerPaused ? <Play size={11} fill="currentColor" /> : <Pause size={11} fill="currentColor" />}
              </button>
            </div>
          </div>

          {/* Timer Progress Track Bar */}
          <div className="turn-timer-progress-track">
            <div
              className={`turn-timer-progress-fill ${timeLeft <= 10 ? 'progress-fill--warning' : ''}`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>

          <h2 className="active-turn-player-name">
            {activePlayer.name}’s Turn
            {activePlayer.heroSecondaryTitle && (
              <span className="turn-hero-title"> · {activePlayer.heroSecondaryTitle}</span>
            )}
          </h2>

          <p className="turn-sub-instruction">
            ⏳ 1 min per turn · Tap banner to pass turn early ➔
          </p>
        </div>

        {/* 2. USE ADVANTAGE ACTION BANNER */}
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

      {/* ===== MODAL 3: SURVEY TELEMETRY - PLAYER BY PLAYER WITH RECORDING DATE ===== */}
      {isSurveyModalOpen && (
        <div className="live-modal-overlay" onClick={() => setIsSurveyModalOpen(false)}>
          <div className="survey-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-icon-btn"
              onClick={() => setIsSurveyModalOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div className="survey-modal-title-row">
              <FileSpreadsheet size={22} color="#2ECC71" />
              <div>
                <h3 className="survey-modal-title">Move Timestamps Survey</h3>
                <span className="survey-modal-sub">
                  Organized by player with timestamps & total time
                </span>
              </div>
            </div>

            {/* Quick Action Export Bar */}
            <div className="survey-actions-panel">
              <button
                type="button"
                className="survey-export-btn survey-export-btn--csv"
                onClick={() => downloadSurveyCSV(playersRef.current)}
                title="Download CSV formatted by Player"
              >
                <Download size={14} />
                <span>Download CSV (Sheets)</span>
              </button>

              <button
                type="button"
                className="survey-export-btn survey-export-btn--copy"
                onClick={handleCopySummary}
                title="Copy all player timestamps to clipboard"
              >
                {copiedText ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                type="button"
                className="survey-export-btn survey-export-btn--sheets"
                onClick={openGoogleSheets}
                title="Open Google Sheets"
              >
                <ExternalLink size={14} />
                <span>Open Sheets</span>
              </button>
            </div>

            {/* PLAYER-BY-PLAYER TIMESTAMPS & TOTAL TIME SECTION */}
            <div className="survey-players-grouped-container">
              {groupedSurveyData.map((player) => (
                <div key={player.name} className="survey-player-group-card">
                  {/* Player Header */}
                  <div className="group-card-header">
                    <div className="group-header-left">
                      <span className="group-num-pill">Player {player.playerIndex}</span>
                      <strong className="group-player-name">{player.name}</strong>
                      <span className="group-hero-tag">{player.heroTitle || 'HERO'}</span>
                    </div>
                    <div className="group-header-right">
                      <span className="group-total-time-badge">
                        ⏱️ Total: <strong>{player.totalSeconds}s</strong>
                      </span>
                    </div>
                  </div>

                  {/* Moves Timestamps List */}
                  <div className="group-moves-list">
                    {player.moves.length === 0 ? (
                      <div className="group-empty-hint">No moves played yet in this session</div>
                    ) : (
                      player.moves.map((m, idx) => (
                        <div key={m.id || idx} className="group-move-row">
                          <span className="move-number-badge">Move #{idx + 1}</span>
                          <span className="move-timestamps-text">
                            {m.startFormatted} → {m.endFormatted}
                          </span>
                          <strong className="move-duration-highlight">{m.durationSeconds}s</strong>
                          <span className="move-action-type-tag">{m.actionType}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Player Footer Summary */}
                  <div className="group-card-footer">
                    <span>Total Moves: <strong>{player.totalMoves}</strong></span>
                    <span>Average per Move: <strong>{player.averageSeconds}s</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* DATE OF RECORDING AT THE END */}
            <div className="survey-recording-date-footer">
              <div className="date-banner-content">
                <Calendar size={15} color="#D9A441" />
                <span>
                  Date of Recording: <strong>{new Date().toLocaleString()}</strong>
                </span>
              </div>

              {groupedSurveyData.some((p) => p.moves.length > 0) && (
                <button
                  type="button"
                  className="survey-clear-btn"
                  onClick={handleClearSurveyData}
                  title="Clear all recorded moves"
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>
              )}
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