import { Helmet } from 'react-helmet-async';
// sections
import { FAQCategoryEditView } from 'sections/faqs/category/view';

// ----------------------------------------------------------------------

export default function FAQCategoryEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit FAQ Category</title>
      </Helmet>

      <FAQCategoryEditView />
    </>
  );
}

