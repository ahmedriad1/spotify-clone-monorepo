import { useMutation } from 'react-query';
import { useState } from 'react';
import { axiosGql, IGraphQLError } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { toast } from '@spotify-clone-monorepo/ui';

export interface IAddTrackData {
  name: string;
  genreId: string;
  albumId: string;
  artists: string[];
  trackFile: File;
}

const useAddTrack = () => {
  const [completed, setCompleted] = useState<number | null>(null);
  const data = useMutation<unknown, IGraphQLError, IAddTrackData>(
    ({ trackFile, ...rest }) =>
      axiosGql(
        gql`
          mutation createTrack($data: CreateTrackInput!, $trackFile: Upload!) {
            createTrack(data: $data, trackFile: $trackFile) {
              id
              name
            }
          }
        `,
        { data: rest, trackFile },
        {
          onUploadProgress: (progress) => {
            setCompleted(Math.round((progress.loaded * 100) / progress.total));
          },
        }
      ),
    {
      onSuccess: () => {
        toast('success', 'Track created');
      },
    }
  );

  return { completed, ...data };
};

export default useAddTrack;
