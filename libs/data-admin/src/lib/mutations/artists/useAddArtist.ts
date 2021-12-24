import { useMutation, useQueryClient } from 'react-query';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';

interface IAddArtistData {
  name: string;
  user: { id: string };
}

const useAddArtist = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, IGraphQLError, IAddArtistData>(
    (data) =>
      axiosGql(
        gql`
          mutation createArtist($data: CreateArtistInput!) {
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
        queryClient.invalidateQueries('artists');
        toast('success', 'Artist created');
      },
    }
  );
};

export default useAddArtist;
