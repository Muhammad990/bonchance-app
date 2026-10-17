import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import "./Navbar.css";

const Navbar = () => {
  const { t } = useLanguage();
  const navItems = [
    { icon: "fa-regular fa-house", label: t('navbar.home'), path: "/" },
    { icon: "fa-solid fa-clock-rotate-left", label: t('navbar.history'), path: "/history" },
    { icon: "fa-solid fa-boxes-stacked", label: t('navbar.starting'), path: "/starting" },
    { icon: "fa-solid fa-tty", label: t('navbar.services'), path: "/services" },
    { icon: "fa-solid fa-user", label: t('navbar.my_profile'), path: "/my-profile" },
  ];

  return (
    <div className='main_navbar'>
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) => `inner_container ${isActive ? 'active' : ''}`}
        >
          <div><i className={item.icon}></i></div>
          <div><span>{item.label}</span></div>
        </NavLink>
      ))}
    </div>
  );
}

export default Navbar;