import { useQuery } from 'react-query';
import { gql } from '@spotify-clone-monorepo/utils';
import { axiosGql } from '@spotify-clone-monorepo/auth';
import { Genre } from '../types/models';

const GENRE_QUERY = gql`
  query genre($id: String!) {
    genre(where: { id: $id }) {
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

const useGenre = (id: string) => {
  return useQuery<Genre>(['genre', id], async () => {
    const { genre } = await axiosGql<{ genre: Genre }>(GENRE_QUERY, { id });
    return genre;
  });
};

export default useGenre;
