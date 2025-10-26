import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
// layouts
import MainLayout from 'layouts/main';
import SimpleLayout from 'layouts/simple';
import CompactLayout from 'layouts/compact';
// components
import { SplashScreen } from 'components/loading-screen';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('pages/home'));
const Page500 = lazy(() => import('pages/500'));
const Page403 = lazy(() => import('pages/403'));
const Page404 = lazy(() => import('pages/404'));
const FaqsPage = lazy(() => import('pages/faqs'));
const MaintenancePage = lazy(() => import('pages/maintenance'));
// BLOG
const PostListPage = lazy(() => import('pages/post/list'));
const PostDetailsPage = lazy(() => import('pages/post/details'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <MainLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    ),
    children: [
      { path: 'faqs', element: <FaqsPage /> },
      {
        path: 'post',
        children: [
          { element: <PostListPage />, index: true },
          { path: 'list', element: <PostListPage /> },
          { path: ':title', element: <PostDetailsPage /> },
        ],
      },
    ],
  },
  {
    element: (
      <SimpleLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </SimpleLayout>
    ),
  },
  {
    element: (
      <CompactLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </CompactLayout>
    ),
    children: [
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },
];
