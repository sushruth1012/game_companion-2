import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, CheckCircle, HelpCircle, Coins, Lock, RotateCw, ArrowLeft } from 'lucide-react';
import { buyRiddle, submitAnswer, themeRiddlesDatabase } from '../../services/riddleService';
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

  // Get question data based on selected theme
  const riddles = themeRiddlesDatabase[themeKey] || themeRiddlesDatabase.rajya;
  const currentRiddle = riddles[0];
  const storyImage = themeImages[themeKey] || wiseAdvisorImg;

  // Reset flip when theme changes or upon explicit reset
  useEffect(() => {
    setIsFlipped(false);
    setSelectedOption(null);
    setOutcome(null);
  }, [themeKey]);

  // Handle Buying & Flipping Riddle
  const handleBuyAndFlip = async () => {
    const cost = currentRiddle.cost || 1000;
    if (activePlayer.points < cost) {
      onEventLog?.(`⚠️ ${activePlayer.name} needs ${cost} points to unlock this riddle! (Has ${activePlayer.points} pts)`);
      return;
    }

    try {
      setIsPurchasing(true);
      await buyRiddle(activePlayer.id, cost);
      onPointsDeducted?.(cost);
      onEventLog?.(`🪙 ${activePlayer.name} spent ${cost} points to unlock the ${currentRiddle.title} riddle!`);

      // Trigger 3D Card Flip
      setIsFlipped(true);
    } catch (err) {
      console.error('Error purchasing riddle:', err);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Handle Answer Selection
  const handleOptionSelect = async (option) => {
    setSelectedOption(option.id);
    const result = await submitAnswer(currentRiddle.id, option.id);

    if (result.correct) {
      setOutcome('correct');
      onSolveSuccess?.(currentRiddle.reward || 1500, currentRiddle.advantage);
      onEventLog?.(`🎉 ${activePlayer.name} answered correctly! Earned +${currentRiddle.reward} pts and unlocked: ${currentRiddle.advantage}`);
    } else {
      setOutcome('wrong');
      onSolveFail?.(0);
      onEventLog?.(`❌ ${activePlayer.name}'s answer was incorrect. No advantage granted.`);
    }
  };

  // Flip Back to Front (Reset)
  const handleFlipBack = () => {
    setIsFlipped(false);
    setSelectedOption(null);
    setOutcome(null);
  };

  return (
    <div className={`riddle-3d-scene ${isFlipped ? 'riddle-3d-scene--flipped' : ''}`}>
      <div className="riddle-flipper-card">
        {/* =========================================
            FRONT FACE (LOCKED STORY LORE & BUY BUTTON)
            ========================================= */}
        <div className="riddle-card-face riddle-face--front">
          {/* Top Floating Medallion */}
          <div className="riddle-top-medallion">
            <Lock size={15} color="#F9D77E" />
          </div>

          {/* Header Tag & Title */}
          <div className="riddle-header-text">
            <span className="riddle-category-tag">THEME RIDDLE EVENT</span>
            <h2 className="riddle-title">{currentRiddle.title}</h2>
          </div>

          {/* Artwork Canvas */}
          <div className="riddle-artwork-wrap">
            <img
              src={storyImage}
              alt={currentRiddle.title}
              className="riddle-artwork-img"
            />
            <div className="riddle-artwork-overlay" />
            <div className="riddle-mystery-badge">
              <Sparkles size={14} color="#D9A441" />
              <span>Ancient Mystery</span>
            </div>
          </div>

          {/* Lore Teaser (Question is HIDDEN) */}
          <div className="riddle-front-body">
            <p className="riddle-lore-text">{currentRiddle.lore}</p>
            <div className="riddle-hidden-prompt-box">
              <Lock size={15} className="lock-icon-faint" />
              <span className="hidden-prompt-hint">
                Riddle challenge is locked. Spend points to reveal and gain strategic advantages.
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
                  {isPurchasing ? 'Unlocking...' : `Unlock Riddle (🪙 ${currentRiddle.cost || 1000} Pts)`}
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
            <span className="riddle-category-tag riddle-category-tag--gold">QUESTION REVEALED</span>
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
                      <strong>Correct! (+{currentRiddle.reward} Pts)</strong>
                    </div>
                    <p className="outcome-adv">Advantage: {currentRiddle.advantage}</p>
                  </div>
                ) : (
                  <div className="outcome-box outcome-box--fail">
                    <div className="outcome-header">
                      <HelpCircle size={18} color="#E74C3C" />
                      <strong>Incorrect Answer</strong>
                    </div>
                    <p className="outcome-adv">No advantage gained this turn.</p>
                  </div>
                )}

                <button
                  type="button"
                  className="riddle-flip-back-btn"
                  onClick={handleFlipBack}
                >
                  <RotateCw size={14} /> Back to Event
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
