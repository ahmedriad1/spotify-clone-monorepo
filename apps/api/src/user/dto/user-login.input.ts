import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserLoginInput {
  @Field(() => String, {
    description: undefined,
  })
  email: string;

  @Field(() => String, {
    nullable: false,
    description: undefined,
  })
  password: string;
}
