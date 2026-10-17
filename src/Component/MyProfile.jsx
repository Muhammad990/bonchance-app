import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css';
import { deleteCookie } from '../api';
import { useLanguage } from '../LanguageContext';
import img from './avatar.png'

const MyProfile = ({ user = {}, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const dailyOrderVolume = user.dailyOrderVolume || 30;
  // Menu items data
  const menuItems = [
    {
      id: 'deposit',
      label: t('page.deposit'),
      path: '/deposit',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
    },
    {
      id: 'withdraw',
      label: t('page.withdraw'),
      path: '/withdraw',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      ),
    },
    {
      id: 'withdrawal-account',
      label: t('page.withdrawal_account'),
      path: '/withdrawal-account',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      ),
    },
    {
      id: 'login-password',
      label: t('page.login_password'),
      path: '/login-password',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      ),
    },
    {
      id: 'security-pin',
      label: t('page.security_pin'),
      path: '/security-pin',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
    },
    {
      id: 'about-us',
      label: t('page.about_us'),
      path: '/about-us',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      ),
    },
  ];

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  const handleLogout = () => {
    deleteCookie('token');
    if (onLogout) onLogout();
  };

  return (
    <div className="my-profile">
      <div className="my-profile__container">
        {/* ===== Top: User Profile Header ===== */}
        <div className="my-profile__user">
          <img
            src={img}
            alt="User Avatar"
            className="my-profile__avatar"
          />
          <div className="my-profile__user-info">
            <div className="my-profile__username">{user.nickname || t('mp.user')}</div>
            <div className="my-profile__user-meta">{t('mp.invitation_code')}：{user.invitationCode || '-'}</div>
            <div className="my-profile__user-meta">{t('mp.credit_reputation')}：{Number(user.creditScore || 0)}%</div>
          </div>
        </div>

        {/* ===== Stats Cards Section ===== */}
        <div className="my-profile__cards">
          <div className="my-profile__top-row">
            {/* Today's Profit - left big card */}
            <div className="my-profile__profit-card">
              <div className="my-profile__card-label">{t('mp.today_profit')}</div>
              <div className="my-profile__card-value">{Number(user.todayProfit || 0).toFixed(2)}</div>
            </div>

            {/* Right column with two stacked cards */}
            <div className="my-profile__right-column">
              <div className="my-profile__balance-card">
                <div className="my-profile__card-label">{t('mp.account_balance')}</div>
                <div className="my-profile__card-value">{Number(user.availableFunds || 0).toFixed(2)}</div>
              </div>
              <div className="my-profile__orders-card">
                <div className="my-profile__card-label">{t('mp.orders_count')}</div>
                <div className="my-profile__card-value">({Number(user.taskStatus || 0)} / {dailyOrderVolume})</div>
              </div>
            </div>
          </div>

          {/* Invite Friends Card */}
          <div className="my-profile__invite-card" onClick={() => navigate('/invite-friends')}>
            <div className="my-profile__invite-text">
              <div className="my-profile__invite-title">{t('mp.invite_friends')}</div>
              <div className="my-profile__invite-subtitle">{t('mp.invite_subtitle')}</div>
            </div>
            <div className="my-profile__invite-decoration">
              <svg className="my-profile__gift-icon" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 40 Q10 20 30 20 L70 20 Q90 20 90 40 L90 65 Q90 75 80 75 L20 75 Q10 75 10 65 Z" fill="#FF69B4" />
                <rect x="42" y="20" width="16" height="55" rx="2" fill="#FF1493" />
                <ellipse cx="50" cy="20" rx="38" ry="12" fill="#FFB6C1" />
                <path d="M50 8 Q35 8 35 20 Q35 28 50 28 Q65 28 65 20 Q65 8 50 8Z" fill="#FF1493" />
                <circle cx="50" cy="52" r="8" fill="white" opacity="0.9" />
                <circle cx="50" cy="52" r="4" fill="#FF69B4" />
              </svg>
              <div className="my-profile__confetti my-profile__confetti--1"></div>
              <div className="my-profile__confetti my-profile__confetti--2"></div>
              <div className="my-profile__confetti my-profile__confetti--3"></div>
              <div className="my-profile__confetti my-profile__confetti--4"></div>
            </div>
          </div>
        </div>

        {/* ===== Settings Menu List ===== */}
        <ul className="my-profile__menu-list">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="my-profile__menu-item"
              onClick={() => handleMenuClick(item)}
            >
              <div className="my-profile__menu-left">
                <div className="my-profile__menu-icon">{item.icon}</div>
                <span className="my-profile__menu-text">{item.label}</span>
              </div>
              <div className="my-profile__menu-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </li>
          ))}
        </ul>

        {/* ===== Logout Button ===== */}
        <div className="my-profile__logout-container">
          <button className="my-profile__logout-btn" onClick={() => setLogoutConfirm(true)}>
            {t('mp.logout')}
          </button>
        </div>

        {/* ===== Logout Confirm Popup ===== */}
        {logoutConfirm && (
          <div className="my-profile__popup-overlay" onClick={() => setLogoutConfirm(false)}>
            <div className="my-profile__popup-box" onClick={(e) => e.stopPropagation()}>
              <div className="my-profile__popup-icon">
                <i className="fa-solid fa-right-from-bracket"></i>
              </div>
              <div className="my-profile__popup-title">{t('mp.logout')}</div>
              <p className="my-profile__popup-text">
                {t('mp.logout_confirm')}
              </p>
              <div className="my-profile__popup-actions">
                <button
                  className="my-profile__popup-btn my-profile__popup-cancel"
                  onClick={() => setLogoutConfirm(false)}
                >
                  {t('common.cancel')}
                </button>
                <button
                  className="my-profile__popup-btn my-profile__popup-confirm"
                  onClick={handleLogout}
                >
                  {t('common.confirm')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== Footer ===== */}
        <div className="my-profile__footer">
          Copyright © 2023 Nativz All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default MyProfile;