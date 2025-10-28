import { useState, useMemo, useCallback, useEffect } from 'react';
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
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
// hooks
import { useResponsive } from 'hooks/use-responsive';
import { useTranslation } from 'react-i18next';
// routes
import { paths } from 'routes/paths';
import { useRouter } from 'routes/hooks';
// types
import type { IFAQ } from 'types/faq';
import type { LanguageCode, Translation } from 'components/language-selector';
// api
import { createFAQ, updateFAQ } from 'api/faq';
import { useGetFAQCategories } from 'api/faq';
// components
import { useSnackbar } from 'components/snackbar';
import { LanguageSelector } from 'components/language-selector';

// ----------------------------------------------------------------------

type Props = {
  currentFAQ?: IFAQ;
};

export default function FAQFormWithTranslations({ currentFAQ }: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const { categories } = useGetFAQCategories('all');
  const { t } = useTranslation('faq');

  // Get categoryId from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const categoryIdFromUrl = urlParams.get('categoryId');

  const [categoryId, setCategoryId] = useState<string>(
    currentFAQ?.categoryId || categoryIdFromUrl || ''
  );
  const [isCategoryLocked, setIsCategoryLocked] = useState(false);

  // Lock category if it comes from URL
  useEffect(() => {
    if (categoryIdFromUrl) {
      setIsCategoryLocked(true);
      setCategoryId(categoryIdFromUrl);
    }
  }, [categoryIdFromUrl]);
  const [tags, setTags] = useState<string[]>(() => {
    const faqTags = currentFAQ?.tags || [];
    return faqTags.filter((t): t is string => t !== null);
  });
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'ARCHIVED'>(
    currentFAQ?.status || 'ACTIVE'
  );
  const [uploading, setUploading] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('es');

  // Initialize translations from existing FAQ
  const [translations, setTranslations] = useState<Translation[]>(() => {
    if (currentFAQ?.translations) {
      return currentFAQ.translations.map(t => ({
        lang: t.lang as LanguageCode,
        values: {
          question: t.question || '',
          answer: t.answer || '',
        },
      }));
    }
    return [
      { lang: 'es' as LanguageCode, values: { question: '', answer: '' } },
    ];
  });

  const currentValues = useMemo(() => {
    return (
      translations.find(t => t.lang === selectedLang)?.values || {
        question: '',
        answer: '',
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
      return [...prev, { lang, values: { question: '', answer: '' } }];
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

      const translationsData = translations.map(t => ({
        lang: t.lang,
        question: t.values.question || '',
        answer: t.values.answer || '',
      }));

      if (currentFAQ) {
        // Update existing FAQ
        const result = await updateFAQ(currentFAQ.id, {
          categoryId,
          tags,
          status,
          translations: translationsData,
        });

        if (result.error) {
          enqueueSnackbar(t('faq.error_updating'), { variant: 'error' });
          return;
        }
      } else {
        // Create new FAQ
        const result = await createFAQ({
          categoryId,
          tags,
          status,
          translations: translationsData,
        });

        if (result.error) {
          enqueueSnackbar(t('faq.error_creating'), { variant: 'error' });
          return;
        }
      }

      enqueueSnackbar(
        currentFAQ ? t('faq.update_success') : t('faq.create_success'),
        { variant: 'success' }
      );
      router.push(paths.dashboard.faq.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('faq.error_occurred'), { variant: 'error' });
    } finally {
      setUploading(false);
    }
  }, [
    translations,
    categoryId,
    tags,
    status,
    currentFAQ,
    enqueueSnackbar,
    router,
    t,
  ]);

  const handleAddTag = useCallback((tag: string) => {
    setTags(prev => {
      if (prev.includes(tag)) return prev;
      return [...prev, tag];
    });
  }, []);

  const handleRemoveTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  }, []);

  const renderLanguageSelector = (
    <Grid size={{ xs: 12 }}>
      <Card>
        <CardHeader title={t('faq.translations_title')} />
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
            {t('faq.details_title')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('faq.details_subtitle')}
          </Typography>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          {!mdUp && <CardHeader title={t('faq.details_title')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <FormControl fullWidth>
              <InputLabel>{t('faq.category')}</InputLabel>
              <Select
                value={categoryId}
                label={t('faq.category')}
                onChange={e => setCategoryId(e.target.value)}
                disabled={isCategoryLocked}
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.translations?.[0]?.name || category.id}
                  </MenuItem>
                ))}
              </Select>
              {isCategoryLocked && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: 'block' }}
                >
                  {t('faq.category_locked')}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('faq.status')}</InputLabel>
              <Select
                value={status}
                label={t('faq.status')}
                onChange={e =>
                  setStatus(
                    e.target.value as 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
                  )
                }
              >
                <MenuItem value="ACTIVE">{t('common.active')}</MenuItem>
                <MenuItem value="INACTIVE">{t('common.inactive')}</MenuItem>
                <MenuItem value="ARCHIVED">{t('common.archived')}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={t('faq.question')}
              value={currentValues.question || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateTranslation(selectedLang, 'question', e.target.value)
              }
            />

            <TextField
              fullWidth
              label={t('faq.answer')}
              multiline
              rows={6}
              value={currentValues.answer || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateTranslation(selectedLang, 'answer', e.target.value)
              }
            />

            <Stack spacing={2}>
              <Typography variant="subtitle2">{t('faq.tags')}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))}
                <TextField
                  size="small"
                  placeholder={t('faq.add_tag')}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget as HTMLInputElement;
                      if (input.value) {
                        handleAddTag(input.value);
                        input.value = '';
                      }
                    }
                  }}
                  sx={{ minWidth: 120 }}
                />
              </Stack>
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
          {t('faq.cancel')}
        </Button>

        <LoadingButton
          variant="contained"
          size="large"
          onClick={onSubmit}
          loading={uploading}
          disabled={uploading}
          sx={{ ml: 2 }}
        >
          {!currentFAQ ? t('faq.create') : t('faq.save_changes')}
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
