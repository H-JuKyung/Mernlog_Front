import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleLike } from '@/apis/postApi';

export default function LikeButton({ postId, initialIsLiked, initialLikesCount, className = '' }) {
  const navigate = useNavigate();

  // 초기 상태를 props로 받아옴 (isLiked, likesCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);

  useEffect(() => {
    setIsLiked(initialIsLiked || false);
    setLikesCount(initialLikesCount || 0);
  }, [initialIsLiked, initialLikesCount]);

  const handleLikeToggle = async e => {
    e.stopPropagation();
    try {
      const updated = await toggleLike(postId);
      setIsLiked(updated.isLiked);
      setLikesCount(updated.likesCount);
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    }
  };

  return (
    <span className={className}>
      <span onClick={handleLikeToggle} style={{ cursor: 'pointer' }}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span> {likesCount}</span>
    </span>
  );
}
