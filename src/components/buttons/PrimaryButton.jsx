import React from 'react';
import { ChevronRight } from 'lucide-react';
import './PrimaryButton.css';

export const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'terracotta', // 'terracotta' | 'forest' | 'gold'
  showArrow = true,
  className = '',
  type = 'button',
  fullWidth = true,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`primary-button primary-button--${variant} ${fullWidth ? 'primary-button--full' : ''} ${className}`}
    >
      <span className="primary-button__label">{children}</span>
      {showArrow && <ChevronRight className="primary-button__icon" size={18} strokeWidth={2.5} />}
    </button>
  );
};

export default PrimaryButton;
