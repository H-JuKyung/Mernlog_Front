import css from './index.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from '@/components/PostCard';
import { getPostList } from '@/apis/postApi';
import { useSelector } from 'react-redux';
import mernlogCharacter from '@/assets/mernlog_character.svg';

export default function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);
  const observer = useRef();

  const user = useSelector(state => state.user.user);
  const userId = user?.userId;

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

  const fetchPostList = async (pageNum = 0, reset = false) => {
    try {
      if (pageNum > 0 && !reset) setIsLoading(true);
      const data = await getPostList(pageNum);
      if (reset) {
        setPostList(data.posts);
        setPage(1);
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

  useEffect(() => {
    fetchPostList(page);
  }, [page]);

  useEffect(() => {
    fetchPostList(0, true);
  }, [userId]);

  return (
    <main className={css.postlistpage}>
      {error && <p className={css.errorMessage}>{error}</p>}
      {postList.length === 0 && !isLoading ? (
        <div className={css.noPostContainer}>
          <img src={mernlogCharacter} alt="No Posts" className={css.noPostImage} />
          <p className={css.noPostMessage}>아직 게시글이 없어요. 첫 번째 주인공이 되어볼까요?</p>
        </div>
      ) : (
        <ul className={css.postList} ref={listRef}>
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
