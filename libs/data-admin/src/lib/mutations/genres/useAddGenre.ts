import { useMutation, useQueryClient } from 'react-query';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';

interface IAddGenreData {
  name: string;
  description: string;
}

const useAddGenre = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, IGraphQLError, IAddGenreData>(
    (data) =>
      axiosGql(
        gql`
          mutation createGenre($data: GenreCreateInput!) {
            createGenre(data: $data) {
              id
              name
            }
          }
        `,
        { data }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('genres');
        toast('success', 'Genre created');
      },
    }
  );
};

export default useAddGenre;
