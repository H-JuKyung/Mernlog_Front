import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from '@/common/DefaultLayout';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import CreatePostPage from '@/pages/CreatePostPage';
import PostListPage from '@/pages/PostListPage';
import PostDetailPage from '@/pages/PostDetailPage';
import EditPostPage from '@/pages/EditPostPage';
import UserPage from '@/pages/UserPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
    children: [
      {
        index: true,
        element: <PostListPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/createPost',
        element: <CreatePostPage />,
      },
      {
        path: '/detail/:postId',
        element: <PostDetailPage />,
      },
      {
        path: '/edit/:postId',
        element: <EditPostPage />,
      },
      {
        path: '/userpage/:userId',
        element: <UserPage />,
      },
    ],
  },
]);
