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
// FAQ
const FAQListPage = lazy(() => import('pages/dashboard/faq/list'));
const FAQUnifiedPage = lazy(() => import('pages/dashboard/faq/unified'));
const FAQCreatePage = lazy(() => import('pages/dashboard/faq/new'));
const FAQEditPage = lazy(() => import('pages/dashboard/faq/edit'));
// FAQ CATEGORY
const FAQCategoryCreatePage = lazy(() => import('pages/dashboard/faq-category/new'));
const FAQCategoryEditPage = lazy(() => import('pages/dashboard/faq-category/edit'));
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
      {
        path: 'faq',
        children: [
          { element: <FAQUnifiedPage />, index: true },
          { path: 'list', element: <FAQListPage /> },
          { path: 'unified', element: <FAQUnifiedPage /> },
          { path: ':id/edit', element: <FAQEditPage /> },
          { path: 'new', element: <FAQCreatePage /> },
        ],
      },
      {
        path: 'faq-category',
        children: [
          { element: <FAQCategoryCreatePage />, index: true },
          { path: ':id/edit', element: <FAQCategoryEditPage /> },
          { path: 'new', element: <FAQCategoryCreatePage /> },
        ],
      },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
