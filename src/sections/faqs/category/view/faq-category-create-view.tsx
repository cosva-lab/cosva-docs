import { useTranslation } from 'react-i18next';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'routes/paths';
// components
import { useSettingsContext } from 'components/settings';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
//
import FAQCategoryFormWithTranslations from '../faq-category-form-with-translations';

// ----------------------------------------------------------------------

export default function FAQCategoryCreateView() {
  const settings = useSettingsContext();
  const { t } = useTranslation(['faq', 'translations']);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('faq:category.create')}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'FAQ',
            href: paths.dashboard.faq.categories.root,
          },
          {
            name: t('translations:create'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FAQCategoryFormWithTranslations />
    </Container>
  );
}

