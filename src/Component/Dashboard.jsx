import React, { useEffect } from 'react'
import Navbar from './Navbar'
import History from './History'
import Starting from './Starting'
import Services from './Services'
import MyProfile from './MyProfile'
import Home from './Home'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import DepositHistory from './DepositHistory'
import WithdrawHistory from './WithdrawHistory'
import WithdrawPage from './WidthrawPage'
import LoginPassword from './LoginPassword'
import SecurityPin from './SecurityPin'
import AboutUs from './Aboutus'
import InviteFriends from './InviteFriends'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useLanguage } from '../LanguageContext'

const Dashboard = ({ user, onLogout }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const standaloneRoutes = ['/deposit', '/deposit-history', '/withdraw', '/withdraw-history', '/withdrawal-account', '/login-password', '/security-pin', '/about-us', '/invite-friends'];
  const isStandalone = standaloneRoutes.includes(location.pathname);

  useEffect(() => {
    const PAGE_TITLES = {
      '/': t('page.home'),
      '/history': t('page.history'),
      '/starting': t('page.starting'),
      '/services': t('page.services'),
      '/my-profile': t('page.my_profile'),
      '/deposit': t('page.deposit'),
      '/deposit-history': t('page.deposit_history'),
      '/withdraw': t('page.withdraw'),
      '/withdraw-history': t('page.withdraw_history'),
      '/withdrawal-account': t('page.widthraw_page'),
      '/login-password': t('page.login_password'),
      '/security-pin': t('page.security_pin'),
      '/about-us': t('page.about_us'),
      '/invite-friends': t('page.invite_friends'),
    };
    document.title = PAGE_TITLES[location.pathname] || t('page.home');
  }, [location.pathname, t]);

  return (
    <>
    {!isStandalone && <Navbar/>}
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/history" element={<History/>} />
      <Route path="/starting" element={<Starting/>} />
      <Route path="/services" element={<Services/>} />
      <Route path="/my-profile" element={<MyProfile user={user} onLogout={onLogout} />} />
      <Route path="/deposit" element={<Deposit/>} />
      <Route path="/deposit-history" element={<DepositHistory/>} />
      <Route path="/withdraw" element={<Withdraw/>} />
      <Route path="/withdraw-history" element={<WithdrawHistory/>} />
      <Route path="/withdrawal-account" element={<WithdrawPage/>} />
      <Route path="/login-password" element={<LoginPassword/>} />
      <Route path="/security-pin" element={<SecurityPin/>} />
      <Route path="/about-us" element={<AboutUs/>} />
      <Route path="/invite-friends" element={<InviteFriends user={user}/>} />
    </Routes>
    </>
  )
}

export default Dashboard