import { Helmet } from 'react-helmet-async';
// sections
import { FAQListView } from 'sections/faqs/view';

// ----------------------------------------------------------------------

export default function FAQListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: FAQ List</title>
      </Helmet>

      <FAQListView />
    </>
  );
}

