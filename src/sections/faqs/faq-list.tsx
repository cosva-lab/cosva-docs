// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'components/iconify';
import Label from 'components/label';
//
import { IFAQItemSkeleton } from './faq-skeleton';
import { IFAQ, IFAQI18n } from 'types/faq';
import { useEntityTranslation } from 'hooks/use-entity-translation';

// ----------------------------------------------------------------------

type Props = {
  faqs: IFAQ[];
  loading?: boolean;
  onEdit?: (faq: IFAQ) => void;
};

export default function FAQList({ faqs, loading, onEdit }: Props) {
  const { getTranslation } = useEntityTranslation<IFAQI18n>();

  const renderSkeleton = (
    <>
      {[...Array(8)].map((_, index) => (
        <Grid key={index} size={{ xs: 12 }}>
          <IFAQItemSkeleton />
        </Grid>
      ))}
    </>
  );

  const renderList = (
    <>
      {faqs.map(faq => {
        const translation = getTranslation(faq.translations);
        const question = translation?.question || '';
        const answer = translation?.answer || '';

        return (
          <Grid key={faq.id} size={{ xs: 12 }}>
            <Card>
              <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
                <Stack flexGrow={1} spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1">{question}</Typography>
                    <Label
                      color={
                        (faq.status === 'ACTIVE' && 'success') ||
                        (faq.status === 'INACTIVE' && 'warning') ||
                        'default'
                      }
                      variant="soft"
                    >
                      {faq.status || 'N/A'}
                    </Label>
                  </Stack>

                  {faq.tags && faq.tags.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {faq.tags.map(tag => (
                        <Typography
                          key={tag}
                          variant="caption"
                          color="text.secondary"
                        >
                          #{tag}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Stack>

                <Stack direction="row" spacing={1}>
                  <IconButton size="small" onClick={() => onEdit?.(faq)}>
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                </Stack>
              </Stack>

              <Accordion
                sx={{ borderTop: '1px solid', borderColor: 'divider' }}
              >
                <AccordionSummary
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                >
                  <Typography variant="body2" color="text.secondary">
                    View Answer
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Card>
          </Grid>
        );
      })}
    </>
  );

  return (
    <Grid container spacing={3}>
      {loading ? renderSkeleton : renderList}
    </Grid>
  );
}
