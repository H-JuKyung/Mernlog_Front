import css from './index.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from '@/components/PostCard';
import { getPostList } from '@/apis/postApi';
import { useSelector } from 'react-redux';
import mernlogCharacter from '@/assets/mernlog_character.svg';
import PostCardSkeleton from '@/components/PostCardSkeleton';

export default function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const observer = useRef();
  const loadingRef = useRef(false);

  const user = useSelector(state => state.user.user);
  const userId = user?.userId;

  const lastPostElementRef = useCallback(
    node => {
      if (isLoading || !node || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          loadingRef.current = true;
          setPage(prev => prev + 1);
        }
      });

      observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchPostList = async (pageNum = 0, reset = false) => {
    try {
      if (reset) {
        setIsInitialLoading(true);
      } else {
        setIsLoading(true);
      }

      const limit = reset ? 9 : 3;
      const data = await getPostList(pageNum, limit);

      setPostList(prev => {
        const combined = reset ? data.posts : [...prev, ...data.posts];
        const uniquePosts = Array.from(new Map(combined.map(p => [p._id, p])).values());
        return uniquePosts;
      });

      setHasMore(data.hasMore);
    } catch (error) {
      console.error('목록조회 실패:', error);
      setError('글 목록을 불러오는데 실패했습니다.');
    } finally {
      if (reset) {
        setIsInitialLoading(false);
      }
      setIsLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    setPage(0);
    fetchPostList(0, true);
  }, [userId]);

  useEffect(() => {
    if (page === 0) return;
    fetchPostList(page, false);
  }, [page]);

  return (
    <main className={css.postlistpage}>
      {error && <p className={css.errorMessage}>{error}</p>}

      {isInitialLoading ? (
        <ul className={css.postList}>
          {Array.from({ length: 9 }).map((_, i) => (
            <li key={i}>
              <PostCardSkeleton />
            </li>
          ))}
        </ul>
      ) : postList.length === 0 ? (
        <div className={css.noPostContainer}>
          <img src={mernlogCharacter} alt="No Posts" className={css.noPostImage} />
          <p className={css.noPostMessage}>아직 게시글이 없어요. 첫 번째 주인공이 되어볼까요?</p>
        </div>
      ) : (
        <ul className={css.postList}>
          {postList.map((post, i) => (
            <li key={post._id} ref={i === postList.length - 1 ? lastPostElementRef : null}>
              <PostCard post={post} />
            </li>
          ))}
          {isLoading &&
            hasMore &&
            Array.from({ length: 3 }).map((_, i) => (
              <li key={`loading-${i}`}>
                <PostCardSkeleton />
              </li>
            ))}
        </ul>
      )}
    </main>
  );
}
