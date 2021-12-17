import { AlbumType } from '@spotify-clone-monorepo/model';
import { GroupBase } from 'react-select';
import { LoadOptions } from 'react-select-async-paginate';

interface Additional {
  page: number;
}
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

export interface Option {
  value: string;
  label: string;
}

export interface AsyncMultiselectProps {
  name: string;
  defaultValues?: Option[];
  loadOptions: LoadOptions<unknown, GroupBase<unknown>, Additional>;
}

export interface AsyncSelectProps {
  name: string;
  defaultValue?: Option;
  loadOptions: LoadOptions<unknown, GroupBase<unknown>, Additional>;
}

export interface SelectProps {
  name: string;
  options: Option[];
  defaultValue?: Option;
}

export interface MultiselectProps {
  name: string;
  options: Option[];
  defaultValues?: Option[];
}
