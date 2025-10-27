import { useCallback, useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'routes/paths';
import { RouterLink } from 'routes/components';
// api
import { useGetFAQs, useGetFAQCategories } from 'api/faq';
// components
import Label from 'components/label';
import Iconify from 'components/iconify';
import { useSettingsContext } from 'components/settings';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
// types
import type { IFAQ, IFAQFilters, IFAQFilterValue } from 'types/faq';
//
import FAQList from '../faq-list';

// ----------------------------------------------------------------------

const defaultFilters: IFAQFilters = {
  status: 'all',
  category: 'all',
};

// ----------------------------------------------------------------------

export default function FAQListView() {
  const settings = useSettingsContext();
  const [filters, setFilters] = useState(defaultFilters);
  const { faqs, faqsLoading } = useGetFAQs();
  const { categories } = useGetFAQCategories();

  const handleFilters = useCallback((name: string, value: IFAQFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const dataFiltered = applyFilter({
    inputData: faqs,
    filters,
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="FAQs"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'FAQ',
            href: paths.dashboard.faq.root,
          },
          {
            name: 'List',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.faq.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New FAQ
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={filters.status}
        onChange={handleFilterStatus}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {['all', 'ACTIVE', 'INACTIVE', 'ARCHIVED'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters.status) && 'filled') || 'soft'}
                color={(tab === 'ACTIVE' && 'success') || 'default'}
              >
                {tab === 'all' && faqs.length}

                {tab === 'ACTIVE' && faqs.filter((faq) => faq.status === 'ACTIVE').length}

                {tab === 'INACTIVE' && faqs.filter((faq) => faq.status === 'INACTIVE').length}

                {tab === 'ARCHIVED' && faqs.filter((faq) => faq.status === 'ARCHIVED').length}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <FAQList faqs={dataFiltered} loading={faqsLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({
  inputData,
  filters,
}: {
  inputData: IFAQ[];
  filters: IFAQFilters;
}) => {
  const { status } = filters;

  if (status !== 'all') {
    inputData = inputData.filter((faq) => faq.status === status);
  }

  return inputData;
};

