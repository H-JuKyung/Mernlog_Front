import css from './postcard.module.css';

export default function PostCardSkeleton() {
  return (
    <article className={css.skeletonCard}>
      <div className={`${css.shimmer} ${css.skeletonImage}`}></div>
      <div className={css.skeletonContent}>
        <div className={`${css.shimmer} ${css.skeletonTitle}`}></div>
        <div className={`${css.shimmer} ${css.skeletonDescription}`}></div>
        <div className={`${css.shimmer} ${css.skeletonDate}`}></div>
      </div>
      <div className={css.skeletonInfo}>
        <div className={`${css.shimmer} ${css.skeletonMeta}`}></div>
        <div className={css.skeletonActions}>
          <div className={`${css.shimmer} ${css.skeletonAction}`}></div>
          <div className={`${css.shimmer} ${css.skeletonAction}`}></div>
        </div>
      </div>
    </article>
  );
}
