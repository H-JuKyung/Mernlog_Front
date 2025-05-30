import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './index.module.css';
import { registerUser, checkUserIdDuplicate } from '@/apis/userApi';
import KakaoLoginButton from '@/components/KakaoLoginButton';

export default function RegisterPage() {
  const [form, setForm] = useState({ userId: '', password: '', passwordOk: '' });
  const [errors, setErrors] = useState({ userId: '', password: '', passwordOk: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(null);
  const [checkingUserId, setCheckingUserId] = useState(false);

  const navigate = useNavigate();

  const validate = useCallback(
    (field, value, formValues = form) => {
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
        case 'passwordOk':
          return !value
            ? '비밀번호 확인을 입력해주세요.'
            : value !== formValues.password
              ? '비밀번호가 일치하지 않습니다.'
              : '';
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
      if (name === 'userId') setIsUserIdAvailable(null);
    },
    [validate, form]
  );

  const handleCheckUserId = async () => {
    if (!form.userId || errors.userId) {
      alert('유효한 아이디를 입력해주세요.');
      return;
    }
    try {
      setCheckingUserId(true);
      const available = await checkUserIdDuplicate(form.userId);
      setIsUserIdAvailable(available);
    } catch (err) {
      console.error('중복 확인 실패:', err);
      alert('중복 확인 실패');
    } finally {
      setCheckingUserId(false);
    }
  };

  const isFormValid = useMemo(
    () =>
      Object.values(errors).every(error => !error) &&
      Object.values(form).every(value => value) &&
      isUserIdAvailable === true,
    [errors, form, isUserIdAvailable]
  );

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {
      userId: validate('userId', form.userId),
      password: validate('password', form.password),
      passwordOk: validate('passwordOk', form.passwordOk),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err) || !isFormValid) {
      alert('아이디, 비밀번호를 확인하세요.');
      return;
    }

    try {
      await registerUser({ userId: form.userId, password: form.password });
      alert('회원가입 성공');
      navigate('/login');
    } catch (err) {
      console.error('회원가입 오류', err.response?.data || err);
      alert('회원가입 실패');
    }
  };

  return (
    <main className={css.registerPage}>
      <div className={css.wrapper}>
        <h2>회원가입</h2>
        <div className={css.registerContainer}>
          <form className={css.registerForm} onSubmit={handleSubmit}>
            <div className={css.inputGroup}>
              <div className={css.idInputContainer}>
                <input
                  type="text"
                  placeholder="아이디"
                  name="userId"
                  className={css.idInput}
                  value={form.userId}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={css.duplicateCheckButton}
                  onClick={handleCheckUserId}
                  disabled={checkingUserId}
                >
                  {checkingUserId ? '확인 중...' : '중복 확인'}
                </button>
              </div>
              {isUserIdAvailable === true && (
                <strong style={{ color: '#74d69e' }}>사용 가능합니다.</strong>
              )}
              {isUserIdAvailable === false && <strong>이미 존재하는 아이디입니다.</strong>}
              <strong>{errors.userId}</strong>
            </div>

            {['password', 'passwordOk'].map(field => (
              <div className={css.inputGroup} key={field}>
                <div className={css.inputWithIcon}>
                  <input
                    type={
                      field === 'password'
                        ? showPassword
                          ? 'text'
                          : 'password'
                        : showConfirmPassword
                          ? 'text'
                          : 'password'
                    }
                    placeholder={field === 'password' ? '비밀번호' : '비밀번호 확인'}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                  />
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
                    onClick={() =>
                      field === 'password'
                        ? setShowPassword(prev => !prev)
                        : setShowConfirmPassword(prev => !prev)
                    }
                  />
                </div>
                <strong>{errors[field]}</strong>
              </div>
            ))}

            <button type="submit" className={css.submitBtn}>
              가입하기
            </button>
          </form>
          <div className={css.socialLogin}>
            <p>소셜 계정으로 간편하게 가입하기</p>
            <KakaoLoginButton />
          </div>
        </div>
      </div>
    </main>
  );
}
