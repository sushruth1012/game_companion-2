import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, Flame, Music, Landmark, Home, Settings } from 'lucide-react';
import ThemeCard from '../../components/cards/ThemeCard';
import { setTheme } from '../../services/themeService';
import rajyaImg from '../../assets/themes/rajya.jpg';
import navarasaImg from '../../assets/themes/navarasa.jpg';
import panchaboothaImg from '../../assets/themes/panchabootha.jpg';
import kalaYugaImg from '../../assets/themes/kala_yuga.jpg';
import kshetraDevalayaImg from '../../assets/themes/kshetra_devalaya.jpg';
import './ThemeSelection.css';

export const ThemeSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedThemeId, setSelectedThemeId] = useState('rajya');

  const themes = [
    {
      id: 'rajya',
      name: 'RAJYA',
      description: 'Lead mighty realms, build your legacy and shape history.',
      image: rajyaImg,
      accentColor: '#D9A441',
      badgeBg: 'radial-gradient(circle, #543714 0%, #2A1A08 100%)',
      buttonGradient: 'linear-gradient(180deg, #9E6C28 0%, #6E4515 100%)',
      buttonBorder: '#E5C37A',
      arrowDiscBg: 'radial-gradient(circle, #DDB15D 0%, #A57422 100%)',
      arrowColor: '#261509',
      icon: <Crown size={17} color="#F9D77E" />,
    },
    {
      id: 'navarasa',
      name: 'NAVARASA',
      description: 'Experience the nine emotions that shape art, life and the human spirit.',
      image: navarasaImg,
      accentColor: '#C76B4A',
      badgeBg: 'radial-gradient(circle, #5C2513 0%, #301107 100%)',
      buttonGradient: 'linear-gradient(180deg, #9C4524 0%, #6E2B12 100%)',
      buttonBorder: '#E89D80',
      arrowDiscBg: 'radial-gradient(circle, #E27B56 0%, #9C4524 100%)',
      arrowColor: '#FFFFFF',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#F8B89C">
          {/* Theater / Natya masks */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" opacity="0.3"/>
          <path d="M7 10h2v2H7zm8 0h2v2h-2zm-8 4c.83.6 1.88 1 3 1s2.17-.4 3-1H7zm8 0c.35.25.75.46 1.18.62L17.5 13H15v1z"/>
        </svg>
      ),
    },
    {
      id: 'panchabootha',
      name: 'PANCHABOOTHA',
      description: 'Discover the five elements that create, sustain and transform everything.',
      image: panchaboothaImg,
      accentColor: '#355E3B',
      badgeBg: 'radial-gradient(circle, #1E3B29 0%, #0F2216 100%)',
      buttonGradient: 'linear-gradient(180deg, #245037 0%, #153523 100%)',
      buttonBorder: '#72B68C',
      arrowDiscBg: 'radial-gradient(circle, #529E70 0%, #245037 100%)',
      arrowColor: '#FFFFFF',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#98D9AF">
          {/* Five Elements / Sacred Lotus Spirals */}
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="5" r="2" />
          <circle cx="19" cy="10" r="2" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="5" cy="10" r="2" />
        </svg>
      ),
    },
    {
      id: 'kala_yuga',
      name: 'KALA AND YUGA',
      description: 'Explore the arts, knowledge and time cycles that guide civilizations.',
      image: kalaYugaImg,
      accentColor: '#8C68B8',
      badgeBg: 'radial-gradient(circle, #3D275A 0%, #1F1230 100%)',
      buttonGradient: 'linear-gradient(180deg, #4A3469 0%, #2F1E46 100%)',
      buttonBorder: '#B297D6',
      arrowDiscBg: 'radial-gradient(circle, #8A68B8 0%, #4A3469 100%)',
      arrowColor: '#FFFFFF',
      icon: <Music size={16} color="#D8C4F2" />,
    },
    {
      id: 'kshetra_devalaya',
      name: 'KSHETRA AND DEVALAYA',
      description: 'Visit sacred places and temples that connect us to the divine.',
      image: kshetraDevalayaImg,
      accentColor: '#D97741',
      badgeBg: 'radial-gradient(circle, #5C2D16 0%, #2E1408 100%)',
      buttonGradient: 'linear-gradient(180deg, #9C4B20 0%, #6E3211 100%)',
      buttonBorder: '#EFA47B',
      arrowDiscBg: 'radial-gradient(circle, #E27845 0%, #9C4B20 100%)',
      arrowColor: '#FFFFFF',
      icon: <Landmark size={16} color="#F8C4A7" />,
    },
  ];

  const handleSelectTheme = async (theme) => {
    setSelectedThemeId(theme.id);
    console.log('[ThemeSelection] Setting standard theme:', theme.id);
    await setTheme(theme.id);
    navigate('/player-setup');
  };

  return (
    <div className="theme-selection-screen">
      {/* Background Ambience Watermark */}
      <div className="theme-bg-watermark" />

      {/* ===== TOP BAR ===== */}
      <header className="theme-top-bar">
        {/* Left Back Button */}
        <button
          type="button"
          className="theme-back-btn"
          onClick={() => navigate('/game-selection')}
          aria-label="Back to Game Selection"
        >
          <Home size={18} />
        </button>

        {/* Right Action / Emblem Badge */}
        <div className="theme-top-right-badge">
          <div className="top-banner-pendant">
            <svg viewBox="0 0 38 48" width="34" height="44" fill="#1C3827">
              <path d="M0,0 H38 V38 L19,46 L0,38 Z" stroke="#D9A441" strokeWidth="1.2" />
              {/* Star and Lotus */}
              <circle cx="19" cy="12" r="1.8" fill="#D9A441" />
              <path d="M19,16 C21,21 25,23 28,24 C25,26 21,28 19,32 C17,28 13,26 10,24 C13,23 17,21 19,16 Z" fill="#D9A441" />
            </svg>
          </div>
        </div>
      </header>

      {/* ===== HEADING SECTION ===== */}
      <section className="theme-heading-section">
        <div className="theme-main-title-wrap">
          <span className="theme-flourish-wing">❧</span>
          <h1 className="theme-main-title">CHOOSE YOUR WORLD</h1>
          <span className="theme-flourish-wing theme-flourish-wing--flip">❧</span>
        </div>
        <p className="theme-subtitle">Every world tells a different story. Pick your journey.</p>
      </section>

      {/* ===== THEME CARDS LAYOUT (UNIFORM EXACT SIZE) ===== */}
      <main className="theme-cards-grid">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={selectedThemeId === theme.id}
            onSelect={handleSelectTheme}
          />
        ))}
      </main>

      {/* ===== BOTTOM LOTUS ORNAMENT ===== */}
      <footer className="theme-bottom-flourish">
        <div className="bottom-lotus-wrap">
          <span className="lotus-divider-line lotus-divider-line--left" />
          <svg viewBox="0 0 32 20" width="28" height="18" fill="#B38435">
            <path d="M16,0 C17,5 22,8 27,9 C22,11 17,14 16,19 C15,14 10,11 5,9 C10,8 15,5 16,0 Z" />
            <path d="M8,10 C10,14 14,16 16,20 C18,16 22,14 24,10 Z" opacity="0.6" />
          </svg>
          <span className="lotus-divider-line lotus-divider-line--right" />
        </div>
      </footer>
    </div>
  );
};

export default ThemeSelectionPage;
