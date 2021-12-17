import { withAuth } from '@spotify-clone-monorepo/auth';
import { Button, toast } from '@spotify-clone-monorepo/ui';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout title="Home">
      <Button onClick={() => toast('success', 'Test')}>Click me</Button>
    </Layout>
  );
};

export default withAuth(Home);
