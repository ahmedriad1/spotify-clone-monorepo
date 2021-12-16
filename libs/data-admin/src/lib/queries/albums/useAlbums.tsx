import createPaginatedQuery from '../createPaginatedQuery';
import { Album } from '../../data';

const useAlbums = createPaginatedQuery<Album[]>(
  { queryName: 'albums', cacheName: 'albums' },
  `
    id
    name
    description
    imageUrl
    type
    likesCount
    artists {
      id
      name
    }
    genre {
      id
      name
    }
    _count {
      tracks
    }
`
);

export default useAlbums;
