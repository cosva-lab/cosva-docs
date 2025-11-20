import { useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// api
import { useGetFAQCategories, useGetFAQs } from 'api/faq';
// components
import { useLocales } from 'locales';
import Iconify from 'components/iconify';
import FaqsHero from '../faqs-hero';
import FaqsList from '../faqs-list';
import FaqsForm from '../faqs-form';
import FaqsCategory from '../faqs-category';
import { useEntityTranslation } from 'hooks/use-entity-translation';
import { IFAQCategoryI18n } from 'types/faq';

// ----------------------------------------------------------------------

export default function FaqsView() {
  const { t } = useLocales();
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();

  // Get all categories (only ACTIVE ones for public view)
  const { categories, categoriesLoading } = useGetFAQCategories('ACTIVE');

  // Get FAQs (filtered by category if one is selected)
  const { faqs, faqsLoading } = useGetFAQs(selectedCategoryId);

  // Filter active FAQs
  const activeFAQs = faqs.filter(faq => faq.status === 'ACTIVE');

  // Get category name from selected category
  const selectedCategory = categories.find(
    cat => cat.id === selectedCategoryId
  );

  const { getTranslation } = useEntityTranslation<IFAQCategoryI18n>();

  const translation = getTranslation(selectedCategory?.translations);
  const categoryName = translation?.name;
  const categoryDescription = translation?.description;

  const handleShowAll = () => {
    setSelectedCategoryId(undefined);
  };

  return (
    <>
      <FaqsHero />
      <Container
        sx={{
          pb: 10,
          pt: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <FaqsCategory
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          loading={categoriesLoading}
        />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mt: { xs: 3, md: 8 } }}
        >
          <Typography variant="h3">
            {categoryName || t('pages.frequently_asked')}
          </Typography>

          {selectedCategoryId && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:refresh-outline" />}
              onClick={handleShowAll}
            >
              {t('pages.frequently_asked')}
            </Button>
          )}
        </Stack>
        {categoryDescription && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              marginBottom: 3,
            }}
          >
            {categoryDescription}
          </Typography>
        )}
        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <FaqsList
            faqs={activeFAQs}
            selectedCategory={categoryName}
            loading={faqsLoading}
          />
          <FaqsForm />
        </Box>
      </Container>
    </>
  );
}
