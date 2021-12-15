import {
  ArtistWhereUniqueInput,
  GenreWhereUniqueInput,
} from '@spotify-clone-monorepo/model';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
class ArtistsConnectOrDisconnect {
  @Field(() => [ArtistWhereUniqueInput], { nullable: true })
  connect?: ArtistWhereUniqueInput[];

  @Field(() => [ArtistWhereUniqueInput], { nullable: true })
  disconnect?: ArtistWhereUniqueInput[];
}

@InputType()
export class UpdateAlbumInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => GenreWhereUniqueInput, { nullable: true })
  genre?: GenreWhereUniqueInput;

  @Field(() => ArtistsConnectOrDisconnect, { nullable: true })
  artists?: ArtistsConnectOrDisconnect;
}
