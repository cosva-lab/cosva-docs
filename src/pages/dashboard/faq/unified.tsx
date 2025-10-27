import { Helmet } from 'react-helmet-async';
// sections
import FAQUnifiedView from 'sections/faqs/faq-unified-view';
import { useRouter } from 'routes/hooks';
import { paths } from 'routes/paths';
import { IFAQ, IFAQCategory } from 'types/faq';

// ----------------------------------------------------------------------

export default function FAQUnifiedPage() {
  const router = useRouter();

  const handleEditCategory = (category: IFAQCategory) => {
    router.push(paths.dashboard.faqCategory.edit(category.id));
  };

  const handleEditFAQ = (faq: IFAQ) => {
    router.push(paths.dashboard.faq.edit(faq.id));
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Categorías de FAQs</title>
      </Helmet>

      <FAQUnifiedView
        onEditCategory={handleEditCategory}
        onEditFAQ={handleEditFAQ}
      />
    </>
  );
}
