import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'routes/hooks';
// sections
import { PostDetailsView } from 'sections/blog/view';

// ----------------------------------------------------------------------

export default function PostDetailsPage() {
  const params = useParams();

  const { title } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Post Details</title>
      </Helmet>

      <PostDetailsView title={`${title}`} />
    </>
  );
}
