import css from './index.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from '@/components/PostCard';
import { getPostList } from '@/apis/postApi';
import { useSelector } from 'react-redux';

export default function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const user = useSelector(state => state.user.user);
  const userId = user?.userId;

  const fetchPostList = async (pageNum = 0, reset = false) => {
    setIsLoading(true);
    try {
      const data = await getPostList(pageNum);
      setPostList(prev => (reset || pageNum === 0 ? data.posts : [...prev, ...data.posts]));
      setHasMore(data.hasMore);
      if (reset) setPage(1);
    } catch (err) {
      console.error('목록조회 실패:', err);
      setError('글 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const lastPostElementRef = useCallback(
    node => {
      if (isLoading || !node) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) setPage(prev => prev + 1);
      });
      observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchPostList(page);
  }, [page]);

  useEffect(() => {
    fetchPostList(0, true);
  }, [userId]);

  return (
    <main className={css.postlistpage}>
      <h2>글목록</h2>
      {error && <p className={css.errorMessage}>{error}</p>}
      {postList.length === 0 && !isLoading ? (
        <p className={css.noPostMessage}>첫번째 글의 주인공이 되어주세요</p>
      ) : (
        <ul className={css.postList}>
          {postList.map((post, i) => (
            <li key={post._id} ref={i === postList.length - 1 ? lastPostElementRef : null}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
      {isLoading && <p>로딩중...</p>}
    </main>
  );
}
