import { AlbumType } from '@spotify-clone-monorepo/model';

export interface Album {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  likesCount: number;
  genre: Omit<Genre, 'albums'>;
  type: AlbumType;
  _count: {
    tracks: number;
  };
  artists: Artist[];
}

export interface Artist {
  id: string;
  name: string;
  user?: {
    name: string;
    email: string;
  };
  imageUrl: string;
  _count: {
    tracks: number;
    albums: number;
  };
}

export interface Genre {
  id: string;
  name: string;
  description: string;
  albums: Album[];
  _count: {
    albums: number;
  };
}

export interface Track {
  id: string;
  name: string;
  duration: number;
  likesCount: number;
  album: Album;
  artists: Pick<Artist, 'id' | 'name'>[];
}
