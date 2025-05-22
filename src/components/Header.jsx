import { Link, NavLink } from 'react-router-dom';
import css from './header.module.css';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleMenu = () => {
    setIsMenuActive(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuActive(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={css.header}>
      <div className={`container ${css.headerInner}`}>
        <h1>
          <Link to={'/'}>MERNLOG</Link>
        </h1>
        {isMobile ? (
          <>
            {!isMenuActive && <Hamburger toggleMenu={toggleMenu} />}
            <nav className={`${css.gnbCon} ${isMenuActive ? css.active : ''}`}>
              <div className={css.gnb}>
                <button className={css.closeBtn} onClick={closeMenu}>
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <MenuLink to="/register" label="회원가입" closeMenu={closeMenu} />
                <MenuLink to="/login" label="로그인" closeMenu={closeMenu} />
              </div>
            </nav>
          </>
        ) : (
          <div className={css.desktopMenu}>
            <MenuLink to="/register" label="회원가입" />
            <MenuLink to="/login" label="로그인" />
          </div>
        )}
      </div>
    </header>
  );
}

const MenuLink = ({ to, label, closeMenu }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? css.active : '')} onClick={closeMenu}>
    {label}
  </NavLink>
);

const Hamburger = ({ toggleMenu }) => (
  <button className={css.hamburger} onClick={toggleMenu}>
    <i class="fa-solid fa-bars"></i>
  </button>
);
