import { useQuery, UseQueryResult } from 'react-query';
import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';

interface IOptions {
  cacheName: string;
  queryName: string;
}

export interface IPaginatedData<T> {
  all: T;
  total: number;
}

const createPaginatedQuery = <T>(options: IOptions, query: string) => {
  const firstCapitalized =
    options.queryName[0].toUpperCase() + options.queryName.slice(1);
  return (page = 1, limit = 10): UseQueryResult<IPaginatedData<T>> => {
    return useQuery([options.cacheName, page], async ({ signal }) => {
      const data = await axiosGql<{ [key: string]: T | number }>(
        gql`
          query ${options.queryName}($page: Int!, $limit: Int!) {
            ${options.queryName}(page: $page, limit: $limit) {
              ${query}
            }
            total${firstCapitalized}
          }
        `,
        { page, limit },
        { signal }
      );
      return {
        all: data[options.queryName] as T,
        total: data[`total${firstCapitalized}`] as number,
      };
    });
  };
};

export default createPaginatedQuery;
