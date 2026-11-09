import React, { useState, useEffect } from 'react';
import './Starting.css';
import { API_URL, getCookie, apiError } from '../api';
import { useLanguage } from '../LanguageContext';

const Starting = () => {
  const { t } = useLanguage();
  const [accountBalance, setAccountBalance] = useState(0);
  const [taskStatus, setTaskStatus] = useState(0);
  const [vipLevel, setVipLevel] = useState('VIP1');
  const [profitPct, setProfitPct] = useState('1.00');
  const [dailyOrderVolume, setDailyOrderVolume] = useState('30');
  const [todayProfit, setTodayProfit] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showProduct, setShowProduct] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [working, setWorking] = useState(false);
  const [popup, setPopup] = useState(null);
  const [orderWindow, setOrderWindow] = useState('');
  const [settings, setSettings] = useState(null);

  const token = getCookie('token');

  const loadMember = (member) => {
    setAccountBalance(Number(member.availableFunds) || 0);
    setTaskStatus(Number(member.taskStatus) || 0);
    setVipLevel(member.vipLevel || 'VIP1');
    setTodayProfit(Number(member.todayProfit) || 0);
    if (member.dailyOrderVolume) setDailyOrderVolume(member.dailyOrderVolume);
  };

  useEffect(() => {
    let alive = true;
    if (!token) return;
    Promise.all([
      fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json()),
      fetch(`${API_URL}/api/membership-levels`)
        .then((res) => res.json()),
      fetch(`${API_URL}/api/orders/my-pending`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json()),
      fetch(`${API_URL}/api/settings`)
        .then((res) => res.json()),
    ])
      .then(([meJson, levelsJson, pendJson, settingsJson]) => {
        if (!alive) return;
        if (meJson && meJson.success && meJson.data && meJson.data.member) {
          loadMember(meJson.data.member);
        }
        if (levelsJson && levelsJson.success) {
          const levels = levelsJson.data || [];
          const level = meJson && meJson.data && meJson.data.member
            ? levels.find((l) => l.name === meJson.data.member.vipLevel)
            : null;
          if (level) {
            if (level.dailyOrderVolume) setDailyOrderVolume(level.dailyOrderVolume);
            const rate = parseFloat(level.orderCommissionRate);
            if (!Number.isNaN(rate)) {
              const pct = rate < 1 ? rate * 100 : rate;
              setProfitPct(pct % 1 === 0 ? String(pct) : pct.toFixed(2));
            }
          }
        }
        if (pendJson && pendJson.success && pendJson.data && pendJson.data.order) {
          setCurrentOrder(pendJson.data.order);
        }
        if (settingsJson && settingsJson.success && settingsJson.data) {
          setSettings(settingsJson.data);
          // setOrderWindow(formatSystemWindowForUser(settingsJson.data));
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartClick = async () => {
    if (working) return;
    setWorking(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => null);
      if (json && json.success) {
        setInsufficientBalance(false);
        setCurrentOrder(json.data.order);
        setShowProduct(true);
      } else if (json && json.insufficientBalance && json.data && json.data.order) {
        setCurrentOrder(json.data.order);
        setInsufficientBalance(true);
        setShowProduct(true);
      } else {
        setPopup({ message: apiError(res, json), type: 'error' });
      }
    } catch (e) {
      setPopup({ message: t('start.unable_server'), type: 'error' });
    } finally {
      setWorking(false);
    }
  };

  const handleOrderDone = async () => {
    if (!currentOrder || working) return;
    setWorking(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/${currentOrder._id}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => null);
      if (json && json.success) {
        if (json.data.member) loadMember(json.data.member);
        setCurrentOrder(null);
        setShowProduct(false);
        setPopup({
          message: t('start.order_done', { amount: Number(json.data.order.commission || 0).toFixed(2) }),
          type: 'success',
        });
      } else {
        setPopup({ message: apiError(res, json), type: 'error' });
      }
    } catch (e) {
      setPopup({ message: t('start.unable_server'), type: 'error' });
    } finally {
      setWorking(false);
    }
  };

  const formatSystemWindowForUser = (settings) => {
    if (!settings?.openingTime || !settings?.closingTime || !settings?.systemTimeZone) return '';
    const formatTime = (wallTime) => {
      const match = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(wallTime);
      if (!match) return wallTime;
      const now = new Date();
      let candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), Number(match[1]), Number(match[2]), Number(match[3] || 0)));
      for (let i = 0; i < 3; i += 1) {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: settings.systemTimeZone,
          hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
        }).formatToParts(candidate);
        const values = {};
        parts.forEach((part) => { if (part.type !== 'literal') values[part.type] = Number(part.value); });
        const displayed = (values.hour || 0) * 3600 + (values.minute || 0) * 60 + (values.second || 0);
        const wanted = Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3] || 0);
        candidate = new Date(candidate.getTime() + (wanted - displayed) * 1000);
      }
      return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(candidate);
    };
    return `${t('start.working_hours')}: ${formatTime(settings.openingTime)} - ${formatTime(settings.closingTime)}`;
  };

  return (
    <div className="starting-container">
      {/* Top VIP Banner */}
      <div className="vip-banner">
        <div className="vip-top-row">
          <span className="vip-title"><i>{vipLevel}</i></span>
          <span className="current-badge">{t('start.current')}</span>
        </div>
        <div className="vip-info">
          <p>{t('start.profit')} {profitPct}%</p>
          <p>{t('start.application')} {dailyOrderVolume}</p>
        </div>
        <div className="vip-logo-badge">N</div>
      </div>

      {/* Notification / Announcement Bar */}
      <div className="notification-bar">
        <span className="speaker-icon"><i className="fa-solid fa-bullhorn"></i></span>
        <div className="welcome-container">
          <span className="welcome-text-moving">{t('start.welcome')}</span>
        </div>
      </div>

      {/* Commission Details Section */}
      <div className="section-title-box">
        <span className="blue-dash"><i className="fa-solid fa-bolt"></i></span>
        <h3>{t('start.commission_details')}</h3>
      </div>

      {/* Dashboard Grid / Cards */}
      <div className="dashboard-grid">
        {/* Left Big Card (Today's Profit) */}
        <div className="profit-card">
          <span className="card-label">{t('start.today_profit')}</span>
          <h2 className="card-value">{todayProfit.toFixed(2)}</h2>
        </div>

        {/* Right Stacked Cards */}
        <div className="right-stack-cards">
          <div className="balance-card">
            <span className="card-label">{t('start.account_balance')}</span>
            <h2 className="card-value">{accountBalance.toFixed(2)}</h2>
          </div>
          <div className="starting-count-card">
            <span className="card-label">{t('start.starting')}</span>
            <h2 className="card-value">({taskStatus} / {dailyOrderVolume})</h2>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="notice-box">
        <h4>{t('start.important_notice')}</h4>
        <p>{formatSystemWindowForUser(settings)}</p>
        <p>{t('start.contact_line')}</p>
      </div>

      {/* Bottom Fixed Blue Start Button */}
      <div className="bottom-btn-wrapper">
        <button className="start-btn" onClick={handleStartClick} disabled={working}>
          {working ? t('start.processing') : t('start.start')}
        </button>
      </div>

      {/* Product Popup (assigned by Start) */}
      {currentOrder && showProduct && (
        <div className="popup-overlay">
          <div className="popup-box product-popup-box">
            <div className="popup-title">{t('start.order_product')}</div>
            <div className="product-image-wrap product-popup-image">
              {currentOrder.productPicture ? (
                <img src={currentOrder.productPicture} alt={currentOrder.productName} className="product-image" />
              ) : (
                <div className="product-image product-image-placeholder">N</div>
              )}
            </div>
            <div className="popup-product-name">{currentOrder.productName}</div>
            <div className="popup-product-meta">{t('start.rating')} {Number(currentOrder.productRating || 0)}</div>
            <div className="popup-product-meta">{t('start.price')} {Number(currentOrder.unitPrice || 0).toFixed(2)}</div>
            <div className="popup-product-meta">{t('start.commission')} {Number(currentOrder.commission || 0).toFixed(2)}</div>
            <button
              className="popup-btn product-start-btn"
              onClick={handleOrderDone}
              disabled={working || insufficientBalance}
            >
              {insufficientBalance ? 'Insufficient Balance' : working ? t('start.processing') : t('start.start')}
            </button>
          </div>
        </div>
      )}

      {/* Popup */}
      {popup && (
        <div className="popup-overlay" onClick={() => setPopup(null)}>
          <div className="popup-box">
            <div className={`popup-icon ${popup.type === 'success' ? 'popup-icon-success' : 'popup-icon-error'}`}>
              <i className={popup.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
            </div>
            <div className={`popup-title ${popup.type === 'success' ? 'popup-title-success' : 'popup-title-error'}`}>
              {popup.type === 'success' ? t('common.success') : t('common.error')}
            </div>
            <p className="popup-message">{popup.message}</p>
            <button className="popup-btn" onClick={() => setPopup(null)}>
              {t('common.ok')}
            </button>
          </div>
        </div>
      )}

      {/* Order Window Display */}
      {orderWindow && (
        <div className="order-window">
          <div className="order-window-content">
            <span className="order-window-title">{t('start.order_window')}</span>
            <div className="order-window-times">
              {orderWindow.map((time, index) => (
                <div key={index} className="order-window-time">
                  {time}
                </div>
              ))}
            </div>
            <button className="popup-btn" onClick={() => setOrderWindow('')}>
              {t('common.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Starting;