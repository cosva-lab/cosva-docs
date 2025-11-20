import { Theme } from '@mui/material/styles';
import { SystemStyleObject } from '@mui/system';

export const richStyles: SystemStyleObject<Theme> = {
  '& p': {
    margin: 0,
    marginBottom: 1,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: 2,
    marginBottom: 1,
    '&:first-of-type': {
      marginTop: 0,
    },
  },
  '& ul, & ol': {
    margin: 0,
    paddingLeft: 3,
    '& li': {
      marginBottom: 0.5,
    },
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 1,
    marginTop: 1,
    marginBottom: 1,
  },
  '& a': {
    color: 'primary.main',
    textDecoration: 'underline',
  },
  '& blockquote': {
    borderLeft: 3,
    borderColor: 'divider',
    paddingLeft: 2,
    marginLeft: 0,
    marginY: 2,
    fontStyle: 'italic',
    color: 'text.secondary',
  },
  '& pre': {
    backgroundColor: 'background.neutral',
    padding: 2,
    borderRadius: 1,
    overflow: 'auto',
    marginY: 1,
  },
  '& code': {
    backgroundColor: 'background.neutral',
    padding: 0.25,
    borderRadius: 0.5,
    fontSize: '0.875em',
  },
};
export const simpleStyles: SystemStyleObject<Theme> = {
  '& p': {
    typography: 'body2',
    margin: 0,
  },
  '& a': {
    color: 'inherit',
    textDecoration: 'none',
  },
  '& strong': {
    typography: 'subtitle2',
  },
};
