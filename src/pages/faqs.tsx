import { Helmet } from 'react-helmet-async';
// sections
import { FaqsView } from 'sections/faqs/view';

// ----------------------------------------------------------------------

export default function FaqsPage() {
  return (
    <>
      <Helmet>
        <title> Faqs</title>
      </Helmet>

      <FaqsView />
    </>
  );
}
