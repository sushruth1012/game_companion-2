import React from 'react';
import { Ticket } from 'lucide-react';
import './CodeInput.css';

export const CodeInput = ({
  value,
  onChange,
  placeholder = 'Enter code',
  disabled = false,
  maxLength = 12,
  id = 'game-code-input',
  autoComplete = 'off',
}) => {
  const handleChange = (e) => {
    // Format to uppercase for clean activation/game codes
    const val = e.target.value.toUpperCase();
    onChange(val);
  };

  return (
    <div className="code-input-container">
      <div className="code-input-wrapper">
        <div className="code-input__icon-box">
          <Ticket size={20} className="code-input__icon" />
        </div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          spellCheck="false"
          className="code-input__field"
        />
      </div>
    </div>
  );
};

export default CodeInput;
