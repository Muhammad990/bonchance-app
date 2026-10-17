import React, { useState } from 'react';

const PasswordField = ({ label, value, onChange, placeholder = '', autoComplete = 'off' }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="pwd-field">
      <label>{label}</label>
      <div className="pwd-input-wrap">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="pwd-eye"
          onClick={() => setShow(!show)}
          tabIndex="-1"
          aria-label={show ? 'Hide' : 'Show'}
        >
          <i className={`fa-solid fa-eye${show ? '-slash' : ''}`}></i>
        </button>
      </div>
    </div>
  );
};

export default PasswordField;