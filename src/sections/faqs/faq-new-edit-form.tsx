import * as Yup from 'yup';
import { useCallback, useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// hooks
import { useBoolean } from 'hooks/use-boolean';
import { useResponsive } from 'hooks/use-responsive';
// routes
import { paths } from 'routes/paths';
import { useRouter } from 'routes/hooks';
// types
import type { IFAQ, IFAQCategory } from 'types/faq';
// components
import { useSnackbar } from 'components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from 'components/hook-form';
// api
import { useGetFAQCategories } from 'api/faq';

// ----------------------------------------------------------------------

type Props = {
  currentFAQ?: IFAQ;
};

export default function FAQNewEditForm({ currentFAQ }: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const { categories } = useGetFAQCategories();

  const FAQSchema = Yup.object().shape({
    categoryId: Yup.string().required('Category is required'),
    tags: Yup.array().min(1, 'Must have at least 1 tag'),
    status: Yup.string().required('Status is required'),
    // Translations
    question: Yup.string().required('Question is required'),
    answer: Yup.string().required('Answer is required'),
  });

  const defaultValues = useMemo(
    () => ({
      categoryId: currentFAQ?.categoryId || '',
      tags: currentFAQ?.tags || [],
      status: currentFAQ?.status || 'ACTIVE',
      question: currentFAQ?.translations?.[0]?.question || '',
      answer: currentFAQ?.translations?.[0]?.answer || '',
      lang: 'en',
    }),
    [currentFAQ]
  );

  const methods = useForm({
    resolver: yupResolver(FAQSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentFAQ) {
      reset(defaultValues);
    }
  }, [currentFAQ, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentFAQ ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.faq.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid size={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Category, tags, status...
          </Typography>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                label="Category"
                value={watch('categoryId')}
                onChange={(e) => setValue('categoryId', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.translations?.[0]?.name || category.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                label="Status"
                value={watch('status')}
                onChange={(e) => setValue('status', e.target.value as any)}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="ARCHIVED">Archived</MenuItem>
              </Select>
            </FormControl>

            <RHFTextField name="question" label="Question" />

            <RHFTextField name="answer" label="Answer" multiline rows={6} />

            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={['account', 'billing', 'support', 'technical'].map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid size={{ md: 4 }} />}
      <Grid
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
        size={{ xs: 12, md: 8 }}
      >
        <Button color="inherit" variant="outlined" size="large" onClick={() => router.back()}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentFAQ ? 'Create FAQ' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

