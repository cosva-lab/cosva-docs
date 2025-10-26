import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

interface ThemeProps {
  children: React.ReactNode;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#81c04d',
      darker: '#81c04d',
      lighter: '#81c04d',
    },
    secondary: {
      main: '#82ccf1',
      darker: '#82ccf1',
      lighter: '#82ccf1',
    },
  },
});

const Theme = ({ children }: ThemeProps) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default Theme;
