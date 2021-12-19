import { axiosGql } from '@spotify-clone-monorepo/auth';
import { toast } from '@spotify-clone-monorepo/ui';
import { gql } from '@spotify-clone-monorepo/utils';
import { useMutation, useQueryClient } from 'react-query';

const LIKE_TRACK_MUTATION = gql`
  mutation likeTrack($id: String!) {
    likeTrack(where: { id: $id }) {
      id
    }
  }
`;

const UNLIKE_TRACK_MUTATION = gql`
  mutation unlikeTrack($id: String!) {
    unlikeTrack(where: { id: $id }) {
      id
    }
  }
`;

interface Context {
  trackId: string;
  previousStatus: boolean;
}

const useLikeTrackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (trackId: string) => {
      const isLiked = queryClient.getQueryData<boolean>([
        'isTrackLiked',
        trackId,
      ]);

      const data = await axiosGql<
        | {
            unlikeTrack: { id: string };
          }
        | { likeTrack: { id: string } }
      >(isLiked ? UNLIKE_TRACK_MUTATION : LIKE_TRACK_MUTATION, {
        id: trackId,
      });

      return data[isLiked ? 'unlikeTrack' : 'likeTrack'];
    },
    {
      onMutate: async (variables) => {
        console.log({ variables });
        await queryClient.cancelQueries(['isTrackLiked', variables]);

        const isLiked = queryClient.getQueryData<boolean>([
          'isTrackLiked',
          variables,
        ]);

        const previousStatus = isLiked;

        return { trackId: variables, previousStatus };
      },
      onSuccess: (data, variables, context: Context) => {
        queryClient.setQueryData(
          ['isTrackLiked', context.trackId],
          !context.previousStatus
        );
        toast(
          'success',
          !context.previousStatus
            ? 'Added track to library'
            : 'Removed track from library'
        );
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(
          ['isTrackLiked', context.trackId],
          context.previousStatus
        );
        toast('error', 'Error');
      },
    }
  );
};

export default useLikeTrackMutation;
