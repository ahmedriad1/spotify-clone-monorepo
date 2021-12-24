import { useMutation, useQueryClient } from 'react-query';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';

export interface IRemoveAlbumData {
  id: string;
  page: number;
}

const useRemoveAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, IGraphQLError, IRemoveAlbumData>(
    async ({ id }) => {
      const { removeAlbum } = await axiosGql<{
        removeAlbum: { id: string; name: string };
      }>(
        gql`
          mutation removeAlbum($id: String!) {
            removeAlbum(where: { id: $id }) {
              id
              name
            }
          }
        `,
        { id }
      );
      return removeAlbum;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('albums');
        toast('success', 'Album deleted');
      },
    }
  );
};

export default useRemoveAlbum;
