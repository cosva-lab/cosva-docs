import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'routes/paths';
import { RouterLink } from 'routes/components';

// ----------------------------------------------------------------------

export default function AmplifyRegisterView() {
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">Self-service sign-up is disabled</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link href={paths.auth.amplify.login} component={RouterLink} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Alert severity="info">
        Self-service sign-up is currently disabled. Please contact an administrator to create your account.
      </Alert>
      
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
        If you need access to this application, please reach out to your system administrator.
      </Typography>
    </Stack>
  );

  return (
    <div>
      {renderHead}
      {renderForm}
    </div>
  );
}
