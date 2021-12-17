import { useMutation, useQueryClient } from 'react-query';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';
import { Album } from '../../data';
import { IPaginatedData } from '../../queries/createPaginatedQuery';

export interface IRemoveAlbumData {
  id: string;
  page: number;
}

const useRemoveAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation<any, IGraphQLError, IRemoveAlbumData>(
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
      onSuccess: (_, variables) => {
        toast('success', 'Album deleted');
        queryClient.setQueryData<IPaginatedData<Album[]> | undefined>(
          ['albums', variables.page],
          (data) => {
            if (!data) return;
            return {
              total: data.total - 1,
              all: data.all.filter((album) => album.id !== variables.id),
            };
          }
        );
      },
    }
  );
};

export default useRemoveAlbum;
