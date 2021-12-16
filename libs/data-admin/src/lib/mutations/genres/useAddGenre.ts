import { useMutation } from 'react-query';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';

interface IAddGenreData {
  name: string;
  description: string;
}

const useAddGenre = () => {
  return useMutation<any, IGraphQLError, IAddGenreData>(
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
        toast('success', 'Genre created');
      },
      onError: (error) => {
        const msg =
          error?.response?.data?.errors[0]?.message || 'An error occurred';
        toast('error', msg);
      },
    }
  );
};

export default useAddGenre;
