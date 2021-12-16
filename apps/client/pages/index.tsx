import CardSection from '../components/CardSection';
import Layout from '../components/Layout';
import useGenresAlbums from '../hooks/useGenresAlbums';

const Home = () => {
  const { data, isLoading } = useGenresAlbums();

  return (
    <Layout title="Home">
      {isLoading ? (
        <h1>Loading....</h1>
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
