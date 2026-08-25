import React from 'react';
import { ChevronRight } from 'lucide-react';
import './ThemeCard.css';

export const ThemeCard = ({ theme, isSelected, onSelect }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(theme);
    }
  };

  return (
    <button
      type="button"
      className={`theme-world-card ${isSelected ? 'theme-world-card--selected' : ''}`}
      onClick={handleClick}
      aria-label={`Select ${theme.name} theme`}
    >
      <div className="theme-card-frame">
        {/* Top Floating Circular Icon Badge */}
        <div
          className="theme-top-badge"
          style={{
            background: theme.badgeBg || 'radial-gradient(circle, #2C1B10 0%, #150C07 100%)',
            borderColor: theme.accentColor || '#D9A441',
          }}
        >
          {theme.icon}
        </div>

        {/* Artwork Canvas */}
        <div className="theme-card-image-wrap">
          <img
            src={theme.image}
            alt={theme.name}
            className="theme-artwork-img"
            loading="lazy"
          />
          <div className="theme-image-gradient-overlay" />
        </div>

        {/* Content Details */}
        <div className="theme-card-body">
          <h3 className="theme-world-title">{theme.name}</h3>
          <p className="theme-world-description">{theme.description}</p>

          {/* Theme-Themed Action Button Container */}
          <div className="theme-card-action">
            <div
              className="theme-select-btn"
              style={{
                background: theme.buttonGradient,
                borderColor: theme.buttonBorder || '#E5C37A',
              }}
            >
              <span className="theme-select-text">Select</span>
              <div
                className="theme-arrow-disc"
                style={{
                  background: theme.arrowDiscBg || 'radial-gradient(circle, #DDB15D 0%, #A57422 100%)',
                  color: theme.arrowColor || '#261509',
                }}
              >
                <ChevronRight size={13} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ThemeCard;
