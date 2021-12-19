import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { useQuery, useQueryClient } from 'react-query';

const TRACKS_QUERY = gql`
  query tracks($ids: [String!]) {
    tracks(where: { id: { in: $ids } }) {
      id
      name
      trackUrl
      duration
      album {
        id
        name
        imageUrl
        artists {
          id
          name
        }
      }
      artists {
        id
        name
      }
    }
  }
`;

export interface Track {
  id: string;
  name: string;
  trackUrl: string;
  duration: number;
  album: {
    id: string;
    name: string;
    imageUrl: string;
    artists: {
      id: string;
      name: string;
    }[];
  };
  artists: {
    id: string;
    name: string;
  }[];
}

const useTrack = (id: string | null, queue = []) => {
  const queryClient = useQueryClient();
  return useQuery<Track>(['tracks', id], async () => {
    if (!id) return;

    const ids = queue.length
      ? queue.filter((track) => !queryClient.getQueryData(['tracks', track]))
      : [id];

    if (!queue.length && queryClient.getQueryData(['tracks', id]))
      return queryClient.getQueryData<Track>(['tracks', id]);

    if (ids) {
      const { tracks } = await axiosGql<{ tracks: Track[] }>(TRACKS_QUERY, {
        ids,
      });
      tracks.forEach((track) =>
        queryClient.setQueryData(['tracks', track.id], track)
      );
    }
    return queryClient.getQueryData<Track>(['tracks', id]);
  });
};

export default useTrack;
