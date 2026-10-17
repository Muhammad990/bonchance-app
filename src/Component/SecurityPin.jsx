import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPassword.css';
import { API_URL, getCookie, apiError } from '../api';
import { useLanguage } from '../LanguageContext';
import PasswordField from './PasswordField';

const SecurityPin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!oldPin || !newPin || !confirmPin) {
      setError(t('common.fill_all'));
      return;
    }
    if (newPin.length < 6) {
      setError(t('sp.err_min'));
      return;
    }
    if (newPin !== confirmPin) {
      setError(t('sp.err_mismatch'));
      return;
    }
    try {
      const token = getCookie('token');
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'withdraw', oldPassword: oldPin, newPassword: newPin }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        setSuccess(json.message || t('common.saved'));
        setOldPin('');
        setNewPin('');
        setConfirmPin('');
      } else {
        setError(apiError(res, json));
      }
    } catch (e) {
      setError(t('common.unable_server'));
    }
  };

  return (
    <div className="login-pwd-container">
      {/* Top Header */}
      <div className="login-pwd-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h2>{t('page.security_pin')}</h2>
        <div className="header-space"></div>
      </div>

      {/* Form Fields Section */}
      <div className="login-pwd-card">
        <div className="login-pwd-form">
          <PasswordField
            label={t('sp.old_pin')}
            value={oldPin}
            onChange={setOldPin}
            autoComplete="off"
          />

          <PasswordField
            label={t('sp.new_pin')}
            value={newPin}
            onChange={setNewPin}
            autoComplete="off"
          />

          <PasswordField
            label={t('sp.confirm_pin')}
            value={confirmPin}
            onChange={setConfirmPin}
            autoComplete="off"
          />

          {/* Note Text */}
          <p className="pwd-note">
            {t('sp.note')}
          </p>

          {error && (
            <div className="form-msg form-msg-error">{error}</div>
          )}
          {success && (
            <div className="form-msg form-msg-success">{success}</div>
          )}
        </div>
      </div>

      {/* Saved Button Section */}
      <div className="login-pwd-footer">
        <button className="saved-btn" onClick={handleSave}>
          {t('common.saved')}
        </button>
      </div>
    </div>
  );
};

export default SecurityPin;