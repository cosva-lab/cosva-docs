import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'routes/paths';
// api
import { useGetFAQCategory } from 'api/faq';
// components
import { useSettingsContext } from 'components/settings';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
//
import FAQCategoryFormWithTranslations from '../faq-category-form-with-translations';

// ----------------------------------------------------------------------

export default function FAQCategoryEditView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { category, categoryLoading } = useGetFAQCategory(params.id || '');
  const { t } = useTranslation(['faq', 'general']);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('faq:category.edit')}
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
            name: t('general:edit'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {!categoryLoading && category && (
        <FAQCategoryFormWithTranslations currentCategory={category} />
      )}
    </Container>
  );
}
