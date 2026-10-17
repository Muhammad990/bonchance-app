import React, { useState } from 'react'
import "./Login.css"
import { API_URL, setCookie, apiError } from '../api'

const Register = ({ onShowLogin, onLogin, t, initialInvitationCode = '' }) => {
  const [form, setForm] = useState({
    nickname: '',
    username: '',
    password: '',
    confirmPassword: '',
    securityPin: '',
    invitationCode: initialInvitationCode || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    if (loading) return;

    const missing = [];
    if (!form.nickname.trim()) missing.push(t('auth.nicknamePlaceholder'));
    if (!form.username.trim()) missing.push(t('auth.userPlaceholder'));
    if (!form.password) missing.push(t('auth.regPassPlaceholder'));
    if (!form.confirmPassword) missing.push(t('auth.confirmPassPlaceholder'));
    if (!form.securityPin.trim()) missing.push(t('auth.secPinPlaceholder'));
    if (missing.length > 0) {
      setError(`${t('register.required')}${missing.join(', ')}`);
      return;
    }
    if (form.password.length < 6) {
      setError(t('register.passMin6'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t('register.passMismatch'));
      return;
    }
    if (form.securityPin.trim().length < 4) {
      setError(t('register.pinMin4'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/app-register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: form.nickname.trim(),
          username: form.username.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          securityPin: form.securityPin.trim(),
          invitationCode: form.invitationCode.trim(),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        if (json.data && json.data.token) setCookie('token', json.data.token, 7);
        setError('');
        if (onLogin) onLogin(json.data.member);
      } else {
        setError(apiError(res, json));
      }
    } catch (e) {
      setError(t('common.unableToReachShort'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main_register'>
        <div><h2>{t('auth.registerTitle')}</h2></div>
        <div className='register_area'>
          <div className='login_inputs'><input type="text" placeholder={t('auth.nicknamePlaceholder')} value={form.nickname} onChange={(e) => setField('nickname', e.target.value)} /></div>
          <div className='login_inputs'><input type="text" placeholder={t('auth.userPlaceholder')} value={form.username} onChange={(e) => setField('username', e.target.value)} /></div>
          <div className='login_inputs'><input type="password" placeholder={t('auth.regPassPlaceholder')} value={form.password} onChange={(e) => setField('password', e.target.value)} /></div>
          <div className='login_inputs'><input type="password" placeholder={t('auth.confirmPassPlaceholder')} value={form.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} /></div>
          <div className='login_inputs'><input type="password" placeholder={t('auth.secPinPlaceholder')} value={form.securityPin} onChange={(e) => setField('securityPin', e.target.value)} /></div>
          <div className='login_inputs'><input type="text" placeholder={t('auth.invitePlaceholder')} value={form.invitationCode} onChange={(e) => setField('invitationCode', e.target.value)} /></div>
          {error && <div style={{ color: '#ff8a8a', fontSize: '13px', textAlign: 'center', margin: '6px 0 0', lineHeight: '1.4' }}>{error}</div>}
          <div className='login_btn'><button disabled={loading} onClick={submit}>{t('auth.registerBtn')}</button></div>
          <div className='no_or_already'>{t('auth.hasAccount')} &nbsp;&nbsp; <a href="#login" onClick={(e) => { e.preventDefault(); onShowLogin(); }}>{t('auth.loginLink')}</a></div>
        </div>
    </div>
  )
}

export default Register;
