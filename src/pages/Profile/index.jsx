import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Shield, Award, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../../services/authService';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser() || { displayName: 'Royal Voyager', email: 'player@heritagegames.in' };

  const handleLogout = async () => {
    sessionStorage.clear();
    localStorage.removeItem('active_device_session');
    localStorage.removeItem('activated_box_code');
    await logoutUser();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: 'var(--color-background)' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
        <button
          type="button"
          className="app-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#6B4F3A' }}>Player Profile</h1>
      </header>

      <div style={{ background: '#FFF', borderRadius: '18px', padding: '20px', border: '1.5px solid #E5DACB', textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#D9A441', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#2D1C13' }}>
          👑
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#3A271B' }}>{user.displayName}</h2>
        <p style={{ color: '#887', fontSize: '0.88rem' }}>{user.email}</p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          background: '#FFF',
          border: '1.5px solid #C76B4A',
          color: '#C76B4A',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <LogOut size={18} /> Sign Out & Return to Login
      </button>
    </div>
  );
};

export default ProfilePage;
