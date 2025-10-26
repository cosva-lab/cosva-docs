import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
// auth
import { AuthGuard } from 'auth/guard';
// layouts
import DashboardLayout from 'layouts/dashboard';
// components
import { LoadingScreen } from 'components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('pages/dashboard/app'));
// BLOG
const BlogPostsPage = lazy(() => import('pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('pages/dashboard/post/edit'));
// BLANK PAGE
const BlankPage = lazy(() => import('pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
