import css from './index.module.css';
import { useState, useEffect } from 'react';
import { loginUser } from '@/apis/userApi';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/store/userSlice';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errId, setErrId] = useState('');
  const [errPassword, setErrPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [loginStatus, setLoginStatus] = useState(''); // 로그인 상태
  const [redirect, setRedirect] = useState(false); // 로그인 상태 메시지

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    setLoginStatus('');
    validateId(id);
    validatePassword(password);

    if (errId || errPassword || !id || !password) {
      setLoginStatus('아이디와 패스워드를 확인하세요.');
      return;
    }
    try {
      const userData = await loginUser({ id, password });

      if (userData) {
        setLoginStatus('로그인 성공');

        dispatch(setUserInfo(userData));

        setTimeout(() => {
          setRedirect(true);
        }, 500);
      } else {
        setLoginStatus('사용자가 없습니다');
      }
    } catch (err) {
      console.error('로그인 오류---', err);
      return;
    } finally {
      setLoginStatus(false);
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate('/');
    }
  }, [redirect, navigate]);

  return (
    <main className={css.loginPage}>
      <div className={css.wrapper}>
        <h2>로그인</h2>
        {loginStatus && <strong>{loginStatus}</strong>}
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
