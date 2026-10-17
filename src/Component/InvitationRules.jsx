import React from 'react';
import './InfoPages.css';
import { useLanguage } from '../LanguageContext';

const InvitationRules = () => {
  const { t } = useLanguage();
  return (
    <div className="info-page-container">
      <div className="info-header">
        <span className="back-arrow"><i className="fa-solid fa-chevron-left"></i></span>
        <h2>{t('ir.title')}</h2>
        <span className="empty-space"></span>
      </div>
      <div className="info-content serif-text">
        <p>{t('ir.p1')}</p>
        <p className="notice-title">{t('ir.notice')}</p>
        <p>{t('ir.p2')}</p>
      </div>
    </div>
  );
};

export default InvitationRules;