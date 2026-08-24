import React from 'react';
import logoImg from '../../assets/yatra_logo.png';
import './LogoBadge.css';

export const LogoBadge = () => {
  return (
    <div className="logo-badge-container">
      <div className="logo-badge-ring-outer">
        <div className="logo-badge-circle">
          <img
            src={logoImg}
            alt="YATRA Logo"
            className="logo-badge-img"
          />
        </div>
      </div>
    </div>
  );
};

export default LogoBadge;
