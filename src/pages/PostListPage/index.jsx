import css from './index.module.css';
import PostCard from '@/components/PostCard';

export default function PostListPage() {
  return (
    <main className={css.postlistpage}>
      <h2>글목록</h2>

      <ul className={css.postList}>
        <li>
          <PostCard />
        </li>
        <li>
          <PostCard />
        </li>
        <li>
          <PostCard />
        </li>
        <li>
          <PostCard />
        </li>
      </ul>
    </main>
  );
}
