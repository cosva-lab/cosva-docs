import { useEffect } from 'react';
// @mui
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
// hooks
import { useBoolean } from 'hooks/use-boolean';
// routes
import { usePathname } from 'routes/hooks';
import { useActiveLink } from 'routes/hooks/use-active-link';
//
import { useLocales } from 'locales';
import { NavItemProps } from '../types';
import { NavItem } from './nav-item';
import { StyledSubheader, StyledMenu } from './styles';

// ----------------------------------------------------------------------

type NavListProps = {
  item: NavItemProps;
  offsetTop: boolean;
};

export default function NavList({ item, offsetTop }: NavListProps) {
  const { t } = useLocales();
  const pathname = usePathname();

  const nav = useBoolean();

  const { path, children } = item;

  const active = useActiveLink(path, false);

  const externalLink = path.includes('http');

  useEffect(() => {
    if (nav.value) {
      nav.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = () => {
    if (children) {
      nav.onTrue();
    }
  };

  return (
    <>
      <NavItem
        item={item}
        offsetTop={offsetTop}
        active={active}
        open={nav.value}
        externalLink={externalLink}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={nav.onFalse}
      />

      {!!children && nav.value && (
        <Portal>
          <Fade in={nav.value}>
            <StyledMenu
              onMouseEnter={handleOpenMenu}
              onMouseLeave={nav.onFalse}
              sx={{ display: 'flex' }}
            >
              {children.map((list) => (
                <NavSubList
                  key={list.subheader}
                  subheader={list.subheader}
                  items={list.items}
                  isGallery={list.subheader === t('gallery')}
                  onClose={nav.onFalse}
                />
              ))}
            </StyledMenu>
          </Fade>
        </Portal>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type NavSubListProps = {
  isGallery: boolean;
  subheader: string;
  items: NavItemProps[];
  onClose: VoidFunction;
};

function NavSubList({ items, isGallery, subheader, onClose }: NavSubListProps) {
  const pathname = usePathname();

  return (
    <Stack
      spacing={2}
      flexGrow={1}
      alignItems="flex-start"
      sx={{
        pb: 2,
        ...(isGallery && {
          pb: 0,
          maxWidth: { md: 1 / 3, lg: 540 },
        }),
      }}
    >
      <StyledSubheader disableSticky>{subheader}</StyledSubheader>

      {items.map((item) => (
        <NavItem
          subItem
          key={item.title}
          item={item}
          active={pathname === item.path}
          onClick={onClose}
        />
      ))}
    </Stack>
  );
}
