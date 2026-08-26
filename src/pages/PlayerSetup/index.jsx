import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Users,
  ChevronUp,
  ChevronDown,
  Crown,
  Music,
  Landmark
} from 'lucide-react';

import PlayerCard from '../../components/cards/PlayerCard';
import PrimaryButton from '../../components/buttons/PrimaryButton';

import rajyaImg from '../../assets/themes/rajya.jpg';
import navarasaImg from '../../assets/themes/navarasa.jpg';
import panchaboothaImg from '../../assets/themes/panchabootha.jpg';
import kalaYugaImg from '../../assets/themes/kala_yuga.jpg';
import kshetraDevalayaImg from '../../assets/themes/kshetra_devalaya.jpg';

import './PlayerSetup.css';


export const PlayerSetupPage = () => {

  const navigate = useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    selectedThemeKey,
    setSelectedThemeKey
  ] = useState('rajya');


  const [
    playerCount,
    setPlayerCount
  ] = useState(2);


  const [
    isDetailsOpen,
    setIsDetailsOpen
  ] = useState(true);


  const [
    isStarting,
    setIsStarting
  ] = useState(false);


  const [
    errorMessage,
    setErrorMessage
  ] = useState('');


  // ==========================================================
  // THEMES
  // ==========================================================

  const themeDetailsMap = {

    rajya: {
      id: 'rajya',
      name: 'RAJYA',
      tag: 'Royal Realm',
      image: rajyaImg,
      color: '#D9A441',
      badgeBg:
        'radial-gradient(circle, #543714 0%, #2A1A08 100%)',
      icon:
        <Crown
          size={18}
          color="#F9D77E"
        />,
    },

    navarasa: {
      id: 'navarasa',
      name: 'NAVARASA',
      tag: 'Nine Emotions',
      image: navarasaImg,
      color: '#C76B4A',
      badgeBg:
        'radial-gradient(circle, #5C2513 0%, #301107 100%)',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="#F8B89C"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
            opacity="0.4"
          />
          <path
            d="M7 10h2v2H7zm8 0h2v2h-2zm-8 4c.83.6 1.88 1 3 1s2.17-.4 3-1H7zm8 0c.35.25.75.46 1.18.62L17.5 13H15v1z"
          />
        </svg>
      ),
    },

    panchabootha: {
      id: 'panchabootha',
      name: 'PANCHABOOTHA',
      tag: 'Five Elements',
      image: panchaboothaImg,
      color: '#355E3B',
      badgeBg:
        'radial-gradient(circle, #1E3B29 0%, #0F2216 100%)',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="#98D9AF"
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="5" r="2" />
          <circle cx="19" cy="10" r="2" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="5" cy="10" r="2" />
        </svg>
      ),
    },

    kala_yuga: {
      id: 'kala_yuga',
      name: 'KALA & YUGA',
      tag: 'Arts & Eras',
      image: kalaYugaImg,
      color: '#8C68B8',
      badgeBg:
        'radial-gradient(circle, #3D275A 0%, #1F1230 100%)',
      icon:
        <Music
          size={18}
          color="#D8C4F2"
        />,
    },

    kshetra_devalaya: {
      id: 'kshetra_devalaya',
      name: 'KSHETRA & DEVALAYA',
      tag: 'Sacred Temples',
      image: kshetraDevalayaImg,
      color: '#D97741',
      badgeBg:
        'radial-gradient(circle, #5C2D16 0%, #2E1408 100%)',
      icon:
        <Landmark
          size={18}
          color="#F8C4A7"
        />,
    },

  };


  // ==========================================================
  // LOAD THEME
  // ==========================================================

  useEffect(() => {

    const storedTheme =
      localStorage.getItem(
        'selectedTheme'
      );


    if (
      storedTheme &&
      themeDetailsMap[storedTheme]
    ) {

      setSelectedThemeKey(
        storedTheme
      );

    }

  }, []);


  const currentTheme =
    themeDetailsMap[selectedThemeKey] ||
    themeDetailsMap.rajya;


  // ==========================================================
  // PLAYERS
  // ==========================================================

  const [
    playersData,
    setPlayersData
  ] = useState([
    {
      id: '1',
      uid: '',
      age: ''
    },
    {
      id: '2',
      uid: '',
      age: ''
    },
    {
      id: '3',
      uid: '',
      age: ''
    },
    {
      id: '4',
      uid: '',
      age: ''
    }
  ]);


  const playerThemes = [

    {
      color: '#355E3B',
      label: 'Forest Green'
    },

    {
      color: '#C76B4A',
      label: 'Terracotta'
    },

    {
      color: '#D9A441',
      label: 'Marigold Gold'
    },

    {
      color: '#6B4F3A',
      label: 'Earth Brown'
    }

  ];


  // ==========================================================
  // UID
  // ==========================================================

  const handleUidChange =
    (
      index,
      value
    ) => {

      setPlayersData(
        (previous) => {

          const updated =
            [
              ...previous
            ];


          updated[index] = {

            ...updated[index],

            uid:
              value

          };


          return updated;

        }
      );

    };


  // ==========================================================
  // AGE
  // ==========================================================

  const handleAgeChange =
    (
      index,
      value
    ) => {

      setPlayersData(
        (previous) => {

          const updated =
            [
              ...previous
            ];


          updated[index] = {

            ...updated[index],

            age:
              value

          };


          return updated;

        }
      );

    };


  // ==========================================================
  // SCAN
  // ==========================================================

  const handleScan =
    (
      index
    ) => {

      const mockUID =
        'YTR_' +
        Math.floor(
          1000 +
          Math.random() *
          9000
        );


      handleUidChange(
        index,
        mockUID
      );

    };


  // ==========================================================
  // CONTINUE
  // ==========================================================

  const handleContinue =
    async () => {

      try {

        setIsStarting(
          true
        );

        setErrorMessage(
          ''
        );


        // ======================================================
        // PREPARE PLAYER DATA
        // ======================================================

        const activePlayers =
          playersData
            .slice(
              0,
              playerCount
            )
            .map(
              (
                player,
                index
              ) => ({

                id:
                  `p_${index + 1}`,

                name:
                  `Player ${index + 1}`,

                uid:
                  player.uid.trim() ||
                  `GUEST_${index + 1}`,

                age:
                  player.age ||
                  '15+',

                color:
                  playerThemes[index].color,

                pawnIndex:
                  index

              })
            );


        // ======================================================
        // SAVE TO THIS BROWSER
        // ======================================================
        //
        // No Firebase player/session write.
        // This is intentional because multiple devices using
        // the same Gmail are currently allowed.
        // ======================================================

        sessionStorage.setItem(
          'activeGamePlayers',
          JSON.stringify(
            activePlayers
          )
        );


        sessionStorage.setItem(
          'activeTheme',
          selectedThemeKey
        );


        // ======================================================
        // ENTER LIVE GAME
        // ======================================================

        navigate(
          '/live-game'
        );

      } catch (error) {

        console.error(
          '[PlayerSetup] Failed:',
          error
        );


        setErrorMessage(
          error.message ||
          'Unable to start the game.'
        );

      } finally {

        setIsStarting(
          false
        );

      }

    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="player-setup-screen page-transition-fade">

      {/* ======================================================
          TOP HEADER
          ====================================================== */}

      <header className="setup-header-arch">

        <button
          type="button"
          className="setup-back-btn"
          onClick={() =>
            navigate(
              '/theme-selection'
            )
          }
          aria-label="Back to Theme Selection"
        >

          <ChevronLeft
            size={20}
          />

        </button>


        <div className="header-temple-art">

          <svg
            viewBox="0 0 100 80"
            width="85"
            height="68"
            fill="#B38435"
            opacity="0.8"
          >

            <path
              d="M50,80 L50,45 Q55,42 60,30 L60,18 Q65,12 70,8 Q75,12 80,18 L80,30 Q85,42 90,45 L90,80 Z"
            />

            <path
              d="M20,80 L20,55 Q25,50 30,40 L30,30 Q35,22 40,18 Q45,22 50,30 L50,55 Z"
              opacity="0.7"
            />

            <path
              d="M70,8 Q95,15 90,40 Q95,25 100,5"
              fill="#355E3B"
              opacity="0.85"
            />

            <circle
              cx="85"
              cy="20"
              r="3"
              fill="#C76B4A"
            />

            <circle
              cx="95"
              cy="30"
              r="3"
              fill="#D9A441"
            />

          </svg>

        </div>


        <div className="setup-arch-curve" />

      </header>


      {/* ======================================================
          THEME MEDALLION
          ====================================================== */}

      <div className="setup-theme-badge-wrapper">

        <div
          className="setup-theme-medallion-ring"
          style={{
            borderColor:
              currentTheme.color,

            boxShadow:
              `0 8px 24px rgba(45, 27, 14, 0.4), 0 0 16px ${currentTheme.color}66`
          }}
        >

          <div
            className="setup-theme-icon-tag"
            style={{
              background:
                currentTheme.badgeBg,

              borderColor:
                currentTheme.color
            }}
          >

            {currentTheme.icon}

          </div>


          <div className="setup-theme-artwork-circle">

            <img
              src={
                currentTheme.image
              }
              alt={
                currentTheme.name
              }
              className="setup-theme-artwork-img"
            />

            <div className="setup-theme-artwork-overlay" />

          </div>


          <div className="setup-theme-ribbon-tag">

            <span className="ribbon-theme-name">

              {
                currentTheme.name
              }

            </span>

          </div>

        </div>

      </div>


      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <main className="setup-content">

        <div className="setup-heading-group">

          <h1 className="setup-title">
            Select Number of Players
          </h1>


          <div className="setup-mini-divider">

            <span
              className="divider-line divider-line--left"
            />


            <div className="divider-lotus">

              <svg
                viewBox="0 0 28 16"
                width="24"
                height="14"
                fill="#D9A441"
              >

                <path
                  d="M14,0 C15,4 19,6 23,7 C19,8 15,10 14,14 C13,10 9,8 5,7 C9,6 13,4 14,0 Z"
                />

                <circle
                  cx="14"
                  cy="7"
                  r="1.8"
                  fill="#422919"
                />

              </svg>

            </div>


            <span
              className="divider-line divider-line--right"
            />

          </div>


          <p className="setup-subtitle">
            Choose how many players will join the game
          </p>

        </div>


        {/* ====================================================
            PLAYER COUNT
            ==================================================== */}

        <div className="player-count-tabs">

          {[2, 3, 4].map(
            (
              count
            ) => (

              <button
                key={count}
                type="button"
                className={
                  `player-tab-btn ${
                    playerCount === count
                      ? 'player-tab-btn--active'
                      : ''
                  }`
                }
                onClick={() =>
                  setPlayerCount(
                    count
                  )
                }
              >

                <Users
                  size={17}
                  className="player-tab-icon"
                />

                <span>
                  {count} Players
                </span>

              </button>

            )
          )}

        </div>


        {/* ====================================================
            PLAYER DETAILS
            ==================================================== */}

        <div className="player-details-container">

          <div
            className="player-details-header"
            onClick={() =>
              setIsDetailsOpen(
                !isDetailsOpen
              )
            }
          >

            <div className="details-header-left">

              <div className="details-users-badge">

                <Users
                  size={16}
                  color="#FFFFFF"
                />

              </div>


              <div className="details-header-text">

                <h3 className="details-title">
                  Player Details
                </h3>


                <p className="details-subtitle">

                  Enter details for{' '}

                  {
                    playerCount === 2
                      ? 'both'
                      : `all ${playerCount}`
                  }

                  {' '}
                  players

                </p>

              </div>

            </div>


            <button
              type="button"
              className="details-toggle-btn"
              aria-label="Toggle details"
            >

              {
                isDetailsOpen
                  ? (
                    <ChevronUp
                      size={20}
                    />
                  )
                  : (
                    <ChevronDown
                      size={20}
                    />
                  )
              }

            </button>

          </div>


          {isDetailsOpen && (

            <div className="player-cards-list">

              {Array.from(
                {
                  length:
                    playerCount
                }
              ).map(
                (
                  _,
                  index
                ) => (

                  <PlayerCard
                    key={index}
                    playerNumber={
                      index + 1
                    }
                    playerData={
                      playersData[index]
                    }
                    themeColor={
                      playerThemes[index].color
                    }
                    onUidChange={
                      (value) =>
                        handleUidChange(
                          index,
                          value
                        )
                    }
                    onAgeChange={
                      (value) =>
                        handleAgeChange(
                          index,
                          value
                        )
                    }
                    onScanClick={
                      () =>
                        handleScan(
                          index
                        )
                    }
                  />

                )
              )}

            </div>

          )}

        </div>


        {/* ====================================================
            ERROR
            ==================================================== */}

        {errorMessage && (

          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#FDF2E9',
              border: '1px solid #C76B4A',
              color: '#A84F35',
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >

            {
              errorMessage
            }

          </div>

        )}


        {/* ====================================================
            CONTINUE
            ==================================================== */}

        <div className="setup-action-wrap">

          <PrimaryButton
            variant="terracotta"
            onClick={
              handleContinue
            }
            disabled={
              isStarting
            }
            showArrow={true}
          >

            {
              isStarting
                ? 'Setting up Match...'
                : 'Continue'
            }

          </PrimaryButton>

        </div>

      </main>


      {/* ======================================================
          FOOTER
          ====================================================== */}

      <footer className="setup-footer-arch">

        <div className="footer-arch-curve" />

        <div className="footer-monuments-bg" />


        <div className="footer-lotus-flourish">

          <svg
            viewBox="0 0 32 20"
            width="28"
            height="18"
            fill="#D9A441"
          >

            <path
              d="M16,0 C17,5 22,8 27,9 C22,11 17,14 16,19 C15,14 10,11 5,9 C10,8 15,5 16,0 Z"
            />

            <path
              d="M8,10 C10,14 14,16 16,20 C18,16 22,14 24,10 Z"
              opacity="0.65"
            />

          </svg>

        </div>

      </footer>

    </div>

  );

};


export default PlayerSetupPage;