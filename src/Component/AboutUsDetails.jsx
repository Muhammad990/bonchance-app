import React from 'react';
import './InfoPages.css';
import { useLanguage } from '../LanguageContext';

const AboutUsDetails = () => {
  const { t } = useLanguage();
  return (
    <div className="info-page-container">
      <div className="info-header">
        <span className="back-arrow"><i className="fa-solid fa-chevron-left"></i></span>
        <h2>{t('ad.title')}</h2>
        <span className="empty-space"></span>
      </div>
      <div className="info-content serif-text">
        <p>{t('ad.intro')}</p>

        <p className="section-heading">{t('ad.h_agreement')}</p>
        <p>{t('ad.p1')}</p>
        <p>{t('ad.p2')}</p>
        <p>{t('ad.p3')}</p>

        <p className="section-heading">{t('ad.h_relationships')}</p>
        <p>{t('ad.p4')}</p>
        <p>{t('ad.p5')}</p>

        <p className="section-heading">{t('ad.h_deliverables')}</p>
        <p>{t('ad.p6')}</p>

        <p className="section-heading">{t('ad.h_statement')}</p>
        <p>{t('ad.p7')}</p>
        <p>{t('ad.p8')}</p>
        <p>{t('ad.p9')}</p>
        <p>{t('ad.p10')}</p>
        <p>{t('ad.p11')}</p>
        <p>{t('ad.p12')}</p>

        <p className="section-heading">{t('ad.h_term')}</p>
        <p>{t('ad.p13')}</p>
        <p>{t('ad.p14')}</p>
        <p>{t('ad.p15')}</p>
        <p>{t('ad.p16')}</p>
        <p>{t('ad.p17')}</p>
        <p>{t('ad.p18')}</p>
        <p>{t('ad.p19')}</p>
        <p>{t('ad.p20')}</p>

        <p className="section-heading">{t('ad.h_consequences')}</p>
        <p>{t('ad.p21')}</p>
        <p>{t('ad.p22')}</p>
        <p>{t('ad.p23')}</p>

        <p className="section-heading">{t('ad.h_payment')}</p>
        <p className="section-heading">{t('ad.h_payment_method')}</p>
        <p>{t('ad.p24')}</p>
        <p>{t('ad.p25')}</p>

        <p className="section-heading">{t('ad.h_currency')}</p>
        <p>{t('ad.p26')}</p>

        <p className="section-heading">{t('ad.h_prepay')}</p>
        <p>{t('ad.p27')}</p>

        <p className="section-heading">{t('ad.h_nofees')}</p>
        <p>{t('ad.p28')}</p>

        <p className="section-heading">{t('ad.h_tax')}</p>
        <p>{t('ad.p29')}</p>
        <p>{t('ad.p30')}</p>
      </div>
    </div>
  );
};

export default AboutUsDetails;
