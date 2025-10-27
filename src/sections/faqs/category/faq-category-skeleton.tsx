// @mui
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export function IFAQCategoryItemSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Skeleton variant="circular" width={56} height={56} />
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
          </Stack>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </Stack>
      </CardContent>
      <CardActions>
        <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
      </CardActions>
    </Card>
  );
}

