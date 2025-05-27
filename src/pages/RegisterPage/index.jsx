import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './index.module.css';
import { registerUser } from '@/apis/userApi';
import KakaoLoginButton from '@/components/KakaoLoginButton';

export default function RegisterPage() {
  const [form, setForm] = useState({ userId: '', password: '', passwordOk: '' });
  const [errors, setErrors] = useState({ userId: '', password: '', passwordOk: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerState, setRegisterState] = useState('');

  const navigate = useNavigate();

  const validate = useCallback(
    (field, value, formValues = form) => {
      switch (field) {
        case 'userId':
          return !value
            ? ''
            : /^[a-zA-Z0-9]{4,}$/.test(value)
              ? ''
              : '4자 이상의 영문자 또는 숫자를 입력해주세요.';
        case 'password':
          return !value ? '' : value.length < 4 ? '4자 이상 입력해주세요.' : '';
        case 'passwordOk':
          return !value ? '' : value !== formValues.password ? '패스워드가 일치하지 않습니다.' : '';
        default:
          return '';
      }
    },
    [form]
  );

  const handleChange = useCallback(
    e => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: validate(name, value, { ...form, [name]: value }) }));
    },
    [validate, form]
  );

  const isFormValid = useMemo(
    () => Object.values(errors).every(error => !error) && Object.values(form).every(value => value),
    [errors, form]
  );

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {
      userId: validate('userId', form.userId),
      password: validate('password', form.password),
      passwordOk: validate('passwordOk', form.passwordOk),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err) || !isFormValid) return;

    try {
      setRegisterState('등록중');
      await registerUser({ userId: form.userId, password: form.password });
      setRegisterState('등록완료');
      navigate('/login');
    } catch (err) {
      setRegisterState('회원가입 실패');
      console.error('회원가입 오류', err.response?.data || err);
    }
  };

  return (
    <main className={css.registerPage}>
      <div className={css.wrapper}>
        <h2>회원가입</h2>
        {registerState && <strong>{registerState}</strong>}
        <form className={css.registerForm} onSubmit={handleSubmit}>
          {['userId', 'password', 'passwordOk'].map(field => (
            <div className={css.inputGroup} key={field}>
              <div className={css.inputWithIcon}>
                <input
                  type={
                    field === 'password'
                      ? showPassword
                        ? 'text'
                        : 'password'
                      : field === 'passwordOk'
                        ? showConfirmPassword
                          ? 'text'
                          : 'password'
                        : 'text'
                  }
                  placeholder={
                    field === 'userId'
                      ? '아이디'
                      : field === 'password'
                        ? '비밀번호'
                        : '비밀번호 확인'
                  }
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                />
                {field !== 'userId' && (
                  <i
                    className={`fa-regular ${
                      field === 'password'
                        ? showPassword
                          ? 'fa-eye-slash'
                          : 'fa-eye'
                        : showConfirmPassword
                          ? 'fa-eye-slash'
                          : 'fa-eye'
                    } ${css.eyeIcon}`}
                    onClick={() => {
                      field === 'password'
                        ? setShowPassword(prev => !prev)
                        : setShowConfirmPassword(prev => !prev);
                    }}
                  />
                )}
              </div>
              <strong>{errors[field]}</strong>
            </div>
          ))}
          <button type="submit">가입하기</button>
          <div className={css.socialLogin}>
            <p>소셜 계정으로 간편하게 가입하기</p>
            <KakaoLoginButton />
          </div>
        </form>
      </div>
    </main>
  );
}
