// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';
// hooks
import { useOffSetTop } from 'hooks/use-off-set-top';
import { useResponsive } from 'hooks/use-responsive';
// theme
import { bgBlur } from 'theme/css';
// components
import Logo from 'components/logo';
//
import { useLocales } from 'locales';
import { useModules } from 'hooks/use-modules';
import { HEADER } from '../config-layout';
import { NavConfigT } from './config-navigation';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
//
import { SettingsButton, HeaderShadow, LoginButton, LanguagePopover } from '../_common';

// ----------------------------------------------------------------------

export default function Header() {
  const { t } = useLocales();
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  const { i18n } = useModules();

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Badge
            sx={{
              [`& .${badgeClasses.badge}`]: {
                top: 8,
                right: -16,
              },
            }}
          >
            <Logo />
          </Badge>

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop offsetTop={offsetTop} data={NavConfigT(t)} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            {/* {mdUp && <LoginButton />} */}
            <LoginButton />

            <SettingsButton
              sx={{
                ml: { xs: 1, md: 0 },
                mr: { md: 2 },
              }}
            />
            {i18n && (
              <LanguagePopover
                sx={{
                  ml: { xs: 1, md: 0 },
                  mr: { md: 2 },
                }}
              />
            )}
            {!mdUp && <NavMobile offsetTop={offsetTop} data={NavConfigT(t)} />}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
