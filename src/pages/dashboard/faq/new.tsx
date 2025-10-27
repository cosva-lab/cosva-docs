import { Helmet } from 'react-helmet-async';
// sections
import { FAQCreateView } from 'sections/faqs/view';

// ----------------------------------------------------------------------

export default function FAQCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new FAQ</title>
      </Helmet>

      <FAQCreateView />
    </>
  );
}

