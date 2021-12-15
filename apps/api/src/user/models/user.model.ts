import { Artist } from '../../artist/models/artist.model';
import { AlbumLikes, TrackLikes } from '@spotify-clone-monorepo/model';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  email!: string;

  @HideField()
  password!: string;

  @Field(() => Artist, { nullable: true })
  artist!: Artist;

  @Field(() => [TrackLikes], { nullable: true })
  likedTracks!: TrackLikes[];

  @Field(() => [AlbumLikes], { nullable: true })
  likedAlbums!: AlbumLikes[];

  @Field(() => Date, { nullable: true })
  createdAt!: Date;

  @Field(() => Date, { nullable: true })
  updatedAt!: Date;
}
