import { useMutation, useQueryClient } from 'react-query';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';
import { IPaginatedData } from '../../queries/createPaginatedQuery';
import { Genre } from '../../data';

export interface IRemoveGenreData {
  id: string;
  page: number;
}

const useRemoveGenre = () => {
  const queryClient = useQueryClient();
  return useMutation<any, IGraphQLError, IRemoveGenreData>(
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
      onSuccess: (_, variables) => {
        toast('success', 'Genre deleted');
        queryClient.setQueryData<IPaginatedData<Genre[]> | undefined>(
          ['genres', variables.page],
          (data) => {
            if (!data) return;
            return {
              total: data.total - 1,
              all: data.all.filter((genre) => genre.id !== variables.id),
            };
          }
        );
      },
      onError: (error) => {
        const msg =
          error?.response?.data?.errors[0]?.message || 'An error occurred';
        toast('error', msg);
      },
    }
  );
};

export default useRemoveGenre;
