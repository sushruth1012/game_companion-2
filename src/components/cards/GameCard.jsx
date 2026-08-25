import React from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import './GameCard.css';

export const GameCard = ({ game, isCenter, offset, onClick, onSelect }) => {
  const isPlayable = game.id === 'chowkabara';

  // Calculate dynamic transform based on distance from center
  const getCardStyle = () => {
    if (isCenter) {
      return {
        transform: 'scale(1) translateX(0) translateZ(50px)',
        zIndex: 15,
        filter: 'none',
        opacity: 1,
        touchAction: 'manipulation',
      };
    }

    const direction = offset < 0 ? -1 : 1;
    const absOffset = Math.abs(offset);
    const scale = Math.max(0.72, 1 - absOffset * 0.12);
    const xTranslate = direction * (absOffset * 85);
    const rotateY = direction * -18;
    const blurAmount = Math.min(6, absOffset * 2.5);
    const brightness = Math.max(0.35, 1 - absOffset * 0.28);

    return {
      transform: `scale(${scale}) translateX(${xTranslate}px) translateZ(-${absOffset * 40}px) rotateY(${rotateY}deg)`,
      zIndex: 10 - absOffset,
      filter: `blur(${blurAmount}px) brightness(${brightness})`,
      opacity: Math.max(0.4, 1 - absOffset * 0.25),
      pointerEvents: absOffset > 1 ? 'none' : 'auto',
    };
  };

  const handleAction = (e) => {
    e.stopPropagation();
    if (isPlayable && onSelect) {
      onSelect(game);
    }
  };

  return (
    <div
      className={`game-slide-card ${isCenter ? 'game-slide-card--active' : 'game-slide-card--side'}`}
      style={getCardStyle()}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="game-card-frame">
        {/* Top Center Lotus Medallion */}
        <div className="card-top-medallion">
          <svg viewBox="0 0 36 36" width="30" height="30" fill="#D9A441">
            <path d="M18,3 C19.5,8 24,10 28,12 C24,14 19.5,16 18,21 C16.5,16 12,14 8,12 C12,10 16.5,8 18,3 Z" />
            <path d="M18,21 C19.5,25 23,26 26,28 C23,30 19.5,31 18,34 C16.5,31 13,30 10,28 C13,26 16.5,25 18,21 Z" opacity="0.75" />
            <circle cx="18" cy="17" r="2.5" fill="#422818" />
          </svg>
        </div>

        {/* Board Image / Preview */}
        <div className="game-card-board-container">
          <div className="board-wooden-texture">
            {game.boardGraphic}
          </div>
          {!isPlayable && (
            <div className="locked-badge-overlay">
              <Lock size={16} className="lock-icon" />
              <span>Coming Soon</span>
            </div>
          )}
        </div>

        {/* Card Title with Flourishes */}
        <div className="game-card-title-group">
          <div className="card-title-flourish">
            <span className="flourish-mark">☙</span>
            <h3 className="card-game-name">{game.title}</h3>
            <span className="flourish-mark flourish-mark--flip">❧</span>
          </div>
          <p className="card-game-tagline">{game.description}</p>
        </div>

        {/* Action Button - Only interactive when active and playable */}
        {isCenter && (
          <div className="game-card-action">
            {isPlayable ? (
              <button
                type="button"
                className="select-game-btn"
                onClick={handleAction}
              >
                <span className="select-btn-text">Select</span>
                <div className="select-btn-arrow-circle">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
              </button>
            ) : (
              <div className="locked-action-pill">
                <Lock size={14} /> Unavailable in MVP
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
