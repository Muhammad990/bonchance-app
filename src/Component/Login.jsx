import React, { useState } from 'react'
import "./Login.css"
import { API_URL, setCookie, apiError } from '../api'

const Login = ({ onShowRegister, onLogin, t }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    if (!identifier.trim() || !password) {
      setError(t('login.fillCredentials'));
      setDisabled(false);
      return;
    }

    setLoading(true);
    setError('');
    setDisabled(false);
    try {
      const res = await fetch(`${API_URL}/api/auth/app-login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        if (json.data && json.data.token) setCookie('token', json.data.token, 7);
        setError('');
        if (onLogin) onLogin(json.data.member);
      } else {
        const msg = apiError(res, json);
        if ((res.status === 403 || (json && json.message === 'Your Account is Disabled'))) {
          setDisabled(true);
        }
        setError(msg);
      }
    } catch (e) {
      setError(t('common.unableToReachShort'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='main_login'>
        <div><h2>{t('auth.loginTitle')}</h2></div>
        <div className='login_area'>
          <div className='login_inputs'><input type="text" placeholder={t('auth.userPlaceholder')} value={identifier} onChange={(e) => setIdentifier(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} /></div>
          <div className='login_inputs'><input type="password" placeholder={t('auth.passPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} /></div>
          {error && <div style={{ color: '#ff8a8a', fontSize: '13px', textAlign: 'center', margin: '6px 0 0', lineHeight: '1.4' }}>{disabled && <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '5px', fontSize: '15px' }}></i>}{error}</div>}
          <div className='login_btn'><button disabled={loading} onClick={submit}>{t('auth.loginBtn')}</button></div>
          <div className='no_or_already'>{t('auth.noAccount')} &nbsp;&nbsp; <a href="#register" onClick={(e) => { e.preventDefault(); onShowRegister(); }}>{t('auth.registerLink')}</a></div>
        </div>
      </div>
    </>
  )
}

export default Login;
