import React from 'react';
import { useLanguage } from '../LanguageContext';
import './Services.css';

const Services = () => {
  const { t } = useLanguage();
  const handleServiceClick = (serviceName) => {
    console.log(`${serviceName} clicked`);
  };

  return (
    <div className="services-container">
      {/* Title */}
      <h2 className="services-main-title">
        {t('sv.online')}<br />{t('sv.customer')}<br />{t('sv.services')}
      </h2>

      {/* Services List */}
      <div className="services-list">
        {/* Tawk Card */}
        <div className="service-card" onClick={() => handleServiceClick('Tawk')}>
          <div className="service-left">
            <div className="service-icon-box">
              <i className="fa-solid fa-headset"></i>
            </div>
            <span className="service-name">Tawk</span>
          </div>
          <button className="service-arrow-btn">
            <a href='https://t.me/TUIcustomerservice' target='_blank' rel='noreferrer'><i className="fa-solid fa-arrow-right"></i></a>
          </button>
        </div>

        {/* Telegram Card */}
        <div className="service-card" onClick={() => handleServiceClick('Telegram')}>
          <div className="service-left">
            <div className="service-icon-box">
              <i className="fa-solid fa-headset"></i>
            </div>
            <span className="service-name">Telegram</span>
          </div>
          <button className="service-arrow-btn">
           <a href='https://t.me/TUIcustomerservice' target='_blank' rel='noreferrer'><i className="fa-solid fa-arrow-right"></i></a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;