import css from './postcard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/features';
import { getImageUrl } from '@/utils/helpers';
import LikeButton from './LikeButton';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/detail/${post._id}`);
  };

  const handleAuthorLinkClick = e => {
    e.stopPropagation();
  };

  return (
    <article className={css.postcard} onClick={handleCardClick}>
      <div className={css.post_img}>
        <img src={getImageUrl(post.cover)} alt={post.title} />
      </div>
      <div className={css.content}>
        <h3 className={css.title}>{post.title}</h3>
        <p className={css.description}>{post.summary}</p>
      </div>
      <div className={css.info}>
        <div className={css.meta}>
          <Link
            to={`/userpage/${post.author}`}
            onClick={handleAuthorLinkClick}
            className={css.author}
          >
            {post.author}
          </Link>
          <time className={css.date}>{formatDate(post.createdAt)}</time>
        </div>
        <div className={css.actions}>
          <LikeButton
            postId={post._id}
            initialIsLiked={post.isLiked}
            initialLikesCount={post.likesCount}
          />
          <span>
            <i className="fa-regular fa-comment-dots"></i>
          </span>
          <span>{post.commentCount || 0}</span>
        </div>
      </div>
    </article>
  );
}
