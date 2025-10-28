import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'routes/paths';
// api
import { useGetFAQ } from 'api/faq';
// components
import { useSettingsContext } from 'components/settings';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
//
import FAQFormWithTranslations from '../faq-form-with-translations';

// ----------------------------------------------------------------------

export default function FAQEditView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { faq, faqLoading } = useGetFAQ(params.id || '');
  const { t } = useTranslation(['faq', 'general']);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('faq:faq.edit')}
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
            name: t('general:edit'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {!faqLoading && faq && <FAQFormWithTranslations currentFAQ={faq} />}
    </Container>
  );
}

