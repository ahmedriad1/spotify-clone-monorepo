import { shuffle } from '@spotify-clone-monorepo/utils';
import create, { GetState, SetState } from 'zustand';
import {
  devtools,
  persist,
  StoreApiWithDevtools,
  StoreApiWithPersist,
} from 'zustand/middleware';

interface IPlayerStore {
  isPlaying: boolean;
  currentSong: string;
  loop: boolean;
  queue: string[];
  shuffledQueue: string[];
  nowPlayingQueue: string[];
  shuffle: boolean;
  volume: number;
  oldVolume: number;
  get: <T extends keyof IPlayerStore>(key: T) => IPlayerStore[T];
  setVolume: (newVolume: number) => void;
  toggleMuted: () => void;
  setQueue: ({
    tracks,
    currentSong,
  }: {
    tracks: string[];
    currentSong?: string;
  }) => void;
  resume: () => void;
  pause: () => void;
  toggleLoop: () => void;
  shuffleQueue: () => void;
  deshuffleQueue: () => void;
  nextSong: () => void;
  previousSong: () => void;
}

const initialState = {
  isPlaying: false,
  currentSong: null,
  loop: false,
  queue: [],
  shuffledQueue: [],
  nowPlayingQueue: [],
  shuffle: false,
  volume: 20,
  oldVolume: 20,
};

const usePlayerStore = create<
  IPlayerStore,
  SetState<IPlayerStore>,
  GetState<IPlayerStore>,
  StoreApiWithDevtools<IPlayerStore>
>(
  devtools(
    persist<
      IPlayerStore,
      SetState<IPlayerStore>,
      GetState<IPlayerStore>,
      StoreApiWithPersist<IPlayerStore>
    >(
      (set, get) => ({
        ...initialState,
        get: (key) => get()[key],
        setVolume: (newVolume) => set(() => ({ volume: newVolume })),
        toggleMuted: () =>
          set((state) => ({
            volume: state.volume !== 0 ? 0 : state.oldVolume,
            oldVolume: state.volume !== 0 ? state.volume : state.oldVolume,
          })),
        setQueue: ({ tracks, currentSong }) =>
          set((state) => {
            const newQueue = tracks;
            const newShuffledQueue = state.shuffle
              ? shuffle<string>(newQueue.map((val) => [val]))
              : [];

            const nowPlaying = state.shuffle ? newShuffledQueue : newQueue;
            const nowPlayingQueue = currentSong
              ? nowPlaying.slice(
                  nowPlaying.findIndex((track) => track === currentSong)
                )
              : nowPlaying;

            return {
              isPlaying: true,
              currentSong: nowPlayingQueue[0],
              queue: newQueue,
              shuffledQueue: newShuffledQueue,
              nowPlayingQueue: nowPlayingQueue,
            };
          }),
        resume: () =>
          set((state) => {
            let newNowPlayingQueue = state.nowPlayingQueue;
            if (
              (state.queue.length || state.shuffledQueue.length) &&
              !state.nowPlayingQueue.length
            )
              newNowPlayingQueue = [
                state.currentSong,
                ...(state.shuffle
                  ? state.shuffledQueue.slice(1)
                  : state.queue.slice(1)),
              ];
            return {
              isPlaying: true,
              nowPlayingQueue: newNowPlayingQueue,
            };
          }),
        pause: () => set((_state) => ({ isPlaying: false })),
        toggleLoop: () => set((state) => ({ loop: !state.loop })),
        shuffleQueue: () =>
          set((state) => {
            const shuffled = shuffle(state.queue.map((val) => [val]));
            return {
              shuffledQueue: shuffled,
              shuffle: true,
              nowPlayingQueue: [
                state.currentSong,
                ...shuffled.filter((song) => song !== state.currentSong),
              ],
            };
          }),
        deshuffleQueue: () =>
          set((state) => ({
            shuffle: false,
            shuffledQueue: [],
            nowPlayingQueue: state.queue.slice(
              state.queue.findIndex((song) => song === state.currentSong)
            ),
          })),
        nextSong: () =>
          set((state) => {
            const newNowPlayingQueue = state.nowPlayingQueue.slice(1);
            const currentSong = newNowPlayingQueue.length
              ? newNowPlayingQueue[0]
              : state[state.shuffle ? 'shuffledQueue' : 'queue'][0];
            return {
              nowPlayingQueue: newNowPlayingQueue,
              currentSong,
              isPlaying: !!newNowPlayingQueue.length,
            };
          }),
        previousSong: () =>
          set((state) => {
            const queue = state.shuffle ? state.shuffledQueue : state.queue;
            const indexOfSongInQueue = queue.findIndex(
              (song) => song === state.currentSong
            );
            const previousSong =
              indexOfSongInQueue > 0 ? queue[indexOfSongInQueue - 1] : null;
            if (!previousSong) return;
            return {
              nowPlayingQueue: [previousSong, ...state.nowPlayingQueue],
              currentSong: previousSong,
            };
          }),
      }),
      { name: 'playerState', blacklist: ['isPlaying'] }
    )
  )
);

export default usePlayerStore;
