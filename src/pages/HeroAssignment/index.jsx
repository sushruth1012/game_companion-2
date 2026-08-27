import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowRight, Shuffle, Crown, ChevronLeft } from 'lucide-react';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { HEROES_DATABASE, assignRandomHeroes } from '../../services/heroService';
import './HeroAssignment.css';

export const HeroAssignmentPage = () => {
  const navigate = useNavigate();
  const [assignedPlayers, setAssignedPlayers] = useState([]);
  const [speakingHeroId, setSpeakingHeroId] = useState(null);

  useEffect(() => {
    // Read configured players from setup
    let players = [];
    const stored = sessionStorage.getItem('activeGamePlayers');
    if (stored) {
      try {
        players = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored players:', e);
      }
    }

    // Default fallback to 2 players if none found
    if (!players || players.length === 0) {
      players = [
        { id: 'p_1', name: 'Player 1', uid: 'CHB001', color: '#1B3B5C', num: 1 },
        { id: 'p_2', name: 'Player 2', uid: 'CHB002', color: '#B86518', num: 2 },
      ];
    }

    // Randomly assign heroes on load
    const updated = assignRandomHeroes(players);
    setAssignedPlayers(updated);
    sessionStorage.setItem('activeGamePlayers', JSON.stringify(updated));
  }, []);

  // Re-shuffle heroes randomly
  const handleReshuffle = () => {
    window.speechSynthesis?.cancel();
    setSpeakingHeroId(null);
    setAssignedPlayers((prev) => {
      const updated = assignRandomHeroes(prev);
      sessionStorage.setItem('activeGamePlayers', JSON.stringify(updated));
      return updated;
    });
  };

  // Speaker audio narration for character lore
  const handlePlayLore = (hero) => {
    if (!window.speechSynthesis) return;

    if (speakingHeroId === hero.id) {
      window.speechSynthesis.cancel();
      setSpeakingHeroId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(hero.lore);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingHeroId(null);
    utterance.onerror = () => setSpeakingHeroId(null);

    setSpeakingHeroId(hero.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleProceed = () => {
    window.speechSynthesis?.cancel();
    navigate('/live-game');
  };

  return (
    <div className="heroes-screen page-transition-fade">
      {/* Background Ambience */}
      <div className="heroes-parchment-bg" />

      {/* ===== TOP NAVIGATION & HEADER ===== */}
      <header className="heroes-top-header">
        <button
          type="button"
          className="heroes-back-btn"
          onClick={() => navigate('/player-setup')}
          aria-label="Back to Player Setup"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Vintage Header Engravings */}
        <div className="heroes-title-container">
          <div className="header-engraving-left">
            <svg viewBox="0 0 60 40" width="45" height="30" fill="#8C642A" opacity="0.65">
              <path d="M5,35 Q20,10 40,5 Q30,20 20,25 Q10,28 5,35 Z" />
              <circle cx="45" cy="5" r="2" fill="#D9A441" />
              <path d="M15,35 L45,15" stroke="#8C642A" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="heroes-main-headings">
            <h1 className="heroes-main-title">CHOOSE YOUR HEROES</h1>
            <p className="heroes-sub-badge">✦ EACH HERO IS ASSIGNED TO A PLAYER ✦</p>
          </div>

          <div className="header-engraving-right">
            <svg viewBox="0 0 60 40" width="45" height="30" fill="#8C642A" opacity="0.65">
              <circle cx="20" cy="28" r="8" stroke="#8C642A" strokeWidth="1.5" fill="none" />
              <path d="M10,28 L50,15 L40,5 Z" />
              <circle cx="48" cy="12" r="2" fill="#D9A441" />
            </svg>
          </div>
        </div>

        <button
          type="button"
          className="heroes-shuffle-top-btn"
          onClick={handleReshuffle}
          title="Re-assign heroes randomly"
        >
          <Shuffle size={15} />
          <span>Shuffle</span>
        </button>
      </header>

      {/* ===== HERO ASSIGNMENT LIST ===== */}
      <main className="heroes-assignment-list">
        {assignedPlayers.map((player, idx) => {
          const hero = player.hero || HEROES_DATABASE[idx % HEROES_DATABASE.length];
          const isSpeaking = speakingHeroId === hero.id;

          return (
            <div key={player.id || idx} className="hero-assignment-row">
              {/* 1. Hero Artwork Portrait */}
              <div className="hero-portrait-frame">
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="hero-portrait-img"
                />
                <div className="hero-portrait-border" />
              </div>

              {/* 2. Hero Details & Advantage Box */}
              <div className="hero-details-column">
                <h2 className="hero-name">{hero.name}</h2>

                {/* Secondary Title Pill */}
                <div
                  className="hero-title-pill"
                  style={{
                    background: hero.badgeBg,
                    borderColor: hero.badgeBorder,
                  }}
                >
                  <span className="pill-flourish">✦</span>
                  <span className="pill-text">{hero.secondaryTitle}</span>
                  <span className="pill-flourish">✦</span>
                </div>

                {/* Advantage Box */}
                <div className="hero-advantage-box">
                  <div className="advantage-box-header">✦ ADVANTAGE ✦</div>
                  <p className="advantage-box-text">{hero.advantage}</p>
                </div>

                {/* Speaker Lore Button (Replaces Story Paragraph) */}
                <div className="hero-audio-action-row">
                  <button
                    type="button"
                    className={`hero-audio-btn ${isSpeaking ? 'hero-audio-btn--active' : ''}`}
                    onClick={() => handlePlayLore(hero)}
                    title={isSpeaking ? "Stop narration" : "Listen to character lore"}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX size={15} color="#E74C3C" />
                        <span>Stop Lore Narration</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={15} color="#D9A441" />
                        <span>Listen to Lore</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 3. Connecting Flow Arrow */}
              <div className="hero-flow-arrow">
                <ArrowRight size={22} color="#4A2E1B" strokeWidth={2.5} />
              </div>

              {/* 4. Assigned Player Card */}
              <div
                className="hero-assigned-player-card"
                style={{
                  background: hero.badgeBg,
                  borderColor: hero.cardBorder,
                  boxShadow: `0 8px 20px rgba(0, 0, 0, 0.35), inset 0 0 10px ${hero.cardBorder}44`,
                }}
              >
                <div className="assigned-card-sub">✦ ASSIGNED TO ✦</div>
                <h3 className="assigned-card-player-num">
                  {player.name || `PLAYER ${idx + 1}`}
                </h3>

                {/* Avatar Silhouette Disc */}
                <div className="assigned-avatar-disc">
                  <svg viewBox="0 0 40 40" width="32" height="32" fill="#0D1622">
                    <circle cx="20" cy="14" r="7" />
                    <path d="M8,36 C8,26 14,23 20,23 C26,23 32,26 32,36 Z" />
                  </svg>
                </div>

                {/* Golden Crown Icon */}
                <div className="assigned-crown-badge">
                  <Crown size={12} color="#D9A441" fill="#D9A441" />
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* ===== BOTTOM ACTION PANEL ===== */}
      <footer className="heroes-bottom-panel">
        <PrimaryButton
          variant="terracotta"
          onClick={handleProceed}
          showArrow={true}
        >
          Proceed to Game Companion
        </PrimaryButton>
      </footer>
    </div>
  );
};

export default HeroAssignmentPage;
