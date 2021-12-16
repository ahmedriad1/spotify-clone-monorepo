import { Genre } from '../../data';
import createPaginatedQuery from '../createPaginatedQuery';

const useGenres = createPaginatedQuery<Omit<Genre, 'albums'>[]>(
  { cacheName: 'genres', queryName: 'genres' },
  `
  id
  name
  description
  _count {
    albums
  }
`
);

export default useGenres;
