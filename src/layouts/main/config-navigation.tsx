// routes
import { paths } from 'routes/paths';
// config
import { PATH_AFTER_LOGIN } from 'config-global';
// components
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

export const NavConfigT = (t: any) => {
  if (!import.meta.env.VITE_IS_PROD) {
    return [
      {
        title: 'Home',
        icon: <Iconify icon="solar:home-2-bold-duotone" />,
        path: '/',
      },
      {
        title: 'Pages',
        path: '/pages',
        icon: <Iconify icon="solar:file-bold-duotone" />,
        children: [
          {
            subheader: 'Other',
            items: [
              { title: 'FAQs', path: paths.faqs },
              { title: 'Maintenance', path: paths.maintenance },
              { title: 'Coming Soon', path: paths.comingSoon },
            ],
          },
          {
            subheader: 'Concepts',
            items: [
              { title: 'Posts', path: paths.post.root },
              { title: 'Post', path: paths.post.demo.details },
            ],
          },
          {
            subheader: 'Dashboard',
            items: [{ title: 'Dashboard', path: PATH_AFTER_LOGIN }],
          },
        ],
      },
    ];
  }

  return [
    {
      title: t('home'),
      icon: <Iconify icon="solar:home-2-bold-duotone" />,
      path: '/',
    },
    {
      title: t('services'),
      icon: <Iconify icon="solar:notebook-bold-duotone" />,
      path: '#',
      children: [
        {
          subheader: t('other'),
          items: [
            { title: 'PQRS', path: paths.faqs },
            { title: t('forms_download'), path: paths.faqs },
          ],
        },
      ],
    },
    {
      title: t('blog'),
      icon: <Iconify icon="solar:notebook-bold-duotone" />,
      path: '#',
    },
    {
      title: t('contact_us'),
      icon: <Iconify icon="solar:notebook-bold-duotone" />,
      path: '#',
    },
  ];
};
