import { useParams } from 'react-router';
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
import FAQNewEditForm from '../faq-new-edit-form';

// ----------------------------------------------------------------------

export default function FAQEditView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { faq, faqLoading } = useGetFAQ(params.id || '');

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit FAQ"
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
            name: 'Edit',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {!faqLoading && faq && <FAQNewEditForm currentFAQ={faq} />}
    </Container>
  );
}

