import { useState } from 'react';
import css from './index.module.css';

export default function RegisterPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordOk, setPasswordOk] = useState('');
  const [errId, setErrId] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [errPasswordOk, setErrPasswordOk] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validatePasswordCheck = (value, current = password) => {
    if (!value) {
      setErrPasswordOk('');
      return;
    }

    if (value !== current) {
      setErrPasswordOk('패스워드가 일치하지 않습니다.');
    } else {
      setErrPasswordOk('');
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
  const handlePasswordOkChange = e => {
    const value = e.target.value;
    setPasswordOk(value);
    validatePasswordCheck(value);
  };

  const register = async e => {
    e.preventDefault();
    console.log('register');
  };

  return (
    <main className={css.registerPage}>
      <div className={css.wrapper}>
        <h2>회원가입</h2>
        <form className={css.registerForm} onSubmit={register}>
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

          <div className={css.inputGroup}>
            <div className={css.inputWithIcon}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                value={passwordOk}
                onChange={handlePasswordOkChange}
              />
              <i
                className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} ${css.eyeIcon}`}
                onClick={() => setShowConfirmPassword(prev => !prev)}
              />
            </div>
            <strong>{errPasswordOk}</strong>
          </div>

          <button type="submit">가입하기</button>
        </form>
      </div>
    </main>
  );
}
