// @mui
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Accordion from '@mui/material/Accordion';
import CardContent from '@mui/material/CardContent';

// ----------------------------------------------------------------------

export function IFAQItemSkeleton() {
  return (
    <Card>
      <Accordion>
        <CardContent>
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Accordion>
    </Card>
  );
}
