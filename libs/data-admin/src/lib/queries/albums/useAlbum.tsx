import { useQuery } from 'react-query';
import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { Album } from '../../data';

const useAlbum = (id: string) => {
  return useQuery(['album', id], async ({ signal }) => {
    const { album } = await axiosGql<{
      album: Omit<Omit<Album, '_count'>, 'likesCount'>;
    }>(
      gql`
        query album($id: String!) {
          album(where: { id: $id }) {
            id
            name
            description
            imageUrl
            type
            artists {
              id
              name
            }
            genre {
              id
              name
            }
          }
        }
      `,
      { id },
      { signal }
    );
    return album;
  });
};

export default useAlbum;
