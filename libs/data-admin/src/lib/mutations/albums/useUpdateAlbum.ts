import { useMutation, useQueryClient } from 'react-query';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';

export interface IUpdateAlbumData {
  id: string;
  name: string;
  description: string;
  genre: { id: string };
  image?: File;
  artists?: { id: string }[];
}

const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, IGraphQLError, IUpdateAlbumData>(
    async ({ id, image, ...data }) => {
      const { updateAlbum } = await axiosGql<{
        updateAlbum: { id: string; name: string };
      }>(
        gql`
          mutation updateAlbum($id: String!, $data: UpdateAlbumInput!${
            image ? ', $image: Upload!' : ''
          }) {
            updateAlbum(where: { id: $id }, data: $data${
              image ? ', image: $image' : ''
            }) {
              id
              name
            }
          }
        `,
        { id, image, data }
      );
      return updateAlbum;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('albums');
        toast('success', 'Album updated');
      },
    }
  );
};

export default useUpdateAlbum;
