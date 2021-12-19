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

  const { currentSong, isPlaying, pause, resume, setQueue } = usePlayerStore(
    (state) => ({
      currentSong: state.currentSong,
      isPlaying: state.isPlaying,
      pause: state.pause,
      resume: state.resume,
      setQueue: state.setQueue,
    }),
    shallow
  );

  const playSong = (track) => {
    const { tracks } = data;
    if (!currentSong || currentSong !== track.id)
      return setQueue({
        tracks: tracks.map((t) => t.id),
        currentSong: track.id,
      });
    if (isPlaying) return pause();
    return resume();
  };

  return (
    <Layout
      scrolledNavStyles={{ background: 'rgb(192, 64, 64)' }}
      title={isLoading ? 'Album' : data.name}
      innerStyle={{
        background: 'rgb(192, 64, 64)',
        paddingLeft: 0,
        paddingRight: 0,
      }}

      // innerStyles={{ padding: 0 }}
      // outerStyles={{
      //   backgroundImage:
      //     'linear-gradient(rgb(83, 83, 83), transparent), linear-gradient(rgba(0, 0, 0, 0.5), transparent)',
      // }}
      // navStyles={{ position: 'sticky' }}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <SingleItem
          type={data.type}
          info={data}
          isLiked={liked}
          onLike={() => likeMutation.mutate(data.id)}
          onSongClick={playSong}
        />
      )}
    </Layout>
  );
};

export default Album;
