import { axiosGql, withAuth } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import SongItem from '../components/SongItem';

const Search = () => {
  const router = useRouter();
  const q = router.query.q;

  const { data, isLoading } = useQuery(['search', q], async () => {
    if (!q) return { albums: [], tracks: [] };
    const results = await axiosGql<{
      albums: {
        id: string;
        name: string;
        imageUrl: string;
        artists: {
          id: string;
          name: string;
        }[];
      }[];
      tracks: {
        id: string;
        name: string;
        duration: number;
        album: {
          imageUrl: string;
          artists: {
            id: string;
            name: string;
          }[];
        };
      }[];
    }>(
      gql`
        query search($q: String!) {
          albums(where: { name: { contains: $q } }, limit: 10) {
            id
            name
            imageUrl
            artists {
              id
              name
            }
          }

          tracks(where: { name: { contains: $q } }, limit: 5) {
            id
            name
            duration
            album {
              imageUrl
              artists {
                id
                name
              }
            }
          }
        }
      `,
      { q }
    );
    return results;
  });
  // console.log(data);
  return (
    <Layout title="Search">
      <div className="w-[350px] max-w-full">
        <input
          defaultValue={q}
          onChange={(e) =>
            router.replace(
              `/search?q=${e.target.value}`,
              `/search?q=${e.target.value}`,
              { shallow: true }
            )
          }
          className={`appearance-none rounded-full relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue
        focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5`}
          placeholder="Type something to search"
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-8">
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
        </div>
      )}
    </Layout>
  );
};

export default withAuth(Search);
