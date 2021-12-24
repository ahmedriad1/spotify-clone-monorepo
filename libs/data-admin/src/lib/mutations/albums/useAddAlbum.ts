import { useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';

export interface IAddAlbumData {
  name: string;
  description: string;
  genreId: string;
  type: 'ALBUM' | 'SINGLE';
  image: File;
  artists: string[];
}

const useAddAlbum = () => {
  const [completed, setCompleted] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const data = useMutation<unknown, IGraphQLError, IAddAlbumData>(
    ({ image, ...rest }) =>
      axiosGql(
        gql`
          mutation createAlbum($data: CreateAlbumInput!, $image: Upload!) {
            createAlbum(data: $data, image: $image) {
              id
              name
            }
          }
        `,
        { data: rest, image },
        {
          onUploadProgress: (progress) => {
            setCompleted(Math.round((progress.loaded * 100) / progress.total));
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('albums');
        toast('success', 'Album created');
      },
    }
  );

  return { completed, ...data };
};

export default useAddAlbum;
