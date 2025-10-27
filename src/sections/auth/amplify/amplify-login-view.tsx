import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'routes/paths';
import { RouterLink } from 'routes/components';
import { useSearchParams, useRouter } from 'routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'config-global';
// hooks
import { useBoolean } from 'hooks/use-boolean';
// auth
import { useAuthContext } from 'auth/hooks';
// components
import Iconify from 'components/iconify';
import FormProvider, { RHFTextField } from 'components/hook-form';
import { useLocales } from 'locales';

// ----------------------------------------------------------------------

export default function AmplifyLoginView() {
  const { login, confirmPasswordVerifier } = useAuthContext();
  const { t } = useLocales();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required(t('email_required')).email(t('email_invalid')),
    password: Yup.string().required(t('password_required')),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await login?.(data.email, data.password);

      if (result?.success) {
        router.push(returnTo || PATH_AFTER_LOGIN);
      } else if (result?.challenge === 'NEW_PASSWORD_REQUIRED') {
        // Redirect to new password page with email and session
        const sessionParam = result.session === 'internal' ? 'internal' : encodeURIComponent(result.session || '');
        router.push(`${paths.auth.amplify.newPassword}?email=${encodeURIComponent(data.email)}&session=${sessionParam}`);
      } else if (result?.challenge === 'PASSWORD_VERIFIER') {
        // Handle PASSWORD_VERIFIER challenge (SRP flow)
        console.log('Handling PASSWORD_VERIFIER challenge');
        const verifierResult = await confirmPasswordVerifier?.(data.email, data.password);
        
        if (verifierResult?.success) {
          router.push(returnTo || PATH_AFTER_LOGIN);
        } else if (verifierResult?.challenge === 'NEW_PASSWORD_REQUIRED') {
          // After password verification, user might need to set new password
          const sessionParam = verifierResult.session === 'internal' ? 'internal' : encodeURIComponent(verifierResult.session || '');
          router.push(`${paths.auth.amplify.newPassword}?email=${encodeURIComponent(data.email)}&session=${sessionParam}`);
        } else {
          setErrorMsg(verifierResult?.error || t('login_failed'));
        }
      } else {
        reset();
        // Handle specific error types
        let errorMessage = '';
        switch (result?.error) {
          case 'USER_NOT_FOUND':
            errorMessage = t('user_not_found');
            break;
          case 'INVALID_CREDENTIALS':
            errorMessage = t('invalid_credentials');
            break;
          case 'USER_NOT_CONFIRMED':
            errorMessage = t('user_not_confirmed');
            break;
          case 'TOO_MANY_ATTEMPTS':
            errorMessage = t('too_many_attempts');
            break;
          default:
            errorMessage = result?.error || t('login_failed');
        }
        setErrorMsg(errorMessage);
      }
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : t(error.code));
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">{t('login_head')}</Typography>

      {/* <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.amplify.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack> */}
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label={t('email_label')} />

      <RHFTextField
        name="password"
        label={t('password_label')}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link
        component={RouterLink}
        href={paths.auth.amplify.forgotPassword}
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
      >
        {t('forgot_password_label')}
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('login_button')}
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
