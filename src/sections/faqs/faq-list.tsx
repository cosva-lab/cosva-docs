// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// components
import Iconify from 'components/iconify';
//
import { IFAQItemSkeleton } from './faq-skeleton';
import { IFAQ } from 'types/faq';

// ----------------------------------------------------------------------

type Props = {
  faqs: IFAQ[];
  loading?: boolean;
};

export default function FAQList({ faqs, loading }: Props) {
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
      {faqs.map(faq => (
        <Grid key={faq.id} size={{ xs: 12 }}>
          <Card>
            <Accordion>
              <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              >
                <Typography variant="subtitle1">
                  {faq.translations?.[0]?.question || 'No question'}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.translations?.[0]?.answer || 'No answer'}
                </Typography>

                {faq.tags && faq.tags.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
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
              </AccordionDetails>
            </Accordion>
          </Card>
        </Grid>
      ))}
    </>
  );

  return (
    <Grid container spacing={3}>
      {loading ? renderSkeleton : renderList}
    </Grid>
  );
}
