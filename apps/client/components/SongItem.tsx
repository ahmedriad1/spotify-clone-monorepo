import { useAuthStore } from '@spotify-clone-monorepo/auth';
import PrettyMs from 'pretty-ms';
import useIsTrackLiked from '../hooks/useIsTrackLiked';
import useLikeTrackMutation from '../hooks/useLikeTrackMutation';
import { Album } from '../hooks/useSingleAlbum';

interface SongItemProps {
  onClick: () => void;
  track: Album['tracks'][0];
  album: Album;
  isPlaying: boolean;
  active: boolean;
}

const SongItem: React.FC<SongItemProps> = ({
  onClick,
  active,
  album,
  isPlaying,
  track,
}) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const likeTrackMutation = useLikeTrackMutation();
  const { data: isLiked } = useIsTrackLiked(
    track.id,
    album.tracks.map(({ id }) => id)
  );

  return (
    <li
      className={`cursor-pointer w-full p-3 flex items-center ${
        active ? 'text-sp-green' : ''
      } trasition-colors duration-200 ease-in-out group hover:bg-[rgba(255,255,255,0.1)]`}
      onClick={onClick}
    >
      <div
        className={`${
          active ? 'text-sp-green' : 'text-[rgba(255,255,255,0.7)]'
        } pr-4`}
        onClick={(e) => e.stopPropagation()}
      >
        <svg
          className="w-4 h-4 fill-current group-hover:hidden"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M334.938 102.697c-30.917-24.154-57.604-45.007-57.604-91.999C277.333 4.785 272.563 0 266.667 0S256 4.785 256 10.698v351.53c0 11.805-9.563 21.396-21.333 21.396H192c-47.063 0-85.333 28.793-85.333 64.188S144.937 512 192 512s85.333-28.793 85.333-64.188V77.853c12.349 16.53 28.538 29.241 44.5 41.706C353.792 144.548 384 168.138 384 223.154c0 5.913 4.771 10.698 10.667 10.698s10.667-4.785 10.667-10.698c-.001-65.463-37.396-94.694-70.396-120.457zM256 447.812c0 23.193-29.313 42.792-64 42.792s-64-19.599-64-42.792 29.313-42.792 64-42.792h42.667A42.214 42.214 0 00256 399.274v48.538z" />
        </svg>
        {isPlaying ? (
          <svg
            className="w-4 h-4 fill-current hidden group-hover:block"
            viewBox="0 0 24 24"
          >
            <svg
              className="fill-current"
              viewBox="-45 0 327 327"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M158 0h71a8 8 0 018 8v311a8 8 0 01-8 8h-71a8 8 0 01-8-8V8a8 8 0 018-8zm0 0M8 0h71a8 8 0 018 8v311a8 8 0 01-8 8H8a8 8 0 01-8-8V8a8 8 0 018-8zm0 0" />
            </svg>
          </svg>
        ) : (
          <svg
            className="w-4 h-4 fill-current hidden group-hover:block"
            viewBox="0 0 85 100"
          >
            <path d="M81 44.6c5 3 5 7.8 0 10.8L9 98.7c-5 3-9 .7-9-5V6.3c0-5.7 4-8 9-5l72 43.3z">
              <title>PLAY</title>
            </path>
          </svg>
        )}

        {/*  */}
      </div>
      <div>
        <h3 className="font-light text-base">{track.name}</h3>
        <span className="text-[0.9rem] text-[rgba(255,255,255,0.7)]">
          {album.artists.map((a) => a.name).join(', ')}
        </span>
      </div>
      <div className="ml-auto flex">
        {isLoggedIn && (
          <button
            className="mr-4 text-sp-green"
            onClick={(e) => {
              e.stopPropagation();
              likeTrackMutation.mutate(track.id);
            }}
          >
            {isLiked ? (
              <svg
                className="fill-current w-4"
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
        <span className="text-sm text-[rgba(255,255,255,0.7)]">
          {PrettyMs(track.duration, {
            colonNotation: true,
            secondsDecimalDigits: 0,
            millisecondsDecimalDigits: 0,
          })}
        </span>
      </div>
    </li>
  );
};

export default SongItem;
