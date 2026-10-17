import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WithdrawHistory.css';
import { API_URL, getCookie } from '../api';
import { useLanguage } from '../LanguageContext';
import { statusLabel } from '../i18n';

const WithdrawHistory = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const token = getCookie('token');
        const res = await fetch(`${API_URL}/api/withdrawal-orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json().catch(() => null);
        if (alive && res.ok && json && json.success) {
          setItems(Array.isArray(json.data) ? json.data : []);
        }
      } catch (e) {
        // keep empty list
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="withdraw-history-page">
      <div className="withdraw-history-page-header">
        <span className="back-arrow" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-chevron-left"></i>
        </span>
        <h2>{t('wh.title')}</h2>
        <span className="page-header-spacer"></span>
      </div>

      <div className="withdraw-history-page-list">
        {loading ? (
          <div className="withdraw-history-page-empty">{t('common.loading')}</div>
        ) : items.length === 0 ? (
          <div className="withdraw-history-page-empty">{t('wh.empty')}</div>
        ) : (
          items.map((o) => (
            <div className="withdraw-history-page-row" key={o._id}>
              <div className="withdraw-history-page-info">
                <div className="withdraw-history-page-amount">
                  -{Number(o.withdrawalAmount || 0).toFixed(2)}
                </div>
                <div className="withdraw-history-page-date">{o.creationTime}</div>
              </div>
              <span
                className={`withdraw-history-page-state ${
                  String(o.state || '').toLowerCase() === 'approved'
                    ? 'state-approved'
                    : String(o.state || '').toLowerCase() === 'rejected'
                    ? 'state-rejected'
                    : 'state-pending'
                }`}
              >
                {statusLabel(lang, o.state)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WithdrawHistory;
