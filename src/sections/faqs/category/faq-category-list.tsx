// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// components
import Label from 'components/label';
import Iconify from 'components/iconify';
import IconButton from '@mui/material/IconButton';
//
import { IFAQCategoryItemSkeleton } from './faq-category-skeleton';
import { IFAQCategory } from 'types/faq';

// ----------------------------------------------------------------------

type Props = {
  categories: IFAQCategory[];
  loading?: boolean;
  onEdit?: (category: IFAQCategory) => void;
};

export default function FAQCategoryList({ categories, loading, onEdit }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(6)].map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
          <IFAQCategoryItemSkeleton />
        </Grid>
      ))}
    </>
  );

  const renderList = (
    <>
      {categories.map((category) => (
        <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Avatar
                    src={typeof category.logoData === 'object' && category.logoData ? (category.logoData as any)?.urls?.thumb : undefined}
                    alt={category.translations?.[0]?.name || 'Category'}
                    sx={{ width: 56, height: 56 }}
                  >
                    <Iconify icon="solar:question-circle-bold" width={40} />
                  </Avatar>
                  
                  <Label
                    color={
                      (category.status === 'ACTIVE' && 'success') ||
                      (category.status === 'INACTIVE' && 'warning') ||
                      'default'
                    }
                    variant="soft"
                  >
                    {category.status || 'N/A'}
                  </Label>
                </Stack>

                <Typography variant="h6">{category.translations?.[0]?.name || 'Unnamed'}</Typography>

                {category.translations?.[0]?.description && (
                  <Typography variant="body2" color="text.secondary">
                    {category.translations[0].description}
                  </Typography>
                )}
              </Stack>
            </CardContent>

            <CardActions>
              <Button
                size="small"
                startIcon={<Iconify icon="solar:eye-bold" />}
                onClick={() => onEdit?.(category)}
              >
                View
              </Button>
              <Button
                size="small"
                startIcon={<Iconify icon="solar:pen-bold" />}
                onClick={() => onEdit?.(category)}
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </>
  );

  return (
    <Grid container spacing={3}>
      {loading ? renderSkeleton : renderList}
    </Grid>
  );
}

