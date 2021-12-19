import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { useQuery } from 'react-query';

export interface Album {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: 'SINGLE' | 'ALBUM';
  artists: {
    id: string;
    name: string;
  }[];
  tracks: {
    id: string;
    name: string;
    duration: number;
  }[];
  tracksDuration: number;
  _count: {
    tracks: number;
  };
}

const ALBUM_QUERY = gql`
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
      tracks {
        id
        name
        duration
      }
      tracksDuration
      _count {
        tracks
      }
    }
  }
`;

const useSingleAlbum = (id) => {
  // const queryClient = useQueryClient();
  return useQuery<Album>(
    ['albums', id],
    async () => {
      const { album } = await axiosGql<{ album: Album }>(ALBUM_QUERY, { id });
      return album;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // onSuccess: data => {
      //   const { tracks, ...rest } = data;
      //   tracks.forEach(track => {
      //     if (!queryClient.getQueryData(['tracks', `${track.id}`]))
      //       queryClient.setQueryData(['tracks', `${track.id}`], {
      //         ...track,
      //         album: rest,
      //       });
      //   });
      // },
    }
  );
};

export default useSingleAlbum;
