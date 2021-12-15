import {
  AlbumWhereUniqueInput,
  ArtistWhereUniqueInput,
  GenreWhereUniqueInput,
} from '@spotify-clone-monorepo/model';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateTrackInput {
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string;

  @IsNotEmpty()
  @Field(() => GenreWhereUniqueInput, { nullable: false })
  genre: GenreWhereUniqueInput;

  @IsNotEmpty()
  @Field(() => AlbumWhereUniqueInput, { nullable: false })
  album: AlbumWhereUniqueInput;

  @IsOptional()
  @Field(() => [ArtistWhereUniqueInput], { nullable: true })
  artists?: ArtistWhereUniqueInput[];
}
