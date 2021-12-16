import { withAuth } from '@spotify-clone-monorepo/auth';
import {
  Genre,
  useGenres,
  useRemoveGenre,
} from '@spotify-clone-monorepo/data-admin';
import { PlusButton, Table } from '@spotify-clone-monorepo/ui';
import Link from 'next/link';
import { useState } from 'react';
import { Column } from 'react-table';
import Layout from '../../components/Layout';

const columns: Column<Omit<Genre, 'albums'>>[] = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Description',
    accessor: 'description',
  },

  {
    Header: 'Albums',
    accessor: (r) => r._count.albums,
  },
];

const ShowGenres = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useGenres(page, pageSize);
  const mutation = useRemoveGenre();

  return (
    <Layout title="View Genres">
      <div className="flex justify-between items-center mb-8">
        <h2>Show Genres</h2>
        <Link href="/genres/add">
          <a>
            <PlusButton />
          </a>
        </Link>
      </div>

      <Table<Omit<Genre, 'albums'>>
        columns={columns}
        editLink={(r) => `/genres/edit/${r.id}`}
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

export default withAuth(ShowGenres);
