import { Helmet } from 'react-helmet-async';
// sections
import { FAQCategoryCreateView } from 'sections/faqs/category/view';

// ----------------------------------------------------------------------

export default function FAQCategoryCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new FAQ Category</title>
      </Helmet>

      <FAQCategoryCreateView />
    </>
  );
}

