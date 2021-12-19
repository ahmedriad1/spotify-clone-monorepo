import { axiosGql } from '@spotify-clone-monorepo/auth';
import { toast } from '@spotify-clone-monorepo/ui';
import { gql } from '@spotify-clone-monorepo/utils';
import { useMutation, useQueryClient } from 'react-query';

const LIKE_ALBUM_MUTATION = gql`
  mutation likeAlbum($id: String!) {
    likeAlbum(where: { id: $id }) {
      id
    }
  }
`;

const UNLIKE_ALBUM_MUTATION = gql`
  mutation unlikeAlbum($id: String!) {
    unlikeAlbum(where: { id: $id }) {
      id
    }
  }
`;

const useLikeAlbumMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (albumId: string) => {
      const isLiked = queryClient.getQueryData<boolean>([
        'isAlbumLiked',
        albumId,
      ]);

      const data = await axiosGql(
        isLiked ? UNLIKE_ALBUM_MUTATION : LIKE_ALBUM_MUTATION,
        {
          id: albumId,
        }
      );

      return data[isLiked ? 'unlikeAlbum' : 'likeAlbum'];
    },
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries(['isAlbumLiked', variables]);

        const isLiked = queryClient.getQueryData(['isAlbumLiked', variables]);

        const previousStatus = isLiked;

        return { albumId: variables, previousStatus };
      },
      onSuccess: (
        data,
        variables,
        context: { albumId: string; previousStatus: boolean }
      ) => {
        queryClient.setQueryData(
          ['isAlbumLiked', context.albumId],
          !context.previousStatus
        );
        toast(
          'success',
          !context.previousStatus
            ? 'Added album to library'
            : 'Removed album from library'
        );
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(
          ['isAlbumLiked', context.albumId],
          context.previousStatus
        );
        toast('error', 'Error');
      },
    }
  );
};

export default useLikeAlbumMutation;
