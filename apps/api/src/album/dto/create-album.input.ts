import {
  ArtistWhereUniqueInput,
  GenreWhereUniqueInput,
  AlbumType,
} from '@spotify-clone-monorepo/model';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateAlbumInput {
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string;

  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  description: string;

  @IsNotEmpty()
  @Field(() => GenreWhereUniqueInput, { nullable: false })
  genre: GenreWhereUniqueInput;

  @IsNotEmpty()
  @IsEnum(AlbumType)
  @Field(() => AlbumType, { nullable: false, defaultValue: AlbumType.ALBUM })
  type: AlbumType;

  @IsNotEmpty()
  @Field(() => [ArtistWhereUniqueInput], { nullable: false })
  artists: ArtistWhereUniqueInput[];
}
