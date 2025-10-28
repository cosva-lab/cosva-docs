import { TFunction } from 'i18next';
// routes
import { paths } from 'routes/paths';
// components
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

export const NavConfigT = (t: TFunction<'translation', undefined>) => {
  return [
    {
      title: t('home'),
      icon: <Iconify icon="solar:home-2-bold-duotone" />,
      path: '/',
    },
    { title: 'FAQs', path: paths.faqs },
    {
      title: t('blog'),
      icon: <Iconify icon="solar:notebook-bold-duotone" />,
      path: paths.post.root,
    },
    {
      title: t('contact_us'),
      icon: <Iconify icon="solar:notebook-bold-duotone" />,
      path: '#',
    },
  ];
};
