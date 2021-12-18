import Link from 'next/link';
import { useState } from 'react';
import { Column } from 'react-table';
import { Track, useTracks } from '@spotify-clone-monorepo/data-admin';
import { LazyImage, PlusButton, Table } from '@spotify-clone-monorepo/ui';
import { withAuth } from '@spotify-clone-monorepo/auth';
import Layout from '../../components/Layout';

const columns: Column<Track>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ value, row: { original } }) => (
      <Link href={`/albums/${original.id}`}>
        <a>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <LazyImage
                className="h-10 w-10 rounded"
                width={40}
                height={40}
                src={original.album.imageUrl}
                alt={`"${original.album.name}"'s cover`}
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">{value}</div>
              <div className="text-sm text-[rgba(255,255,255,0.6)]">
                {original.album.name}
              </div>
            </div>
          </div>
        </a>
      </Link>
    ),
  },
  {
    Header: 'Artists',
    accessor: 'artists',
    Cell: ({ value, row: { original } }) => (
      <>
        {[...original.album.artists, ...value].map((artist) => (
          <Link href={`/artists/${artist.id}`} key={artist.id}>
            <a className="text-[rgba(255,255,255,0.6)] hover:text-white">
              {artist.name}
            </a>
          </Link>
        ))}
      </>
    ),
  },
  {
    Header: 'Duration',
    accessor: 'duration',
    Cell: ({ value }) => value,
  },
  {
    Header: 'Likes',
    accessor: 'likesCount',
  },
];

const ShowTracks = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useTracks(page, pageSize);

  return (
    <Layout title="View Tracks">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl">Show Tracks</h2>
        <Link href="/tracks/add">
          <a>
            <PlusButton />
          </a>
        </Link>
      </div>

      <Table<Track>
        columns={columns}
        editLink={(r) => `/tracks/edit/${r.id}`}
        deleteRow={(record, page) => {
          console.log(record, page);
          // mutation.mutate({ id, page });
        }}
        data={data?.all}
        loading={isLoading}
        pageCount={data ? Math.ceil(data.total / pageSize) : 1}
        setPage={setPage}
      />
    </Layout>
  );
};

export default withAuth(ShowTracks);
