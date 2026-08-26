import React, {
  useState,
  useEffect
} from 'react';

import {
  useNavigate
} from 'react-router-dom';

import {
  Crown,
  Settings,
  Shield,
  Scroll,
  Coins
} from 'lucide-react';

import RiddleCard
  from '../../components/cards/RiddleCard';

import {
  nextTurn
} from '../../services/turnService';

import {
  addPoints,
  deductPoints
} from '../../services/pointService';

import {
  getCurrentUser
} from '../../services/authService';

import './LiveCompanion.css';


export const LiveCompanionPage = () => {

  const navigate =
    useNavigate();


  // ==========================================================
  // PLAYERS
  // ==========================================================

  const defaultPlayers = [

    {
      id: 'p_1',
      name: 'Arjun',
      uid: 'CHB001',
      points: 2450,
      shieldColor: '#2ECC71',
      avatar: '👦',
      num: 1
    },

    {
      id: 'p_2',
      name: 'Diya',
      uid: 'CHB002',
      points: 1980,
      shieldColor: '#3498DB',
      avatar: '👧',
      num: 2
    },

    {
      id: 'p_3',
      name: 'Kabir',
      uid: 'CHB003',
      points: 2760,
      shieldColor: '#E74C3C',
      avatar: '👦',
      num: 3
    },

    {
      id: 'p_4',
      name: 'Myra',
      uid: 'CHB004',
      points: 2120,
      shieldColor: '#9B59B6',
      avatar: '👧',
      num: 4
    }

  ];


  const [
    players,
    setPlayers
  ] = useState(
    defaultPlayers
  );


  const [
    activePlayerIndex,
    setActivePlayerIndex
  ] = useState(0);


  const [
    themeKey,
    setThemeKey
  ] = useState('rajya');


  const [
    worldThemeName,
    setWorldThemeName
  ] = useState('KINGDOMS');


  const [
    eventLogText,
    setEventLogText
  ] = useState(
    'A new story event has been triggered!'
  );


  // ==========================================================
  // LOGIN CHECK ONLY
  // ==========================================================
  //
  // NO SESSION LOCK
  // NO HEARTBEAT
  // NO TIMEOUT
  //
  // Multiple browsers/devices using the same Gmail are allowed.
  // ==========================================================

  useEffect(() => {

    const user =
      getCurrentUser();


    if (!user) {

      navigate(
        '/login'
      );

    }

  }, [navigate]);


  // ==========================================================
  // LOAD PLAYERS + THEME
  // ==========================================================

  useEffect(() => {

    const storedPlayers =
      sessionStorage.getItem(
        'activeGamePlayers'
      );


    if (
      storedPlayers
    ) {

      try {

        const parsed =
          JSON.parse(
            storedPlayers
          );


        if (
          parsed.length > 0
        ) {

          const mapped =
            parsed.map(
              (
                p,
                idx
              ) => ({

                id:
                  p.id,

                name:
                  p.name ||
                  `Player ${idx + 1}`,

                uid:
                  p.uid ||
                  `CHB00${idx + 1}`,

                points:
                  2000 +
                  idx * 250,

                shieldColor:
                  [
                    '#2ECC71',
                    '#3498DB',
                    '#E74C3C',
                    '#9B59B6'
                  ][
                    idx % 4
                  ],

                avatar:
                  idx % 2 === 0
                    ? '👦'
                    : '👧',

                num:
                  idx + 1

              })
            );


          setPlayers(
            mapped
          );

        }

      } catch (error) {

        console.error(
          'Error parsing stored players:',
          error
        );

      }

    }


    const storedTheme =
      localStorage.getItem(
        'selectedTheme'
      ) ||
      sessionStorage.getItem(
        'activeTheme'
      );


    if (
      storedTheme
    ) {

      setThemeKey(
        storedTheme
      );


      const names = {

        rajya:
          'KINGDOMS',

        navarasa:
          'NAVARASA',

        panchabootha:
          'PANCHABOOTHA',

        kala_yuga:
          'KALA & YUGA',

        kshetra_devalaya:
          'KSHETRA & DEVALAYA'

      };


      setWorldThemeName(
        names[storedTheme] ||
        'KINGDOMS'
      );

    }

  }, []);


  const activePlayer =
    players[
      activePlayerIndex
    ] ||
    players[0];


  // ==========================================================
  // PLAYER TAP
  // ==========================================================

  const handlePlayerTap =
    (
      index
    ) => {

      setActivePlayerIndex(
        index
      );


      const selected =
        players[index];


      setEventLogText(
        `Turn switched to ${selected.name}.`
      );

    };


  // ==========================================================
  // NEXT TURN
  // ==========================================================

  const handleNextTurn =
    async () => {

      try {

        await nextTurn(
          'chowkabara_live_session'
        );


        setActivePlayerIndex(
          (
            previous
          ) => {

            const nextIndex =
              (
                previous +
                1
              ) %
              players.length;


            setEventLogText(
              `Turn passed to ${players[nextIndex].name}.`
            );


            return nextIndex;

          }
        );

      } catch (error) {

        console.error(
          'Next turn failed:',
          error
        );

      }

    };


  // ==========================================================
  // POINT DEDUCTION
  // ==========================================================

  const handlePointsDeducted =
    async (
      cost
    ) => {

      try {

        await deductPoints(
          activePlayer.id,
          cost
        );


        setPlayers(
          (
            previous
          ) =>
            previous.map(
              (
                player,
                index
              ) =>
                index ===
                activePlayerIndex
                  ? {

                      ...player,

                      points:
                        Math.max(
                          0,
                          player.points -
                          cost
                        )

                    }

                  : player
            )
        );

      } catch (error) {

        console.error(
          'Point deduction failed:',
          error
        );

      }

    };


  // ==========================================================
  // RIDDLE SOLVED
  // ==========================================================

  const handleSolveSuccess =
    async (
      rewardPts
    ) => {

      try {

        await addPoints(
          activePlayer.id,
          rewardPts
        );


        setPlayers(
          (
            previous
          ) =>
            previous.map(
              (
                player,
                index
              ) =>
                index ===
                activePlayerIndex
                  ? {

                      ...player,

                      points:
                        player.points +
                        rewardPts

                    }

                  : player
            )
        );

      } catch (error) {

        console.error(
          'Reward points failed:',
          error
        );

      }

    };


  // ==========================================================
  // RIDDLE FAILED
  // ==========================================================

  const handleSolveFail =
    async (
      penalty
    ) => {

      if (
        penalty <= 0
      ) {

        return;

      }


      try {

        await deductPoints(
          activePlayer.id,
          penalty
        );


        setPlayers(
          (
            previous
          ) =>
            previous.map(
              (
                player,
                index
              ) =>
                index ===
                activePlayerIndex
                  ? {

                      ...player,

                      points:
                        Math.max(
                          0,
                          player.points -
                          penalty
                        )

                    }

                  : player
            )
        );

      } catch (error) {

        console.error(
          'Penalty points failed:',
          error
        );

      }

    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="live-companion-screen page-transition-fade">

      <div className="live-ambient-blurred-bg" />

      <div className="live-bg-board-watermark" />


      {/* ======================================================
          TOP APP BAR
          ====================================================== */}

      <header className="live-top-bar">

        <div className="world-theme-badge">

          <Crown
            size={15}
            color="#D9A441"
          />

          <div className="world-badge-text">

            <span className="world-label">
              World
            </span>

            <span className="world-name">
              {worldThemeName}
            </span>

          </div>

        </div>


        <div className="chapter-banner">

          <span className="chapter-title">
            Chapter 1: The Young Heir 📜
          </span>

        </div>


        <div className="top-right-group">

          <div className="progress-badge">

            <span>
              Game in Progress ⏳
            </span>

          </div>


          <button
            type="button"
            className="settings-gear-btn"
            onClick={() =>
              navigate(
                '/settings'
              )
            }
            aria-label="Settings"
          >

            <Settings
              size={17}
            />

          </button>

        </div>

      </header>


      {/* ======================================================
          MAIN PLAY AREA
          ====================================================== */}

      <main className="live-main-arena">


        {/* LEFT */}

        <div className="players-column players-column--left">

          {players
            .filter(
              (
                _,
                index
              ) =>
                index % 2 === 0
            )
            .map(
              (
                player,
                filteredIndex
              ) => {

                const originalIndex =
                  filteredIndex *
                  2;


                const isActive =
                  originalIndex ===
                  activePlayerIndex;


                return (

                  <div
                    key={
                      player.id
                    }
                    className={
                      `player-side-card ${
                        isActive
                          ? 'player-side-card--active'
                          : ''
                      }`
                    }
                    onClick={() =>
                      handlePlayerTap(
                        originalIndex
                      )
                    }
                    title="Tap to make active turn"
                  >

                    <div className="player-num-pill">

                      {
                        player.num
                      }

                    </div>


                    <div className="player-avatar-circle">

                      <span className="player-emoji-avatar">

                        {
                          player.avatar
                        }

                      </span>

                    </div>


                    <h3 className="player-side-name">

                      {
                        player.name
                      }

                    </h3>


                    <span className="player-side-uid">

                      UID: {
                        player.uid
                      }

                    </span>


                    <div className="player-side-points">

                      <Coins
                        size={12}
                        className="points-coin-icon"
                      />

                      <span>

                        {
                          player.points
                        }

                      </span>

                    </div>


                    <span className="points-label">
                      Points
                    </span>


                    <div
                      className="player-shield-wrap"
                      style={{
                        color:
                          player.shieldColor
                      }}
                    >

                      <Shield
                        size={16}
                        fill="currentColor"
                        fillOpacity={0.25}
                      />

                    </div>

                  </div>

                );

              }
            )}

        </div>


        {/* CENTER */}

        <div className="arena-center-card">

          <RiddleCard

            activePlayer={
              activePlayer
            }

            themeKey={
              themeKey
            }

            onPointsDeducted={
              handlePointsDeducted
            }

            onSolveSuccess={
              handleSolveSuccess
            }

            onSolveFail={
              handleSolveFail
            }

            onEventLog={
              setEventLogText
            }

          />

        </div>


        {/* RIGHT */}

        <div className="players-column players-column--right">

          {players
            .filter(
              (
                _,
                index
              ) =>
                index % 2 !== 0
            )
            .map(
              (
                player,
                filteredIndex
              ) => {

                const originalIndex =
                  filteredIndex *
                  2 +
                  1;


                const isActive =
                  originalIndex ===
                  activePlayerIndex;


                return (

                  <div
                    key={
                      player.id
                    }
                    className={
                      `player-side-card ${
                        isActive
                          ? 'player-side-card--active'
                          : ''
                      }`
                    }
                    onClick={() =>
                      handlePlayerTap(
                        originalIndex
                      )
                    }
                    title="Tap to make active turn"
                  >

                    <div className="player-num-pill">

                      {
                        player.num
                      }

                    </div>


                    <div className="player-avatar-circle">

                      <span className="player-emoji-avatar">

                        {
                          player.avatar
                        }

                      </span>

                    </div>


                    <h3 className="player-side-name">

                      {
                        player.name
                      }

                    </h3>


                    <span className="player-side-uid">

                      UID: {
                        player.uid
                      }

                    </span>


                    <div className="player-side-points">

                      <Coins
                        size={12}
                        className="points-coin-icon"
                      />

                      <span>

                        {
                          player.points
                        }

                      </span>

                    </div>


                    <span className="points-label">
                      Points
                    </span>


                    <div
                      className="player-shield-wrap"
                      style={{
                        color:
                          player.shieldColor
                      }}
                    >

                      <Shield
                        size={16}
                        fill="currentColor"
                        fillOpacity={0.25}
                      />

                    </div>

                  </div>

                );

              }
            )}

        </div>

      </main>


      {/* ======================================================
          BOTTOM PANEL
          ====================================================== */}

      <footer className="live-bottom-panel">

        <div
          className="current-turn-banner"
          onClick={
            handleNextTurn
          }
          title="Click to advance to next player's turn"
        >

          <div className="turn-banner-header">

            <Crown
              size={18}
              color="#D9A441"
            />

            <span className="turn-label">
              CURRENT TURN
            </span>

          </div>


          <h2 className="active-turn-player-name">

            {
              activePlayer.name
            }’s Turn

          </h2>


          <p className="turn-sub-instruction">
            Tap banner to pass turn or select another player on the board
          </p>


          <div className="turn-tap-hint">
            Tap banner to pass turn ➔
          </div>

        </div>


        <div className="event-log-banner">

          <div className="event-log-text-wrap">

            <span className="event-log-label">
              EVENT LOG
            </span>

            <p className="event-log-content">

              {
                eventLogText
              }

            </p>

          </div>


          <div className="event-log-scroll-icon">

            <Scroll
              size={22}
              color="#8C642A"
            />

          </div>

        </div>

      </footer>

    </div>

  );

};


export default LiveCompanionPage;