import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, CheckCircle, HelpCircle, Coins, Lock, RotateCw, Shuffle } from 'lucide-react';
import { buyRiddle, submitAnswer, getRandomRiddle, STARTING_MUDRAS, RIDDLE_COSTS } from '../../services/riddleService';
import wiseAdvisorImg from '../../assets/wise_advisor.jpg';
import kshetraImg from '../../assets/themes/kshetra_devalaya.jpg';
import navarasaImg from '../../assets/themes/navarasa.jpg';
import panchaboothaImg from '../../assets/themes/panchabootha.jpg';
import kalaYugaImg from '../../assets/themes/kala_yuga.jpg';
import './RiddleCard.css';

export const RiddleCard = ({
  activePlayer,
  themeKey = 'rajya',
  hasAnsweredRiddleThisTurn = false,
  onRiddleAnswered,
  onPointsDeducted,
  onSolveSuccess,
  onSolveFail,
  onEventLog,
}) => {
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' | 'medium' | 'hard'
  const [currentRiddle, setCurrentRiddle] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [outcome, setOutcome] = useState(null); // 'correct' | 'wrong' | null

  // Map theme images
  const themeImages = {
    rajya: wiseAdvisorImg,
    kshetra_devalaya: kshetraImg,
    navarasa: navarasaImg,
    panchabootha: panchaboothaImg,
    kala_yuga: kalaYugaImg,
  };

  const storyImage = themeImages[themeKey] || wiseAdvisorImg;

  // Load / Shuffle Riddle when theme, difficulty, or activePlayer changes
  useEffect(() => {
    const playerAge = activePlayer?.ageGroup || activePlayer?.age || '8-12';
    const riddle = getRandomRiddle(themeKey, difficulty, playerAge);
    setCurrentRiddle(riddle);
    setIsFlipped(false);
    setSelectedOption(null);
    setOutcome(null);
  }, [themeKey, difficulty, activePlayer?.id, activePlayer?.ageGroup, activePlayer?.age]);

  const handleDifficultyChange = (newDiff) => {
    if (isFlipped || hasAnsweredRiddleThisTurn) return;
    setDifficulty(newDiff);
    const playerAge = activePlayer?.ageGroup || activePlayer?.age || '8-12';
    const riddle = getRandomRiddle(themeKey, newDiff, playerAge);
    setCurrentRiddle(riddle);
    onEventLog?.(`Selected ${newDiff.toUpperCase()} difficulty (${RIDDLE_COSTS[newDiff]} Mudras).`);
  };

  const handleShuffle = () => {
    if (isFlipped || hasAnsweredRiddleThisTurn) return;
    const playerAge = activePlayer?.ageGroup || activePlayer?.age || '8-12';
    const riddle = getRandomRiddle(themeKey, difficulty, playerAge);
    setCurrentRiddle(riddle);
    onEventLog?.(`Drawn a new ${difficulty.toUpperCase()} riddle challenge for ${activePlayer?.name || 'Player'}.`);
  };

  // Handle Buying & Flipping Riddle via Member 2 Game Logic
  const handleBuyAndFlip = async () => {
    if (!currentRiddle || hasAnsweredRiddleThisTurn) return;

    const playerObj = {
      uid: activePlayer.uid || 'CHB001',
      age: typeof activePlayer.age === 'number' ? activePlayer.age : 20,
      mudras: activePlayer.points ?? STARTING_MUDRAS,
    };
    const riddleObj = {
      id: currentRiddle.id,
      difficulty: currentRiddle.difficulty || difficulty,
      question: currentRiddle.question,
    };

    try {
      setIsPurchasing(true);
      const result = await buyRiddle(playerObj, riddleObj);

      if (!result.success) {
        onEventLog?.(`⚠️ ${result.message}`);
        return;
      }

      onPointsDeducted?.(result.player.mudras);
      onEventLog?.(`🪙 ${activePlayer.name}: ${result.message}`);

      // Trigger 3D Card Flip
      setIsFlipped(true);
    } catch (err) {
      console.error('Error purchasing riddle:', err);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Handle Answer Selection via Member 2 Game Logic
  const handleOptionSelect = async (option) => {
    if (!currentRiddle) return;

    setSelectedOption(option.id);
    const isCorrect = option.isCorrect;

    const playerObj = {
      uid: activePlayer.uid || 'CHB001',
      age: typeof activePlayer.age === 'number' ? activePlayer.age : 20,
      mudras: activePlayer.points ?? STARTING_MUDRAS,
    };

    // Mark that a riddle has been answered for this player's turn (1 riddle per move rule)
    onRiddleAnswered?.();

    const submitResult = await submitAnswer(playerObj, isCorrect, currentRiddle.advantage);

    if (submitResult.solved) {
      setOutcome('correct');
      onSolveSuccess?.(currentRiddle.reward || 1500, currentRiddle.advantage);
      onEventLog?.(`🎉 ${activePlayer.name}: ${submitResult.message}`);
    } else {
      setOutcome('wrong');
      onSolveFail?.(0);
      onEventLog?.(`❌ ${activePlayer.name}: ${submitResult.message}`);
    }
  };

  // Flip Back to Front (Reset)
  const handleFlipBack = () => {
    setIsFlipped(false);
    setSelectedOption(null);
    setOutcome(null);
    // Draw next random challenge
    const nextRiddle = getRandomRiddle(themeKey, difficulty);
    setCurrentRiddle(nextRiddle);
  };

  if (!currentRiddle) return null;

  return (
    <div className={`riddle-3d-scene ${isFlipped ? 'riddle-3d-scene--flipped' : ''}`}>
      <div className="riddle-flipper-card">
        {/* =========================================
            FRONT FACE (LOCKED STORY LORE & DIFFICULTY SELECTOR)
            ========================================= */}
        <div className="riddle-card-face riddle-face--front">
          {/* Top Floating Medallion */}
          <div className="riddle-top-medallion">
            <Lock size={15} color="#F9D77E" />
          </div>

          {/* Header Tag & Title */}
          <div className="riddle-header-text">
            <span className="riddle-category-tag">
              AGE {activePlayer?.ageGroup || '8-12'} · {difficulty.toUpperCase()} RIDDLE
            </span>
            <h2 className="riddle-title">{currentRiddle.title}</h2>
          </div>

          {/* Difficulty Tier Switcher */}
          <div className="riddle-difficulty-switcher">
            <button
              type="button"
              className={`diff-tab-btn diff-tab-btn--easy ${difficulty === 'easy' ? 'diff-tab-btn--active' : ''}`}
              onClick={() => handleDifficultyChange('easy')}
              disabled={hasAnsweredRiddleThisTurn}
              title="Easy: 500 Mudras"
            >
              <span>Easy</span>
              <small>500</small>
            </button>
            <button
              type="button"
              className={`diff-tab-btn diff-tab-btn--med ${difficulty === 'medium' ? 'diff-tab-btn--active' : ''}`}
              onClick={() => handleDifficultyChange('medium')}
              disabled={hasAnsweredRiddleThisTurn}
              title="Medium: 1000 Mudras"
            >
              <span>Med</span>
              <small>1000</small>
            </button>
            <button
              type="button"
              className={`diff-tab-btn diff-tab-btn--hard ${difficulty === 'hard' ? 'diff-tab-btn--active' : ''}`}
              onClick={() => handleDifficultyChange('hard')}
              disabled={hasAnsweredRiddleThisTurn}
              title="Hard: 1500 Mudras"
            >
              <span>Hard</span>
              <small>1500</small>
            </button>
          </div>

          {/* Shuffle Button Row */}
          <div className="riddle-shuffle-row">
            <button
              type="button"
              className="riddle-shuffle-btn"
              onClick={handleShuffle}
              disabled={hasAnsweredRiddleThisTurn}
              title="Draw another challenge"
            >
              <Shuffle size={12} />
              <span>Shuffle</span>
            </button>
          </div>

          {/* Lore Teaser */}
          <div className="riddle-front-body">
            <p className="riddle-lore-text">{currentRiddle.lore}</p>
            
            {hasAnsweredRiddleThisTurn ? (
              <div className="riddle-already-answered-box">
                <Lock size={14} color="#D9A441" />
                <span>
                  <strong>1 Riddle Limit:</strong> You have already answered a riddle for this move. Pass turn to make another move!
                </span>
              </div>
            ) : (
              <div className="riddle-hidden-prompt-box">
                <Lock size={14} className="lock-icon-faint" />
                <span className="hidden-prompt-hint">
                  Unlock {difficulty.toUpperCase()} challenge for {currentRiddle.cost} Mudras to reveal question & win{' '}
                  <strong>{typeof currentRiddle.advantage === 'object' ? currentRiddle.advantage.name : 'Advantage'}</strong>!
                </span>
              </div>
            )}

            {/* Buy / Unlock Action Button */}
            <div className="riddle-buy-action-wrap">
              {hasAnsweredRiddleThisTurn ? (
                <button
                  type="button"
                  className="riddle-unlock-buy-btn riddle-unlock-buy-btn--disabled"
                  disabled={true}
                >
                  <Lock size={15} />
                  <span>1 Riddle Per Move (Completed)</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="riddle-unlock-buy-btn"
                  onClick={handleBuyAndFlip}
                  disabled={isPurchasing}
                >
                  <Coins size={16} className="coin-icon" />
                  <span>
                    {isPurchasing ? 'Unlocking...' : `Unlock Riddle (${currentRiddle.cost} Mudras)`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================
            BACK FACE (REVEALED QUESTION & OPTIONS)
            ========================================= */}
        <div className="riddle-card-face riddle-face--back">
          {/* Top Floating Medallion */}
          <div className="riddle-top-medallion riddle-top-medallion--unlocked">
            <BookOpen size={15} color="#2ECC71" />
          </div>

          {/* Back Header */}
          <div className="riddle-header-text">
            <div className="back-badge-row">
              <span className="difficulty-pill-tag">
                AGE {activePlayer?.ageGroup || '8-12'} · {difficulty.toUpperCase()} · {currentRiddle.cost} MUDRAS
              </span>
              <span className="reward-pill-tag">
                <Sparkles size={11} color="#2ECC71" /> +{currentRiddle.reward || 1500}
              </span>
            </div>
            <h2 className="riddle-title riddle-title--back">{currentRiddle.title}</h2>
          </div>

          {/* Question Text */}
          <div className="riddle-question-wrap">
            <p className="riddle-question-prompt">{currentRiddle.question}</p>
          </div>

          {/* Advantage Perk Preview */}
          <div className="riddle-perk-ribbon">
            <span className="perk-label">REWARD:</span>
            <span className="perk-name">
              {typeof currentRiddle.advantage === 'object' ? currentRiddle.advantage.name : 'Divine Advantage'}
            </span>
          </div>

          {/* 4 Interactive Options */}
          <div className="riddle-options-container">
            {currentRiddle.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.id;
              let optionClass = 'riddle-option-choice';

              if (outcome && isSelected) {
                optionClass += outcome === 'correct' ? ' option--correct' : ' option--wrong';
              } else if (outcome && opt.isCorrect) {
                optionClass += ' option--show-correct';
              }

              const letter = String.fromCharCode(65 + idx); // A, B, C, D

              return (
                <button
                  key={opt.id}
                  type="button"
                  className={optionClass}
                  onClick={() => !outcome && handleOptionSelect(opt)}
                  disabled={outcome !== null}
                >
                  <span className="option-letter">{letter}</span>
                  <span className="option-text">{opt.text}</span>
                  {outcome && opt.isCorrect && (
                    <CheckCircle size={14} className="option-status-icon" color="#2ECC71" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Outcome Result Message */}
          {outcome && (
            <div className={`riddle-outcome-banner outcome--${outcome}`}>
              <span className="outcome-text">
                {outcome === 'correct'
                  ? `🎉 Solved! +${currentRiddle.reward || 1500} Mudras awarded!`
                  : `❌ Incorrect! No advantage awarded.`}
              </span>
              <button
                type="button"
                className="riddle-flipback-btn"
                onClick={handleFlipBack}
              >
                <RotateCw size={13} />
                <span>Return to Event Card</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiddleCard;
