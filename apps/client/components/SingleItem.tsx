import { useAuthStore } from '@spotify-clone-monorepo/auth';
import { LazyImage } from '@spotify-clone-monorepo/ui';
import PrettyMs from 'pretty-ms';
import shallow from 'zustand/shallow';
import { Album } from '../hooks/useSingleAlbum';
import useTrack, { Track } from '../hooks/useTrack';
import usePlayerStore from '../stores/PlayerStore';
import LikeButton from './LikeButton';
import SongItem from './SongItem';

interface SingleItemProps {
  type: string;
  info: Album;
  onLike: () => void;
  isLiked: boolean;
  color?: string;
}

const SingleItem: React.FC<SingleItemProps> = ({
  type,
  info,
  onLike,
  isLiked,
  color,
}) => {
  const {
    currentSong: currentSongId,
    isPlaying,
    pause,
    resume,
    setQueue,
  } = usePlayerStore(
    (state) => ({
      currentSong: state.currentSong,
      isPlaying: state.isPlaying,
      pause: state.pause,
      resume: state.resume,
      setQueue: state.setQueue,
    }),
    shallow
  );
  const { data: currentSong } = useTrack(currentSongId);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <>
      {/* padding: 60px 35px; */}
      <div className="min-h-[calc(340px-60px)] flex items-end overflow-hidden pb-6 relative isolate">
        <div
          className="h-full w-full absolute top-0 left-0 z-[-1]"
          style={{
            background:
              'linear-gradient(transparent 0,rgba(0,0,0,.5) 100%), url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=")',
          }}
        />
        <div className="flex px-9 text-center h-full">
          <div className="aspect-square mr-6 self-end z-0">
            <LazyImage
              src={info.imageUrl}
              alt="Album Poster"
              className="h-full w-full object-cover [box-shadow:0_4px_60px_rgb(0_0_0/50%)]"
              width={192}
              height={192}
            />
          </div>

          <div className="flex text-left flex-col justify-end z-0">
            <p
              style={{
                fontSize: 12,
                letterSpacing: '0.8px',
                fontWeight: 700,
                textTransform: 'uppercase',
                // marginBottom: 10,
                marginTop: 4,
              }}
            >
              {type}
            </p>

            <h1 className="text-8xl mt-1 py-1 font-bold tracking-[-2px]">
              {info.name}
            </h1>

            <p className="text-sm mt-2 text-[rgba(255,255,255,0.7)]">
              {info.artists.map((a) => a.name).join(', ') || info.description}
            </p>

            <div className="flex items-center text-sm mt-2 text-[rgba(255,255,255,0.7)]">
              <span>
                {info._count.tracks} song{info._count.tracks > 1 && 's'},{' '}
                {PrettyMs(
                  info.tracks.reduce((acc, track) => acc + track.duration, 0),
                  { secondsDecimalDigits: 0, millisecondsDecimalDigits: 0 }
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-full bg-[rgb(18,18,18)] isolate">
        <div
          style={{
            height: 232,
            position: 'absolute',
            width: '100%',
            zIndex: -1,
            backgroundColor: color,
            backgroundImage:
              'linear-gradient(rgba(0,0,0,.6) 0,#121212 100%),url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=")',
          }}
        />
        <div className="py-6 px-9">
          <div className="flex items-center">
            <button
              className="flex justify-center items-center h-12 w-12 bg-sp-green transition-transform text-white rounded-full hover:scale-110"
              onClick={() => {
                const { tracks } = info;
                if (currentSong?.album.id === info.id)
                  isPlaying ? pause() : resume();
                else if (tracks.length)
                  setQueue({ tracks: tracks.map((track) => track.id) });
              }}
            >
              {currentSong?.album.id === info.id && isPlaying ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <svg
                    className="pause"
                    viewBox="-45 0 327 327"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="M158 0h71a8 8 0 018 8v311a8 8 0 01-8 8h-71a8 8 0 01-8-8V8a8 8 0 018-8zm0 0M8 0h71a8 8 0 018 8v311a8 8 0 01-8 8H8a8 8 0 01-8-8V8a8 8 0 018-8zm0 0" />
                  </svg>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <polygon
                    points="21.57 12 5.98 3 5.98 21 21.57 12"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
            {isLoggedIn && (
              <LikeButton className="ml-8" onClick={onLike} liked={isLiked} />
            )}
          </div>

          <ul className="mt-5 z-[inherit]">
            {info.tracks.map((track) => (
              <SongItem key={track.id} album={info} track={track} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SingleItem;
