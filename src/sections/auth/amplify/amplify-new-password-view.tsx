import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { useRouter, useSearchParams } from 'routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'config-global';
// hooks
import { useBoolean } from 'hooks/use-boolean';
import { useCountdownSeconds } from 'hooks/use-countdown';
// auth
import { useAuthContext } from 'auth/hooks';
// assets
import { SentIcon } from 'assets/icons';
// components
import Iconify from 'components/iconify';
import FormProvider, { RHFTextField, RHFCode } from 'components/hook-form';
import { useLocales } from 'locales';

// ----------------------------------------------------------------------

export default function AmplifyNewPasswordView() {
  const { newPassword, forgotPassword, confirmNewPassword } = useAuthContext();
  const { t } = useLocales();
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email');
  const session = searchParams.get('session');

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const VerifySchema = Yup.object().shape({
    code: Yup.string().when([], {
      is: () => !session, // If no session, code is required (forgot password flow)
      then: (schema) => schema.min(6, t('new_password_code_min')).required(t('new_password _code_required')),
      otherwise: (schema) => schema.optional(),
    }),
    email: Yup.string().required(t('email_required')).email(t('email_invalid')),
    password: Yup.string().min(8, t('password_min')).required(t('password_required')),
    confirmPassword: Yup.string()
      .required(t('confirm_password_required'))
      .oneOf([Yup.ref('password')], t('password_match')),
  });

  const defaultValues = {
    code: '',
    email: email || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (session) {
        // NEW_PASSWORD_REQUIRED challenge flow
        const result = await confirmNewPassword?.(data.email, data.password);
        if (result?.success) {
          router.push(PATH_AFTER_LOGIN);
        } else {
          console.error(result?.error);
          setErrorMsg(result?.error || t('password_confirmation_failed'));
        }
      } else {
        // Forgot password flow
        const result = await newPassword?.(data.email, data.code || '', data.password);
        if (result?.success) {
          router.push(paths.auth.amplify.login);
        } else {
          // Handle specific error types
          let errorMessage = '';
          switch (result?.error) {
            case 'INVALID_CODE':
              errorMessage = t('invalid_code');
              break;
            case 'CODE_EXPIRED':
              errorMessage = t('code_expired');
              break;
            case 'INVALID_PASSWORD':
              errorMessage = t('invalid_password');
              break;
            default:
              errorMessage = result?.error || t('password_reset_failed');
          }
          setErrorMsg(errorMessage);
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(t('password_reset_failed'));
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await forgotPassword?.(values.email);
    } catch (error) {
      console.error(error);
    }
  }, [forgotPassword, startCountdown, values.email]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      
      <RHFTextField
        name="email"
        label={t('email_label')}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />

      {!session && <RHFCode name="code" />}

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

      <RHFTextField
        name="confirmPassword"
        label={t('confirm_password_label')}
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('new_password_label_button')}
      </LoadingButton>

      {!session && (
        <Typography variant="body2">
          {`${t("dont_have_code")}? `}
          <Link
            variant="subtitle2"
            onClick={handleResendCode}
            sx={{
              cursor: 'pointer',
              ...(counting && {
                color: 'text.disabled',
                pointerEvents: 'none',
              }),
            }}
          >
            {t('resend_code')} {counting && `(${countdown}s)`}
          </Link>
        </Typography>
      )}

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
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">
          {session ? t('new_password_required') : t('request_send_success')}!
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {session 
            ? t('new_password_required_description')
            : `${t('request_send_description')}.
              <br />
              ${t('enter_code_description')}`
          }
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
