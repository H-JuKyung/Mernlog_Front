import css from './index.module.css';
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/store/userSlice';
import { loginUser } from '@/apis/userApi';
import KakaoLoginButton from '@/components/KakaoLoginButton';

export default function LoginPage() {
  const [form, setForm] = useState({ userId: '', password: '' });
  const [errors, setErrors] = useState({ userId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = useCallback((field, value) => {
    switch (field) {
      case 'userId':
        return !value
          ? '아이디를 입력해주세요.'
          : /^[a-zA-Z0-9]{4,20}$/.test(value)
            ? ''
            : '아이디는 4~20자의 영문자와 숫자로 입력해주세요.';
      case 'password':
        return !value
          ? '비밀번호를 입력해주세요.'
          : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/.test(value)
            ? ''
            : '비밀번호는 8자 이상, 영문자, 숫자, 특수문자를 모두 포함해주세요.';
      default:
        return '';
    }
  }, []);

  const handleChange = useCallback(
    e => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    },
    [validate]
  );

  const isFormValid = useMemo(
    () => Object.values(errors).every(err => !err) && Object.values(form).every(val => val),
    [errors, form]
  );

  const handleLogin = async e => {
    e.preventDefault();
    const newErrors = {
      userId: validate('userId', form.userId),
      password: validate('password', form.password),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err) || !isFormValid) {
      alert('아이디와 비밀번호를 확인하세요.');
      return;
    }

    try {
      const userData = await loginUser(form);
      if (userData) {
        alert('로그인 성공');
        dispatch(setUserInfo(userData));
        setTimeout(() => navigate('/'), 500);
      } else {
        alert('사용자가 없습니다');
      }
    } catch (err) {
      console.error('로그인 오류---', err);
      alert('로그인 실패');
    }
  };

  return (
    <main className={css.loginPage}>
      <div className={css.wrapper}>
        <h2>로그인</h2>
        <div className={css.loginContainer}>
          <form className={css.loginForm} onSubmit={handleLogin}>
            {['userId', 'password'].map(field => (
              <div className={css.inputGroup} key={field}>
                <div className={css.inputWithIcon}>
                  <input
                    type={field === 'password' && !showPassword ? 'password' : 'text'}
                    placeholder={field === 'userId' ? '아이디' : '비밀번호'}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                  />
                  {field === 'password' && (
                    <i
                      className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${css.eyeIcon}`}
                      onClick={() => setShowPassword(prev => !prev)}
                    />
                  )}
                </div>
                <strong>{errors[field]}</strong>
              </div>
            ))}

            <button type="submit">로그인</button>
          </form>
          <div className={css.socialLogin}>
            <p>소셜 계정으로 로그인</p>
            <KakaoLoginButton />
          </div>
        </div>
      </div>
    </main>
  );
}
