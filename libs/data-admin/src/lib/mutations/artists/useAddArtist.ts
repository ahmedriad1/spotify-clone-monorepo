import { useMutation } from 'react-query';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';

interface IAddArtistData {
  name: string;
  user: { id: string };
}

const useAddArtist = () => {
  return useMutation<any, IGraphQLError, IAddArtistData>(
    (data) =>
      axiosGql(
        gql`
          mutation createArtist($data: ArtistCreateInput!) {
            createArtist(data: $data) {
              id
              name
            }
          }
        `,
        { data }
      ),
    {
      onSuccess: () => {
        toast('success', 'Artist created');
      },
      onError: (error) => {
        const msg =
          error?.response?.data?.errors[0]?.message || 'An error occurred';
        toast('error', msg);
      },
    }
  );
};

export default useAddArtist;
