import createPaginatedQuery from '../createPaginatedQuery';
import { Track } from '../../data';

const useTracks = createPaginatedQuery<Track[]>(
  { cacheName: 'tracks', queryName: 'tracks' },
  `
    id
    name
    likesCount
    duration
    artists {
      id
      name
    }
    album {
      id
      name
      imageUrl
      artists {
        id
        name
      }
    }
`
);

export default useTracks;
