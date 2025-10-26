import { useLocales } from 'locales';
import { Helmet } from 'react-helmet-async';
// sections
import { AmplifyLoginView } from 'sections/auth/amplify';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const { t } = useLocales();
  return (
    <>
      <Helmet>
        <title> {t("login_head")}</title>
      </Helmet>

      <AmplifyLoginView />
    </>
  );
}
