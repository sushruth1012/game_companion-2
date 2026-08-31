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
  RotateCw,
  BookOpen,
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

  // Initialize 4 players with Member 2 STARTING_MUDRAS (6000), secondary hero titles & hero advantage
  const defaultPlayers = [
    {
      id: 'p_1',
      name: 'Player 1',
      uid: 'CHB001',
      age: 10,
      ageGroup: '8-12',
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
      name: 'Player 2',
      uid: 'CHB002',
      age: 10,
      ageGroup: '8-12',
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
      name: 'Player 3',
      uid: 'CHB003',
      age: 10,
      ageGroup: '8-12',
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
      name: 'Player 4',
      uid: 'CHB004',
      age: 10,
      ageGroup: '8-12',
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
  const [themeKey, setThemeKey] = useState('mahabharatha');
  const [worldThemeName, setWorldThemeName] = useState('MAHABHARATHA');

  // 1 Riddle Per Move Rule State
  const [hasAnsweredRiddleThisTurn, setHasAnsweredRiddleThisTurn] = useState(false);

  // Fullscreen Riddle Experience State
  const [isRiddleFullscreenOpen, setIsRiddleFullscreenOpen] = useState(false);
  const [riddleModalPlayer, setRiddleModalPlayer] = useState(null);
  const [riddleTimeLeft, setRiddleTimeLeft] = useState(60);
  const [isRiddleTimerPaused, setIsRiddleTimerPaused] = useState(false);

  // 1-Minute Chess Turn Timer State
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

  // Handle Turn Timeout (when main turn timer hits 0)
  useEffect(() => {
    if (timeLeft === 0) {
      const currentIdx = activePlayerIndexRef.current;
      const playerList = playersRef.current;
      
      // 1. Log previous player's move as Timeout
      logPlayerMove(currentIdx, 'Timeout (60s)');

      // 2. Close riddle modal if open on timeout
      setIsRiddleFullscreenOpen(false);

      // 3. Advance to next player and reset 1-riddle-per-move rule
      const nextIdx = (currentIdx + 1) % playerList.length;
      const nextPlayer = playerList[nextIdx];
      setActivePlayerIndex(nextIdx);
      setTimeLeft(60);
      setHasAnsweredRiddleThisTurn(false);
      showTurnDropdown(nextPlayer, true);
    }
  }, [timeLeft]);

  // Dedicated 1-Minute Riddle Session Countdown Timer
  useEffect(() => {
    if (!isRiddleFullscreenOpen || isRiddleTimerPaused) return;

    const riddleInterval = setInterval(() => {
      setRiddleTimeLeft((prev) => {
        if (prev <= 1) {
          // 1-Minute Riddle Time Out: Automatically close riddle modal and return to board
          setIsRiddleFullscreenOpen(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(riddleInterval);
  }, [isRiddleFullscreenOpen, isRiddleTimerPaused]);

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
            const ageGroup = p.ageGroup || (typeof p.age === 'number' ? (p.age <= 12 ? '8-12' : p.age <= 16 ? '13-16' : '17+') : '8-12');
            return {
              id: p.id || `p_${idx + 1}`,
              name: p.name || `Player ${idx + 1}`,
              uid: p.uid || `CHB00${idx + 1}`,
              age: typeof p.age === 'number' ? p.age : (ageGroup === '8-12' ? 10 : ageGroup === '13-16' ? 14 : 20),
              ageGroup: ageGroup,
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
        mahabharatha: 'MAHABHARATHA',
        rajya: 'MAHABHARATHA',
        navarasa: 'NAVARASA',
        panchabootha: 'PANCHABOOTHA',
        kala_yuga: 'KALA & YUGA',
        kshetra_devalaya: 'KSHETRA & DEVALAYA',
      };
      setWorldThemeName(names[storedTheme] || 'MAHABHARATHA');
    } else {
      setThemeKey('mahabharatha');
      setWorldThemeName('MAHABHARATHA');
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

  // Open Fullscreen Riddle for a specific player card tap
  const handleOpenRiddleFullscreen = (player, index) => {
    setActivePlayerIndex(index);
    setRiddleModalPlayer(player);
    setRiddleTimeLeft(60);
    setIsRiddleFullscreenOpen(true);
  };

  // Manual Turn Advancement
  const handleNextTurn = async () => {
    logPlayerMove(activePlayerIndexRef.current, 'Manual Pass');

    try {
      await nextTurn();
    } catch (e) {
      console.warn('Local turn advance:', e);
    }

    const nextIdx = (activePlayerIndex + 1) % players.length;
    const nextPlayer = players[nextIdx];
    setActivePlayerIndex(nextIdx);
    setTimeLeft(60);
    setHasAnsweredRiddleThisTurn(false);
    setIsRiddleFullscreenOpen(false);
    showTurnDropdown(nextPlayer, false);
  };

  // Tap Player Side Card to Switch Turn
  const handlePlayerTap = (index) => {
    if (index === activePlayerIndex) {
      // Tap on active player card -> Open Fullscreen Riddle
      handleOpenRiddleFullscreen(players[index], index);
      return;
    }

    logPlayerMove(activePlayerIndexRef.current, `Switched to ${players[index].name}`);
    setActivePlayerIndex(index);
    setTimeLeft(60);
    setHasAnsweredRiddleThisTurn(false);
    showTurnDropdown(players[index], false);
  };

  // Toggle Timer Pause / Resume
  const handleTogglePause = (e) => {
    e.stopPropagation();
    setIsTimerPaused((prev) => !prev);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Open Survey Analytics Modal
  const handleOpenSurveyModal = () => {
    const grouped = getPlayerGroupedSurveyData(playersRef.current);
    setGroupedSurveyData(grouped);
    setWebhookUrlInput(getGoogleSheetsWebhook());
    setIsSurveyModalOpen(true);
  };

  // Copy Survey Data to Clipboard
  const handleCopySurveyText = () => {
    const text = generateSurveyTextSummary(playersRef.current);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Save Custom Webhook URL
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

  // Riddle Reward Handlers - No points/Mudras added on solve, only earned advantage
  const handleSolveSuccess = async (_rewardPts, advantage) => {
    logPlayerMove(activePlayerIndexRef.current, 'Riddle Solved');
    updatePlayersState((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex
          ? {
              ...p,
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
      prev.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, isHeroAdvantageUsed: true } : p
      )
    );

    setActiveRewardNotification({
      title: `${advantageToConfirm.heroName} · ${advantageToConfirm.heroSecondaryTitle}`,
      description: advantageToConfirm.heroAdvantage,
    });

    setAdvantageToConfirm(null);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out and return to the main entrance?')) {
      sessionStorage.clear();
      localStorage.removeItem('active_device_session');
      navigate('/login');
    }
  };

  return (
    <div className="live-companion-screen">
      {/* Background Texture Overlay */}
      <div className="live-companion-bg" />

      {/* ===== TOP SLIDE DROPDOWN NOTIFICATION BANNER ===== */}
      {turnDropdown && (
        <div
          className="turn-dropdown-banner page-dropdown-slide"
          onClick={() => setTurnDropdown(null)}
        >
          <div className="dropdown-icon-disc">
            <Crown size={16} color="#261509" />
          </div>
          <div className="dropdown-banner-text">
            <span className="dropdown-banner-tag">
              {turnDropdown.isTimeout ? '⏱️ Turn Timed Out' : '✦ Turn Passed'}
            </span>
            <h4 className="dropdown-banner-title">
              {turnDropdown.playerName}’s Turn{' '}
              {turnDropdown.heroTitle && <small>({turnDropdown.heroTitle})</small>}
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
          <span className="chapter-title">Chapter 1: The Kurukshetra Trial 📜</span>
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

      {/* ===== MAIN ARENA: FULL-SCREEN PLAYER CARDS GRID ===== */}
      <main className="live-main-arena">
        <div className={`players-arena-grid players-arena-grid--${players.length}`}>
          {players.map((player, idx) => {
            const isActive = idx === activePlayerIndex;

            return (
              <div
                key={player.id}
                className={`arena-player-card ${isActive ? 'arena-player-card--active' : ''}`}
                onClick={() => handlePlayerTap(idx)}
                role="button"
                tabIndex={0}
              >
                {/* Active Player Crown Glow Banner */}
                {isActive && (
                  <div className="active-turn-pulse-badge">
                    <Crown size={12} />
                    <span>ACTIVE TURN</span>
                  </div>
                )}

                {/* Info (i) Button */}
                <button
                  type="button"
                  className="player-info-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfoPlayer(player);
                  }}
                  title={`View ${player.name}'s hero powers & inventory`}
                  aria-label="Player info"
                >
                  <Info size={13} />
                </button>

                {/* Number Badge Pill */}
                <div className="player-num-pill">{player.num}</div>

                {/* Card Top Avatar & Identity Row */}
                <div className="player-card-header-row">
                  <div className="player-avatar-circle" style={{ borderColor: player.shieldColor }}>
                    <span className="player-emoji-avatar">{player.avatar}</span>
                  </div>

                  <div className="player-name-block">
                    <h3 className="arena-player-name">{player.name}</h3>
                    <span className="arena-player-meta">
                      UID: {player.uid} · <strong style={{ color: '#D9A441' }}>Age {player.ageGroup || '8-12'}</strong>
                    </span>
                  </div>
                </div>

                {/* Hero Power Secondary Title Badge */}
                <div className="arena-hero-badge">
                  <span className="hero-char-name">{player.heroName}</span>
                  <span className="hero-title-divider">·</span>
                  <span className="hero-power-title">{player.heroSecondaryTitle}</span>
                </div>

                {/* Points and Status Footer */}
                <div className="player-card-stats-row">
                  <div className="player-mudras-badge">
                    <Coins size={14} className="points-coin-icon" />
                    <strong>{player.points}</strong>
                    <small>Mudras</small>
                  </div>

                  <div
                    className={`player-hero-status-pill ${player.isHeroAdvantageUsed ? 'player-hero-status-pill--used' : 'player-hero-status-pill--ready'}`}
                  >
                    <Zap size={10} />
                    <span>{player.isHeroAdvantageUsed ? 'Skill Used' : 'Skill Ready'}</span>
                  </div>
                </div>

                {/* Tap to Play Riddle Interactive Callout */}
                <div className="tap-riddle-callout">
                  {isActive ? (
                    <div className="tap-riddle-prompt tap-riddle-prompt--active">
                      <Sparkles size={13} color="#D9A441" />
                      <span>Tap Card to Open Riddle ➔</span>
                    </div>
                  ) : (
                    <div className="tap-riddle-prompt">
                      <span>Tap to switch turn</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ===== BOTTOM COMPANION CONTROLS (Intact) ===== */}
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

      {/* ===== FULLSCREEN 180° FLIPPED RIDDLE EXPERIENCE MODAL ===== */}
      {isRiddleFullscreenOpen && (
        <div className="riddle-fullscreen-overlay page-transition-fade">
          <div className="riddle-fullscreen-container">
            {/* Top Bar with 1-Minute Riddle Session Countdown */}
            <div className="riddle-modal-top-bar">
              <div className="riddle-player-info-pill">
                <span className="riddle-player-avatar">{riddleModalPlayer?.avatar || activePlayer.avatar}</span>
                <div className="riddle-player-text">
                  <strong>{riddleModalPlayer?.name || activePlayer.name}</strong>
                  <small>Age {riddleModalPlayer?.ageGroup || activePlayer.ageGroup || '8-12'}</small>
                </div>
              </div>

              {/* 1-Minute Riddle Session Countdown Widget */}
              <div className={`riddle-session-timer-badge ${riddleTimeLeft <= 10 ? 'timer-badge--alert' : ''}`}>
                <Clock size={14} className={riddleTimeLeft <= 10 ? 'timer-pulse-icon' : ''} />
                <span className="timer-digits">{formatTime(riddleTimeLeft)}</span>
              </div>

              {/* Close / Return to Board Button */}
              <button
                type="button"
                className="riddle-fullscreen-close-btn"
                onClick={() => setIsRiddleFullscreenOpen(false)}
                aria-label="Return to Board"
              >
                <X size={18} />
              </button>
            </div>

            {/* Session Timer Progress Line */}
            <div className="riddle-timer-bar-track">
              <div
                className={`riddle-timer-bar-fill ${riddleTimeLeft <= 10 ? 'fill--alert' : ''}`}
                style={{ width: `${(riddleTimeLeft / 60) * 100}%` }}
              />
            </div>

            {/* Center 3D Flipped Riddle Card */}
            <div className="riddle-fullscreen-card-stage">
              <RiddleCard
                activePlayer={riddleModalPlayer || activePlayer}
                themeKey={themeKey}
                hasAnsweredRiddleThisTurn={hasAnsweredRiddleThisTurn}
                onRiddleAnswered={() => setHasAnsweredRiddleThisTurn(true)}
                onPointsDeducted={handlePointsDeducted}
                onSolveSuccess={handleSolveSuccess}
                onSolveFail={handleSolveFail}
              />
            </div>

            {/* Bottom Done Button */}
            <div className="riddle-modal-bottom-bar">
              <button
                type="button"
                className="return-to-arena-btn"
                onClick={() => setIsRiddleFullscreenOpen(false)}
              >
                <span>Return to Player Grid</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
                <span className="info-player-hero">
                  Hero: <strong>{selectedInfoPlayer.heroName}</strong> ({selectedInfoPlayer.heroSecondaryTitle})
                </span>
                <span className="info-player-age">
                  Age Range: <strong>{selectedInfoPlayer.ageGroup || '8-12'}</strong>
                </span>
              </div>
            </div>

            <div className="info-divider" />

            <div className="info-section">
              <h4 className="info-sec-title">
                <Zap size={14} color="#D9A441" /> Assigned Hero Advantage
              </h4>
              <div className="info-hero-adv-box">
                <strong className="info-hero-adv-name">{selectedInfoPlayer.heroSecondaryTitle}</strong>
                <p className="info-hero-adv-desc">{selectedInfoPlayer.heroAdvantage}</p>
                <span className="info-hero-status">
                  Status: <strong>{selectedInfoPlayer.isHeroAdvantageUsed ? 'Used' : 'Ready to activate'}</strong>
                </span>
              </div>
            </div>

            <div className="info-section" style={{ marginTop: '12px' }}>
              <h4 className="info-sec-title">
                <Sparkles size={14} color="#2ECC71" /> Earned Riddle Advantages ({selectedInfoPlayer.advantages?.length || 0})
              </h4>
              {selectedInfoPlayer.advantages && selectedInfoPlayer.advantages.length > 0 ? (
                <div className="info-earned-adv-list">
                  {selectedInfoPlayer.advantages.map((adv, aIdx) => (
                    <div key={aIdx} className="earned-adv-item">
                      <span className="earned-adv-dot">✦</span>
                      <div className="earned-adv-text">
                        <strong>{adv.name}</strong>
                        <small>{adv.description}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-adv-text">No riddle advantages earned yet. Solve riddles during your turn to win advantages!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL 2: CONFIRM HERO ADVANTAGE ACTIVATION ===== */}
      {advantageToConfirm && (
        <div className="live-modal-overlay">
          <div className="live-confirm-modal-card">
            <div className="confirm-modal-icon-badge">
              <Zap size={26} color="#D9A441" />
            </div>

            <h3 className="confirm-modal-title">Activate Hero Advantage?</h3>
            <p className="confirm-hero-name">
              {advantageToConfirm.heroName} · <strong>{advantageToConfirm.heroSecondaryTitle}</strong>
            </p>

            <div className="confirm-adv-desc-box">
              <p>{advantageToConfirm.heroAdvantage}</p>
            </div>

            <p className="confirm-warning-text">
              ⚠️ Note: This hero power is <strong>single-use</strong> per game session!
            </p>

            <div className="confirm-actions-row">
              <button
                type="button"
                className="confirm-activate-btn"
                onClick={handleConfirmUseAdvantage}
              >
                <Sparkles size={15} /> Activate Power Now
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

      {/* ===== MODAL 3: ACTIVE REWARD ANNOUNCEMENT ===== */}
      {activeRewardNotification && (
        <div className="live-modal-overlay" onClick={() => setActiveRewardNotification(null)}>
          <div className="live-reward-announcement-card" onClick={(e) => e.stopPropagation()}>
            <div className="reward-glow-badge">
              <Sparkles size={30} color="#FAF5EA" />
            </div>
            <h2 className="reward-headline">DIVINE POWER UNLEASHED!</h2>
            <h3 className="reward-power-title">{activeRewardNotification.title}</h3>
            <p className="reward-power-desc">{activeRewardNotification.description}</p>
            <button
              type="button"
              className="reward-dismiss-btn"
              onClick={() => setActiveRewardNotification(null)}
            >
              Execute on Physical Board ➔
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL 4: SURVEY TELEMETRY & GOOGLE SHEETS POPUP ===== */}
      {isSurveyModalOpen && (
        <div className="live-modal-overlay" onClick={() => setIsSurveyModalOpen(false)}>
          <div className="survey-modal-card page-dropdown-slide" onClick={(e) => e.stopPropagation()}>
            <div className="survey-modal-header">
              <div className="survey-header-title-group">
                <div className="survey-icon-disc">
                  <FileSpreadsheet size={20} color="#2ECC71" />
                </div>
                <div>
                  <h3 className="survey-modal-title">Survey Move Telemetry</h3>
                  <p className="survey-modal-subtitle">Time taken per player & timestamps</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setIsSurveyModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="survey-modal-body">
              {/* Quick 1-Click Action Bar */}
              <div className="survey-action-bar">
                <button
                  type="button"
                  className="survey-action-btn survey-action-btn--csv"
                  onClick={() => downloadSurveyCSV(players)}
                >
                  <Download size={14} /> Download CSV (Sheets)
                </button>
                <button
                  type="button"
                  className={`survey-action-btn survey-action-btn--copy ${copiedText ? 'btn-copied' : ''}`}
                  onClick={handleCopySurveyText}
                >
                  {copiedText ? <Check size={14} /> : <Copy size={14} />}
                  {copiedText ? 'Copied to Clipboard!' : 'Copy Text Summary'}
                </button>
                <button
                  type="button"
                  className="survey-action-btn survey-action-btn--open"
                  onClick={openGoogleSheets}
                >
                  <ExternalLink size={14} /> Open Google Sheets
                </button>
              </div>

              {/* Player-by-Player Clean Grouped Breakdown */}
              <div className="survey-players-container">
                {groupedSurveyData && groupedSurveyData.length > 0 ? (
                  groupedSurveyData.map((pData, pIdx) => (
                    <div key={pIdx} className="survey-player-card">
                      <div className="survey-player-header">
                        <div className="survey-player-name-row">
                          <span className="survey-player-num-tag">Player {pData.playerIndex + 1}</span>
                          <h4 className="survey-player-fullname">
                            {pData.playerName} <small>({pData.heroTitle || pData.heroName})</small>
                          </h4>
                        </div>
                        <div className="survey-player-total-pill">
                          <span>Total: <strong>{pData.totalDurationFormatted}</strong> ({pData.totalMoves} moves)</span>
                        </div>
                      </div>

                      <div className="survey-moves-table-wrap">
                        <table className="survey-moves-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Start ➔ End</th>
                              <th>Duration</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pData.moves.map((m, mIdx) => (
                              <tr key={mIdx}>
                                <td>{m.moveNumber}</td>
                                <td className="timestamp-cell">{m.startFormatted} ➔ {m.endFormatted}</td>
                                <td className="duration-cell"><strong>{m.durationSeconds}s</strong></td>
                                <td className="action-cell">{m.actionType}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="survey-empty-state">
                    <Clock size={28} color="#D9A441" />
                    <p>No moves recorded yet. Play moves in the game to generate telemetry!</p>
                  </div>
                )}
              </div>

              {/* End of Recording Date Banner */}
              <div className="survey-recording-date-banner">
                <Calendar size={15} color="#D9A441" />
                <span>
                  <strong>Date of Recording:</strong> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Optional Webhook URL Input for Direct Automation */}
              <form className="survey-webhook-form" onSubmit={handleSaveWebhook}>
                <label className="webhook-label">
                  🔗 Optional Google Apps Script / Webhook Endpoint:
                </label>
                <div className="webhook-input-row">
                  <input
                    type="url"
                    className="webhook-text-input"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput(e.target.value)}
                  />
                  <button type="submit" className="webhook-save-btn">
                    {webhookSaved ? 'Saved!' : 'Save'}
                  </button>
                </div>
              </form>
            </div>

            <div className="survey-modal-footer">
              <button
                type="button"
                className="survey-clear-btn"
                onClick={handleClearSurveyData}
              >
                <Trash2 size={14} /> Clear Telemetry
              </button>
              <button
                type="button"
                className="survey-close-btn"
                onClick={() => setIsSurveyModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCompanionPage;