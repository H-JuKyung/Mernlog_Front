import css from './header.module.css';
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '@/store/userSlice';
import { getUserProfile, logoutUser } from '@/apis/userApi';

export default function Header() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const userId = user?.userId;
  console.log(userId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserProfile();
        if (userData) {
          dispatch(setUserInfo(userData));
        }
      } catch (err) {
        console.log(err);
        dispatch(setUserInfo(''));
      } finally {
        setIsLoading(false);
      }
    };
    getProfile();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(setUserInfo(''));
      setIsMenuActive(false);
    } catch (err) {
      console.log('프로필 조회 실패:', err);
      // 401 에러는 로그인 필요 상태이므로 정상 처리
      dispatch(setUserInfo(''));
    }
  };

  // 로딩 중일 때는 메뉴 표시하지 않음
  if (isLoading) {
    return (
      <header className={css.header}>
        <div className={`container ${css.headerInner}`}>
          <h1>
            <Link to={'/'}>MERNLOG</Link>
          </h1>
          <div>로딩 중...</div>
        </div>
      </header>
    );
  }

  const toggleMenu = () => {
    setIsMenuActive(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuActive(false);
  };

  // 배경 영역(gnbCon)만 클릭 시 닫히도록 하는 핸들러
  const handleBackgroundClick = e => {
    // 클릭된 요소가 css.gnbCon 클래스를 가진 요소와 동일할 때만 closeMenu 실행
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  // gnb 영역 클릭 시 이벤트 전파 중단
  const handleGnbClick = e => {
    e.stopPropagation();
  };

  return (
    <header className={css.header}>
      <div className={`container ${css.headerInner}`}>
        <h1>
          <Link to={'/'}>MERNLOG</Link>
        </h1>
        {isMobile ? (
          <>
            {!isMenuActive && <Hamburger toggleMenu={toggleMenu} isMenuActive={isMenuActive} />}
            <nav
              className={`${css.gnbCon} ${isMenuActive ? css.active : ''}`}
              onClick={handleBackgroundClick}
            >
              <div className={css.gnb} onClick={handleGnbClick}>
                <button className={css.closeBtn} onClick={closeMenu}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
                {userId ? (
                  <>
                    <MenuLink to="/createPost" label="글쓰기" closeMenu={closeMenu} />
                    <MenuLink to="/mypage" label={`마이페이지(${userId})`} closeMenu={closeMenu} />
                    <button onClick={handleLogout}>로그아웃</button>
                  </>
                ) : (
                  <>
                    <MenuLink to="/register" label="회원가입" closeMenu={closeMenu} />
                    <MenuLink to="/login" label="로그인" closeMenu={closeMenu} />
                  </>
                )}
              </div>
            </nav>
          </>
        ) : (
          <div className={css.desktopMenu}>
            {userId ? (
              <>
                <MenuLink to="/createPost" label="글쓰기" closeMenu={closeMenu} />
                <MenuLink
                  to="/userpage/${userId}"
                  label={`마이페이지(${userId})`}
                  closeMenu={closeMenu}
                />
                <button onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <>
                <MenuLink to="/register" label="회원가입" closeMenu={closeMenu} />
                <MenuLink to="/login" label="로그인" closeMenu={closeMenu} />
              </>
            )}
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
    <i className="fa-solid fa-bars"></i>
  </button>
);
