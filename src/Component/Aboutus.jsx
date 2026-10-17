import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Aboutus.css';
import InvitationRules from './InvitationRules';
import VipRules from './VipRules';
import Faq from './Faq';
import AboutUsDetails from './AboutUsDetails';
import { useLanguage } from '../LanguageContext';

const AboutUs = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activePage, setActivePage] = useState(null);

  const menuItems = [
    { title: t('page.invitation_rules'), component: 'invitation-rules' },
    { title: t('page.vip_rules'), component: 'vip-rules' },
    { title: t('page.faq'), component: 'faq' },
    { title: t('page.about_us_details'), component: 'about-us-details' }
  ];

  const pageMap = {
    'invitation-rules': InvitationRules,
    'vip-rules': VipRules,
    'faq': Faq,
    'about-us-details': AboutUsDetails
  };

  const handleItemClick = (component) => {
    setActivePage(component);
  };

  const handleContainerClick = (e) => {
    if (e.target.closest('.back-arrow')) {
      if (activePage) {
        setActivePage(null);
      } else {
        navigate(-1);
      }
    }
  };

  const ActivePage = activePage ? pageMap[activePage] : null;

  return (
    <div className="about-us-container" onClick={handleContainerClick}>
      {ActivePage ? (
        <ActivePage />
      ) : (
        <>
          {/* Header */}
          <div className="about-us-header">
            <span className="back-arrow"><i className="fa-solid fa-chevron-left"></i></span>
            <h2>{t('page.about_us')}</h2>
            <span className="empty-space"></span>
          </div>

          {/* Menu List */}
          <div className="menu-list">
            {menuItems.map((item, index) => (
              <div 
                key={index} 
                className="menu-item" 
                onClick={() => handleItemClick(item.component)}
              >
                <span className="menu-title">{item.title}</span>
                <span className="chevron-arrow">&gt;</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AboutUs;