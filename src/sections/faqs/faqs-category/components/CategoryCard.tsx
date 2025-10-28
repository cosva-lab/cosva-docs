import type { IFAQCategory, IFAQCategoryI18n } from 'types/faq';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';
// components
import Image from 'components/image';
import TextMaxLine from 'components/text-max-line';
import { useEntityTranslation } from 'hooks/use-entity-translation';

type CategoryCardProps = {
  category: IFAQCategory;
  isSelected?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
};

// CategoryCard component
const CategoryCard = ({
  category,
  isSelected,
  onClick,
  isMobile = false,
}: CategoryCardProps) => {
  const { getTranslation } = useEntityTranslation<IFAQCategoryI18n>();
  const name = getTranslation(category.translations)?.name || 'Category';
  const logoUrl =
    typeof category.logoData === 'object' &&
    category.logoData &&
    'urls' in category.logoData
      ? (category.logoData.urls as { original?: string })?.original
      : undefined;

  // Mobile-specific styles
  const mobileStyles = isMobile
    ? {
        border: isSelected ? '2px solid' : '1px solid',
        '&:hover': {
          bgcolor: 'background.neutral',
          borderColor: 'primary.main',
          boxShadow: (theme: Theme) => theme.customShadows.z8,
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0px)',
        },
      }
    : {
        border: isSelected ? '1.5px solid' : '1px solid',
        '&:hover': {
          bgcolor: 'background.neutral',
          borderColor: 'primary.main',
          boxShadow: (theme: Theme) => theme.customShadows.z8,
        },
      };

  // Image dimensions based on device type
  const imageSize = isMobile ? 56 : 60;
  const borderRadius = isMobile ? 1.5 : 1;
  const typographyVariant = isMobile ? 'h5' : 'h4';

  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: isSelected ? 'action.selected' : 'background.paper',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        borderColor: isSelected ? 'primary.main' : 'divider',
        boxShadow: isSelected
          ? (theme: Theme) =>
              `0 0 0 3px ${theme.palette.primary.main}${
                theme.palette.mode === 'dark' ? '40' : '15'
              }`
          : 'none',
        ...mobileStyles,
      }}
    >
      {logoUrl ? (
        <Image
          disabledEffect
          alt={name}
          src={logoUrl}
          sx={{
            mb: 1.5,
            width: imageSize,
            height: imageSize,
            mx: 'auto',
            borderRadius: borderRadius,
            objectFit: 'cover',
          }}
        />
      ) : (
        <Box
          sx={{
            mb: 1.5,
            width: imageSize,
            height: imageSize,
            mx: 'auto',
            borderRadius: borderRadius,
            bgcolor: 'background.neutral',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant={typographyVariant}
            sx={{
              color: 'text.secondary',
              fontWeight: 700,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Typography>
        </Box>
      )}

      <TextMaxLine variant="subtitle2" persistent>
        {name}
      </TextMaxLine>
    </Paper>
  );
};

export default CategoryCard;
