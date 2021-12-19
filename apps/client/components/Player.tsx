import { useEffect, useRef, useState } from 'react';
import PrettyMs from 'pretty-ms';
import Seeker from './Seeker';
import ReactHowler from 'react-howler';
import usePlayerStore from '../stores/PlayerStore';
import { useAuthStore } from '@spotify-clone-monorepo/auth';
import Link from 'next/link';
import useTrack from '../hooks/useTrack';
import useIsTrackLiked from '../hooks/useIsTrackLiked';
import useLikeTrackMutation from '../hooks/useLikeTrackMutation';
import { LazyImage } from '@spotify-clone-monorepo/ui';

const Player = () => {
  const {
    currentSong: currentSongId,
    isPlaying,
    shuffle,
    pause,
    resume,
    nextSong,
    shuffleQueue,
    deshuffleQueue,
    previousSong,
    toggleLoop,
    loop,
    setVolume,
    get,
    volume,
    toggleMuted,
    queue,
  } = usePlayerStore();
  const { data: currentSong, isLoading } = useTrack(currentSongId, queue);
  const { data: isLiked } = useIsTrackLiked(currentSongId, queue);
  const player = useRef<any>();
  const [playedDuration, setPlayedDuration] = useState(0);
  const [virtualDuration, setVirtualDuration] = useState(0);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [isDragging, setIsDragging] = useState(false);

  const likeTrackMutation = useLikeTrackMutation();

  const step = () => {
    // console.log(player.current.howlerState());
    if (!player.current || player.current.howlerState() !== 'loaded') return;
    const seek = player.current.seek() || 0;
    setPlayedDuration(Math.floor(!Number.isNaN(seek) ? seek : 0));
    if (player.current.props.playing) requestAnimationFrame(step);
  };

  const togglePlay = () => {
    if (isPlaying) pause();
    else resume();
  };

  const seek = (val) => {
    setIsDragging(false);
    player.current.seek(val);
    setPlayedDuration(val);
  };

  const changeVolume = (volume) => {
    setVolume(volume);
  };

  useEffect(() => {
    setPlayedDuration(0);
  }, [currentSong?.id]);

  if (!currentSongId || (!isLoading && !currentSong)) return null;
  console.log(currentSong);
  return (
    <div className="z-50 w-full [grid-area:now-playing-bar]">
      <div className="bg-[#181818] text-center px-4 h-[90px] flex items-center justify-between text-white z-[2] border-t-[1px] border-solid border-[#282828] min-w-[620px]">
        {isLoading ? (
          <p>loading...</p>
        ) : (
          <>
            <ReactHowler
              src={currentSong.trackUrl}
              format={['ogg']}
              playing={isPlaying}
              volume={volume / 20}
              onPlay={() => {
                console.log('started');
                requestAnimationFrame(step);
              }}
              onStop={() => {
                setPlayedDuration(0);
              }}
              ref={player}
              onEnd={() => {
                setPlayedDuration(0);
                if (get('loop')) return;

                return nextSong();
              }}
            />
            <div className="flex items-center text-left min-w-[180px] w-[30%]">
              <LazyImage
                className="w-14 h-14"
                width={56}
                height={56}
                src={currentSong.album.imageUrl}
                alt={currentSong.name}
              />
              <div className="mx-4">
                <Link href={`/albums/${currentSong.album.id}`}>
                  <a className="text-sm leading-5 tracking-[0.015em] hover:underline line-clamp-1">
                    {currentSong.name}
                  </a>
                </Link>

                <p className="text-xs leading-4 tracking-[0.015em] text-[#b3b3b3] line-clamp-1">
                  {(currentSong.artists?.length
                    ? currentSong.artists
                    : currentSong.album.artists
                  ).map((a) => (
                    <Link href={`/artists/${a.id}`} key={a.id}>
                      <a className="hover:underline">{a.name}</a>
                    </Link>
                  ))}
                </p>
              </div>
              {isLoggedIn && (
                <button
                  onClick={() => likeTrackMutation.mutate(currentSong.id)}
                >
                  {isLiked ? (
                    <svg
                      className="fill-current w-4 text-sp-green"
                      viewBox="0 -28 512.00002 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0 0" />
                    </svg>
                  ) : (
                    <svg
                      className="fill-current w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M378.667 21.333c-56.792 0-103.698 52.75-122.667 77.646-18.969-24.896-65.875-77.646-122.667-77.646C59.813 21.333 0 88.927 0 172c0 45.323 17.99 87.562 49.479 116.469a10.54 10.54 0 001.677 2.177l197.313 196.906c2.083 2.073 4.802 3.115 7.531 3.115s5.458-1.042 7.542-3.125L467.417 283.74l2.104-2.042c1.667-1.573 3.313-3.167 5.156-5.208a10.372 10.372 0 001.896-2.542C499.438 245.948 512 209.833 512 172c0-83.073-59.812-150.667-133.333-150.667zm80.156 240.615a9.929 9.929 0 00-.802 1.083c-1 1.146-2.094 2.156-3.177 3.188L255.99 464.927 68.667 277.979a10.706 10.706 0 00-2.479-3.177C37.677 249.906 21.333 212.437 21.333 172c0-71.313 50.24-129.333 112-129.333 61.063 0 113.177 79.646 113.698 80.448 3.938 6.083 14 6.083 17.938 0 .521-.802 52.635-80.448 113.698-80.448 61.76 0 112 58.021 112 129.333 0 33.604-11.313 65.552-31.844 89.948z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            {/* controls */}

            <div className="flex items-center flex-col justify-center max-w-[722px] w-[40%]">
              <div className="flex w-full mb-3 gap-2 flex-row flex-nowrap">
                <div className="flex flex-1 justify-end gap-2">
                  <button
                    className={`w-8 h-8 text-${
                      shuffle ? 'sp-green' : '[#b3b3b3] hover:text-white'
                    } flex justify-center items-center`}
                    onClick={() =>
                      shuffle ? deshuffleQueue() : shuffleQueue()
                    }
                  >
                    <svg className="fill-current w-4 h-4" viewBox="0 0 16 16">
                      <path d="M4.5 6.8l.7-.8C4.1 4.7 2.5 4 .9 4v1c1.3 0 2.6.6 3.5 1.6l.1.2zm7.5 4.7c-1.2 0-2.3-.5-3.2-1.3l-.6.8c1 1 2.4 1.5 3.8 1.5V14l3.5-2-3.5-2v1.5zm0-6V7l3.5-2L12 3v1.5c-1.6 0-3.2.7-4.2 2l-3.4 3.9c-.9 1-2.2 1.6-3.5 1.6v1c1.6 0 3.2-.7 4.2-2l3.4-3.9c.9-1 2.2-1.6 3.5-1.6z"></path>
                    </svg>
                  </button>

                  <button
                    className="w-8 h-8 text-[#b3b3b3] hover:text-white flex justify-center items-center"
                    onClick={() => previousSong()}
                  >
                    <svg className="fill-current w-4 h-4" viewBox="0 0 16 16">
                      <path d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z"></path>
                    </svg>
                  </button>
                </div>

                <button
                  className="bg-white text-black rounded-full h-8 w-8 flex justify-center items-center transition-transform duration-200 ease-in-out"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" d="M0 0h16v16H0z"></path>
                      <path d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                      <path d="M4.018 14L14.41 8 4.018 2z"></path>
                    </svg>
                  )}
                </button>

                <div className="flex flex-1 gap-2">
                  <button
                    className="w-8 h-8 text-[#b3b3b3] hover:text-white
                     flex justify-center items-center"
                    onClick={() => nextSong()}
                  >
                    <svg className="fill-current w-4 h-4" viewBox="0 0 16 16">
                      <path d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z"></path>
                    </svg>
                  </button>

                  <button
                    className={`w-8 h-8 text-${
                      loop ? 'sp-green' : '[#b3b3b3] hover:text-white'
                    } flex justify-center items-center`}
                    onClick={() => toggleLoop()}
                  >
                    <svg className="fill-current w-4 h-4" viewBox="0 0 16 16">
                      <path d="M5.5 5H10v1.5l3.5-2-3.5-2V4H5.5C3 4 1 6 1 8.5c0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.6 3.6 5 5.5 5zm9.1 1.7l-.9.5c.2.4.3.8.3 1.3 0 1.9-1.6 3.5-3.5 3.5H6v-1.5l-3.5 2 3.5 2V13h4.5C13 13 15 11 15 8.5c0-.6-.1-1.2-.4-1.8z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="text-[11px] font-light leading-4 tracking-normal min-w-[40px] text-center text-[#b3b3b3]">
                  {PrettyMs(playedDuration * 1000, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                  })}
                </div>
                <Seeker
                  value={isDragging ? virtualDuration : playedDuration}
                  max={currentSong.duration / 1000}
                  onChange={(val) => {
                    setIsDragging(true);
                    setVirtualDuration(val);
                  }}
                  onChangeEnd={seek}
                />

                <div className="text-[11px] font-normal leading-4 tracking-normal min-w-[40px] text-center text-[#b3b3b3]">
                  {PrettyMs(currentSong.duration, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                    millisecondsDecimalDigits: 0,
                  })}
                </div>
              </div>
            </div>

            {/* volume */}
            <div className="min-w-[180px] w-[30%] flex items-center justify-end">
              <button
                className="bg-transparent mr-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white"
                onClick={toggleMuted}
              >
                {volume !== 0 ? (
                  <svg
                    className="fill-current w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.945 1.379l-.652.763c1.577 1.462 2.57 3.544 2.57 5.858s-.994 4.396-2.57 5.858l.651.763a8.966 8.966 0 00.001-13.242zm-2.272 2.66l-.651.763a4.484 4.484 0 01-.001 6.397l.651.763c1.04-1 1.691-2.404 1.691-3.961s-.65-2.962-1.69-3.962zM0 5v6h2.804L8 14V2L2.804 5H0zm7-1.268v8.536L3.072 10H1V6h2.072L7 3.732z"></path>
                  </svg>
                ) : (
                  <svg
                    className="fill-current w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 5v6h2.804L8 14V2L2.804 5H0zm7-1.268v8.536L3.072 10H1V6h2.072L7 3.732zm8.623 2.121l-.707-.707-2.147 2.147-2.146-2.147-.707.707L12.062 8l-2.146 2.146.707.707 2.146-2.147 2.147 2.147.707-.707L13.477 8l2.146-2.147z"></path>
                  </svg>
                )}
              </button>
              <Seeker
                value={volume}
                max={20}
                width={100}
                onChange={changeVolume}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Player;
