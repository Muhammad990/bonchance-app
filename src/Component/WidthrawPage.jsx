import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Withdraw.css';
import { API_URL, getCookie, apiError } from '../api';
import { useLanguage } from '../LanguageContext';

const WithdrawPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Bank Card');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [success, setSuccess] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [fullName, setFullName] = useState('');

  const [usdtAddress, setUsdtAddress] = useState('');
  const [usdtProtocol, setUsdtProtocol] = useState('ERC20');
  const [usdtFullName, setUsdtFullName] = useState('');

  const [wiseEmail, setWiseEmail] = useState('');
  const [wiseFullName, setWiseFullName] = useState('');

  const [revolutWallet, setRevolutWallet] = useState('');
  const [revolutFullName, setRevolutFullName] = useState('');

  useEffect(() => {
    let alive = true;
    const token = getCookie('token');
    if (!token) return;
    fetch(`${API_URL}/api/bank-cards/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (alive && json && json.success && json.data) {
          const d = json.data;
          setBankName(d.bankName || '');
          setBankAccount(d.accountNumber || '');
          setFullName(d.accountHolderName || '');
          setUsdtAddress(d.usdtAddress || '');
          setUsdtProtocol(d.usdtProtocol || 'ERC20');
          setUsdtFullName(d.usdtFullName || '');
          setWiseEmail(d.wiseEmail || '');
          setWiseFullName(d.wiseFullName || '');
          setRevolutWallet(d.revolutWallet || '');
          setRevolutFullName(d.revolutFullName || '');
        }
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const handleSubmit = async () => {
    setMsg(null);
    setSaving(true);
    try {
      const token = getCookie('token');
      const res = await fetch(`${API_URL}/api/bank-cards/my`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bankName: bankName.trim(),
          accountNumber: bankAccount.trim(),
          accountHolderName: fullName.trim(),
          usdtAddress: usdtAddress.trim(),
          usdtProtocol,
          usdtFullName: usdtFullName.trim(),
          wiseEmail: wiseEmail.trim(),
          wiseFullName: wiseFullName.trim(),
          revolutWallet: revolutWallet.trim(),
          revolutFullName: revolutFullName.trim(),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        setSuccess(json.message || t('waccount.saved_success'));
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setMsg(apiError(res, json));
      }
    } catch (e) {
      setMsg(t('common.unable_server'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="withdraw-container">
      {/* Header */}
      <div className="withdraw-header">
        <span className="back-arrow" onClick={() => navigate(-1)}><i className="fa-solid fa-chevron-left"></i></span>
        <h2>{t('waccount.title')}</h2>
        <span className="header-space"></span>
      </div>

      <p className="withdrawal-account-hint">
        {t('waccount.hint')}
      </p>

      {/* Withdrawal Method Section */}
      <div className="withdrawal-method-section">
        {/* Tabs */}
        <div className="method-tabs">
          <button
            className={`tab-btn ${activeTab === 'Bank Card' ? 'active' : ''}`}
            onClick={() => setActiveTab('Bank Card')}
          >
            {t('withdraw.bank_card')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'USDT' ? 'active' : ''}`}
            onClick={() => setActiveTab('USDT')}
          >
            USDT
          </button>
          <button
            className={`tab-btn ${activeTab === 'Wise' ? 'active' : ''}`}
            onClick={() => setActiveTab('Wise')}
          >
            Wise
          </button>
          <button
            className={`tab-btn ${activeTab === 'Revolut' ? 'active' : ''}`}
            onClick={() => setActiveTab('Revolut')}
          >
            Revolut
          </button>
        </div>

        {/* Dynamic Form Fields */}
        <div className="method-form-box">
          {activeTab === 'Bank Card' && (
            <>
              <div className="form-row">
                <input
                  type="text"
                  placeholder={t('withdraw.bank_name')}
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder={t('withdraw.bank_account')}
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder={t('withdraw.full_name')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </>
          )}

          {activeTab === 'USDT' && (
            <>
              <div className="form-row label-row">
                <span className="field-label-text">USDT</span>
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder={t('waccount.usdt_number')}
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                />
              </div>
              <div className="form-row protocol-row">
                <span className="field-label-text">{t('withdraw.usdt_protocol')}</span>
                <select
                  className="protocol-select"
                  value={usdtProtocol}
                  onChange={(e) => setUsdtProtocol(e.target.value)}
                >
                  <option value="ERC20">ERC20</option>
                  <option value="TRC20">TRC20</option>
                </select>
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder={t('withdraw.full_name')}
                  value={usdtFullName}
                  onChange={(e) => setUsdtFullName(e.target.value)}
                />
              </div>
            </>
          )}

          {activeTab === 'Wise' && (
            <>
              <div className="form-row label-row">
                <span className="field-label-text">Wise</span>
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder={t('withdraw.wise_email')}
                  value={wiseEmail}
                  onChange={(e) => setWiseEmail(e.target.value)}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder={t('withdraw.full_name')}
                  value={wiseFullName}
                  onChange={(e) => setWiseFullName(e.target.value)}
                />
              </div>
            </>
          )}

          {activeTab === 'Revolut' && (
            <>
              <div className="form-row label-row">
                <span className="field-label-text">Revolut</span>
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder={t('withdraw.wallet_address')}
                  value={revolutWallet}
                  onChange={(e) => setRevolutWallet(e.target.value)}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder={t('withdraw.full_name')}
                  value={revolutFullName}
                  onChange={(e) => setRevolutFullName(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {msg && (
        <div style={{ color: '#e03e3e', fontSize: '13px', textAlign: 'center', margin: '0 0 10px' }}>{msg}</div>
      )}
      {success && (
        <div style={{ color: '#2fb344', fontSize: '13px', textAlign: 'center', margin: '0 0 10px' }}>{success}</div>
      )}

      {/* Submit Button */}
      <button
        className="submit-btn"
        onClick={() => setConfirmOpen(true)}
        disabled={saving || loading}
      >
        {saving ? t('common.saving') : loading ? t('common.loading') : t('common.submit')}
      </button>

      {/* Confirm Popup */}
      {confirmOpen && (
        <div className="withdraw-popup-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="withdraw-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="withdraw-popup-icon">
              <i className="fa-solid fa-circle-question"></i>
            </div>
            <div className="withdraw-popup-title">{t('common.confirm')}</div>
            <p className="withdraw-popup-text">
              {t('waccount.confirm_text')}
            </p>
            <div className="withdraw-popup-actions">
              <button
                className="withdraw-popup-btn withdraw-popup-cancel"
                onClick={() => setConfirmOpen(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                className="withdraw-popup-btn withdraw-popup-confirm"
                onClick={() => {
                  setConfirmOpen(false);
                  handleSubmit();
                }}
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;