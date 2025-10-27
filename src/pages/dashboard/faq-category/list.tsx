import { Helmet } from 'react-helmet-async';
// sections
import { FAQCategoryListView } from 'sections/faqs/category/view';

// ----------------------------------------------------------------------

export default function FAQCategoryListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: FAQ Category List</title>
      </Helmet>

      <FAQCategoryListView />
    </>
  );
}

