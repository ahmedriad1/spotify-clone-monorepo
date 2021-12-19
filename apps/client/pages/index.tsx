import CardSection from '../components/CardSection';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import useGenresAlbums from '../hooks/useGenresAlbums';

const Home = () => {
  const { data, isLoading } = useGenresAlbums();

  return (
    <Layout title="Home">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-[24px]">
          {data.map((genre) => (
            <CardSection
              key={genre.id}
              data={{
                name: genre.name,
                description: genre.description,
                link: `/genres/${genre.id}`,
                itemLink: '/albums/:id',
              }}
              albums={genre.albums}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Home;
