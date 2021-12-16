import { Button, toast } from '@spotify-clone-monorepo/ui';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout title="Home">
      <Button onClick={() => toast('error', 'test')}>Hello</Button>
    </Layout>
  );
};

export default Home;
