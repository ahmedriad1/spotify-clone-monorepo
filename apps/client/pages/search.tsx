import { SearchIcon, XIcon } from '@heroicons/react/outline';
import { axiosGql, withAuth } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import SongItem from '../components/SongItem';
import useDebounce from '../hooks/useDebounce';
import useSearch from '../hooks/useSearch';

const Search = () => {
  const router = useRouter();
  const q = router.query.q as string;
  const [search, setSearch] = useState(q || '');
  const debouncedSearch = useDebounce(q, 500);
  const { isLoading, data } = useSearch(debouncedSearch);

  useEffect(() => {
    if (!search && q) router.replace('/search', undefined, { shallow: true });
    else if (search)
      router.replace(`/search?q=${search}`, undefined, {
        shallow: true,
      });
  }, [search]);

  return (
    <Layout title="Search">
      <div className="w-[350px] max-w-full relative">
        {q && (
          <button
            className="absolute right-0 top-0 w-5 h-5 text-gray-700 mt-3 mr-4 z-10"
            onClick={() => setSearch('')}
          >
            <XIcon className="w-full h-full" />
          </button>
        )}
        <SearchIcon className="absolute left-0 top-0 w-5 h-5 text-gray-700 mt-3 ml-4 z-10" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="appearance-none rounded-full relative block w-full px-4 pl-12 py-3 placeholder-gray-500 text-gray-900 sm:text-sm sm:leading-5 focus:outline-none"
          placeholder="Type something to search"
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-8">
          {data.tracks.length ? (
            <div className="w-full md:w-2/3">
              <h3 className="mb-3">Songs</h3>
              {data.tracks.map((track) => (
                <SongItem
                  showAlbumImg
                  key={track.id}
                  track={track}
                  album={track.album}
                />
              ))}
            </div>
          ) : null}

          {data.albums.length ? (
            <div className="w-full mt-12">
              <h3 className="mb-3">Albums</h3>
              <div className="flex space-x-6">
                {data.albums.map((album) => (
                  <Link href={`/albums/${album.id}`} key={album.id}>
                    <a className="w-[200px]">
                      <Card
                        data={{
                          name: album.name,
                          image: album.imageUrl,
                          description: album.artists
                            .map((artist) => artist.name)
                            .join(', '),
                        }}
                      />
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Layout>
  );
};

export default withAuth(Search);
