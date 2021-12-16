import { withAuth } from '@spotify-clone-monorepo/auth';
import { LazyImage, PlusButton, Table } from '@spotify-clone-monorepo/ui';
import {
  Album,
  useAlbums,
  useRemoveAlbum,
} from '@spotify-clone-monorepo/data-admin';
import Link from 'next/link';
import { useState } from 'react';
import { Column } from 'react-table';
import Layout from '../../components/Layout';

const columns: Column<Album>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ value, row: { original } }) => (
      <Link href={`/albums/${original.id}`}>
        <a>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <LazyImage
                src={original.imageUrl}
                width={40}
                height={40}
                className="h-10 w-10 rounded"
                alt={`"${original.name}"'s cover`}
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">{value}</div>
              <div className="text-sm text-[rgba(255,255,255,0.6)]">
                {original.description}
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
    Cell: ({ value }) => (
      <>
        {value.map((artist) => (
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
    Header: 'Type',
    accessor: 'type',
    Cell: ({ value }) => (
      <span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-[rgba(255,255,255,.1)] text-sp-green capitalize">
        {value.toLowerCase()}
      </span>
    ),
  },
  {
    Header: 'Likes',
    accessor: 'likesCount',
  },
  {
    Header: 'Tracks',
    accessor: (r) => r._count.tracks,
  },
  {
    Header: 'Genre',
    accessor: (r) => r.genre.name,
  },
];

const ShowAlbums = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useAlbums(page, pageSize);
  const mutation = useRemoveAlbum();

  return (
    <Layout title="View Albums">
      <div className="flex justify-between items-center mb-8">
        <h2>Show Albums</h2>
        <Link href="/albums/add">
          <a>
            <PlusButton />
          </a>
        </Link>
      </div>

      <Table<Album>
        columns={columns}
        editLink={(r) => `/albums/edit/${r.id}`}
        deleteRow={(record, page) => {
          mutation.mutate({ id: record.id, page });
        }}
        data={data?.all}
        loading={isLoading}
        pageCount={data ? Math.ceil(data.total / pageSize) : 1}
        setPage={setPage}
      />
    </Layout>
  );
};

export default withAuth(ShowAlbums);
