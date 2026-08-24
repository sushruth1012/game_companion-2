import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoBadge from '../../components/cards/LogoBadge';
import './Splash.css';

export const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-transition to login / landing page after 1.8s
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen" onClick={() => navigate('/login')}>
      <div className="splash-mandala" />
      <div className="splash-content">
        <LogoBadge />
        <h1 className="splash-title">YATRA</h1>
        <p className="splash-subtitle">Chowkabara Heritage Companion</p>
        <div className="splash-loading-bar">
          <div className="splash-loading-progress" />
        </div>
      </div>
      <div className="splash-footer">
        <span>Strategize • Discover • Conquer</span>
      </div>
    </div>
  );
};

export default SplashPage;
