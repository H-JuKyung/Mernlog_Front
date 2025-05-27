import css from './header.module.css';
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '@/store/userSlice';
import { getUserProfile, logoutUser } from '@/apis/userApi';

export default function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const userId = user?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserProfile();
        dispatch(setUserInfo(userData || ''));
      } catch {
        dispatch(setUserInfo(''));
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(setUserInfo(''));
      navigate('/', { replace: true });
    } catch {
      dispatch(setUserInfo(''));
    }
  };

  const handleProtectedClick = path => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  if (isLoading) {
    return (
      <header className={`${css.header} ${scrolled ? css.scrolled : ''}`}>
        <div className={`container ${css.headerInner}`}>
          <h1>
            <Link to={'/'}>MERNLOG</Link>
          </h1>
          <div>로딩 중...</div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`${css.header} ${scrolled ? css.scrolled : ''}`}>
        <div className={`container ${css.headerInner}`}>
          <h1>
            <Link to="/">MERNLOG</Link>
          </h1>
          {isMobile ? (
            <div className={css.mobileTopRight}>
              {userId ? (
                <button onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              ) : (
                <>
                  <NavLink to="/register">
                    <i className="fa-solid fa-user-plus"></i>
                  </NavLink>
                  <NavLink to="/login">
                    <i className="fa-solid fa-right-to-bracket"></i>
                  </NavLink>
                </>
              )}
            </div>
          ) : (
            <nav className={css.desktopMenu}>
              {userId ? (
                <>
                  <MenuLink to="/createPost" icon="fa-solid fa-pen" label="글쓰기" />
                  <MenuLink to={`/userpage/${userId}`} icon="fa-solid fa-user" label="마이페이지" />
                  <button onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <MenuLink to="/register" icon="fa-solid fa-user-plus" label="회원가입" />
                  <MenuLink to="/login" icon="fa-solid fa-right-to-bracket" label="로그인" />
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {isMobile && (
        <nav className={css.mobileBottomNav}>
          <button onClick={() => handleProtectedClick('/createPost')}>
            <i className="fa-solid fa-pen"></i>
          </button>
          <button onClick={() => handleProtectedClick(`/userpage/${userId || ''}`)}>
            <i className="fa-solid fa-user"></i>
          </button>
        </nav>
      )}
    </>
  );
}

const MenuLink = ({ to, label, icon }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? css.active : '')}>
    {icon && <i className={`${icon}`}></i>}
    {label}
  </NavLink>
);
