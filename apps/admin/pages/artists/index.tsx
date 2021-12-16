import Link from 'next/link';
import { useState } from 'react';
import { Column } from 'react-table';
import Layout from '../../components/Layout';
import { UserIcon } from '@heroicons/react/outline';
import { Artist, useArtists } from '@spotify-clone-monorepo/data-admin';
import { LazyImage, PlusButton, Table } from '@spotify-clone-monorepo/ui';
import { withAuth } from '@spotify-clone-monorepo/auth';

const columns: Column<Artist>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ value, row: { original } }) => (
      <Link href={`/albums/${original.id}`}>
        <a>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              {original.imageUrl ? (
                <LazyImage
                  src={original.imageUrl}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded"
                  alt={`"${original.name}"'s cover`}
                />
              ) : (
                <div className="w-full h-full rounded bg-gray-200 text-black flex justify-center items-center">
                  <UserIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">{value}</div>
              <div className="text-sm text-[rgba(255,255,255,0.6)]">
                {original.user.email}
              </div>
            </div>
          </div>
        </a>
      </Link>
    ),
  },

  {
    Header: 'Albums',
    accessor: (r) => r._count.albums,
    Cell: ({ value }) => value,
  },
  {
    Header: 'Tracks',
    accessor: (r) => r._count.tracks,
    Cell: ({ value }) => value,
  },
];

const ShowArtists = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useArtists(page, pageSize);

  return (
    <Layout title="View Artists">
      <div className="flex justify-between items-center mb-8">
        <h2>Show Artists</h2>
        <Link href="/artists/add">
          <a>
            <PlusButton />
          </a>
        </Link>
      </div>

      {isLoading ? (
        'Loading...'
      ) : (
        <Table<Artist>
          columns={columns}
          editLink={(r) => `/artists/edit/${r.id}`}
          deleteRow={(record, page) => {
            console.log(record, page);
            // mutation.mutate({ id, page });
          }}
          data={data?.all}
          loading={false}
          pageCount={data ? Math.ceil(data.total / pageSize) : 1}
          setPage={setPage}
        />
      )}
    </Layout>
  );
};

export default withAuth(ShowArtists);
