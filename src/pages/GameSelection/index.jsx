import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Settings, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import GameCard from '../../components/cards/GameCard';
import { createGame } from '../../services/gameService';
import chowkabaraImg from '../../assets/chowkabara_board.jpg';
import './GameSelection.css';

export const GameSelectionPage = () => {
  const navigate = useNavigate();

  // List of games in carousel
  const games = [
    {
      id: 'moksha',
      title: 'MOKSHA PATAM',
      description: 'Vedic journey of virtues and karma towards eternal liberation.',
      boardGraphic: (
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          <rect width="200" height="200" fill="#2E1B10" rx="8" />
          <path d="M20,20 H180 V180 H20 Z" fill="none" stroke="#D9A441" strokeWidth="1.5" />
          {/* Snakes and ladders grid */}
          <line x1="20" y1="60" x2="180" y2="60" stroke="#7A5228" strokeWidth="1" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="#7A5228" strokeWidth="1" />
          <line x1="20" y1="140" x2="180" y2="140" stroke="#7A5228" strokeWidth="1" />
          <line x1="60" y1="20" x2="60" y2="180" stroke="#7A5228" strokeWidth="1" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="#7A5228" strokeWidth="1" />
          <line x1="140" y1="20" x2="140" y2="180" stroke="#7A5228" strokeWidth="1" />
          <path d="M40,160 Q80,100 120,40" stroke="#C76B4A" strokeWidth="2.5" fill="none" strokeDasharray="3,3" />
          <path d="M160,140 Q110,90 70,30" stroke="#355E3B" strokeWidth="3" fill="none" />
        </svg>
      ),
    },
    {
      id: 'pachisi',
      title: 'PACHISI',
      description: 'The ancient royal four-arm cross race played in Mughal and Vedic courts.',
      boardGraphic: (
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          <rect width="200" height="200" fill="#29180E" rx="8" />
          {/* Cross Shape Board */}
          <path d="M70,20 H130 V70 H180 V130 H130 V180 H70 V130 H20 V70 H70 Z" fill="#3D2415" stroke="#D9A441" strokeWidth="1.5" />
          <rect x="75" y="75" width="50" height="50" fill="#24130A" stroke="#D9A441" strokeWidth="1.2" />
          <line x1="90" y1="20" x2="90" y2="180" stroke="#7A5228" strokeWidth="0.8" />
          <line x1="110" y1="20" x2="110" y2="180" stroke="#7A5228" strokeWidth="0.8" />
          <line x1="20" y1="90" x2="180" y2="90" stroke="#7A5228" strokeWidth="0.8" />
          <line x1="20" y1="110" x2="180" y2="110" stroke="#7A5228" strokeWidth="0.8" />
        </svg>
      ),
    },
    {
      // MVP Game - Positioned in the center by default
      id: 'chowkabara',
      title: 'CHOWKABARA',
      description: 'A legendary game of strategy, wisdom and perfect balance.',
      boardGraphic: (
        <img
          src={chowkabaraImg}
          alt="Authentic Chowkabara Wooden Inlay Board"
          className="chowkabara-board-img"
        />
      ),
    },
    {
      id: 'aadu_huli',
      title: 'AADU HULI AATA',
      description: 'The ancient Karnataka asymmetric tactical hunt of Tigers & Goats.',
      boardGraphic: (
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          <rect width="200" height="200" fill="#2A170C" rx="8" />
          {/* Triangular Apex & Grid */}
          <polygon points="100,25 25,175 175,175" fill="none" stroke="#D9A441" strokeWidth="1.5" />
          <line x1="100" y1="25" x2="100" y2="175" stroke="#D9A441" strokeWidth="1.2" />
          <line x1="50" y1="125" x2="150" y2="125" stroke="#7A5228" strokeWidth="1" />
          <line x1="68" y1="75" x2="132" y2="75" stroke="#7A5228" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: 'pallanguzhi',
      title: 'PALLANGUZHI',
      description: 'Traditional Tamil 14-pit mancala mathematical strategy game.',
      boardGraphic: (
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          <rect width="200" height="200" fill="#25160D" rx="8" />
          <rect x="20" y="55" width="160" height="90" rx="14" fill="#3D2415" stroke="#D9A441" strokeWidth="1.2" />
          {/* Two rows of circular pits */}
          <circle cx="42" cy="80" r="10" fill="#1A0E07" stroke="#8C622D" />
          <circle cx="70" cy="80" r="10" fill="#1A0E07" stroke="#8C622D" />
          <circle cx="100" cy="80" r="10" fill="#1A0E07" stroke="#8C622D" />
          <circle cx="130" cy="80" r="10" fill="#1A0E07" stroke="#8C622D" />
          <circle cx="158" cy="80" r="10" fill="#1A0E07" stroke="#8C622D" />
          <circle cx="42" cy="120" r="10" fill="#1A0E07" stroke="#8C622D" />
          <circle cx="70" cy="120" r="10" fill="#1A0E07" stroke="#8C622D" />
          <circle cx="100" cy="120" r="10" fill="#1A0E07" stroke="#8C622D" />
          <circle cx="130" cy="120" r="10" fill="#1A0E07" stroke="#8C622D" />
          <circle cx="158" cy="120" r="10" fill="#1A0E07" stroke="#8C622D" />
        </svg>
      ),
    },
  ];

  // Default active index is Chowkabara (Index 2 in list)
  const [activeIndex, setActiveIndex] = useState(2);

  // Swipe / Drag handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum swipe distance

    if (diff > threshold) {
      // Swiped Left -> Move Next
      handleNext();
    } else if (diff < -threshold) {
      // Swiped Right -> Move Prev
      handlePrev();
    }
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : games.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < games.length - 1 ? prev + 1 : 0));
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Selection Handler
  const handleSelectGame = async (game) => {
    if (game.id === 'chowkabara') {
      console.log('Selected MVP game: Chowkabara');
      await createGame({ name: 'Chowkabara', boardSize: 5 });
      navigate('/theme-selection');
    }
  };

  return (
    <div className="khel-selection-screen">
      {/* Background Palace Watermark & Ambience */}
      <div className="khel-bg-watermark" />

      {/* ===== TOP APP BAR ===== */}
      <header className="khel-top-bar">
        {/* Left Home Button */}
        <button
          type="button"
          className="header-icon-btn"
          onClick={() => navigate('/login')}
          aria-label="Back to Login"
        >
          <Home size={18} />
        </button>

        {/* Center Royal Hanging Tapestry Banner */}
        <div className="royal-hanging-banner">
          <div className="banner-rod" />
          <div className="banner-cloth">
            <svg viewBox="0 0 40 54" width="36" height="48" fill="#1C3827">
              <path d="M0,0 H40 V42 L20,52 L0,42 Z" stroke="#D9A441" strokeWidth="1.2" />
              {/* Center Golden Lotus Emblem */}
              <circle cx="20" cy="14" r="2" fill="#D9A441" />
              <path d="M20,18 C22,23 26,25 29,26 C26,28 22,30 20,34 C18,30 14,28 11,26 C14,25 18,23 20,18 Z" fill="#D9A441" />
            </svg>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="top-bar-actions">
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => navigate('/settings')}
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* ===== TITLE & SUBTITLE SECTION ===== */}
      <section className="khel-heading-section">
        <div className="khel-main-title-wrap">
          <span className="khel-flourish-wing">❧</span>
          <h1 className="khel-main-title">PICK YOUR KHEL</h1>
          <span className="khel-flourish-wing khel-flourish-wing--flip">❧</span>
        </div>
        <p className="khel-subtitle-line1">Every game carries a tradition.</p>
        <p className="khel-subtitle-line2">Choose your khel and begin your story.</p>

        {/* Center Golden Blossom Divider */}
        <div className="khel-mini-divider">
          <div className="mini-diamond" />
          <div className="mini-lotus">
            <svg viewBox="0 0 24 16" width="22" height="14" fill="#D9A441">
              <path d="M12,0 C13,4 17,6 20,7 C17,8 13,10 12,14 C11,10 7,8 4,7 C7,6 11,4 12,0 Z" />
            </svg>
          </div>
          <div className="mini-diamond" />
        </div>
      </section>

      {/* ===== 3D COVERFLOW SLIDING CAROUSEL ===== */}
      <div
        className="carousel-viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrows for accessibility and easy desktop/mobile clicking */}
        <button
          type="button"
          className="carousel-nav-btn carousel-nav-btn--prev"
          onClick={handlePrev}
          aria-label="Previous game"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="carousel-stage-3d">
          {games.map((game, idx) => {
            const offset = idx - activeIndex;
            const isCenter = idx === activeIndex;

            return (
              <GameCard
                key={game.id}
                game={game}
                isCenter={isCenter}
                offset={offset}
                onClick={() => setActiveIndex(idx)}
                onSelect={handleSelectGame}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="carousel-nav-btn carousel-nav-btn--next"
          onClick={handleNext}
          aria-label="Next game"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Carousel Pagination Dots */}
      <div className="carousel-dots-indicator">
        {games.map((g, idx) => (
          <button
            key={g.id}
            type="button"
            className={`carousel-dot ${idx === activeIndex ? 'carousel-dot--active' : ''}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to ${g.title}`}
          />
        ))}
      </div>

      {/* ===== BOTTOM HERITAGE BANNER ===== */}
      <footer className="khel-bottom-quote-box">
        <div className="quote-box-inner">
          <div className="quote-lotus-icon">
            <svg viewBox="0 0 32 26" width="28" height="22" fill="#D9A441">
              <path d="M16,0 C17,6 23,9 28,11 C23,13 17,16 16,22 C15,16 9,13 4,11 C9,9 15,6 16,0 Z" />
              <path d="M8,12 C10,16 14,19 16,25 C18,19 22,16 24,12 Z" opacity="0.65" />
            </svg>
          </div>
          <div className="quote-text-group">
            <p className="quote-line">Different games. Different stories.</p>
            <p className="quote-line">One timeless tradition.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GameSelectionPage;
