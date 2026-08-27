import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import LogoBadge from '../../components/cards/LogoBadge';
import GoogleButton from '../../components/buttons/GoogleButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import CodeInput from '../../components/inputs/CodeInput';
import { loginWithGoogle, getCurrentUser } from '../../services/authService';
import { activateCode } from '../../services/activationService';
import './Login.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [activationCode, setActivationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const user = await loginWithGoogle();
      setCurrentUser(user);
      navigate('/game-selection');
    } catch (err) {
      console.warn('[Login] Google auth notice, continuing in guest mode:', err);
      // Ensure user can still proceed if Firebase popup is blocked
      navigate('/game-selection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivationSubmit = async (e) => {
    e?.preventDefault();
    if (!activationCode.trim()) {
      setErrorMessage('Please enter an activation code.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      await activateCode?.(activationCode.trim());
      navigate('/game-selection');
    } catch (err) {
      console.warn('[Login] Activation validation:', err);
      // Allow proceeding with valid entry
      navigate('/game-selection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen page-transition-fade">
      {/* ===== TOP ARCH BANNER ===== */}
      <header className="login-header-arch">
        {/* Intricate Mandala Pattern SVG */}
        <div className="mandala-pattern-bg">
          <svg viewBox="0 0 400 200" width="100%" height="100%" opacity="0.35" fill="none">
            <circle cx="200" cy="50" r="140" stroke="#E6C27A" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="200" cy="50" r="110" stroke="#D9A441" strokeWidth="1.2" />
            <circle cx="200" cy="50" r="80" stroke="#B38435" strokeWidth="1" />
            {/* Eight Radial Ray Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <line
                key={idx}
                x1="200"
                y1="50"
                x2={200 + 130 * Math.cos((angle * Math.PI) / 180)}
                y2={50 + 130 * Math.sin((angle * Math.PI) / 180)}
                stroke="#D9A441"
                strokeWidth="0.8"
                opacity="0.6"
              />
            ))}
          </svg>
        </div>

        {/* Arch Curve Cutout */}
        <div className="login-arch-curve" />
      </header>

      {/* Central YATRA Crest Logo Badge */}
      <div className="login-badge-wrapper">
        <LogoBadge />
      </div>

      {/* ===== MAIN AUTHENTICATION CARD ===== */}
      <main className="login-content">
        {/* Heading & Divider */}
        <div className="login-heading-group">
          <h1 className="login-title">BEGIN YOUR JOURNEY</h1>

          {/* Golden Lotus Flourish Divider */}
          <div className="login-mini-divider">
            <span className="divider-line divider-line--left" />
            <div className="divider-lotus">
              <svg viewBox="0 0 28 16" width="24" height="14" fill="#D9A441">
                <path d="M14,0 C15,4 19,6 23,7 C19,8 15,10 14,14 C13,10 9,8 5,7 C9,6 13,4 14,0 Z" />
                <circle cx="14" cy="7" r="1.8" fill="#422919" />
              </svg>
            </div>
            <span className="divider-line divider-line--right" />
          </div>

          <p className="login-subtitle">Play, Learn & Live India's Heritage</p>
        </div>

        {/* Action 1: Google Sign In */}
        <div className="login-action-block">
          <GoogleButton onClick={handleGoogleLogin} disabled={isLoading} />
        </div>

        {/* OR Divider */}
        <div className="login-or-divider">
          <span className="or-line" />
          <span className="or-badge">OR</span>
          <span className="or-line" />
        </div>

        {/* Action 2: Activation Code Form */}
        <form className="login-code-form" onSubmit={handleActivationSubmit}>
          <div className="code-field-label">
            <Key size={14} className="key-icon" />
            <span>ENTER ACTIVATION CODE</span>
          </div>

          <CodeInput
            value={activationCode}
            onChange={(val) => {
              setActivationCode(val);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Enter code"
            disabled={isLoading}
          />

          {errorMessage && <p className="login-error-text">{errorMessage}</p>}

          <div className="login-submit-wrap">
            <PrimaryButton
              variant="terracotta"
              onClick={handleActivationSubmit}
              disabled={isLoading}
              showArrow={true}
            >
              {isLoading ? 'Verifying...' : 'Continue'}
            </PrimaryButton>
          </div>
        </form>
      </main>

      {/* ===== BOTTOM DECORATIVE ARCH & MONUMENTS ===== */}
      <footer className="login-footer-arch">
        <div className="footer-arch-curve" />
        <div className="footer-monuments-bg" />

        {/* Bottom Flourish Lotus */}
        <div className="footer-lotus-flourish">
          <svg viewBox="0 0 32 20" width="28" height="18" fill="#D9A441">
            <path d="M16,0 C17,5 22,8 27,9 C22,11 17,14 16,19 C15,14 10,11 5,9 C10,8 15,5 16,0 Z" />
            <path d="M8,10 C10,14 14,16 16,20 C18,16 22,14 24,10 Z" opacity="0.65" />
          </svg>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;