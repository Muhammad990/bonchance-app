import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Withdraw.css';
import { API_URL, getCookie, apiError } from '../api';
import { useLanguage } from '../LanguageContext';

const Withdraw = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const METHOD_LABEL = {
    'Bank Card': t('withdraw.bank_card'),
    USDT: t('withdraw.usdt'),
    Wise: t('withdraw.wise'),
    Revolut: t('withdraw.revolut'),
  };
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('Bank Card');
  const [totalBalance, setTotalBalance] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields state
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [fullName, setFullName] = useState('');

  // USDT specific state
  const [usdtAddress, setUsdtAddress] = useState('');
  const [usdtProtocol, setUsdtProtocol] = useState('ERC20');
  const [usdtFullName, setUsdtFullName] = useState('');

  // Wise specific state
  const [wiseEmail, setWiseEmail] = useState('');
  const [wiseFullName, setWiseFullName] = useState('');

  // Revolut specific state
  const [revolutWallet, setRevolutWallet] = useState('');
  const [revolutFullName, setRevolutFullName] = useState('');

  const [securityPin, setSecurityPin] = useState('');
  const [transactionsDisabled, setTransactionsDisabled] = useState(false);
  const [disabledMsg, setDisabledMsg] = useState('');
  const [accountTransactionsOff, setAccountTransactionsOff] = useState(false);
  const [timePopup, setTimePopup] = useState(false);
  const [cardLoaded, setCardLoaded] = useState(false);
  const [vipLimits, setVipLimits] = useState(null);
  const [withdrawalCountToday, setWithdrawalCountToday] = useState(0);
  const [limitPopup, setLimitPopup] = useState(null);

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
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (alive && json && json.success && json.data && json.data.member) {
          setTotalBalance(Number(json.data.member.availableFunds) || 0);
          setAccountTransactionsOff(json.data.member.transactions === 'Disabled');
          setVipLimits(json.data.member.vipLimits || null);
          setWithdrawalCountToday(Number(json.data.member.withdrawalCountToday) || 0);
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
          setCardLoaded(true);
        }
      })
      .catch(() => {})
      .finally(() => alive && setCardLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const methodReady = (m) => {
    if (m === 'Bank Card') return Boolean(bankName && bankAccount && fullName);
    if (m === 'USDT') return Boolean(usdtAddress && usdtFullName);
    if (m === 'Wise') return Boolean(wiseEmail && wiseFullName);
    if (m === 'Revolut') return Boolean(revolutWallet && revolutFullName);
    return false;
  };

  const handleClear = () => {
    setAmount('');
  };

  const WITHDRAW_START_SECONDS = 1 * 3600; // 01:00:00
  const WITHDRAW_END_SECONDS = 17 * 3600; // 17:00:00

  const isWithdrawTimeOpen = () => {
    const now = new Date();
    const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return seconds >= WITHDRAW_START_SECONDS && seconds <= WITHDRAW_END_SECONDS;
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (transactionsDisabled) {
      setError(disabledMsg || t('common.hint_disabled'));
      return;
    }
    if (accountTransactionsOff) {
      setError(t('common.account_disabled'));
      return;
    }
    if (!isWithdrawTimeOpen()) {
      setTimePopup(true);
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError(t('withdraw.err_amount'));
      return;
    }
    if (vipLimits) {
      if (Number.isFinite(vipLimits.minWithdrawal) && vipLimits.minWithdrawal > 0 && Number(amount) < vipLimits.minWithdrawal) {
        setLimitPopup({
          title: t('withdraw.limit_title'),
          message: t('withdraw.err_below', { min: vipLimits.minWithdrawal.toFixed(2) }),
        });
        return;
      }
      if (Number.isFinite(vipLimits.maxWithdrawal) && vipLimits.maxWithdrawal > 0 && Number(amount) > vipLimits.maxWithdrawal) {
        setLimitPopup({
          title: t('withdraw.limit_title'),
          message: t('withdraw.err_above', { max: vipLimits.maxWithdrawal.toFixed(2) }),
        });
        return;
      }
      if (Number.isFinite(vipLimits.withdrawalLimitCount) && vipLimits.withdrawalLimitCount > 0 && withdrawalCountToday >= vipLimits.withdrawalLimitCount) {
        setLimitPopup({
          title: t('withdraw.limit_title'),
          message: t('withdraw.err_daily', { count: vipLimits.withdrawalLimitCount }),
        });
        return;
      }
    }
    if (!securityPin) {
      setError(t('withdraw.err_pin'));
      return;
    }
    if (!cardLoaded) {
      setError(t('withdraw.err_loading'));
      return;
    }
    if (!methodReady(activeTab)) {
      setError(t('withdraw.err_details', { method: METHOD_LABEL[activeTab] || activeTab }));
      return;
    }

    const payload = {
      method: activeTab,
      withdrawalAmount: Number(amount),
      securityPin,
    };

    if (activeTab === 'Bank Card') {
      if (!bankName || !bankAccount || !fullName) {
        setError(t('withdraw.err_bank'));
        return;
      }
      payload.bankName = bankName;
      payload.accountNumber = bankAccount;
      payload.accountHolderName = fullName;
    } else if (activeTab === 'USDT') {
      if (!usdtAddress || !usdtFullName) {
        setError(t('withdraw.err_usdt'));
        return;
      }
      payload.usdtAddress = usdtAddress;
      payload.usdtProtocol = usdtProtocol;
      payload.usdtFullName = usdtFullName;
    } else if (activeTab === 'Wise') {
      if (!wiseEmail || !wiseFullName) {
        setError(t('withdraw.err_wise'));
        return;
      }
      payload.wiseEmail = wiseEmail;
      payload.wiseFullName = wiseFullName;
    } else if (activeTab === 'Revolut') {
      if (!revolutWallet || !revolutFullName) {
        setError(t('withdraw.err_revolut'));
        return;
      }
      payload.walletAddress = revolutWallet;
      payload.revolutFullName = revolutFullName;
    }

    setSubmitting(true);
    try {
      const token = getCookie('token');
      const res = await fetch(`${API_URL}/api/withdrawal-orders`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        setSuccess(t('withdraw.success'));
        setAmount('');
        setSecurityPin('');
      } else {
        setLimitPopup({
          title: t('withdraw.limit_title'),
          message: apiError(res, json),
        });
      }
    } catch (e) {
      setError(t('common.unable_server'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="withdraw-container">
      {/* Header */}
      <div className="withdraw-header">
        <span className="back-arrow" onClick={() => navigate(-1)}><i className="fa-solid fa-chevron-left"></i></span>
        <h2>{t('withdraw.title')}</h2>
        <span className="menu-icon" onClick={() => navigate('/withdraw-history')}><i className="fa-solid fa-clock-rotate-left"></i></span>
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
          &nbsp;{t('common.account_disabled')}
        </div>
      )}

      {/* Withdrawal Amount Box */}
      <div className="withdraw-amount-box">
        <label>{t('withdraw.amount_label')}</label>
        <div className="input-group">
          <input 
            type="number" 
            placeholder=""
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
          />
          {amount !== '' && (
            <div className="clear-btn" onClick={handleClear}>&#10005;</div>
          )}
        </div>
        <div className="total-balance">
          {t('withdraw.total_balance')}{totalBalance.toFixed(2)}
        </div>
      </div>

      {/* Withdrawal Method Section */}
      <div className="withdrawal-method-section">
        <div className="section-title">
          <span className="lightning-icon"><i class="fa-solid fa-bolt"></i></span> {t('withdraw.method_title')}
        </div>
        <p className="withdrawal-account-hint">
          {t('withdraw.method_hint')}
        </p>
        
        {/* Tabs */}
        <div className="method-tabs">
          <button 
            className={`tab-btn ${activeTab === 'Bank Card' ? 'active' : ''}`}
            onClick={() => setActiveTab('Bank Card')}
          >
            {METHOD_LABEL['Bank Card']}
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

        {/* Dynamic Form Fields based on Image Screenshots */}
        <div className="method-form-box">
          {activeTab === 'Bank Card' && (
            <>
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder={t('withdraw.bank_name')} 
                  readOnly
                  value={bankName}
                />
              </div>
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder={t('withdraw.bank_account')} 
                  readOnly
                  value={bankAccount}
                />
              </div>
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder={t('withdraw.full_name')} 
                  readOnly
                  value={fullName}
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
                  placeholder={t('withdraw.usdt_address')} 
                  readOnly
                  value={usdtAddress}
                />
              </div>
              <div className="form-row protocol-row">
                <span className="field-label-text">{t('withdraw.usdt_protocol')}</span>
                <span className="protocol-value">{usdtProtocol}</span>
              </div>
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder={t('withdraw.full_name')} 
                  readOnly
                  value={usdtFullName}
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
                  readOnly
                  value={wiseEmail}
                />
              </div>
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder={t('withdraw.full_name')} 
                  readOnly
                  value={wiseFullName}
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
                  readOnly
                  value={revolutWallet}
                />
              </div>
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder={t('withdraw.full_name')} 
                  readOnly
                  value={revolutFullName}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Security PIN Section */}
      <div className="security-pin-section">
        <div className="section-title">
          <span className="lightning-icon"><i class="fa-solid fa-bolt"></i></span> {t('withdraw.security_pin')}
        </div>
        <div className="pin-input-box">
          <input 
            type="password" 
            placeholder="•••••••"
            value={securityPin} 
            onChange={(e) => setSecurityPin(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div style={{ color: '#e03e3e', fontSize: '13px', textAlign: 'center', margin: '0 0 10px' }}>{error}</div>
      )}
      {success && (
        <div style={{ color: '#2fb344', fontSize: '13px', textAlign: 'center', margin: '0 0 10px' }}>{success}</div>
      )}

      {/* Submit Button */}
      <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
        {submitting ? t('common.submitting') : t('common.submit')}
      </button>

      {/* Withdrawal Time Popup */}
      {timePopup && (
        <div className="withdraw-popup-overlay">
          <div className="withdraw-popup-box">
            <div className="withdraw-popup-icon">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div className="withdraw-popup-title">{t('withdraw.time_title')}</div>
            <p className="withdraw-popup-text">
              {t('withdraw.time_text')}
            </p>
            <div className="withdraw-popup-actions">
              <button
                className="withdraw-popup-btn withdraw-popup-cancel"
                onClick={() => setTimePopup(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                className="withdraw-popup-btn withdraw-popup-confirm"
                onClick={() => setTimePopup(false)}
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP Limit Error Popup */}
      {limitPopup && (
        <div className="withdraw-popup-overlay">
          <div className="withdraw-popup-box">
            <div className="withdraw-popup-icon">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <div className="withdraw-popup-title">{limitPopup.title}</div>
            <p className="withdraw-popup-text">
              {limitPopup.message}
            </p>
            <div className="withdraw-popup-actions">
              <button
                className="withdraw-popup-btn withdraw-popup-confirm"
                onClick={() => setLimitPopup(null)}
              >
                {t('common.ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;