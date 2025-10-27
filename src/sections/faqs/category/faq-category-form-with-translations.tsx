import { useState, useMemo, useCallback } from 'react';
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
import type { LanguageCode } from 'components/language-selector';
import type { Translation } from 'components/language-selector/language-selector';
import type { FileData } from 'types/files';
// api
import { createFAQCategory, updateFAQCategory } from 'api/faq';
// components
import { useSnackbar } from 'components/snackbar';
import { LanguageSelector } from 'components/language-selector';
import { Upload } from 'components/upload';
import TextField from '@mui/material/TextField';
// utils
import { uploadFileToStorage } from 'utils/upload-file';

// ----------------------------------------------------------------------

type Props = {
  currentCategory?: IFAQCategory;
};

export default function FAQCategoryFormWithTranslations({
  currentCategory,
}: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();

  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'ARCHIVED'>(
    currentCategory?.status || 'ACTIVE'
  );
  const [logo, setLogo] = useState<File | null>(null);
  const [logoData, setLogoData] = useState<FileData | null>(
    (currentCategory?.logoData as FileData) || null
  );
  const [uploading, setUploading] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('es');

  // Initialize translations from existing category
  const [translations, setTranslations] = useState<Translation[]>(() => {
    if (currentCategory?.translations) {
      return currentCategory.translations.map(t => ({
        lang: t.lang as LanguageCode,
        values: {
          name: t.name || '',
          description: t.description || '',
        },
      }));
    }
    return [
      { lang: 'es' as LanguageCode, values: { name: '', description: '' } },
    ];
  });

  const currentValues = useMemo(() => {
    return (
      translations.find(t => t.lang === selectedLang)?.values || {
        name: '',
        description: '',
      }
    );
  }, [translations, selectedLang]);

  const updateTranslation = useCallback(
    (lang: LanguageCode, field: string, value: string) => {
      setTranslations(prev =>
        prev.map(t =>
          t.lang === lang
            ? { ...t, values: { ...t.values, [field]: value } }
            : t
        )
      );
    },
    []
  );

  const addLanguage = useCallback((lang: LanguageCode) => {
    setTranslations(prev => {
      if (prev.find(t => t.lang === lang)) return prev;
      return [...prev, { lang, values: { name: '', description: '' } }];
    });
    setSelectedLang(lang);
  }, []);

  const removeLanguage = useCallback(
    (lang: LanguageCode) => {
      if (translations.length <= 1) return;
      setTranslations(prev => prev.filter(t => t.lang !== lang));
      if (selectedLang === lang) {
        const newLang = translations.find(t => t.lang !== lang);
        if (newLang) setSelectedLang(newLang.lang);
      }
    },
    [translations, selectedLang]
  );

  const onSubmit = useCallback(async () => {
    try {
      setUploading(true);

      // Upload file if there's a new logo
      let finalLogoData = logoData;
      if (logo) {
        finalLogoData = await uploadFileToStorage({
          file: logo,
          model: 'categories',
        });
      }

      const translationsData = translations.map(t => ({
        lang: t.lang,
        name: t.values.name || '',
        description: t.values.description || '',
      }));

      if (currentCategory) {
        // Update existing category
        const result = await updateFAQCategory(currentCategory.id, {
          logoData: finalLogoData || undefined,
          status,
          translations: translationsData,
        });

        if (result.error) {
          enqueueSnackbar('Error updating category', { variant: 'error' });
          return;
        }
      } else {
        // Create new category
        const result = await createFAQCategory({
          logoData: finalLogoData || undefined,
          status,
          translations: translationsData,
        });

        if (result.error) {
          enqueueSnackbar('Error creating category', { variant: 'error' });
          return;
        }
      }

      enqueueSnackbar(currentCategory ? 'Update success!' : 'Create success!', {
        variant: 'success',
      });
      router.push(paths.dashboard.faq.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('An error occurred', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  }, [
    translations,
    status,
    logo,
    logoData,
    currentCategory,
    enqueueSnackbar,
    router,
  ]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setLogo(file);
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setLogo(null);
    setLogoData(null);
  }, []);

  const renderLanguageSelector = (
    <Grid size={{ xs: 12 }}>
      <Card>
        <CardHeader title="Translations" />
        <Stack spacing={3} sx={{ p: 3 }}>
          <LanguageSelector
            translations={translations}
            selectedLang={selectedLang}
            onLangChange={setSelectedLang}
            onAddLang={addLanguage}
            onRemoveLang={removeLanguage}
          />
        </Stack>
      </Card>
    </Grid>
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid size={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Name, description, status...
          </Typography>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={currentValues.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateTranslation(selectedLang, 'name', e.target.value)
              }
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={currentValues.description || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateTranslation(selectedLang, 'description', e.target.value)
              }
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={e =>
                  setStatus(
                    e.target.value as 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
                  )
                }
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="ARCHIVED">Archived</MenuItem>
              </Select>
            </FormControl>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Logo</Typography>
              <Upload
                file={logo ? logo : logoData?.urls?.original || null}
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
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
        size={{ xs: 12, md: 8 }}
      >
        <Button
          color="inherit"
          variant="outlined"
          size="large"
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        <LoadingButton
          variant="contained"
          size="large"
          onClick={onSubmit}
          loading={uploading}
          disabled={uploading}
          sx={{ ml: 2 }}
        >
          {!currentCategory ? 'Create Category' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <Grid container spacing={3}>
      {renderLanguageSelector}
      {renderDetails}
      {renderActions}
    </Grid>
  );
}
