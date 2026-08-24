import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Globe, Moon, Bell } from 'lucide-react';

export const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: 'var(--color-background)' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', color: '#6B4F3A' }}>
          <ArrowLeft size={22} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#6B4F3A' }}>Settings</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { label: 'Sound Effects & Chants', icon: <Volume2 size={20} />, active: 'Enabled' },
          { label: 'Language / ಭಾಷೆ', icon: <Globe size={20} />, active: 'English' },
          { label: 'Notifications', icon: <Bell size={20} />, active: 'On' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #E5DACB',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#3A271B' }}>
              <span style={{ color: '#D9A441' }}>{item.icon}</span>
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#355E3B', fontWeight: 600 }}>{item.active}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
