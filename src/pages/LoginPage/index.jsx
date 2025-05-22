import { useState } from 'react';
import css from './index.module.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className={css.loginPage}>
      <div className={css.wrapper}>
        <h2>로그인</h2>
        <form className={css.loginForm}>
          <div className={css.inputGroup}>
            <input type="text" placeholder="아이디" />
            <strong>에러메세지</strong>
          </div>

          <div className={css.inputGroup}>
            <input type={showPassword ? 'text' : 'password'} placeholder="비밀번호" />
            <i
              className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${css.eyeIcon}`}
              onClick={() => setShowPassword(prev => !prev)}
            />
            <strong>에러메세지</strong>
          </div>

          <button type="submit">로그인</button>
        </form>
      </div>
    </main>
  );
}
