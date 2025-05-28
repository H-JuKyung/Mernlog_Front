import css from './index.module.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getUserInfo,
  getUserPosts,
  getUserComments,
  getUserLikes,
  deleteAccount,
} from '@/apis/userApi';
import { setUserInfo } from '@/store/userSlice';
import { formatDate } from '@/utils/features';

export default function UserPage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUser = useSelector(state => state.user.user);
  const isCurrentUser = currentUser && currentUser.userId === userId;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserInfo(userId);
        const postsData = await getUserPosts(userId);
        const commentsData = await getUserComments(userId);
        const likesData = await getUserLikes(userId);

        setUserData(userData);
        setUserPosts(postsData);
        setUserComments(commentsData);
        setUserLikes(likesData);
      } catch (err) {
        console.error('사용자 데이터 로딩 실패:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('정말 탈퇴하시겠습니까?');
    if (!confirmed) return;
    try {
      setIsDeleting(true);
      await deleteAccount();
      dispatch(setUserInfo(''));
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('회원 탈퇴 실패:', err);
      alert('회원 탈퇴 실패. 다시 시도해주세요.');
      setIsDeleting(false);
    }
  };

  if (loading) return <div className={css.loading}>로딩 중...</div>;
  if (error) return <div className={css.error}>{error}</div>;
  if (!userData) return <div className={css.error}>사용자를 찾을 수 없습니다.</div>;

  return (
    <main className={css.userpage}>
      <h2>{userId}님의 MYPAGE</h2>

      <section className={css.section}>
        <h3>👤 사용자 정보</h3>
        <div className={css.userInfo}>
          <p>
            <strong>이름:</strong> {userData.userId}
          </p>
          <p>
            <strong>가입일:</strong> {formatDate(userData.createdAt)}
          </p>
          {isCurrentUser && (
            <div className={css.buttonGroup}>
              <button
                onClick={() => {
                  if (userData?.kakaoId) {
                    alert('카카오 로그인 사용자는 비밀번호를 수정할 수 없습니다.');
                    return;
                  }
                  navigate('/update-profile');
                }}
                className={css.editButton}
              >
                비밀번호 변경
              </button>
              <button
                onClick={handleDeleteAccount}
                className={css.deleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? '탈퇴 중...' : '회원 탈퇴'}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={css.section}>
        <h3>📝 작성한 글 ({userPosts.length})</h3>
        <div className={css.grid}>
          {userPosts.length ? (
            userPosts.map(post => (
              <Link to={`/detail/${post._id}`} key={post._id} className={css.card}>
                <p className={css.title}>{post.title}</p>
                <p className={css.date}>{formatDate(post.createdAt)}</p>
              </Link>
            ))
          ) : (
            <p>작성한 글이 없습니다.</p>
          )}
        </div>
      </section>

      <section className={css.section}>
        <h3>💬 작성한 댓글 ({userComments.length})</h3>
        <div className={css.grid}>
          {userComments.length ? (
            userComments.map(comment => (
              <Link to={`/detail/${comment.postId}`} key={comment._id} className={css.card}>
                <p className={css.content}>{comment.content}</p>
                <div className={css.meta}>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </Link>
            ))
          ) : (
            <p>작성한 댓글이 없습니다.</p>
          )}
        </div>
      </section>

      <section className={css.section}>
        <h3>❤️ 좋아요 한 글 ({userLikes.length})</h3>
        <div className={`${css.grid} ${css.likesGrid}`}>
          {userLikes.length ? (
            userLikes.map(post => (
              <Link to={`/detail/${post._id}`} key={post._id} className={css.card}>
                <img
                  src={
                    post.cover
                      ? `${import.meta.env.VITE_BACK_URL}/${post.cover}`
                      : 'https://picsum.photos/200/300'
                  }
                  alt={post.title}
                />
              </Link>
            ))
          ) : (
            <p>좋아요 한 글이 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}
