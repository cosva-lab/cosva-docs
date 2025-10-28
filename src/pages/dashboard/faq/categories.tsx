import { Helmet } from 'react-helmet-async';
// sections
import FAQCategoriesView from 'sections/faqs/faq-categories-view';

// ----------------------------------------------------------------------

export default function FAQUnifiedPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Categorías de FAQs</title>
      </Helmet>

      <FAQCategoriesView />
    </>
  );
}
