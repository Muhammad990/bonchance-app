import React from 'react';
import './InfoPages.css';
import { useLanguage } from '../LanguageContext';

const VipRules = () => {
  const { t } = useLanguage();
  return (
    <div className="info-page-container">
      <div className="info-header">
        <span className="back-arrow"><i className="fa-solid fa-chevron-left"></i></span>
        <h2>{t('vr.title')}</h2>
        <span className="empty-space"></span>
      </div>
      <div className="info-content serif-text">
        <p>{t('vr.p1')}</p>
        <p>{t('vr.p2')}</p>
        <p>{t('vr.p3')}</p>
        <p>{t('vr.p4')}</p>
      </div>
    </div>
  );
};

export default VipRules;