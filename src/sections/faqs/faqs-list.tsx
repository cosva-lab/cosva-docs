import type { IFAQ, IFAQI18n } from 'types/faq';
// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// components
import Iconify from 'components/iconify';
import HtmlContent from 'components/html-content';
import { useLocales } from 'locales';
// hooks
import { useEntityTranslation } from 'hooks/use-entity-translation';

// ----------------------------------------------------------------------

type Props = {
  faqs: IFAQ[];
  selectedCategory?: string;
  loading?: boolean;
};

export default function FaqsList({ faqs, selectedCategory, loading }: Props) {
  const { t } = useLocales();
  const { getTranslation } = useEntityTranslation<IFAQI18n>();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (faqs.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 10,
        }}
      >
        <Iconify
          icon="eva:question-mark-circle-outline"
          width={64}
          sx={{ color: 'text.disabled', mb: 2 }}
        />
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {selectedCategory ? t('faq:faq.no_results') : t('faq:faq.no_results')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {faqs.map(faq => {
        const translation = getTranslation(faq.translations);
        const question = translation?.question || '';
        const answer = translation?.answer || '';

        return (
          <Accordion key={faq.id}>
            <AccordionSummary
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Typography variant="subtitle1">{question}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <HtmlContent html={answer} variant="rich" />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
