import { useLocales } from 'locales';
import { Helmet } from 'react-helmet-async';
// sections
import { AmplifyNewPasswordView } from 'sections/auth/amplify';

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  const {t} = useLocales()
  return (
    <>
      <Helmet>
        <title> {t("new_password_head")}</title>
      </Helmet>

      <AmplifyNewPasswordView />
    </>
  );
}
