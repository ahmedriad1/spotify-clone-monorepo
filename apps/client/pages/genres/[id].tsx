import useGenre from '../../hooks/useGenre';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import Card from '../../components/Card';
import Link from 'next/link';

const Genre = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { isLoading, data } = useGenre(id);

  if (isLoading)
    return (
      <Layout title="Loading...">
        <Loading />
      </Layout>
    );

  return (
    <Layout title={data.name}>
      <h1 className="text-4xl font-circular-black font-bold">{data.name}</h1>
      <div className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.albums.map((album) => (
            <Link key={album.id} href={`/albums/${album.id}`}>
              <a>
                <Card
                  data={{
                    name: album.name,
                    description: album.description,
                    image: album.imageUrl,
                  }}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Genre;
