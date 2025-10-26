import { useLocales } from 'locales';
import { Helmet } from 'react-helmet-async';
// sections
import { AmplifyForgotPasswordView } from 'sections/auth/amplify';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  const { t } = useLocales();
  return (
    <>
      <Helmet>
        <title> {t('forgot_password_head')}</title>
      </Helmet>

      <AmplifyForgotPasswordView />
    </>
  );
}
