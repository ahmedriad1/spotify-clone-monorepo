export interface Album {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  artists: Artist[];
}

export interface Artist {
  id: string;
  name: string;
}

export interface Genre {
  id: string;
  name: string;
  description: string;
  albums: Album[];
}
