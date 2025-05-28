import css from './index.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo, getUserProfile } from '@/apis/userApi';
import { setUserInfo } from '@/store/userSlice';

export default function UserInfoUpdate() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = e => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (password) {
      if (password.length < 4) {
        setError('비밀번호는 최소 4자 이상이어야 합니다.');
        return;
      }

      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    try {
      setLoading(true);

      const userData = {
        password: password || undefined,
      };

      await updateUserInfo(userData);
      const updatedProfile = await getUserProfile();
      dispatch(setUserInfo(updatedProfile));

      setSuccess(true);
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setSuccess(false);
        navigate(`/userpage/${user.userId}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || '사용자 정보 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/userpage/${user.userId}`);
  };

  if (!user) return null;

  return (
    <main className={css.userInfoUpdateWrapper}>
      <h2 className={css.userInfoUpdateTitle}>내 정보 수정</h2>

      <form onSubmit={handleSubmit} className={css.userInfoUpdateForm}>
        <div className={css.userInfoUpdateFormGroup}>
          <label htmlFor="userId" className={css.userInfoUpdateLabel}>
            사용자 이름
          </label>
          <input
            type="text"
            id="userId"
            value={user.userId || ''}
            disabled
            className={css.userInfoUpdateInputDisabled}
          />
          <p className={css.userInfoUpdateHelper}>사용자 이름은 변경할 수 없습니다.</p>
        </div>

        <div className={css.userInfoUpdateFormGroup}>
          <label htmlFor="password" className={css.userInfoUpdateLabel}>
            새 비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="변경할 비밀번호를 입력하세요"
            className={css.userInfoUpdateInput}
          />
          <p className={css.userInfoUpdateHelper}>
            비밀번호는 최소 4자 이상이어야 합니다. 변경하지 않으려면 비워두세요.
          </p>
        </div>

        <div className={css.userInfoUpdateFormGroup}>
          <label htmlFor="confirmPassword" className={css.userInfoUpdateLabel}>
            비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호 확인"
            className={css.userInfoUpdateInput}
          />
        </div>

        {error && <p className={css.userInfoUpdateError}>{error}</p>}
        {success && (
          <p className={css.userInfoUpdateSuccess}>정보가 성공적으로 업데이트되었습니다!</p>
        )}

        <div className={css.userInfoUpdateButtonGroup}>
          <button
            type="button"
            onClick={handleCancel}
            className={`${css.userInfoUpdateButton} ${css.userInfoUpdateCancel}`}
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className={`${css.userInfoUpdateButton} ${css.userInfoUpdateSubmit}`}
            disabled={loading}
          >
            {loading ? '처리 중...' : '저장'}
          </button>
        </div>
      </form>
    </main>
  );
}
