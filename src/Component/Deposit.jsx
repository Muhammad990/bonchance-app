import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Deposit.css';
import { API_URL, getCookie, apiError } from '../api';
import { useLanguage } from '../LanguageContext';

const Deposit = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactionsDisabled, setTransactionsDisabled] = useState(false);
  const [disabledMsg, setDisabledMsg] = useState('');
  const [accountTransactionsOff, setAccountTransactionsOff] = useState(false);
  const [cardLoaded, setCardLoaded] = useState(false);
  const [hasCard, setHasCard] = useState(false);
  const [vipLimits, setVipLimits] = useState(null);
  const [vipName, setVipName] = useState('');

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/api/settings`)
      .then((res) => res.json())
      .then((json) => {
        if (alive && json && json.success && json.data) {
          setTransactionsDisabled(!!json.data.transactionsDisabled);
          setDisabledMsg(json.data.disabledMessage || '');
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

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
          setBankName(json.data.bankName || '');
          setCardNumber(json.data.accountNumber || '');
          setAccountHolderName(json.data.accountHolderName || '');
          setHasCard(Boolean(json.data.accountNumber));
        }
      })
      .catch(() => {})
      .finally(() => alive && setCardLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const token = getCookie('token');
    if (!token) return;
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (alive && json && json.success && json.data && json.data.member) {
          setTotalBalance(Number(json.data.member.availableFunds) || 0);
          setAccountTransactionsOff(json.data.member.transactions === 'Disabled');
          setVipLimits(json.data.member.vipLimits || null);
          setVipName(json.data.member.vipLevel || '');
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const quickAmounts = [100.00, 200.00, 500.00, 1000.00, 2000.00, 5000.00];

  const handleQuickSelect = (val) => {
    setAmount(val.toFixed(2));
    setSelectedCard(val);
  };

  const handleClear = () => {
    setAmount('');
    setSelectedCard(null);
  };

  const toggleSide = () => {
    setError('');
    setSideOpen(!sideOpen);
  };

  const accountDisabledMsg = t('common.account_disabled');

  const submitOrder = async () => {
    if (transactionsDisabled) {
      setError(disabledMsg || t('common.hint_disabled'));
      return;
    }
    if (accountTransactionsOff) {
      setError(accountDisabledMsg);
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError(t('deposit.err_amount'));
      return;
    }
    if (vipLimits) {
      if (Number.isFinite(vipLimits.depositMin) && vipLimits.depositMin > 0 && Number(amount) < vipLimits.depositMin) {
        setError(t('deposit.err_below', { min: vipLimits.depositMin.toFixed(2) }));
        return;
      }
      if (Number.isFinite(vipLimits.depositMax) && vipLimits.depositMax > 0 && Number(amount) > vipLimits.depositMax) {
        setError(t('deposit.err_above', { max: vipLimits.depositMax.toFixed(2) }));
        return;
      }
    }
    if (!cardLoaded) {
      setError(t('deposit.err_loading_card'));
      return;
    }
    if (!hasCard || !bankName.trim() || !cardNumber.trim() || !accountHolderName.trim()) {
      setError(t('deposit.err_add_card'));
      setSideOpen(false);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const token = getCookie('token');
      const res = await fetch(`${API_URL}/api/recharge-orders`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bankName: bankName.trim(),
          cardNumber: cardNumber.trim(),
          accountHolderName: accountHolderName.trim(),
          rechargeAmount: Number(amount),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        setAmount('');
        setSelectedCard(null);
        setSideOpen(false);
        setPopup(true);
      } else {
        setError(apiError(res, json));
      }
    } catch (e) {
      setError(t('common.unable_server'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="deposit-container">
      {/* Header */}
      <div className="deposit-header">
        <span className="back-arrow" onClick={() => navigate(-1)}><i className="fa-solid fa-chevron-left"></i></span>
        <h2>{t('deposit.title')}</h2>
        <span className="menu-icon" onClick={() => navigate('/deposit-history')}><i className="fa-solid fa-clock-rotate-left"></i></span>
      </div>

      {transactionsDisabled && (
        <div className="transactions-disabled-banner">
          <i className="fa-solid fa-circle-exclamation"></i>
          &nbsp;{disabledMsg || t('common.hint_disabled')}
        </div>
      )}

      {accountTransactionsOff && (
        <div className="transactions-disabled-banner">
          <i className="fa-solid fa-circle-exclamation"></i>
          &nbsp;{accountDisabledMsg}
        </div>
      )}

      {/* Deposit Amount Box */}
      <div className="deposit-amount-box">
        <label>{t('deposit.amount_label')}</label>
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {amount !== '' && (
            <span className="clear-btn" onClick={handleClear}>&#10005;</span>
          )}
        </div>
        <div className="total-balance">
          {t('deposit.total_balance')}{totalBalance.toFixed(2)}
        </div>
        {vipLimits &&
          Number.isFinite(vipLimits.depositMin) &&
          Number.isFinite(vipLimits.depositMax) &&
          vipLimits.depositMin > 0 &&
          vipLimits.depositMax > 0 && (
            <div style={{ color: '#8a8a8a', fontSize: '12px', marginTop: '6px' }}>
              {t('deposit.range_hint', {
                vip: vipName || '',
                min: vipLimits.depositMin.toFixed(2),
                max: vipLimits.depositMax.toFixed(2),
              })}
            </div>
          )}
      </div>

      {/* Bank Card Section */}
      <div className="bank-card-label">
        <button onClick={toggleSide}>{t('deposit.bank_card')}</button>
        <input type="text" readOnly value={cardNumber ? cardNumber : ''} />
      </div>

      {/* Quick Selection Section */}
      <div className="quick-selection-section">
        <div className="section-title">
          <span className="lightning-icon"><i className="fa-solid fa-bolt"></i></span> {t('deposit.quick_selection')}
        </div>
        <div className="support-links">
          <a className="support-item" href="https://t.me/TUIcustomerservice" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-headset"></i>&nbsp;&nbsp;Tawk</a>
          <a className="support-item" href="https://t.me/TUIcustomerservice" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-telegram"></i> &nbsp;Telegram</a>
        </div>
      </div>

      {/* Amount Grid Cards */}
      <div className="cards-grid">
        {quickAmounts.map((val) => (
          <div
            key={val}
            className={`amount-card ${selectedCard === val ? 'active' : ''}`}
            onClick={() => handleQuickSelect(val)}
          >
            {val.toFixed(2)}
          </div>
        ))}
      </div>

      {error && (
        <div style={{ color: '#e03e3e', fontSize: '13px', textAlign: 'center', margin: '0 0 12px' }}>{error}</div>
      )}

      {/* Submit Button */}
      <button className="submit-btn" onClick={submitOrder} disabled={submitting}>
        {submitting ? t('common.submitting') : t('common.submit')}
      </button>

      {/* Side Panel (Bank Card Details) */}
      {sideOpen && (
        <div className="deposit-side-overlay" onClick={toggleSide}>
          <div className="deposit-side-panel" onClick={(e) => e.stopPropagation()}>
            <div className="deposit-side-header">
              <h3>{t('deposit.info_title')}</h3>
              <button className="deposit-side-close" onClick={toggleSide}>&times;</button>
            </div>
            <div className="deposit-side-body">
              {error && (
                <div style={{ color: '#e03e3e', fontSize: '13px', marginBottom: '10px' }}>{error}</div>
              )}
              <p className="withdrawal-account-hint">
                {t('deposit.info_hint')}
              </p>
              <label>{t('deposit.bank_name')}</label>
              <input
                type="text"
                readOnly
                value={bankName}
                placeholder={t('deposit.ph_bank_name')}
              />
              <label>{t('deposit.card_number')}</label>
              <input
                type="text"
                readOnly
                value={cardNumber}
                placeholder={t('deposit.ph_card_number')}
              />
              <label>{t('deposit.account_holder')}</label>
              <input
                type="text"
                readOnly
                value={accountHolderName}
                placeholder={t('deposit.ph_account_holder')}
              />
            </div>
            <div className="deposit-side-footer">
              <button className="deposit-side-cancel" onClick={toggleSide}>{t('common.cancel')}</button>
              <button className="deposit-side-submit" onClick={submitOrder} disabled={submitting}>
                {submitting ? t('common.submitting') : t('common.submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waiting for Approval Popup */}
      {popup && (
        <div className="deposit-popup-overlay">
          <div className="deposit-popup-box">
            <div className="deposit-popup-icon">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div className="deposit-popup-title">{t('deposit.waiting_title')}</div>
            <p className="deposit-popup-text">
              {t('deposit.waiting_text')}
            </p>
            <button className="deposit-popup-ok" onClick={() => setPopup(false)}>{t('common.ok')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;