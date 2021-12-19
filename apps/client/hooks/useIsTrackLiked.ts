import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { useQuery, useQueryClient } from 'react-query';
import { Track } from './useTrack';

const TRACK_LIKED_QUERY = gql`
  query trackLikesContain($ids: [String!]!) {
    trackLikesContain(tracks: $ids) {
      id
      liked
    }
  }
`;

const useIsTrackLiked = (id: string, tracks: Track[] | string[] = []) => {
  const queryClient = useQueryClient();
  return useQuery<boolean>(['isTrackLiked', id], async () => {
    if (!id) return;

    const isLiked = queryClient.getQueryData<boolean>(['isTrackLiked', id]);

    if (typeof isLiked === 'boolean') return isLiked;

    const ids = tracks.length
      ? tracks.map((track) => (typeof track === 'string' ? track : track.id))
      : [id];

    const { trackLikesContain } = await axiosGql<{
      trackLikesContain: { id: string; liked: boolean }[];
    }>(TRACK_LIKED_QUERY, { ids });
    trackLikesContain.forEach((track) =>
      queryClient.setQueryData(['isTrackLiked', track.id], track.liked)
    );

    return queryClient.getQueryData<boolean>(['isTrackLiked', id]);
  });
};

export default useIsTrackLiked;
