import { useQuery } from 'react-query';
import { gql } from '@spotify-clone-monorepo/utils';
import { axiosGql } from '@spotify-clone-monorepo/auth';
import { Genre } from '../types/models';

const GENRES_ALBUMS_QUERY = gql`
  query {
    genres {
      id
      name
      description
      albums {
        id
        name
        description
        imageUrl
        artists {
          id
          name
        }
      }
    }
  }
`;

const useGenresAlbums = () => {
  return useQuery<Genre[]>('genres-albums', async () => {
    const { genres } = await axiosGql<{ genres: Genre[] }>(GENRES_ALBUMS_QUERY);

    return genres;
  });
};

export default useGenresAlbums;
