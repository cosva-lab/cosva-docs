import sanitizeHtmlBase, { defaults } from 'sanitize-html';

const allowedTags = [...defaults.allowedTags, 'img', 'iframe'];

export const sanitizeHtml = (html: string) =>
  sanitizeHtmlBase(html, {
    allowedTags,
    allowedAttributes: {
      ...defaults.allowedAttributes,
      iframe: [
        'src',
        'width',
        'height',
        'frameborder',
        'allowfullscreen',
        'allow',
      ],
      '*': ['style'],
    },
    allowedSchemes: [...defaults.allowedSchemes, 'data', 'blob'],
    parseStyleAttributes: false,
  });
