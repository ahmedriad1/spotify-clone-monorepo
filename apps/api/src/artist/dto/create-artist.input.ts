import { UserWhereUniqueInput } from '@spotify-clone-monorepo/model';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateArtistInput {
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @Field(() => UserWhereUniqueInput)
  user: UserWhereUniqueInput;
}
