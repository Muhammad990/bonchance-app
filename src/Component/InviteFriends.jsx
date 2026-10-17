import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shareBg from './share_bg.png';
import './InviteFriends.css';
import { useLanguage } from '../LanguageContext';

const InviteFriends = ({ onBack, user }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleInviteClick = async () => {
    const code = (user && user.invitationCode) || '';
    const link = `${window.location.origin}/register?invite=${encodeURIComponent(code)}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const el = document.createElement('textarea');
        el.value = link;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      window.clearTimeout(handleInviteClick._t);
      handleInviteClick._t = window.setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      window.prompt(t('ifr.copy_prompt'), link);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="invite-container">
      {/* Header */}
      <div className="invite-header">
        {/* onBack prop ke zariye pichle page par ja sakte hain */}
        <span className="back-arrow" onClick={handleBack}><i className="fa-solid fa-chevron-left"></i></span>
        <h2>{t('ifr.title')}</h2>
        <span className="empty-space"></span>
      </div>

      {/* Main Content Area */}
      <div className="invite-content">
        <div className="image-card-wrapper">
          <img src={shareBg} alt="Invite Background" className="invite-bg-image" />
        </div>

        {/* Bottom Blue Button */}
        <button className="invite-btn" onClick={handleInviteClick}>
          {t('ifr.title')}
        </button>

        {copied && <div className="invite-copied-toast">{t('ifr.link_copied')}</div>}
      </div>
    </div>
  );
};

export default InviteFriends;