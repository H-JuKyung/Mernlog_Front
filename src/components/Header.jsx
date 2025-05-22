import { Link, NavLink } from 'react-router-dom';
import css from './header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      <h1>
        <Link to={'/'}>MERNLOG</Link>
      </h1>
      <nav className={css.gnbCon}>
        <div className={css.gnb}>
          <NavLink to={'/register'}>회원가입</NavLink>
          <NavLink to={'/login'}>로그인</NavLink>
        </div>
      </nav>
    </header>
  );
}
