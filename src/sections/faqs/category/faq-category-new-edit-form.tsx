import * as Yup from 'yup';
import { useCallback, useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// hooks
import { useResponsive } from 'hooks/use-responsive';
// routes
import { paths } from 'routes/paths';
import { useRouter } from 'routes/hooks';
// types
import type { IFAQCategory } from 'types/faq';
// components
import { useSnackbar } from 'components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUpload,
} from 'components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentCategory?: IFAQCategory;
};

export default function FAQCategoryNewEditForm({ currentCategory }: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    status: Yup.string().required('Status is required'),
    logoData: Yup.mixed(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCategory?.translations?.[0]?.name || '',
      description: currentCategory?.translations?.[0]?.description || '',
      status: currentCategory?.status || 'ACTIVE',
      logoData: currentCategory?.logoData || null,
    }),
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
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
    if (currentCategory) {
      reset(defaultValues);
    }
  }, [currentCategory, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentCategory ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.faqCategory.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('logoData', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('logoData', null);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid size={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Name, description, logo...
          </Typography>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Category Name" />

            <RHFTextField
              name="description"
              label="Description"
              multiline
              rows={4}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                label="Status"
                value={watch('status')}
                onChange={(e) => setValue('status', e.target.value as 'ACTIVE' | 'INACTIVE' | 'ARCHIVED')}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="ARCHIVED">Archived</MenuItem>
              </Select>
            </FormControl>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Logo</Typography>
              <RHFUpload
                name="logoData"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>
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
          {!currentCategory ? 'Create Category' : 'Save Changes'}
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

