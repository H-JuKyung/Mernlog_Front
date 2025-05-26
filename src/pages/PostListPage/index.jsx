import css from './index.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from '@/components/PostCard';
import { getPostList } from '@/apis/postApi';
import { useSelector } from 'react-redux';

export default function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 페이지네이션을 위한 상태 추가
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);
  const observer = useRef();

  const user = useSelector(state => state.user.user); // ✅ Redux user 상태 구독
  const userId = user?.userId; // 변경 감지 기준

  // 마지막 게시물 요소를 감지하는 ref 콜백
  const lastPostElementRef = useCallback(
    node => {
      if (isLoading || !node) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });

      observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // 글 목록 로딩 함수
  const fetchPostList = async (pageNum = 0, reset = false) => {
    try {
      if (pageNum > 0 && !reset) setIsLoading(true);
      const data = await getPostList(pageNum);
      if (reset) {
        setPostList(data.posts);
        setPage(1); // 초기화 후 페이지 1로 설정
      } else {
        setPostList(prev => (pageNum === 0 ? data.posts : [...prev, ...data.posts]));
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('목록조회 실패:', error);
      setError('글 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩 및 페이지네이션 로딩
  useEffect(() => {
    fetchPostList(page);
  }, [page]);

  // 🔥 Redux userId 변경 시 초기화
  useEffect(() => {
    fetchPostList(0, true);
  }, [userId]);

  return (
    <main className={css.postlistpage}>
      <h2>글목록</h2>
      {error && <p className={css.errorMessage}>{error}</p>}
      {isLoading && page === 0 ? (
        <p>로딩중...</p>
      ) : postList.length === 0 ? (
        <p className={css.noPostMessage}>첫번째 글의 주인공이 되어주세요</p>
      ) : (
        <ul className={css.postList} ref={listRef}>
          {postList.map((post, i) => (
            <li key={post._id} ref={i === postList.length - 1 ? lastPostElementRef : null}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
