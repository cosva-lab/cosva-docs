import { Helmet } from 'react-helmet-async';
// sections
import { FAQEditView } from 'sections/faqs/view';

// ----------------------------------------------------------------------

export default function FAQEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit FAQ</title>
      </Helmet>

      <FAQEditView />
    </>
  );
}

