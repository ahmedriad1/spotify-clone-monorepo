import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserUpdateInput {
  @Field(() => String, {
    nullable: true,
    description: undefined,
  })
  email?: string;

  @Field(() => String, {
    nullable: true,
    description: undefined,
  })
  name?: string;

  @Field(() => String, {
    nullable: true,
    description: undefined,
  })
  password?: string;
}
