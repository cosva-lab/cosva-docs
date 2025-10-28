import { useRef, useEffect, useState } from 'react';
import type { IFAQCategory } from 'types/faq';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'hooks/use-responsive';
// components
import Iconify from 'components/iconify';
import { useLocales } from 'locales';
import CategoryCard from './components/CategoryCard';

// ----------------------------------------------------------------------

type Props = {
  categories: IFAQCategory[];
  selectedCategoryId?: string | undefined;
  onSelectCategory?: (categoryId: string | undefined) => void;
  loading?: boolean;
};

export default function FaqsCategory({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
  loading = false,
}: Props) {
  const mdUp = useResponsive('up', 'md');
  const { t } = useLocales();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showButtons, setShowButtons] = useState(false);

  const categoryWidth = 160;

  // Check if content overflows 80% of available width
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current && categories.length > 0) {
        const { clientWidth } = scrollRef.current;

        // Calculate total width needed: (category width + gap) * count
        const gap = 8 * 2; // 8px = 1 (theme spacing), gap: 2
        const totalWidthNeeded = categories.length * (categoryWidth + gap);

        // Show buttons if total width exceeds 80% of available space
        const maxAllowedWidth = clientWidth * 0.8;
        const shouldShowButtons = totalWidthNeeded > maxAllowedWidth;

        setShowButtons(shouldShowButtons);
      } else {
        setShowButtons(false);
      }
    };

    // Delay to ensure content is rendered
    const timeoutId = setTimeout(checkOverflow, 100);

    window.addEventListener('resize', checkOverflow);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [categories, loading]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryClick = (categoryId: string | undefined) => {
    // If clicking the same category, deselect it
    if (selectedCategoryId === categoryId) {
      onSelectCategory?.(undefined);
    } else {
      onSelectCategory?.(categoryId);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
        }}
      >
        {[...Array(6)].map((_, index) => (
          <Box
            key={index}
            sx={{ minWidth: categoryWidth, width: categoryWidth }}
          >
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Skeleton
                variant="circular"
                width={60}
                height={60}
                sx={{ mx: 'auto', mb: 2 }}
              />
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                sx={{ mx: 'auto' }}
              />
            </Paper>
          </Box>
        ))}
      </Box>
    );
  }

  const header = (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ mb: 1, fontWeight: 600 }}>
          {t('pages.categories')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Tap a category to filter FAQs
        </Typography>
      </Box>
    </>
  );
  if (!mdUp) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          mb: 3,
        }}
      >
        {/* Mobile categories header */}
        {header}
        {/* Mobile categories grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
            px: 1,
          }}
        >
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategoryId === category.id}
              onClick={() => handleCategoryClick(category.id)}
              isMobile={true}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (categories.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
          borderRadius: 2,
          bgcolor: 'background.neutral',
          border: '2px dashed',
          borderColor: 'divider',
        }}
      >
        <Iconify
          icon="eva:question-mark-circle-outline"
          width={64}
          sx={{ color: 'text.disabled', mb: 2 }}
        />
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          {t('faq:categories.no_categories')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          {t('faq:categories.no_categories_desc')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
      }}
    >
      {header}
      {/* Left gradient fade */}
      {showButtons && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 80,
              background: theme =>
                `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
              pointerEvents: 'none',
              zIndex: 9,
            }}
          />

          <IconButton
            className="scroll-button"
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: theme => `0 4px 20px ${theme.palette.grey[500]}40`,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
                boxShadow: theme => `0 6px 24px ${theme.palette.grey[500]}60`,
              },
            }}
          >
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>
        </>
      )}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          overflowY: 'visible',
          pb: 2,
          px: showButtons ? 4 : 0,
          scrollbarWidth: 'thin',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            borderRadius: 4,
            bgcolor: 'background.neutral',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 4,
            bgcolor: 'text.disabled',
            '&:hover': {
              bgcolor: 'text.secondary',
            },
          },
        }}
      >
        {categories.map(category => (
          <Box
            key={category.id}
            sx={{
              minWidth: categoryWidth,
              width: categoryWidth,
              py: 0.5, // Space for hover transform
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CategoryCard
              category={category}
              isSelected={selectedCategoryId === category.id}
              onClick={() => handleCategoryClick(category.id)}
              isMobile={false}
            />
          </Box>
        ))}
      </Box>

      {/* Right gradient fade */}
      {showButtons && (
        <>
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 80,
              background: theme =>
                `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
              pointerEvents: 'none',
              zIndex: 9,
            }}
          />

          <IconButton
            className="scroll-button"
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: theme => `0 4px 20px ${theme.palette.grey[500]}40`,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
                boxShadow: theme => `0 6px 24px ${theme.palette.grey[500]}60`,
              },
            }}
          >
            <Iconify icon="eva:arrow-ios-forward-fill" />
          </IconButton>
        </>
      )}
    </Box>
  );
}
