import { useState } from 'react';
import css from './index.module.css';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errId, setErrId] = useState('');
  const [errPassword, setErrPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const validateId = value => {
    if (!value) {
      setErrId('');
      return;
    }
    if (!/^[a-zA-Z0-9]{4,}$/.test(value)) {
      setErrId('4자 이상의 영문자 또는 숫자를 입력해주세요.');
    } else {
      setErrId('');
    }
  };

  const validatePassword = value => {
    if (!value) {
      setErrPassword('');
      return;
    }

    if (value.length < 4) {
      setErrPassword('4자 이상 입력해주세요.');
    } else {
      setErrPassword('');
    }
  };

  const handleIdChange = e => {
    const value = e.target.value;
    setId(value);
    validateId(value);
  };

  const handlePasswordChange = e => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const login = async e => {
    e.preventDefault();
    console.log('로그인');
  };

  return (
    <main className={css.loginPage}>
      <div className={css.wrapper}>
        <h2>로그인</h2>
        <form className={css.loginForm} onSubmit={login}>
          <div className={css.inputGroup}>
            <div className={css.inputWithIcon}>
              <input type="text" placeholder="아이디" value={id} onChange={handleIdChange} />
            </div>
            <strong>{errId}</strong>
          </div>

          <div className={css.inputGroup}>
            <div className={css.inputWithIcon}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                value={password}
                onChange={handlePasswordChange}
              />
              <i
                className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${css.eyeIcon}`}
                onClick={() => setShowPassword(prev => !prev)}
              />
            </div>
            <strong>{errPassword}</strong>
          </div>

          <button type="submit">로그인</button>
        </form>
      </div>
    </main>
  );
}
