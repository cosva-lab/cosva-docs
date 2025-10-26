import { forwardRef } from 'react';
// @mui
import Link from '@mui/material/Link';
// routes
import { RouterLink } from 'routes/components';
// components
import Iconify from 'components/iconify';
//
import { NavItemDesktopProps } from '../types';
import { ListItem } from './styles';

// ----------------------------------------------------------------------

export const NavItem = forwardRef<HTMLDivElement, NavItemDesktopProps>(
  ({ item, open, offsetTop, active, subItem, externalLink, ...other }, ref) => {
    const { title, path, children } = item;

    const renderContent = (
      <ListItem
        ref={ref}
        disableRipple
        offsetTop={offsetTop}
        subItem={subItem}
        active={active}
        open={open}
        {...other}
      >
        {title}

        {!!children && <Iconify width={16} icon="eva:arrow-ios-downward-fill" sx={{ ml: 1 }} />}
      </ListItem>
    );

    // External link
    if (externalLink) {
      return (
        <Link href={path} target="_blank" rel="noopener" underline="none">
          {renderContent}
        </Link>
      );
    }

    // Has child
    if (children) {
      return renderContent;
    }

    // Default
    return (
      <Link component={RouterLink} href={path} underline="none">
        {renderContent}
      </Link>
    );
  }
);
