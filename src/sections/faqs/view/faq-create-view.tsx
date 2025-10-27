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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new FAQ"
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
            name: 'Create',
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

