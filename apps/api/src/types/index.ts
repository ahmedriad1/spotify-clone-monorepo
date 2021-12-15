import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  AppConfigService as _AppEnvironment,
  graphqlModuleFactory,
} from '../environments/app.environment';
import { PassportUserFields as _PassportUserFields } from '../auth';

export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;

export type GraphQLContext = ReturnType<
  Await<ReturnType<typeof graphqlModuleFactory>>['context']
>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      email: string;
    }
  }
}

export type AppEnvironment = typeof _AppEnvironment;
export type PassportUserFields = _PassportUserFields;

@ObjectType()
export class LikesContain {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => Boolean, { nullable: false })
  liked!: boolean;
}
