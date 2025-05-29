import css from './index.module.css';
import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostDetail, deletePost } from '@/apis/postApi';
import { formatDate } from '@/utils/features';
import { useSelector } from 'react-redux';
import LikeButton from '@/components/LikeButton';
import Comments from '@/components/Comments';
import ImageModal from '@/components/ImageModal';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PostDetailPage() {
  const userId = useSelector(state => state.user.user.userId);
  const { postId } = useParams();
  const [postInfo, setPostInfo] = useState();
  const [commentCount, setCommentCount] = useState(0);
  const [imageList, setImageList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await getPostDetail(postId);
        setPostInfo(data);
        setCommentCount(data.commentCount || 0);
      } catch (error) {
        console.error('상세정보 조회 실패:', error);
      }
    };
    fetchPostDetail();
  }, [postId]);

  // 이미지 클릭 이벤트 처리
  useEffect(() => {
    if (!postInfo) return;

    const images = postInfo.cover ? [`${import.meta.env.VITE_BACK_URL}/${postInfo.cover}`] : [];
    const bindClickEvents = () => {
      const contentImages = document.querySelectorAll('.ql-content img');
      contentImages.forEach(img => {
        if (!images.includes(img.src)) images.push(img.src);
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openModal(images.indexOf(img.src)));
      });
      setImageList(images);
    };

    bindClickEvents();
    const observer = new MutationObserver(bindClickEvents);
    const contentElement = document.querySelector('.ql-content');
    if (contentElement) observer.observe(contentElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [postInfo]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleOutsideClick = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDropdownOpen]);

  const openModal = index => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  if (!postInfo) return <LoadingSpinner message="게시글 정보를 불러오는 중입니다..." />;

  const closeModal = () => setIsModalOpen(false);

  const updateCommentCount = count => setCommentCount(count);

  const handleDeletePost = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        alert('삭제되었습니다.');
        window.location.href = '/';
      } catch (error) {
        console.error('글 삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <main>
      <section className={css.postDetailCard}>
        <img
          src={`${import.meta.env.VITE_BACK_URL}/${postInfo?.cover}`}
          alt="포스트 이미지"
          className={css.postDetailImage}
          onClick={() => openModal(0)}
        />
      </section>

      {isModalOpen && (
        <ImageModal imageList={imageList} currentIndex={currentIndex} onClose={closeModal} />
      )}

      <div className={css.postDetailContent}>
        <h3 className={css.postDetailTitle}>{postInfo?.title}</h3>
        <div className={css.summary}>{postInfo?.summary}</div>
      </div>

      <div className={css.postDetailInfo}>
        <div className={css.postDetailMeta}>
          <Link to={`/userpage/${postInfo?.author}`} className={css.authorLink}>
            {postInfo?.author}
          </Link>
          <span>|</span>
          <span>{formatDate(postInfo?.updatedAt)}</span>
        </div>

        <div className={css.postDetailActions}>
          {postInfo && (
            <>
              <LikeButton
                postId={postId}
                initialIsLiked={postInfo.isLiked}
                initialLikesCount={postInfo.likesCount}
              />
              <span>
                <i className="fa-regular fa-comment-dots"></i>
              </span>
              <span>{commentCount}</span>

              {userId === postInfo?.author && (
                <>
                  <div className={css.desktopActions}>
                    <Link to={`/edit/${postId}`}>수정</Link>
                    <span onClick={handleDeletePost}>삭제</span>
                  </div>
                  <div className={css.mobileActions} ref={dropdownRef}>
                    <i
                      className="fa-solid fa-ellipsis-vertical"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    ></i>
                    {isDropdownOpen && (
                      <ul className={css.dropdownMenu}>
                        <li>
                          <Link to={`/edit/${postId}`}>수정</Link>
                        </li>
                        <li>
                          <span onClick={handleDeletePost}>삭제</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className={css.divider}></div>

      <div
        className={`${css.content} ql-content`}
        dangerouslySetInnerHTML={{ __html: postInfo?.content }}
      ></div>

      <div className={css.divider}></div>

      <section className={css.btns}>
        <Link to="/">목록으로</Link>
      </section>

      <Comments
        postId={postId}
        commentCount={commentCount}
        onCommentCountChange={updateCommentCount}
      />
    </main>
  );
}
