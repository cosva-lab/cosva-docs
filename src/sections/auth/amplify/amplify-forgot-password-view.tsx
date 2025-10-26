import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'routes/paths';
import { useRouter } from 'routes/hooks';
import { RouterLink } from 'routes/components';
// auth
import { useAuthContext } from 'auth/hooks';
// assets
import { PasswordIcon } from 'assets/icons';
// components
import Iconify from 'components/iconify';
import FormProvider, { RHFTextField } from 'components/hook-form';
import { useLocales } from 'locales';

// ----------------------------------------------------------------------

export default function AmplifyForgotPasswordView() {
  const { forgotPassword } = useAuthContext();
  const { t } = useLocales();

  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required(t('email_required')).email(t('email_invalid')),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword?.(data.email);

      const searchParams = new URLSearchParams({
        email: data.email,
      }).toString();

      const href = `${paths.auth.amplify.newPassword}?${searchParams}`;
      router.push(href);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label={t("email_label")}/>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('forgot_label_button')}
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.amplify.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        {t('forgot_label_button_return')}
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">{t('forgot_password_head')}?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('forgot_password_description')}
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
