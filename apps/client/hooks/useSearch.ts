import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { useQuery } from 'react-query';

const SEARCH_QUERY = gql`
  query search($q: String!) {
    albums(where: { name: { contains: $q, mode: insensitive } }, limit: 10) {
      id
      name
      imageUrl
      artists {
        id
        name
      }
    }

    tracks(where: { name: { contains: $q, mode: insensitive } }, limit: 5) {
      id
      name
      duration
      album {
        imageUrl
        artists {
          id
          name
        }
      }
    }
  }
`;

interface SearchResult {
  albums: {
    id: string;
    name: string;
    imageUrl: string;
    artists: {
      id: string;
      name: string;
    }[];
  }[];
  tracks: {
    id: string;
    name: string;
    duration: number;
    album: {
      imageUrl: string;
      artists: {
        id: string;
        name: string;
      }[];
    };
  }[];
}

const useSearch = (q: string) => {
  return useQuery(['search', q], async () => {
    if (!q) return { albums: [], tracks: [] };
    const results = await axiosGql<SearchResult>(SEARCH_QUERY, { q });
    return results;
  });
};

export default useSearch;
