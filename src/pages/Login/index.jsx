import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import LogoBadge from '../../components/cards/LogoBadge';
import GoogleButton from '../../components/buttons/GoogleButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import CodeInput from '../../components/inputs/CodeInput';
import { loginWithGoogle, joinGame } from '../../services/authService';
import './Login.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [activationCode, setActivationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Google Login Flow
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const user = await loginWithGoogle();
      console.log('Successfully logged in:', user);
      navigate('/game-selection');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Code Activation Flow
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!activationCode.trim()) {
      setErrorMessage('Please enter an activation code.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const session = await joinGame(activationCode);
      console.log('Joined game session:', session);
      navigate('/game-selection');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid activation code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* ===== TOP ARCH BANNER ===== */}
      <div className="login-header-arch">
        {/* Background Mandala Watermark */}
        <div className="header-mandala-bg" />

        {/* Top Corner Leaf Ornaments */}
        <div className="corner-leaf corner-leaf--left">
          <svg viewBox="0 0 48 48" width="40" height="40" fill="#B37D22" opacity="0.85">
            <path d="M6,6 C16,14 18,28 12,38 C22,28 28,14 36,6 C26,10 14,8 6,6 Z" />
            <circle cx="10" cy="18" r="2.5" fill="#D9A441" />
            <circle cx="20" cy="10" r="2.5" fill="#D9A441" />
          </svg>
        </div>
        <div className="corner-leaf corner-leaf--right">
          <svg viewBox="0 0 48 48" width="40" height="40" fill="#B37D22" opacity="0.85">
            <path d="M42,6 C32,14 30,28 36,38 C26,28 20,14 12,6 C22,10 34,8 42,6 Z" />
            <circle cx="38" cy="18" r="2.5" fill="#D9A441" />
            <circle cx="28" cy="10" r="2.5" fill="#D9A441" />
          </svg>
        </div>

        {/* Curved Golden Arch Border */}
        <div className="header-arch-curve" />
      </div>

      {/* ===== CENTRAL EMBLEM / BADGE ===== */}
      <div className="login-badge-wrapper">
        <LogoBadge />
      </div>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="login-content">
        {/* Title & Decorative Divider */}
        <div className="login-heading-group">
          <h1 className="login-title">Begin Your Journey</h1>

          {/* Ornate Gold Floral Divider */}
          <div className="decorative-divider">
            <span className="divider-whisker divider-whisker--left" />
            <div className="divider-flourish">
              <svg viewBox="0 0 32 18" width="28" height="16" fill="#D9A441">
                {/* Center 4-petal floral diamond */}
                <path d="M 16,0 C 18,5 23,7 28,9 C 23,11 18,13 16,18 C 14,13 9,11 4,9 C 9,7 14,5 16,0 Z" />
                <circle cx="16" cy="9" r="2" fill="#422919" />
              </svg>
            </div>
            <span className="divider-whisker divider-whisker--right" />
          </div>

          <p className="login-subtitle">Play. Learn. Grow. Explore India’s heritage</p>
        </div>

        {/* Error / Status Alert */}
        {errorMessage && (
          <div className="login-alert" role="alert">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Actions Group */}
        <div className="login-actions">
          {/* Primary Action: Google Sign In */}
          <section className="action-section">
            <GoogleButton onClick={handleGoogleLogin} disabled={isLoading} />
          </section>

          {/* Secondary Action: Activation Code */}
          <section className="activation-section">
            <div className="activation-header">
              <div className="activation-icon-badge">
                <Key size={14} className="activation-key-icon" />
              </div>
              <h2 className="activation-title">Enter Activation Code</h2>
            </div>

            <form onSubmit={handleCodeSubmit} className="activation-form">
              <CodeInput
                value={activationCode}
                onChange={setActivationCode}
                placeholder="Enter code"
                disabled={isLoading}
              />
              <PrimaryButton
                type="submit"
                variant="terracotta"
                disabled={isLoading}
                className="activation-continue-btn"
              >
                {isLoading ? 'Joining...' : 'Continue'}
              </PrimaryButton>
            </form>
          </section>
        </div>
      </main>

      {/* ===== BOTTOM DECORATIVE ARCH & PALACE SILHOUETTES ===== */}
      <footer className="login-footer-arch">
        {/* Curved Border Transition */}
        <div className="footer-arch-curve" />

        {/* Palace and Temple Architectural Silhouette */}
        <div className="footer-monuments-bg" />

        {/* Symmetrical Foliage flanking edges */}
        <div className="footer-foliage footer-foliage--left">
          <svg viewBox="0 0 60 120" width="45" height="90" fill="#3A5E44" opacity="0.65">
            <path d="M0,120 Q30,80 15,40 Q40,60 10,20 Q45,30 5,0 Q30,40 20,80 Z" />
          </svg>
        </div>
        <div className="footer-foliage footer-foliage--right">
          <svg viewBox="0 0 60 120" width="45" height="90" fill="#3A5E44" opacity="0.65">
            <path d="M60,120 Q30,80 45,40 Q20,60 50,20 Q15,30 55,0 Q30,40 40,80 Z" />
          </svg>
        </div>

        {/* Bottom Tagline & Flourishes */}
        <div className="footer-tagline">
          <span className="flourish-arrow">➳</span>
          <span className="tagline-text">Strategize. Discover. Conquer.</span>
          <span className="flourish-arrow flourish-arrow--right">➳</span>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
