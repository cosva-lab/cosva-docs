import { memo } from 'react';
// @mui
import Box, { BoxProps } from '@mui/material/Box';
import { Theme } from '@mui/material/styles';
// utils
import { sanitizeHtml } from 'utils/sanitizeHtml';
import { SystemStyleObject } from '@mui/system';
import { richStyles, simpleStyles } from './styles';

// ----------------------------------------------------------------------

type HtmlContentProps = BoxProps & {
  html: string;
  variant?: 'rich' | 'simple';
  sx?: SystemStyleObject<Theme>;
};

function HtmlContent({
  html,
  variant = 'rich',
  sx,
  ...other
}: HtmlContentProps) {
  const sanitizedHtml = sanitizeHtml(html || '');

  const defaultStyles: SystemStyleObject<Theme> =
    variant === 'rich' ? richStyles : simpleStyles;

  return (
    <Box
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      sx={{ ...defaultStyles, ...sx }}
      {...other}
    />
  );
}

export default memo(HtmlContent);
