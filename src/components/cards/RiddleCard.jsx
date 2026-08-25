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

  // Load / Shuffle Riddle when theme or difficulty changes
  useEffect(() => {
    const riddle = getRandomRiddle(themeKey, difficulty);
    setCurrentRiddle(riddle);
    setIsFlipped(false);
    setSelectedOption(null);
    setOutcome(null);
  }, [themeKey, difficulty]);

  const handleDifficultyChange = (newDiff) => {
    if (isFlipped) return; // Prevent changing tier during active challenge
    setDifficulty(newDiff);
    onEventLog?.(`Selected ${newDiff.toUpperCase()} difficulty (${RIDDLE_COSTS[newDiff]} Mudras).`);
  };

  const handleShuffle = () => {
    if (isFlipped) return;
    const riddle = getRandomRiddle(themeKey, difficulty);
    setCurrentRiddle(riddle);
    onEventLog?.(`Drawn a new ${difficulty.toUpperCase()} riddle challenge.`);
  };

  // Handle Buying & Flipping Riddle via Member 2 Game Logic
  const handleBuyAndFlip = async () => {
    if (!currentRiddle) return;

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
            <span className="riddle-category-tag">THEMATIC RIDDLE EVENT</span>
            <h2 className="riddle-title">{currentRiddle.title}</h2>
          </div>

          {/* Difficulty Tier Switcher */}
          <div className="riddle-difficulty-switcher">
            <button
              type="button"
              className={`diff-tab-btn diff-tab-btn--easy ${difficulty === 'easy' ? 'diff-tab-btn--active' : ''}`}
              onClick={() => handleDifficultyChange('easy')}
              title="Easy: 500 Mudras"
            >
              <span>Easy</span>
              <small>500</small>
            </button>
            <button
              type="button"
              className={`diff-tab-btn diff-tab-btn--med ${difficulty === 'medium' ? 'diff-tab-btn--active' : ''}`}
              onClick={() => handleDifficultyChange('medium')}
              title="Medium: 1000 Mudras"
            >
              <span>Med</span>
              <small>1000</small>
            </button>
            <button
              type="button"
              className={`diff-tab-btn diff-tab-btn--hard ${difficulty === 'hard' ? 'diff-tab-btn--active' : ''}`}
              onClick={() => handleDifficultyChange('hard')}
              title="Hard: 1500 Mudras"
            >
              <span>Hard</span>
              <small>1500</small>
            </button>
          </div>

          {/* Artwork Canvas */}
          <div className="riddle-artwork-wrap">
            <img
              src={storyImage}
              alt={currentRiddle.title}
              className="riddle-artwork-img"
            />
            <div className="riddle-artwork-overlay" />
            <button
              type="button"
              className="riddle-shuffle-btn"
              onClick={handleShuffle}
              title="Draw another challenge"
            >
              <Shuffle size={12} />
              <span>Shuffle</span>
            </button>
          </div>

          {/* Lore Teaser (Question is HIDDEN) */}
          <div className="riddle-front-body">
            <p className="riddle-lore-text">{currentRiddle.lore}</p>
            <div className="riddle-hidden-prompt-box">
              <Lock size={14} className="lock-icon-faint" />
              <span className="hidden-prompt-hint">
                Unlock {difficulty.toUpperCase()} challenge for {currentRiddle.cost} Mudras to reveal question & win{' '}
                <strong>{typeof currentRiddle.advantage === 'object' ? currentRiddle.advantage.name : 'Advantage'}</strong>!
              </span>
            </div>

            {/* Buy / Unlock Action Button */}
            <div className="riddle-buy-action-wrap">
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
              <span className={`diff-pill-badge diff-pill-badge--${currentRiddle.difficulty}`}>
                {currentRiddle.difficulty.toUpperCase()}
              </span>
              <span className="riddle-category-tag riddle-category-tag--gold">QUESTION REVEALED</span>
            </div>
            <h2 className="riddle-title">Solve for Advantage</h2>
          </div>

          {/* Question Container */}
          <div className="riddle-back-body">
            <div className="riddle-revealed-question-box">
              <p className="riddle-question-text">{currentRiddle.question}</p>
            </div>

            {/* Interactive Options List */}
            {outcome === null ? (
              <div className="riddle-options-list">
                {currentRiddle.options.map((opt, idx) => (
                  <button
                    key={opt.id}
                    type="button"
                    className="riddle-back-option-btn"
                    onClick={() => handleOptionSelect(opt)}
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="opt-text">{opt.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              /* Result Banner */
              <div className="riddle-outcome-display">
                {outcome === 'correct' ? (
                  <div className="outcome-box outcome-box--success">
                    <div className="outcome-header">
                      <CheckCircle size={18} color="#2ECC71" />
                      <strong>Correct! (+{currentRiddle.reward} Mudras)</strong>
                    </div>
                    <p className="outcome-adv">
                      Advantage: {typeof currentRiddle.advantage === 'object' ? currentRiddle.advantage.name : currentRiddle.advantage}
                    </p>
                    <small className="outcome-adv-desc">
                      {typeof currentRiddle.advantage === 'object' ? currentRiddle.advantage.description : ''}
                    </small>
                  </div>
                ) : (
                  <div className="outcome-box outcome-box--fail">
                    <div className="outcome-header">
                      <HelpCircle size={18} color="#E74C3C" />
                      <strong>Incorrect Answer</strong>
                    </div>
                    <p className="outcome-adv">No refund. No advantage gained this round.</p>
                  </div>
                )}

                <button
                  type="button"
                  className="riddle-flip-back-btn"
                  onClick={handleFlipBack}
                >
                  <RotateCw size={14} /> Next Challenge
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiddleCard;
