import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import '../index.css';
import css from './index.module.css';

export default function DefaultLayout() {
  return (
    <div className={css.defaultlayout}>
      <Header />
      <Outlet />
    </div>
  );
}
