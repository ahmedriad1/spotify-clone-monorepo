// import useGenresAlbums from '@hooks/useGenresAlbums';
import Layout from '../../components/Layout';
import shallow from 'zustand/shallow';
import { useRouter } from 'next/router';
import usePlayerStore from '../../stores/PlayerStore';
import useSingleAlbum from '../../hooks/useSingleAlbum';
import useIsAlbumLiked from '../../hooks/useIsAlbumLiked';
import useLikeAlbumMutation from '../../hooks/useLikeAlbumMutation';
import SingleItem from '../../components/SingleItem';
import Loading from '../../components/Loading';

const Album = () => {
  const {
    query: { id },
  } = useRouter();
  const { isLoading, data } = useSingleAlbum(id);
  const { data: liked } = useIsAlbumLiked(id as string);
  const likeMutation = useLikeAlbumMutation();

  // const { currentSong, isPlaying, pause, resume, setQueue } = usePlayerStore(
  //   (state) => ({
  //     currentSong: state.currentSong,
  //     isPlaying: state.isPlaying,
  //     pause: state.pause,
  //     resume: state.resume,
  //     setQueue: state.setQueue,
  //   }),
  //   shallow
  // );

  // const playSong = (track) => {
  //   const { tracks } = data;
  //   if (!currentSong || currentSong !== track.id)
  //     return setQueue({
  //       tracks: tracks.map((t) => t.id),
  //       currentSong: track.id,
  //     });
  //   if (isPlaying) return pause();
  //   return resume();
  // };

  return (
    <Layout
      scrolledNavStyles={{ background: data?.image?.color }}
      title={isLoading ? 'Album' : data.name}
      innerStyle={{
        background: data?.image?.color,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
      }}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <SingleItem
          type={data.type}
          info={data}
          color={data.image.color}
          isLiked={liked}
          onLike={() => likeMutation.mutate(data.id)}
          // onSongClick={playSong}
        />
      )}
    </Layout>
  );
};

export default Album;
