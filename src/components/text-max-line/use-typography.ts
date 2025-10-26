// @mui
import { useTheme } from '@mui/material/styles';
// hooks
import { useWidth } from 'hooks/use-responsive';
import { TypographyVariant } from '@mui/material/styles/createTypography';
import { CSSProperties } from 'react';

// ----------------------------------------------------------------------

function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export default function useTypography(variant: TypographyVariant) {
  const theme = useTheme();

  const breakpoints = useWidth();

  const key = theme.breakpoints.up(breakpoints === 'xl' ? 'lg' : breakpoints);

  const hasResponsive =
    variant === 'h1' ||
    variant === 'h2' ||
    variant === 'h3' ||
    variant === 'h4' ||
    variant === 'h5' ||
    variant === 'h6';

  const getFont: CSSProperties =
    hasResponsive && theme.typography[variant][key]
      ? theme.typography[variant][key]
      : theme.typography[variant];

  const fontSize = remToPx(getFont.fontSize as string);

  const lineHeight = Number(theme.typography[variant].lineHeight) * fontSize;

  const { fontWeight, letterSpacing } = theme.typography[variant];

  return { fontSize, lineHeight, fontWeight, letterSpacing };
}
