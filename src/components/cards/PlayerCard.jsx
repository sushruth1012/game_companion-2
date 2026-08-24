import React from 'react';
import { User, QrCode, Calendar, ChevronDown } from 'lucide-react';
import './PlayerCard.css';

export const PlayerCard = ({
  playerNumber,
  playerData,
  themeColor = '#355E3B', // '#355E3B' | '#C76B4A' | '#D9A441' | '#6B4F3A'
  onUidChange,
  onAgeChange,
  onScanClick,
}) => {
  return (
    <div
      className="player-setup-card"
      style={{ borderLeftColor: themeColor }}
    >
      {/* Player Header */}
      <div className="player-card-top">
        <div
          className="player-avatar-badge"
          style={{ backgroundColor: themeColor }}
        >
          <User size={16} color="#FFFFFF" />
          <span className="player-avatar-num">{playerNumber}</span>
        </div>
        <h4 className="player-card-name">Player {playerNumber}</h4>
      </div>

      {/* Input Fields Row */}
      <div className="player-inputs-row">
        {/* Player UID Input */}
        <div className="player-input-group">
          <label className="player-input-label">Player UID</label>
          <div className="player-input-wrap">
            <input
              type="text"
              placeholder="Enter UID"
              value={playerData.uid || ''}
              onChange={(e) => onUidChange(e.target.value)}
              className="player-text-input"
              spellCheck="false"
            />
            <button
              type="button"
              className="qr-scan-btn"
              onClick={onScanClick}
              title="Scan Player QR Code"
              aria-label="Scan QR Code"
            >
              <QrCode size={18} />
            </button>
          </div>
        </div>

        {/* Age Dropdown */}
        <div className="player-input-group player-input-group--age">
          <label className="player-input-label">
            <Calendar size={13} className="age-calendar-icon" /> Age
          </label>
          <div className="player-select-wrap">
            <select
              value={playerData.age || ''}
              onChange={(e) => onAgeChange(e.target.value)}
              className="player-select-input"
            >
              <option value="" disabled>Enter age</option>
              <option value="5-10">5 - 10</option>
              <option value="10-15">10 - 15</option>
              <option value="15+">15+</option>
            </select>
            <ChevronDown size={16} className="select-chevron-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
