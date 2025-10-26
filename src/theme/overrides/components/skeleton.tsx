import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function skeleton(theme: Theme) {
  return {
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.neutral,
        },
        rounded: {
          borderRadius:
            typeof theme.shape.borderRadius === 'number'
              ? theme.shape.borderRadius * 2
              : `calc(${theme.shape.borderRadius} * 2)`,
        },
      },
    },
  };
}
