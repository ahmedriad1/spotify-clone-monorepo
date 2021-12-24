import { useQuery } from 'react-query';
import { gql } from '@spotify-clone-monorepo/utils';
import { axiosGql } from '@spotify-clone-monorepo/auth';
import { Album, Artist } from '../types/models';

const ARTIST_QUERY = gql`
  query artist($id: String!) {
    artist(where: { id: $id }) {
      id
      name
      imageUrl
      albums {
        id
        name
        description
        imageUrl
      }
    }
  }
`;

type ArtistWithAlbums = Artist & { albums: Album[] } & { imageUrl?: string };

const useArtist = (id: string) => {
  return useQuery<ArtistWithAlbums>(['artist', id], async () => {
    const { artist } = await axiosGql<{ artist: ArtistWithAlbums }>(
      ARTIST_QUERY,
      { id }
    );
    return artist;
  });
};

export default useArtist;
