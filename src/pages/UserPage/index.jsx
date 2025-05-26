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
  // 현재 로그인한 사용자 정보
  const currentUser = useSelector(state => state.user.user);
  const isCurrentUser = currentUser && currentUser.userId === userId;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // API 호출을 통해 데이터 가져오기
        const userData = await getUserInfo(userId);
        const postsData = await getUserPosts(userId);
        const commentsData = await getUserComments(userId);
        const likesData = await getUserLikes(userId);

        setUserData(userData);
        setUserPosts(postsData);
        setUserComments(commentsData);
        setUserLikes(likesData);
        setLoading(false);
      } catch (err) {
        console.error('사용자 데이터 로딩 실패:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // 회원 탈퇴 처리 함수
  const handleDeleteAccount = async () => {
    // 확인 대화상자 표시
    const confirmed = window.confirm(
      '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 계정 정보가 삭제됩니다.'
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteAccount();

      // Redux 상태 초기화
      dispatch(setUserInfo(''));

      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('회원 탈퇴 실패:', err);
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
      setIsDeleting(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <main className={css.userpage}>
      <h2>{userId}님의 페이지</h2>

      <section>
        <h3>사용자정보</h3>
        <div className={css.userInfo}>
          <p>
            <strong>사용자 이름:</strong> {userData.userId}
          </p>
          <p>
            <strong>가입일:</strong> {formatDate(userData.createdAt)}
          </p>
          {isCurrentUser && (
            <div className={css.editButton}>
              <button
                onClick={() => {
                  if (userData?.kakaoId) {
                    alert('카카오 로그인 사용자는 비밀번호를 수정할 수 없습니다.');
                    return;
                  }
                  navigate(`/update-profile`);
                }}
                className={css.editButton}
              >
                내 정보 수정
              </button>
              <button
                onClick={handleDeleteAccount}
                className={css.deleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? '처리 중...' : '회원 탈퇴'}
              </button>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3>작성한 글 ({userPosts.length})</h3>
        {userPosts.length > 0 ? (
          <ul className={css.postList}>
            {userPosts.map(post => (
              <li key={post._id} className={css.postCard}>
                <Link to={`/detail/${post._id}`}>
                  <p className={css.title}>{post.title}</p>
                  <p className={css.postDate}>{formatDate(post.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 글이 없습니다.</p>
        )}
      </section>

      <section>
        <h3>작성한 댓글 ({userComments.length})</h3>
        {userComments.length > 0 ? (
          <ul className={css.commentList}>
            {userComments.map(comment => (
              <li key={comment._id} className={css.commentCard}>
                <p className={css.commentContent}>{comment.content}</p>
                <div className={css.commentMeta}>
                  <Link to={`/detail/${comment.postId}`}>원문 보기</Link>
                  <p>작성일:{formatDate(comment.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 댓글이 없습니다.</p>
        )}
      </section>

      <section>
        <h3>좋아요 클릭한 글 ({userLikes.length})</h3>
        {userLikes.length > 0 ? (
          <ul className={css.likeList}>
            {userLikes.map(post => (
              <li key={post._id} className={css.likeCard}>
                <Link to={`/detail/${post._id}`}>
                  {post.cover ? (
                    <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
                  ) : (
                    <img src="https://picsum.photos/200/300" alt="기본 이미지" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>좋아요 클릭한 글이 없습니다.</p>
        )}
      </section>
    </main>
  );
}
