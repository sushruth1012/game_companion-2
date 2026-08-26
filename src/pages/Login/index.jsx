import React, {
  useState,
  useEffect
} from 'react';

import {
  useNavigate
} from 'react-router-dom';

import {
  Key
} from 'lucide-react';

import LogoBadge
  from '../../components/cards/LogoBadge';

import GoogleButton
  from '../../components/buttons/GoogleButton';

import PrimaryButton
  from '../../components/buttons/PrimaryButton';

import CodeInput
  from '../../components/inputs/CodeInput';

import {
  loginWithGoogle,
  logoutUser,
  getCurrentUser
} from '../../services/authService';

import {
  checkActivation,
  activateCode
} from '../../services/activationService';

import './Login.css';


export const LoginPage = () => {

  const navigate =
    useNavigate();


  const [
    activationCode,
    setActivationCode
  ] = useState('');


  const [
    isLoading,
    setIsLoading
  ] = useState(false);


  const [
    errorMessage,
    setErrorMessage
  ] = useState('');


  const [
    currentUser,
    setCurrentUser
  ] = useState(null);


  // ==========================================================
  // LOAD EXISTING GOOGLE USER
  // ==========================================================

  useEffect(() => {

    const user =
      getCurrentUser();


    if (user) {

      setCurrentUser(
        user
      );

    }

  }, []);


  // ==========================================================
  // GOOGLE LOGIN
  // ==========================================================

  const handleGoogleLogin =
    async () => {

      try {

        setIsLoading(
          true
        );

        setErrorMessage(
          ''
        );


        // ------------------------------------------------------
        // GOOGLE SIGN IN
        // ------------------------------------------------------

        const user =
          await loginWithGoogle();


        console.log(
          '[Login] Google login successful:',
          user
        );


        setCurrentUser(
          user
        );


        // ------------------------------------------------------
        // CHECK WHETHER THIS GOOGLE ACCOUNT IS ACTIVATED
        // ------------------------------------------------------

        const activation =
          await checkActivation(
            user.email,
            user.googleId
          );


        console.log(
          '[Login] Activation status:',
          activation
        );


        // ------------------------------------------------------
        // ALREADY ACTIVATED
        // ------------------------------------------------------

        if (
          activation &&
          activation.valid
        ) {

          navigate(
            '/game-selection'
          );

          return;

        }


        // ------------------------------------------------------
        // NOT ACTIVATED
        // ------------------------------------------------------

        setErrorMessage(
          'This Google account is not activated yet. Enter your Yatra activation code below.'
        );

      } catch (error) {

        console.error(
          '[Login] Google login / activation check failed:',
          error
        );


        setErrorMessage(
          error.message ||
          'Unable to check your activation status.'
        );

      } finally {

        setIsLoading(
          false
        );

      }

    };


  // ==========================================================
  // SIGN OUT
  // ==========================================================

  const handleLogout =
    async () => {

      try {

        setIsLoading(
          true
        );

        setErrorMessage(
          ''
        );


        await logoutUser();


        setCurrentUser(
          null
        );


        setActivationCode(
          ''
        );

      } catch (error) {

        console.error(
          '[Login] Logout failed:',
          error
        );


        setErrorMessage(
          error.message ||
          'Failed to sign out.'
        );

      } finally {

        setIsLoading(
          false
        );

      }

    };


  // ==========================================================
  // ACTIVATION CODE SUBMIT
  // ==========================================================

  const handleCodeSubmit =
    async (
      event
    ) => {

      event.preventDefault();


      if (
        !activationCode.trim()
      ) {

        setErrorMessage(
          'Please enter your activation code.'
        );

        return;

      }


      try {

        setIsLoading(
          true
        );

        setErrorMessage(
          ''
        );


        // ------------------------------------------------------
        // GOOGLE LOGIN REQUIRED
        // ------------------------------------------------------

        const user =
          getCurrentUser();


        if (!user) {

          throw new Error(
            'Please sign in with Google first.'
          );

        }


        // ------------------------------------------------------
        // ACTIVATE ACCOUNT
        // ------------------------------------------------------

        const result =
          await activateCode(
            activationCode
              .trim()
              .toUpperCase(),

            user.email,

            user.googleId,

            user.displayName
          );


        console.log(
          '[Login] Activation result:',
          result
        );


        // ------------------------------------------------------
        // ACTIVATION SUCCESS
        // ------------------------------------------------------

        if (
          result &&
          result.valid
        ) {

          setErrorMessage(
            ''
          );


          navigate(
            '/game-selection'
          );


          return;

        }


        // ------------------------------------------------------
        // ACTIVATION FAILED
        // ------------------------------------------------------

        throw new Error(
          result?.message ||
          'Invalid or already-used activation code.'
        );

      } catch (error) {

        console.error(
          '[Login] Activation failed:',
          error
        );


        setErrorMessage(
          error.message ||
          'Activation failed.'
        );

      } finally {

        setIsLoading(
          false
        );

      }

    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="login-screen">

      {/* ======================================================
          TOP ARCH BANNER
          ====================================================== */}

      <div className="login-header-arch">

        <div className="header-mandala-bg" />


        <div className="corner-leaf corner-leaf--left">

          <svg
            viewBox="0 0 48 48"
            width="40"
            height="40"
            fill="#B37D22"
            opacity="0.85"
          >

            <path
              d="M6,6 C16,14 18,28 12,38 C22,28 28,14 36,6 C26,10 14,8 6,6 Z"
            />

            <circle
              cx="10"
              cy="18"
              r="2.5"
              fill="#D9A441"
            />

            <circle
              cx="20"
              cy="10"
              r="2.5"
              fill="#D9A441"
            />

          </svg>

        </div>


        <div className="corner-leaf corner-leaf--right">

          <svg
            viewBox="0 0 48 48"
            width="40"
            height="40"
            fill="#B37D22"
            opacity="0.85"
          >

            <path
              d="M42,6 C32,14 30,28 36,38 C26,28 20,14 12,6 C22,10 34,8 42,6 Z"
            />

            <circle
              cx="38"
              cy="18"
              r="2.5"
              fill="#D9A441"
            />

            <circle
              cx="28"
              cy="10"
              r="2.5"
              fill="#D9A441"
            />

          </svg>

        </div>


        <div className="header-arch-curve" />

      </div>


      {/* ======================================================
          LOGO
          ====================================================== */}

      <div className="login-badge-wrapper">

        <LogoBadge />

      </div>


      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <main className="login-content">

        <div className="login-heading-group">

          <h1 className="login-title">
            Begin Your Journey
          </h1>


          <div className="decorative-divider">

            <span
              className="divider-whisker divider-whisker--left"
            />


            <div className="divider-flourish">

              <svg
                viewBox="0 0 32 18"
                width="28"
                height="16"
                fill="#D9A441"
              >

                <path
                  d="M 16,0 C 18,5 23,7 28,9 C 23,11 18,13 16,18 C 14,13 9,11 4,9 C 9,7 14,5 16,0 Z"
                />

                <circle
                  cx="16"
                  cy="9"
                  r="2"
                  fill="#422919"
                />

              </svg>

            </div>


            <span
              className="divider-whisker divider-whisker--right"
            />

          </div>


          <p className="login-subtitle">
            Play. Learn. Grow. Explore India’s heritage
          </p>

        </div>


        {/* ====================================================
            ERROR / STATUS
            ==================================================== */}

        {errorMessage && (

          <div
            className="login-alert"
            role="alert"
          >

            <span>
              {errorMessage}
            </span>

          </div>

        )}


        {/* ====================================================
            ACTIONS
            ==================================================== */}

        <div className="login-actions">


          {/* ==================================================
              GOOGLE ACCOUNT
              ================================================== */}

          <section className="action-section">

            {!currentUser ? (

              <GoogleButton
                onClick={
                  handleGoogleLogin
                }
                disabled={
                  isLoading
                }
              />

            ) : (

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: '#F6EFE5',
                  border: '1.5px solid #D6C4A5',
                  borderRadius: '14px',
                  boxSizing: 'border-box'
                }}
              >

                {currentUser.photoURL ? (

                  <img
                    src={
                      currentUser.photoURL
                    }
                    alt="Google profile"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid #D9A441'
                    }}
                  />

                ) : (

                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#244634',
                      color: '#D9A441',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '18px'
                    }}
                  >

                    {
                      (
                        currentUser.displayName ||
                        'U'
                      )
                        .charAt(0)
                        .toUpperCase()
                    }

                  </div>

                )}


                {/* USER INFO */}

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >

                  <span
                    style={{
                      fontFamily:
                        'var(--font-heading)',
                      fontSize:
                        '0.95rem',
                      fontWeight:
                        '700',
                      color:
                        '#362215',
                      lineHeight:
                        '1.2'
                    }}
                  >

                    {
                      currentUser.displayName ||
                      'Google User'
                    }

                  </span>


                  <span
                    style={{
                      fontFamily:
                        'var(--font-body)',
                      fontSize:
                        '0.72rem',
                      color:
                        '#8C745C',
                      marginTop:
                        '3px',
                      overflow:
                        'hidden',
                      textOverflow:
                        'ellipsis',
                      whiteSpace:
                        'nowrap',
                      maxWidth:
                        '100%'
                    }}
                  >

                    {
                      currentUser.email
                    }

                  </span>

                </div>


                {/* SIGN OUT */}

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  disabled={
                    isLoading
                  }
                  style={{
                    border:
                      '1px solid #C76B4A',
                    background:
                      'transparent',
                    color:
                      '#A84F35',
                    borderRadius:
                      '9px',
                    padding:
                      '7px 10px',
                    fontFamily:
                      'var(--font-body)',
                    fontSize:
                      '0.75rem',
                    fontWeight:
                      '600',
                    cursor:
                      isLoading
                        ? 'not-allowed'
                        : 'pointer',
                    flexShrink:
                      0
                  }}
                >

                  Sign Out

                </button>

              </div>

            )}

          </section>


          {/* ==================================================
              ACTIVATION CODE
              ================================================== */}

          <section className="activation-section">

            <div className="activation-header">

              <div className="activation-icon-badge">

                <Key
                  size={14}
                  className="activation-key-icon"
                />

              </div>


              <h2 className="activation-title">

                Enter Activation Code

              </h2>

            </div>


            <form
              onSubmit={
                handleCodeSubmit
              }
              className="activation-form"
            >

              <CodeInput
                value={
                  activationCode
                }
                onChange={
                  setActivationCode
                }
                placeholder="Enter code"
                disabled={
                  isLoading
                }
              />


              <PrimaryButton
                type="submit"
                variant="terracotta"
                disabled={
                  isLoading
                }
                className="activation-continue-btn"
              >

                {
                  isLoading
                    ? 'Checking...'
                    : 'Continue'
                }

              </PrimaryButton>

            </form>

          </section>

        </div>

      </main>


      {/* ======================================================
          FOOTER
          ====================================================== */}

      <footer className="login-footer-arch">

        <div className="footer-arch-curve" />

        <div className="footer-monuments-bg" />


        <div className="footer-foliage footer-foliage--left">

          <svg
            viewBox="0 0 60 120"
            width="45"
            height="90"
            fill="#3A5E44"
            opacity="0.65"
          >

            <path
              d="M0,120 Q30,80 15,40 Q40,60 10,20 Q45,30 5,0 Q30,40 20,80 Z"
            />

          </svg>

        </div>


        <div className="footer-foliage footer-foliage--right">

          <svg
            viewBox="0 0 60 120"
            width="45"
            height="90"
            fill="#3A5E44"
            opacity="0.65"
          >

            <path
              d="M60,120 Q30,80 45,40 Q20,60 50,20 Q15,30 55,0 Q30,40 40,80 Z"
            />

          </svg>

        </div>


        <div className="footer-tagline">

          <span className="flourish-arrow">
            ➳
          </span>

          <span className="tagline-text">
            Strategize. Discover. Conquer.
          </span>

          <span className="flourish-arrow flourish-arrow--right">
            ➳
          </span>

        </div>

      </footer>

    </div>

  );

};


export default LoginPage;