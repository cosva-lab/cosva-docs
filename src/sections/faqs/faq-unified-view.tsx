import { useMemo, useState } from 'react';
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
  useGetFAQs,
  updateCategoryOrder,
  updateFAQOrder,
} from 'api/faq';
// routes
import { paths } from 'routes/paths';
import { RouterLink } from 'routes/components';
import { useRouter } from 'routes/hooks';
// types
import { IFAQ, IFAQCategory, StatusEnum } from 'types/faq';

// ----------------------------------------------------------------------

type Props = {
  onEditCategory?: (category: IFAQCategory) => void;
  onEditFAQ?: (faq: IFAQ) => void;
};

export default function FAQUnifiedView({ onEditCategory, onEditFAQ }: Props) {
  const settings = useSettingsContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
  const [statusFilter, setStatusFilter] = useState<'all' | StatusEnum>('all');
  
  // Get counts from API
  const counts = useGetFAQCategoryCounts();
  
  // Get filtered categories for display
  const {
    categories,
    categoriesLoading,
    mutate: mutateCategories,
  } = useGetFAQCategories(statusFilter);
  const { faqs, faqsLoading, mutate: mutateFAQs } = useGetFAQs();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group FAQs by category and sort both categories and FAQs
  const faqsByCategory = useMemo(() => {
    const grouped: Record<string, IFAQ[]> = {};

    faqs.forEach(faq => {
      if (!grouped[faq.categoryId]) {
        grouped[faq.categoryId] = [];
      }
      grouped[faq.categoryId].push(faq);
    });

    // Sort FAQs within each category by order
    Object.keys(grouped).forEach(categoryId => {
      grouped[categoryId].sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        return orderA - orderB;
      });
    });

    return grouped;
  }, [faqs]);

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

      const newCategories = arrayMove(localCategories, oldIndex, newIndex);
      setLocalCategories(newCategories);

      // Update orders in database
      try {
        await Promise.all(
          newCategories.map(async (category, index) => {
            const result = await updateCategoryOrder(category.id, index);
            if (result.error) {
              throw new Error(
                `Error updating order for ${category.translations?.[0]?.name}`
              );
            }
            return result;
          })
        );

        mutateCategories();
        enqueueSnackbar('Category order updated', { variant: 'success' });
      } catch (error) {
        console.error('Error updating category orders:', error);
        enqueueSnackbar('Error updating category order', { variant: 'error' });
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
        const newFAQs = arrayMove(categoryFAQs, oldIndex, newIndex);

        // Update orders in database
        try {
          await Promise.all(
            newFAQs.map(async (faq, index) => {
              const result = await updateFAQOrder(faq.id, index);
              if (result.error) {
                throw new Error(`Error updating order for FAQ`);
              }
              return result;
            })
          );

          mutateFAQs();
          enqueueSnackbar('FAQ order updated', { variant: 'success' });
        } catch (error) {
          console.error('Error updating FAQ orders:', error);
          enqueueSnackbar('Error updating FAQ order', { variant: 'error' });
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
        onEditCategory={onEditCategory}
        categoryFAQs={categoryFAQs}
        onEditFAQ={onEditFAQ}
        onFAQsDragEnd={e => handleFAQsDragEnd(category.id, e)}
        router={router}
        categoryId={category.id}
      />
    );
  };

  const renderSkeleton = (
    <>
      {[...Array(6)].map((_, index) => (
        <Grid key={index} size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
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
        heading="Categorías de FAQs"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'FAQs',
          },
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              component={RouterLink}
              href={paths.dashboard.faqCategory.new}
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Category
            </Button>
            <Button
              component={RouterLink}
              href={paths.dashboard.faq.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New FAQ
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
        {['all', 'ACTIVE', 'INACTIVE', 'ARCHIVED'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === statusFilter) && 'filled') || 'soft'}
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
        {categoriesLoading || faqsLoading ? (
          renderSkeleton
        ) : categories.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 8, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                No categories yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first category to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => router.push(paths.dashboard.faqCategory.new)}
              >
                Create Category
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
  onEditCategory?: (category: IFAQCategory) => void;
  categoryFAQs: IFAQ[];
  onEditFAQ?: (faq: IFAQ) => void;
  onFAQsDragEnd: (event: DragEndEvent) => void;
  router: ReturnType<typeof useRouter>;
  categoryId: string;
};

function SortableCategoryItem({
  category,
  onEditCategory,
  categoryFAQs,
  onEditFAQ,
  onFAQsDragEnd,
  router,
  categoryId,
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
                  {category.translations?.[0]?.name || 'Unnamed Category'}
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
                onClick={e => {
                  e.stopPropagation();
                  onEditCategory?.(category);
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
                No FAQs in this category yet
              </Typography>
            ) : (
              <DndContext sensors={faqSensors} onDragEnd={onFAQsDragEnd}>
                <SortableContext items={categoryFAQs.map(f => f.id)}>
                  <Stack spacing={2}>
                    {categoryFAQs.map(faq => (
                      <SortableFAQItem
                        key={faq.id}
                        faq={faq}
                        onEditFAQ={onEditFAQ}
                      />
                    ))}
                  </Stack>
                </SortableContext>
              </DndContext>
            )}

            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() =>
                router.push(
                  `${paths.dashboard.faq.new}?categoryId=${categoryId}`
                )
              }
              sx={{ mt: 1 }}
            >
              Add FAQ to this category
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

type SortableFAQItemProps = {
  faq: IFAQ;
  onEditFAQ?: (faq: IFAQ) => void;
};

function SortableFAQItem({ faq, onEditFAQ }: SortableFAQItemProps) {
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
              {faq.translations?.[0]?.question || 'No question'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {faq.translations?.[0]?.answer || 'No answer'}
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
            <IconButton size="small" onClick={() => onEditFAQ?.(faq)}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
