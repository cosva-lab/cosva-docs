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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new category"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'FAQ Categories',
            href: paths.dashboard.faqCategory.root,
          },
          {
            name: 'Create',
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

