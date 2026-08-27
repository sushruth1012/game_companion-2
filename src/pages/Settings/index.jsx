import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Volume2, Globe, Moon, Bell, FileSpreadsheet, LogOut, Shield, Download } from 'lucide-react';
import { downloadSurveyCSV } from '../../services/surveyAnalyticsService';
import './Settings.css';

export const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out? This will end your active session and return to the login screen.')) {
      sessionStorage.clear();
      localStorage.removeItem('active_device_session');
      localStorage.removeItem('activated_box_code');
      navigate('/login');
    }
  };

  const handleDownloadSurvey = () => {
    downloadSurveyCSV();
  };

  return (
    <div className="settings-screen page-transition-fade">
      {/* Background Ambience */}
      <div className="settings-parchment-bg" />

      {/* ===== TOP APP BAR ===== */}
      <header className="settings-top-header">
        <button
          type="button"
          className="app-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="settings-header-title">SETTINGS</h1>
        <div style={{ width: 36 }} />
      </header>

      {/* ===== MAIN SETTINGS LIST ===== */}
      <main className="settings-main-content">
        {/* Game Preferences Section */}
        <section className="settings-section">
          <h2 className="settings-section-title">GAME PREFERENCES</h2>
          <div className="settings-cards-list">
            {[
              { label: 'Sound Effects & Chants', icon: <Volume2 size={18} />, active: 'Enabled' },
              { label: 'Language / ಭಾಷೆ', icon: <Globe size={18} />, active: 'English' },
              { label: 'Turn Reminders & Vibration', icon: <Bell size={18} />, active: 'On' },
            ].map((item) => (
              <div key={item.label} className="settings-row-card">
                <div className="settings-row-left">
                  <span className="settings-icon-pill">{item.icon}</span>
                  <span className="settings-row-label">{item.label}</span>
                </div>
                <span className="settings-status-tag">{item.active}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Survey & Research Telemetry */}
        <section className="settings-section">
          <h2 className="settings-section-title">RESEARCH & SURVEY</h2>
          <div className="settings-cards-list">
            <div className="settings-row-card settings-row-card--action" onClick={handleDownloadSurvey}>
              <div className="settings-row-left">
                <span className="settings-icon-pill" style={{ background: 'rgba(46, 204, 113, 0.15)', borderColor: '#2ECC71', color: '#2ECC71' }}>
                  <FileSpreadsheet size={18} />
                </span>
                <div className="settings-text-col">
                  <span className="settings-row-label">Download Survey CSV</span>
                  <small className="settings-sub-desc">Export timestamps & move durations</small>
                </div>
              </div>
              <Download size={16} color="#2ECC71" />
            </div>
          </div>
        </section>

        {/* Account & Session Section with Log Out */}
        <section className="settings-section">
          <h2 className="settings-section-title">ACCOUNT & SESSION</h2>
          <div className="settings-cards-list">
            <button
              type="button"
              className="settings-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Log Out & Return to Login</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;
