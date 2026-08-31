import React, { useState, useEffect } from 'react';
import {
  Crown,
  Info,
  Coins,
  Zap,
  Sparkles,
  Lock,
  RotateCw,
  X,
  Clock,
  CheckCircle,
  BookOpen,
} from 'lucide-react';
import {
  buyRiddle,
  submitAnswer,
  getRandomRiddle,
  STARTING_MUDRAS,
} from '../../services/riddleService';
import './PlayerRiddleFlipCard.css';

export const PlayerRiddleFlipCard = ({
  player,
  isActiveTurn,
  isStageFlipped = false,
  onTapCard,
  onFlipBack,
  hasAnsweredRiddleThisTurn,
  onRiddleAnswered,
  onPointsDeducted,
  onSolveSuccess,
  onSolveFail,
  themeKey = 'mahabharatha',
  onInfoClick,
}) => {
  const [difficulty, setDifficulty] = useState('medium');
  const [currentRiddle, setCurrentRiddle] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [outcome, setOutcome] = useState(null); // 'correct' | 'wrong' | null
  const [awardedAdvantage, setAwardedAdvantage] = useState(null);
  const [riddleTimer, setRiddleTimer] = useState(60);
  const [isFlippingBack, setIsFlippingBack] = useState(false);

  // Load riddle when player age, theme, or difficulty changes
  useEffect(() => {
    const riddle = getRandomRiddle(themeKey, difficulty, player.ageGroup || '8-12');
    setCurrentRiddle(riddle);
    setIsUnlocked(false);
    setSelectedOption(null);
    setOutcome(null);
    setAwardedAdvantage(null);
    setRiddleTimer(60);
    setIsFlippingBack(false);
  }, [themeKey, difficulty, player.id, player.ageGroup, isStageFlipped]);

  // 1-Minute Riddle Countdown Timer when flipped on stage
  useEffect(() => {
    if (!isStageFlipped) {
      setRiddleTimer(60);
      return;
    }

    const interval = setInterval(() => {
      setRiddleTimer((prev) => {
        if (prev <= 1) {
          handleTriggerFlipBack();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStageFlipped]);

  const handleDifficultyChange = (e, newDiff) => {
    e.stopPropagation();
    if (isUnlocked || hasAnsweredRiddleThisTurn) return;
    setDifficulty(newDiff);
    const riddle = getRandomRiddle(themeKey, newDiff, player.ageGroup || '8-12');
    setCurrentRiddle(riddle);
  };

  // Buy and Unlock Riddle on the back of the card
  const handleUnlockRiddle = async (e) => {
    e.stopPropagation();
    if (!currentRiddle || hasAnsweredRiddleThisTurn) return;

    const playerObj = {
      uid: player.uid || 'CHB001',
      age: typeof player.age === 'number' ? player.age : 20,
      mudras: player.points ?? STARTING_MUDRAS,
    };
    const riddleObj = {
      id: currentRiddle.id,
      difficulty: currentRiddle.difficulty || difficulty,
      question: currentRiddle.question,
    };

    try {
      setIsPurchasing(true);
      const result = await buyRiddle(playerObj, riddleObj);
      if (!result.success) return;

      onPointsDeducted?.(result.player.mudras);
      setIsUnlocked(true);
    } catch (err) {
      console.error('Error unlocking riddle:', err);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Submit Answer Option
  const handleSelectOption = async (e, opt) => {
    e.stopPropagation();
    if (!currentRiddle || outcome) return;

    setSelectedOption(opt.id);
    const isCorrect = opt.isCorrect;

    const playerObj = {
      uid: player.uid || 'CHB001',
      age: typeof player.age === 'number' ? player.age : 20,
      mudras: player.points ?? STARTING_MUDRAS,
    };

    onRiddleAnswered?.();

    const result = await submitAnswer(playerObj, isCorrect, currentRiddle.difficulty || difficulty);

    if (result.solved) {
      setOutcome('correct');
      setAwardedAdvantage(result.advantage);
      onSolveSuccess?.(0, result.advantage);
    } else {
      setOutcome('wrong');
      setAwardedAdvantage(null);
      onSolveFail?.(0);
    }
  };

  const handleTriggerFlipBack = (e) => {
    e?.stopPropagation();
    if (isFlippingBack) return;
    setIsFlippingBack(true);
    setTimeout(() => {
      onFlipBack?.();
    }, 450);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If rendering inside the grid (Normal Player Card)
  if (!isStageFlipped) {
    return (
      <div
        className="player-grid-card"
        onClick={() => onTapCard?.(player)}
        role="button"
        tabIndex={0}
      >
        <div className={`player-card-face card-face--front ${isActiveTurn ? 'card-face--active-turn' : ''}`}>
          {/* Top Control Bar: Player Num, Active Badge & Info */}
          <div className="card-top-control-bar">
            <div className="card-num-badge">P{player.num}</div>

            {isActiveTurn && (
              <div className="card-active-crown-badge">
                <Crown size={11} />
                <span>ACTIVE TURN</span>
              </div>
            )}

            <button
              type="button"
              className="card-info-btn"
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick?.(player);
              }}
              title={`View ${player.name}'s hero advantages`}
              aria-label="Player info"
            >
              <Info size={13} />
            </button>
          </div>

          {/* Card Avatar & Identity Row */}
          <div className="card-identity-block">
            <div className="card-avatar-circle" style={{ borderColor: player.shieldColor }}>
              <span className="card-emoji-avatar">{player.avatar}</span>
            </div>

            <div className="card-name-column">
              <h3 className="card-player-fullname">{player.name}</h3>
              <div className="card-meta-chips">
                <span className="meta-chip-uid">UID: {player.uid}</span>
                <span className="meta-chip-age">Age {player.ageGroup || '8-12'}</span>
              </div>
            </div>
          </div>

          {/* Hero Power Secondary Title Badge */}
          <div className="card-hero-title-badge">
            <span className="hero-badge-name">{player.heroName}</span>
            <span className="hero-badge-divider">·</span>
            <span className="hero-badge-title">{player.heroSecondaryTitle}</span>
          </div>

          {/* Points & Skill Stats Row */}
          <div className="card-stats-footer-row">
            <div className="card-mudras-counter">
              <Coins size={14} className="points-coin-icon" />
              <strong>{player.points}</strong>
              <small>Mudras</small>
            </div>

            <div
              className={`card-skill-status-pill ${player.isHeroAdvantageUsed ? 'skill-pill--used' : 'skill-pill--ready'}`}
            >
              <Zap size={11} />
              <span>{player.isHeroAdvantageUsed ? 'Used' : 'Skill Ready'}</span>
            </div>
          </div>

          {/* Tap to Flip Prompt Ribbon */}
          <div className="card-tap-flip-ribbon">
            <div className={`flip-prompt-pill ${isActiveTurn ? 'flip-prompt-pill--active' : ''}`}>
              <Sparkles size={12} />
              <span>Tap Card to Solve Riddle ➔</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If rendering inside the 3D Stage Overlay (Two-Sided 3D Flipped Card)
  return (
    <div className="player-stage-3d-wrapper">
      <div className={`player-3d-flipper-card ${isFlippingBack ? 'player-3d-flipper-card--flipping-back' : 'player-3d-flipper-card--flipped'}`}>
        {/* =========================================================
            FRONT FACE (Spins away into depth)
            ========================================================= */}
        <div className={`player-card-face card-face--front ${isActiveTurn ? 'card-face--active-turn' : ''}`}>
          <div className="card-top-control-bar">
            <div className="card-num-badge">P{player.num}</div>
            {isActiveTurn && (
              <div className="card-active-crown-badge">
                <Crown size={11} />
                <span>ACTIVE TURN</span>
              </div>
            )}
            <div className="card-info-btn">
              <Info size={13} />
            </div>
          </div>

          <div className="card-identity-block">
            <div className="card-avatar-circle" style={{ borderColor: player.shieldColor }}>
              <span className="card-emoji-avatar">{player.avatar}</span>
            </div>
            <div className="card-name-column">
              <h3 className="card-player-fullname">{player.name}</h3>
              <div className="card-meta-chips">
                <span className="meta-chip-uid">UID: {player.uid}</span>
                <span className="meta-chip-age">Age {player.ageGroup || '8-12'}</span>
              </div>
            </div>
          </div>

          <div className="card-hero-title-badge">
            <span className="hero-badge-name">{player.heroName}</span>
            <span className="hero-badge-divider">·</span>
            <span className="hero-badge-title">{player.heroSecondaryTitle}</span>
          </div>

          <div className="card-stats-footer-row">
            <div className="card-mudras-counter">
              <Coins size={14} className="points-coin-icon" />
              <strong>{player.points}</strong>
              <small>Mudras</small>
            </div>
            <div className="card-skill-status-pill skill-pill--ready">
              <Zap size={11} />
              <span>Skill Ready</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            BACK FACE: THE PHYSICAL RIDDLE TRIAL FOR THIS PLAYER
            ========================================================= */}
        <div className="player-card-face card-face--back">
          {/* Top Bar: Player identity, 1-min timer & Flip Back button */}
          <div className="back-top-bar">
            <div className="back-player-tag">
              <span className="back-player-avatar">{player.avatar}</span>
              <div className="back-player-info-text">
                <strong>{player.name}</strong>
                <small>Age {player.ageGroup || '8-12'}</small>
              </div>
            </div>

            {/* 1-Minute Dedicated Riddle Timer */}
            <div className={`back-riddle-timer-pill ${riddleTimer <= 10 ? 'timer-pill--danger' : ''}`}>
              <Clock size={12} />
              <span>{formatTimer(riddleTimer)}</span>
            </div>

            {/* Return / Close Flip Button */}
            <button
              type="button"
              className="back-close-flip-btn"
              onClick={handleTriggerFlipBack}
              title="Flip back to board"
              aria-label="Flip back to board"
            >
              <X size={15} />
            </button>
          </div>

          {/* Timer Progress Line */}
          <div className="back-timer-track">
            <div
              className={`back-timer-fill ${riddleTimer <= 10 ? 'fill--danger' : ''}`}
              style={{ width: `${(riddleTimer / 60) * 100}%` }}
            />
          </div>

          {/* Difficulty Tier Switcher (Easy / Med / Hard) */}
          <div className="back-diff-switcher">
            <button
              type="button"
              className={`diff-pill-btn diff-pill--easy ${difficulty === 'easy' ? 'diff-pill--active' : ''}`}
              onClick={(e) => handleDifficultyChange(e, 'easy')}
              disabled={isUnlocked || hasAnsweredRiddleThisTurn}
            >
              <span>Easy</span>
              <small>500</small>
            </button>
            <button
              type="button"
              className={`diff-pill-btn diff-pill--med ${difficulty === 'medium' ? 'diff-pill--active' : ''}`}
              onClick={(e) => handleDifficultyChange(e, 'medium')}
              disabled={isUnlocked || hasAnsweredRiddleThisTurn}
            >
              <span>Medium</span>
              <small>1000</small>
            </button>
            <button
              type="button"
              className={`diff-pill-btn diff-pill--hard ${difficulty === 'hard' ? 'diff-pill--active' : ''}`}
              onClick={(e) => handleDifficultyChange(e, 'hard')}
              disabled={isUnlocked || hasAnsweredRiddleThisTurn}
            >
              <span>Hard</span>
              <small>1500</small>
            </button>
          </div>

          {/* Riddle Body: Locked Story vs Revealed Question */}
          {currentRiddle && (
            <div className="back-riddle-main-content">
              {!isUnlocked ? (
                /* LOCKED STATE: Lore Teaser & Unlock Button */
                <div className="back-locked-pane">
                  <div className="back-lore-header-group">
                    <div className="lore-book-badge">
                      <BookOpen size={13} color="#D9A441" />
                      <span>{difficulty.toUpperCase()} TRIAL</span>
                    </div>
                    <h4 className="back-riddle-title">{currentRiddle.title}</h4>
                    <p className="back-lore-paragraph">{currentRiddle.lore}</p>
                  </div>

                  <div className="back-unlock-teaser">
                    <Lock size={14} color="#F9D77E" />
                    <span>
                      Unlock for <strong>{currentRiddle.cost} Mudras</strong> to win a random <strong>{difficulty.toUpperCase()} Advantage</strong>!
                    </span>
                  </div>

                  {hasAnsweredRiddleThisTurn ? (
                    <div className="back-limit-box">
                      <span>🔒 1 Riddle per turn already answered!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="back-unlock-action-btn"
                      onClick={handleUnlockRiddle}
                      disabled={isPurchasing}
                    >
                      <Coins size={15} />
                      <span>{isPurchasing ? 'Unlocking...' : `Unlock Riddle (${currentRiddle.cost} Mudras)`}</span>
                    </button>
                  )}
                </div>
              ) : (
                /* UNLOCKED STATE: Question Prompt, 4 Options & Outcome */
                <div className="back-unlocked-pane">
                  <div className="back-question-box">
                    <p className="back-question-text">{currentRiddle.question}</p>
                  </div>

                  {/* 4 Interactive Choice Buttons */}
                  <div className="back-options-grid">
                    {currentRiddle.options.map((opt, oIdx) => {
                      const isSelected = selectedOption === opt.id;
                      let btnClass = 'back-opt-btn';

                      if (outcome && isSelected) {
                        btnClass += outcome === 'correct' ? ' opt--correct' : ' opt--wrong';
                      } else if (outcome && opt.isCorrect) {
                        btnClass += ' opt--show-correct';
                      }

                      const letter = String.fromCharCode(65 + oIdx); // A, B, C, D

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={btnClass}
                          onClick={(e) => handleSelectOption(e, opt)}
                          disabled={outcome !== null}
                        >
                          <span className="opt-badge">{letter}</span>
                          <span className="opt-txt">{opt.text}</span>
                          {outcome && opt.isCorrect && (
                            <CheckCircle size={14} color="#2ECC71" className="opt-check" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Outcome Result & Advantage Display */}
                  {outcome && (
                    <div className={`back-outcome-banner outcome--${outcome}`}>
                      <span className="outcome-headline">
                        {outcome === 'correct'
                          ? `🎉 Correct! Won Advantage:`
                          : `❌ Incorrect! No advantage earned.`}
                      </span>
                      {outcome === 'correct' && awardedAdvantage && (
                        <div className="won-advantage-detail">
                          <strong>{awardedAdvantage.name}</strong>
                          <small>{awardedAdvantage.description}</small>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Bottom Flip Back Button */}
          <button
            type="button"
            className="back-flip-return-btn"
            onClick={handleTriggerFlipBack}
          >
            <RotateCw size={13} />
            <span>Return to Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerRiddleFlipCard;
