import React from 'react';
import './InfoPages.css';
import { useLanguage } from '../LanguageContext';

const Faq = () => {
  const { t } = useLanguage();
  return (
    <div className="info-page-container">
      <div className="info-header">
        <span className="back-arrow"><i className="fa-solid fa-chevron-left"></i></span>
        <h2>{t('faq.title')}</h2>
        <span className="empty-space"></span>
      </div>
      <div className="info-content serif-text">
        <p className="section-heading">{t('faq.important_reminder')}</p>
        <p>{t('faq.reminder_text')}</p>

        <p className="section-heading">{t('faq.deposit_heading')}</p>
        <p>{t('faq.deposit_text')}</p>

        <p className="section-heading">{t('faq.withdraw_heading')}</p>
        <p>{t('faq.withdraw_text')}</p>

        <p className="note-text">{t('faq.note')}</p>
      </div>
    </div>
  );
};

export default Faq;