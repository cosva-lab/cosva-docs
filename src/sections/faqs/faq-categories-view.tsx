import { useEffect, useMemo, useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// dnd
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// hooks
import { useTranslation } from 'react-i18next';
// components
import Iconify from 'components/iconify';
import Label from 'components/label';
import { useSettingsContext } from 'components/settings';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSnackbar } from 'components/snackbar';
// api
import {
  useGetFAQCategories,
  useGetFAQCategoryCounts,
  updateCategoryOrder,
  updateFAQOrder,
} from 'api/faq';
// routes
import { paths } from 'routes/paths';
import { RouterLink } from 'routes/components';
// types
import { IFAQ, IFAQCategory, StatusEnum } from 'types/faq';

export default function FAQCategoriesView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation('faq');

  const [statusFilter, setStatusFilter] = useState<'all' | StatusEnum>('all');

  // Get counts from API
  const counts = useGetFAQCategoryCounts();

  // Get filtered categories for display
  const {
    categories,
    categoriesLoading,
    mutate: mutateCategories,
  } = useGetFAQCategories(statusFilter);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Local state for FAQs organized by category
  const [faqsByCategoryState, setFaqsByCategoryState] = useState<
    Record<string, IFAQ[]>
  >({});

  // Initialize state from categories when they load
  useEffect(() => {
    const grouped: Record<string, IFAQ[]> = {};

    categories.forEach(category => {
      if (category.faqs) {
        const faqsArray = Array.isArray(category.faqs) ? category.faqs : [];
        if (faqsArray.length > 0) {
          // Sort FAQs by order
          const sortedFAQs = [...faqsArray].sort((a, b) => {
            const orderA = a.order ?? 999;
            const orderB = b.order ?? 999;
            return orderA - orderB;
          });
          grouped[category.id] = sortedFAQs as IFAQ[];
        }
      }
    });

    setFaqsByCategoryState(grouped);
  }, [categories]);

  const faqsByCategory = faqsByCategoryState;

  // Sort categories by order (no need to filter, already filtered by API)
  const [localCategories, setLocalCategories] =
    useState<IFAQCategory[]>(categories);

  useMemo(() => {
    const sorted = [...categories].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
    setLocalCategories(sorted);
  }, [categories]);

  const handleFilterStatus = (
    _event: React.SyntheticEvent,
    newValue: 'all' | StatusEnum
  ) => {
    setStatusFilter(newValue);
  };

  const handleCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localCategories.findIndex(c => c.id === active.id);
      const newIndex = localCategories.findIndex(c => c.id === over.id);

      // Optimistic update: update UI immediately
      const newCategories = arrayMove(localCategories, oldIndex, newIndex);
      const previousState = [...localCategories];

      setLocalCategories(newCategories);

      // Update orders in database
      try {
        const results = await Promise.all(
          newCategories.map((category, index) =>
            updateCategoryOrder(category.id, index)
          )
        );

        // Check if any result has an error
        const hasError = results.some(result => result.error);
        if (hasError) {
          throw new Error('One or more category order updates failed');
        }

        mutateCategories();
        enqueueSnackbar(t('categories.category_order_updated'), {
          variant: 'success',
        });
      } catch (error) {
        console.error('Error updating category orders:', error);
        // Rollback on error
        setLocalCategories(previousState);
        enqueueSnackbar(t('categories.error_order_update'), {
          variant: 'error',
        });
      }
    }
  };

  const handleFAQsDragEnd = async (categoryId: string, event: DragEndEvent) => {
    const { active, over } = event;
    const categoryFAQs = faqsByCategory[categoryId] || [];

    if (over && active.id !== over.id) {
      const oldIndex = categoryFAQs.findIndex(f => f.id === active.id);
      const newIndex = categoryFAQs.findIndex(f => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Optimistic update: update UI immediately
        const newFAQs = arrayMove(categoryFAQs, oldIndex, newIndex);
        const previousState = { ...faqsByCategoryState };

        setFaqsByCategoryState(prev => ({
          ...prev,
          [categoryId]: newFAQs,
        }));

        // Update orders in database
        try {
          const results = await Promise.all(
            newFAQs.map((faq, index) => updateFAQOrder(faq.id, index))
          );

          // Check if any result has an error
          const hasError = results.some(result => result.error);
          if (hasError) {
            throw new Error('One or more FAQ order updates failed');
          }

          mutateCategories();
          enqueueSnackbar(t('categories.faq_order_updated'), {
            variant: 'success',
          });
        } catch (error) {
          console.error('Error updating FAQ orders:', error);
          // Rollback on error
          setFaqsByCategoryState(previousState);
          enqueueSnackbar(t('categories.error_order_update'), {
            variant: 'error',
          });
        }
      }
    }
  };

  const renderCategoryItem = (category: IFAQCategory) => {
    const categoryFAQs = faqsByCategory[category.id] || [];

    return (
      <SortableCategoryItem
        key={category.id}
        category={category}
        categoryFAQs={categoryFAQs}
        onFAQsDragEnd={e => handleFAQsDragEnd(category.id, e)}
        categoryId={category.id}
        t={t}
      />
    );
  };

  const renderSkeleton = (
    <>
      {[...Array(6)].map((_, index) => (
        <Grid key={index} size={{ xs: 12 }}>
          <Card sx={{ p: 3, opacity: 0.5 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Iconify icon="solar:question-circle-bold" width={40} />
              <Stack flexGrow={1}>
                <Typography variant="subtitle1">Loading...</Typography>
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      ))}
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('categories.heading')}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: t('title'),
          },
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              component={RouterLink}
              href={paths.dashboard.faq.categories.new}
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('categories.new_category')}
            </Button>
            <Button
              component={RouterLink}
              href={paths.dashboard.faq.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('categories.new_faq')}
            </Button>
          </Stack>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={statusFilter}
        onChange={handleFilterStatus}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {['all', 'ACTIVE', 'INACTIVE', 'ARCHIVED'].map(tab => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={
                  ((tab === 'all' || tab === statusFilter) && 'filled') ||
                  'soft'
                }
                color={
                  (tab === 'ACTIVE' && 'success') ||
                  (tab === 'INACTIVE' && 'warning') ||
                  'default'
                }
              >
                {tab === 'all' && counts.all}
                {tab === 'ACTIVE' && counts.ACTIVE}
                {tab === 'INACTIVE' && counts.INACTIVE}
                {tab === 'ARCHIVED' && counts.ARCHIVED}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        {categoriesLoading ? (
          renderSkeleton
        ) : categories.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 8, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('categories.no_categories')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('categories.no_categories_desc')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                component={RouterLink}
                href={paths.dashboard.faq.categories.new}
              >
                {t('categories.create_category')}
              </Button>
            </Card>
          </Grid>
        ) : (
          <Grid size={{ xs: 12 }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCategoryDragEnd}
            >
              <SortableContext
                items={localCategories.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <Stack spacing={2}>
                  {localCategories.map(category =>
                    renderCategoryItem(category)
                  )}
                </Stack>
              </SortableContext>
            </DndContext>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

// ----------------------------------------------------------------------
// Sortable Components

type SortableCategoryItemProps = {
  category: IFAQCategory;
  categoryFAQs: IFAQ[];
  onFAQsDragEnd: (event: DragEndEvent) => void;
  categoryId: string;
  t: (key: string) => string;
};

function SortableCategoryItem({
  category,
  categoryFAQs,
  onFAQsDragEnd,
  categoryId,
  t,
}: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
  });

  const faqSensors = useSensors(useSensor(PointerSensor));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes}>
      <Accordion>
        <AccordionSummary
          expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexGrow={1}
            sx={{ pr: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={2} flexGrow={1}>
              <Box
                {...listeners}
                sx={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}
              >
                <Iconify
                  icon="eva:menu-2-fill"
                  sx={{ color: 'text.disabled' }}
                />
              </Box>

              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ minWidth: 48 }}
              >
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

              <Stack flexGrow={1}>
                <Typography variant="subtitle1">
                  {category.translations?.[0]?.name ||
                    t('categories.unnamed_category')}
                </Typography>
                {category.translations?.[0]?.description && (
                  <Typography variant="body2" color="text.secondary">
                    {category.translations[0].description}
                  </Typography>
                )}
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                component={RouterLink}
                href={paths.dashboard.faq.categories.edit(category.id)}
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Stack>
          </Stack>
        </AccordionSummary>

        <AccordionDetails onClick={e => e.stopPropagation()}>
          <Stack spacing={2}>
            {categoryFAQs.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                {t('categories.no_faqs_in_category')}
              </Typography>
            ) : (
              <DndContext sensors={faqSensors} onDragEnd={onFAQsDragEnd}>
                <SortableContext items={categoryFAQs.map(f => f.id)}>
                  <Stack spacing={2}>
                    {categoryFAQs.map(faq => (
                      <SortableFAQItem key={faq.id} faq={faq} t={t} />
                    ))}
                  </Stack>
                </SortableContext>
              </DndContext>
            )}

            <Button
              variant="outlined"
              component={RouterLink}
              startIcon={<Iconify icon="mingcute:add-line" />}
              href={`${paths.dashboard.faq.new}?categoryId=${categoryId}`}
              sx={{ mt: 1 }}
            >
              {t('categories.add_faq_to_category')}
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

type SortableFAQItemProps = {
  faq: IFAQ;
  t: (key: string) => string;
};

function SortableFAQItem({ faq, t }: SortableFAQItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: faq.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes}>
      <Card variant="outlined">
        <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
          <Box
            {...listeners}
            sx={{
              cursor: 'grab',
              mr: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Iconify icon="eva:menu-2-fill" sx={{ color: 'text.disabled' }} />
          </Box>

          <Stack flexGrow={1} spacing={0.5}>
            <Typography variant="subtitle2">
              {faq.translations?.[0]?.question || t('faq.no_question')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {faq.translations?.[0]?.answer || t('faq.no_answer')}
            </Typography>
            {faq.tags && faq.tags.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                {faq.tags.map(tag => (
                  <Typography
                    key={tag}
                    variant="caption"
                    color="text.secondary"
                  >
                    #{tag}
                  </Typography>
                ))}
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton
              component={RouterLink}
              href={paths.dashboard.faq.edit(faq.id)}
              size="small"
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
