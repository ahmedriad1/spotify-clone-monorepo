import useAddAlbum, { IAddAlbumData } from './albums/useAddAlbum';
import useRemoveAlbum from './albums/useRemoveAlbum';
import useUpdateAlbum, { IUpdateAlbumData } from './albums/useUpdateAlbum';
import useAddArtist from './artists/useAddArtist';
import useAddGenre from './genres/useAddGenre';
import useAddTrack, { IAddTrackData } from './tracks/useAddTrack';
import useRemoveGenre from './genres/useRemoveGenre';

export {
  useAddAlbum,
  IAddAlbumData,
  useRemoveAlbum,
  useAddTrack,
  IAddTrackData,
  useUpdateAlbum,
  IUpdateAlbumData,
  useAddArtist,
  useAddGenre,
  useRemoveGenre,
};
