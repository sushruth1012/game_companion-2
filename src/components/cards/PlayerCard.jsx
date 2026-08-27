import React from 'react';
import { User, Calendar, ChevronDown } from 'lucide-react';
import './PlayerCard.css';

export const PlayerCard = ({
  playerNumber,
  playerData,
  themeColor = '#355E3B', // '#355E3B' | '#C76B4A' | '#D9A441' | '#6B4F3A'
  onUidChange,
  onAgeChange,
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
        {/* Player Name Input */}
        <div className="player-input-group">
          <label className="player-input-label">Player Name</label>
          <div className="player-input-wrap">
            <input
              type="text"
              placeholder="Enter Name"
              value={playerData.uid || ''}
              onChange={(e) => onUidChange(e.target.value)}
              className="player-text-input"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Age Dropdown - Never empty, strictly 8-12, 13-16, 17+ */}
        <div className="player-input-group player-input-group--age">
          <label className="player-input-label">
            <Calendar size={13} className="age-calendar-icon" /> Age Range
          </label>
          <div className="player-select-wrap">
            <select
              value={playerData.age || '8-12'}
              onChange={(e) => onAgeChange(e.target.value)}
              className="player-select-input"
            >
              <option value="8-12">8 - 12</option>
              <option value="13-16">13 - 16</option>
              <option value="17+">17+</option>
            </select>
            <ChevronDown size={16} className="select-chevron-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
