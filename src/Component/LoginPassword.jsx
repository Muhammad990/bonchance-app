import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPassword.css';
import { API_URL, getCookie, apiError } from '../api';
import { useLanguage } from '../LanguageContext';
import PasswordField from './PasswordField';

const LoginPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError(t('common.fill_all'));
      return;
    }
    if (newPassword.length < 6) {
      setError(t('lp.err_min'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('lp.err_mismatch'));
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
        body: JSON.stringify({ type: 'login', oldPassword, newPassword }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        setSuccess(json.message || t('common.saved'));
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
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
        <h2>{t('page.login_password')}</h2>
        <div className="header-space"></div>
      </div>

      {/* Form Fields Section */}
      <div className="login-pwd-card">
        <div className="login-pwd-form">
          <PasswordField
            label={t('lp.old_password')}
            value={oldPassword}
            onChange={setOldPassword}
            autoComplete="current-password"
          />

          <PasswordField
            label={t('lp.new_password')}
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
          />

          <PasswordField
            label={t('lp.confirm_password')}
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />

          {/* Note Text */}
          <p className="pwd-note">
            {t('lp.note')}
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

export default LoginPassword;