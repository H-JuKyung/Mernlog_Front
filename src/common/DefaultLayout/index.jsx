import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import css from './index.module.css';

export default function DefaultLayout() {
  return (
    <div className={css.defaultlayout}>
      <Header />
      <main className="container main">
        <Outlet />
      </main>
    </div>
  );
}
