import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';

// Interface used in the <Select /> element
export interface ISelectAlbum {
  id: string;
  name: string;
}

const searchAlbums = async (q: string, page: number) => {
  const all = await axiosGql<{
    albums: ISelectAlbum[];
    totalAlbums: number;
  }>(
    gql`
      query searchAlbums($q: String!, $page: Int!) {
        albums(where: { name: { contains: $q } }, page: $page, limit: 10) {
          id
          name
        }

        totalAlbums(where: { name: { contains: $q } })
      }
    `,
    { q, page }
  );

  return all;
};

export default searchAlbums;
