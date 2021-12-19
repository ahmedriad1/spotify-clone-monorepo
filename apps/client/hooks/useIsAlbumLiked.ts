import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';
import { useQuery, useQueryClient } from 'react-query';

const ALBUM_LIKED_QUERY = gql`
  query albumLikesContain($ids: [String!]!) {
    albumLikesContain(tracks: $ids) {
      id
      liked
    }
  }
`;

const useIsAlbumLiked = (id: string | null) => {
  const queryClient = useQueryClient();
  return useQuery<boolean>(['isAlbumLiked', id], async () => {
    if (!id) return;

    if (queryClient.getQueryData(['isAlbumLiked', id]) !== undefined)
      return queryClient.getQueryData<boolean>(['isAlbumLiked', id]);

    const { albumLikesContain } = await axiosGql<{
      albumLikesContain: { id: string; liked: boolean }[];
    }>(ALBUM_LIKED_QUERY, { ids: [id] });

    albumLikesContain.forEach((album) =>
      queryClient.setQueryData(['isAlbumLiked', album.id], album.liked)
    );

    return queryClient.getQueryData<boolean>(['isAlbumLiked', id]);
  });
};

export default useIsAlbumLiked;
