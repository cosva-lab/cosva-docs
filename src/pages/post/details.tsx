import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'routes/hooks';
// sections
import { PostDetailsHomeView } from 'sections/blog/view';

// ----------------------------------------------------------------------

export default function PostDetailsHomePage() {
  const params = useParams();

  const { title } = params;

  return (
    <>
      <Helmet>
        <title> Post: Details</title>
      </Helmet>

      <PostDetailsHomeView title={`${title}`} />
    </>
  );
}
