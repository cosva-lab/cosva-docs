import { useTranslation } from 'react-i18next';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'routes/paths';
// components
import { useSettingsContext } from 'components/settings';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
//
import FAQFormWithTranslations from '../faq-form-with-translations';

// ----------------------------------------------------------------------

export default function FAQCreateView() {
  const settings = useSettingsContext();
  const { t } = useTranslation(['faq', 'general']);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('faq:faq.create')}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'FAQ',
            href: paths.dashboard.faq.root,
          },
          {
            name: t('general:create'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FAQFormWithTranslations />
    </Container>
  );
}

