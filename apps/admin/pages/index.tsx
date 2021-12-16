import { withAuth } from '@spotify-clone-monorepo/auth';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout title="Home">
      <h1>Home</h1>
    </Layout>
  );
};

export default withAuth(Home);
