import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';

export const LeaderboardPage = () => {
  const navigate = useNavigate();
  const scores = [
    { rank: 1, name: 'Royal Strategist', points: 2450, badge: '🥇' },
    { rank: 2, name: 'Mysuru Master', points: 1980, badge: '🥈' },
    { rank: 3, name: 'Vedic Champion', points: 1720, badge: '🥉' },
    { rank: 4, name: 'Chowka King', points: 1490, badge: '⭐' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: 'var(--color-background)' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
        <button onClick={() => navigate('/live-game')} style={{ background: 'none', color: '#6B4F3A' }}>
          <ArrowLeft size={22} />
        </button>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#6B4F3A' }}>Leaderboard</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {scores.map((s) => (
          <div
            key={s.rank}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: s.rank === 1 ? '2px solid #D9A441' : '1px solid #E5DACB',
              boxShadow: s.rank === 1 ? '0 4px 12px rgba(217, 164, 65, 0.2)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.3rem' }}>{s.badge}</span>
              <div>
                <strong style={{ color: '#3A271B' }}>{s.name}</strong>
                <div style={{ fontSize: '0.78rem', color: '#887' }}>Rank #{s.rank}</div>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', color: '#6B4F3A' }}>
              {s.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
