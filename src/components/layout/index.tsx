import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from 'components/app';
import Theme from 'contexts/Theme';
import Header from './Header';
import Footer from './Footer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }
]);

const LayoutDefault: React.FC = () => (
    <Theme>
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </Theme>
  );

export default LayoutDefault;
