import { useMutation, useQueryClient } from 'react-query';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';

export interface IRemoveGenreData {
  id: string;
  page: number;
}

const useRemoveGenre = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, IGraphQLError, IRemoveGenreData>(
    async ({ id }) => {
      const { removeGenre } = await axiosGql<{
        removeGenre: { id: string; name: string };
      }>(
        gql`
          mutation removeGenre($id: String!) {
            removeGenre(where: { id: $id }) {
              id
              name
            }
          }
        `,
        { id }
      );
      return removeGenre;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('genres');
        toast('success', 'Genre deleted');
      },
    }
  );
};

export default useRemoveGenre;
