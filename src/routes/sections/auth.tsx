import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
// auth
import { GuestGuard } from 'auth/guard';
// layouts
import CompactLayout from 'layouts/compact';
import AuthClassicLayout from 'layouts/auth/classic';
// components
import { SplashScreen } from 'components/loading-screen';

// ----------------------------------------------------------------------

// AMPLIFY
const AmplifyLoginPage = lazy(() => import('pages/auth/amplify/login'));
const AmplifyRegisterPage = lazy(() => import('pages/auth/amplify/register'));
const AmplifyVerifyPage = lazy(() => import('pages/auth/amplify/verify'));
const AmplifyNewPasswordPage = lazy(() => import('pages/auth/amplify/new-password'));
const AmplifyForgotPasswordPage = lazy(() => import('pages/auth/amplify/forgot-password'));

const authAmplify = {
  path: 'amplify',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <AmplifyLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <AmplifyRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      element: (
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      ),
      children: [
        { path: 'verify', element: <AmplifyVerifyPage /> },
        { path: 'new-password', element: <AmplifyNewPasswordPage /> },
        { path: 'forgot-password', element: <AmplifyForgotPasswordPage /> },
      ],
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authAmplify],
  },
];
