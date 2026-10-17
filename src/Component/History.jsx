import React, { useState, useEffect, useCallback } from 'react';
import './History.css';
import { API_URL, getCookie, apiError } from '../api';
import { useLanguage } from '../LanguageContext';

const History = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState(null);

  const token = getCookie('token');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => null);
      setOrders(json && json.success ? json.data : []);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const isPending = (o) => o.transactionStatus !== 'Complete payment';
  const statusLabel = (o) => (isPending(o) ? t('history.pending') : t('history.completed'));

  const filteredData = orders.filter((o) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return isPending(o);
    if (activeTab === 'Completed') return !isPending(o);
    return true;
  });

  const submitOrder = async (id) => {
    setBusyId(id);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => null);
      if (json && json.success) {
        setMsg({ ok: true, text: t('history.order_submitted') });
        await fetchOrders();
      } else {
        setMsg({ ok: false, text: apiError(res, json) });
      }
    } catch (e) {
      setMsg({ ok: false, text: t('common.unable_server') });
    } finally {
      setBusyId(null);
    }
  };

  const profitPct = (o) => {
    const price = Number(o.unitPrice) || 0;
    const comm = Number(o.commission) || 0;
    if (price <= 0) return '0.00%';
    return `${((comm / price) * 100).toFixed(2)}%`;
  };

  return (
    <div className="history-container">
      {/* Top Filter Tabs */}
      <div className="history-tabs-wrapper">
        <div className="history-tabs">
          <button
            className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => setActiveTab('All')}
          >
            {t('common.all')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'Pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('Pending')}
          >
            {t('history.pending')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'Completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('Completed')}
          >
            {t('history.completed')}
          </button>
        </div>
      </div>

      {msg && (
        <div className={`history-msg ${msg.ok ? 'history-msg-ok' : 'history-msg-err'}`} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      {/* History Items List */}
      <div className="history-list">
        {loading ? (
          <div className="no-data">{t('common.loading')}</div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div className="history-card" key={item._id}>
              {/* Card Header: Timestamp & Status */}
              <div className="card-top-row">
                <span className="history-date">{item.orderTime || item.settlementTime}</span>
                <span className={`history-status ${isPending(item) ? 'history-status--pending' : 'history-status--done'}`}>
                  {statusLabel(item)}
                </span>
              </div>

              {/* Card Body: Image & Details */}
              <div className="card-body-row">
                <div className="hotel-img-box">
                  {item.productPicture ? (
                    <img src={item.productPicture} alt={item.productName} />
                  ) : (
                    <div className="hotel-img-placeholder">N</div>
                  )}
                </div>
                <div className="hotel-info">
                  <h4 className="hotel-title">{item.productName}</h4>
                  <p className="info-text">{t('history.total_amount')} <span className="value-num">{Number(item.transactionAmount || 0).toFixed(2)}</span></p>
                  <p className="info-text">{t('history.profit')} <span className="value-num">{Number(item.commission || 0).toFixed(2)}/{profitPct(item)}</span></p>
                  <p className="info-text">{t('history.volume')} <span className="value-num">{item.transactionVolume}</span></p>
                </div>
              </div>

              {/* Pending orders show Submit button */}
              {isPending(item) && (
                <div className="card-action-row">
                  <button
                    className="submit-btn"
                    onClick={() => submitOrder(item._id)}
                    disabled={busyId === item._id}
                  >
                    {busyId === item._id ? t('common.submitting') : t('common.submit')}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-data">{t('history.no_records')}</div>
        )}
      </div>
    </div>
  );
};

export default History;