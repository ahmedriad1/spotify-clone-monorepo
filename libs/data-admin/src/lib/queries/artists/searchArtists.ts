import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';

// Interface used in the <Select /> element
export interface ISelectArtist {
  id: string;
  name: string;
}

const searchArtists = async (q: string, page: number) => {
  const all = await axiosGql<{
    artists: ISelectArtist[];
    totalArtists: number;
  }>(
    gql`
      query searchArtists($q: String!, $page: Int!) {
        artists(where: { name: { contains: $q } }, page: $page, limit: 10) {
          id
          name
        }

        totalArtists(where: { name: { contains: $q } })
      }
    `,
    { q, page }
  );

  return all;
};

export default searchArtists;
