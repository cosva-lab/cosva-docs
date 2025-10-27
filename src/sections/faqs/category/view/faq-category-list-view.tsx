import { useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'routes/paths';
import { RouterLink } from 'routes/components';
// api
import { useGetFAQCategories } from 'api/faq';
// components
import Iconify from 'components/iconify';
import { useSettingsContext } from 'components/settings';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
//
import FAQCategoryList from '../faq-category-list';
import { useRouter } from 'routes/hooks';

// ----------------------------------------------------------------------

export default function FAQCategoryListView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const { categories, categoriesLoading } = useGetFAQCategories();

  const handleEdit = (category: any) => {
    router.push(paths.dashboard.faqCategory.edit(category.id));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="FAQ Categories"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'FAQ Categories',
            href: paths.dashboard.faqCategory.root,
          },
          {
            name: 'List',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.faqCategory.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Category
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FAQCategoryList categories={categories} loading={categoriesLoading} onEdit={handleEdit} />
    </Container>
  );
}

