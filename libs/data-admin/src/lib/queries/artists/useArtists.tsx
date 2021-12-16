import createPaginatedQuery from '../createPaginatedQuery';
import { Artist } from '../../data';

const useArtists = createPaginatedQuery<Artist[]>(
  { queryName: 'artists', cacheName: 'artists' },
  `
    id
    name
    imageUrl
    user {
      email
    }
    _count {
      tracks
      albums
    }
`
);

export default useArtists;
