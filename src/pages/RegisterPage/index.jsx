import { useState } from 'react';
import css from './index.module.css';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className={css.registerPage}>
      <div className={css.wrapper}>
        <h2>회원가입</h2>
        <form className={css.registerForm}>
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

          <div className={css.inputGroup}>
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="비밀번호 확인" />
            <i
              className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} ${css.eyeIcon}`}
              onClick={() => setShowConfirmPassword(prev => !prev)}
            />
            <strong>에러메세지</strong>
          </div>

          <button type="submit">가입하기</button>
        </form>
      </div>
    </main>
  );
}
