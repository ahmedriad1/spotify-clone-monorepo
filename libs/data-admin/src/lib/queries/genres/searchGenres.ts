import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';

// Interface used in the <Select /> element
export interface ISelectGenre {
  id: string;
  name: string;
}

const searchGenres = async (q: string, page: number) => {
  const all = await axiosGql<{
    genres: ISelectGenre[];
    totalGenres: number;
  }>(
    gql`
      query searchGenres($q: String!, $page: Int!) {
        genres(
          where: { name: { contains: $q, mode: insensitive } }
          page: $page
          limit: 10
        ) {
          id
          name
        }

        totalGenres(where: { name: { contains: $q, mode: insensitive } })
      }
    `,
    { q, page }
  );

  return all;
};

export default searchGenres;
