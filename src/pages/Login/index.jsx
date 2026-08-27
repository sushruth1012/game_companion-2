import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, ShieldAlert, Smartphone, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import LogoBadge from '../../components/cards/LogoBadge';
import GoogleButton from '../../components/buttons/GoogleButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import CodeInput from '../../components/inputs/CodeInput';
import { loginWithGoogle, getCurrentUser } from '../../services/authService';
import { activateCode, checkActivation } from '../../services/activationService';
import { registerDevice, forceTakeoverSession } from '../../services/deviceService';
import './Login.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [activationCode, setActivationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Single-session conflict state
  const [sessionConflict, setSessionConflict] = useState(null); // { user, message }
  // Activation required prompt state (if user signed in with Google first without entering code)
  const [needsActivationModal, setNeedsActivationModal] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Check single-session lock and proceed to game selection
  const checkSessionAndProceed = async (user) => {
    const deviceResult = await registerDevice(user);
    
    if (!deviceResult.success && deviceResult.isSessionConflict) {
      setSessionConflict({
        user,
        message: deviceResult.message || 'Another session is currently active. Only 1 active session at a time is allowed.',
      });
      return false;
    }

    navigate('/game-selection');
    return true;
  };

  // Main Google Login Flow with Physical Board Code Verification
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setStatusMessage('Signing in with Google...');

      const user = await loginWithGoogle();
      setCurrentUser(user);

      // 1. If user entered an activation code on screen, activate it now with their Google ID
      if (activationCode.trim()) {
        setStatusMessage('Activating your physical game board...');
        await activateCode(
          activationCode.trim(),
          user.email,
          user.googleId,
          user.displayName,
          user.uid
        );
        setStatusMessage('Game board activated!');
        await checkSessionAndProceed(user);
        return;
      }

      // 2. Check if this account already has an active board registered
      setStatusMessage('Verifying board activation...');
      const checkResult = await checkActivation(user.email, user.googleId, user.uid);

      if (checkResult.activated) {
        // Already activated -> check single session lock
        await checkSessionAndProceed(user);
      } else {
        // Needs activation code from physical game board
        setPendingGoogleUser(user);
        setNeedsActivationModal(true);
        setStatusMessage('');
      }
    } catch (err) {
      console.warn('[Login] Authentication notice:', err);
      setErrorMessage(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Activation Code when in modal or standalone
  const handleActivateBoardSubmit = async (e) => {
    e?.preventDefault();
    if (!activationCode.trim()) {
      setErrorMessage('Please enter the activation code from your physical game board box.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const targetUser = pendingGoogleUser || currentUser;

      if (!targetUser) {
        // If not yet signed in with Google, trigger Google Sign-In with code
        handleGoogleLogin();
        return;
      }

      setStatusMessage('Validating activation code...');
      await activateCode(
        activationCode.trim(),
        targetUser.email,
        targetUser.googleId,
        targetUser.displayName,
        targetUser.uid
      );

      setNeedsActivationModal(false);
      await checkSessionAndProceed(targetUser);
    } catch (err) {
      console.error('[Login] Activation failed:', err);
      setErrorMessage(err.message || 'Invalid activation code. Please check your physical box.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Force Session Takeover (Switch to this device)
  const handleTakeoverSession = async () => {
    if (!sessionConflict?.user) return;
    try {
      setIsLoading(true);
      await forceTakeoverSession(sessionConflict.user);
      setSessionConflict(null);
      navigate('/game-selection');
    } catch (err) {
      setErrorMessage('Could not switch session. Please try again.');
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
        <div className="login-arch-curve" />
      </header>

      {/* Central YATRA Crest Logo Badge */}
      <div className="login-badge-wrapper">
        <LogoBadge />
      </div>

      {/* ===== MAIN AUTHENTICATION CARD ===== */}
      <main className="login-content">
        <div className="login-heading-group">
          <h1 className="login-title">BEGIN YOUR JOURNEY</h1>

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

          <p className="login-subtitle">Connect your physical board & sign in to play</p>
        </div>

        {/* Step 1: Activation Code from Physical Game Box */}
        <form className="login-code-form" onSubmit={handleActivateBoardSubmit}>
          <div className="code-field-label">
            <Key size={14} className="key-icon" />
            <span>PHYSICAL BOARD ACTIVATION CODE</span>
          </div>

          <CodeInput
            value={activationCode}
            onChange={(val) => {
              setActivationCode(val);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="e.g. YATRA-CHOWK-001"
            disabled={isLoading}
          />

          <p className="code-hint-text">
            💡 Found printed on your physical Yatra board box or manual.
          </p>

          {errorMessage && <p className="login-error-text">{errorMessage}</p>}
          {statusMessage && <p className="login-status-text">{statusMessage}</p>}

          {/* Action: Google Sign In with Board Code */}
          <div className="login-action-block" style={{ marginTop: '12px' }}>
            <GoogleButton
              onClick={handleGoogleLogin}
              disabled={isLoading}
              text={activationCode.trim() ? "Activate Board & Sign In" : "Sign In with Google"}
            />
          </div>
        </form>
      </main>

      {/* ===== MODAL: BOARD ACTIVATION CODE REQUIRED (If signed in without code) ===== */}
      {needsActivationModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-card">
            <div className="modal-icon-badge">
              <Key size={22} color="#D9A441" />
            </div>
            <h3 className="modal-title">Physical Board Activation</h3>
            <p className="modal-description">
              Hello <strong>{pendingGoogleUser?.displayName || 'Traveler'}</strong>! Please enter the activation code included inside your physical board game box to start.
            </p>

            <CodeInput
              value={activationCode}
              onChange={(val) => {
                setActivationCode(val);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. YATRA-CHOWK-001"
              disabled={isLoading}
            />

            {errorMessage && <p className="login-error-text">{errorMessage}</p>}

            <div className="modal-actions-row">
              <PrimaryButton
                variant="terracotta"
                onClick={handleActivateBoardSubmit}
                disabled={isLoading}
                showArrow={true}
              >
                {isLoading ? 'Verifying...' : 'Activate & Enter'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: SINGLE ACTIVE SESSION CONFLICT ENFORCEMENT ===== */}
      {sessionConflict && (
        <div className="login-modal-overlay">
          <div className="login-modal-card">
            <div className="modal-icon-badge modal-icon-badge--warning">
              <ShieldAlert size={24} color="#E74C3C" />
            </div>
            <h3 className="modal-title">Active Session Detected</h3>
            <p className="modal-description">
              Another device is currently using this Yatra game companion session.
              <br /><br />
              <strong>Only 1 active session at a time is allowed per physical board.</strong>
            </p>

            <div className="session-conflict-actions">
              <button
                type="button"
                className="session-takeover-btn"
                onClick={handleTakeoverSession}
                disabled={isLoading}
              >
                <RefreshCw size={15} /> Resume Session on This Device
              </button>
              <button
                type="button"
                className="session-cancel-btn"
                onClick={() => setSessionConflict(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ARCH ===== */}
      <footer className="login-footer-arch">
        <div className="footer-arch-curve" />
        <div className="footer-monuments-bg" />
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