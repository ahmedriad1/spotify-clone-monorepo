import { UnauthorizedException } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {
  RefreshTokenInput,
  UserCreateInput,
  UserLoginInput,
} from '../user/dto';
import { AuthenticatedUserModel } from '../user/models/user.model';
import { UserService } from '../user/user.service';
import { GraphQLContext } from '../utils/gql-config.service';
import { AuthService } from './auth.service';

@Resolver(() => AuthenticatedUserModel)
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Mutation(() => AuthenticatedUserModel)
  async createUser(
    @Args('data') data: UserCreateInput,
    @Context() context: GraphQLContext
  ) {
    const user = await this.userService.create(data);
    ({ accessToken: context.token, refreshToken: context.refreshToken } =
      await this.authService.session(user));
    return user;
  }

  @Mutation(() => AuthenticatedUserModel)
  async loginUser(
    @Args('data') data: UserLoginInput,
    @Context() context: GraphQLContext
  ) {
    const user = await this.userService.findByCredentials(data);
    if (!user) throw new UnauthorizedException();

    ({ accessToken: context.token, refreshToken: context.refreshToken } =
      await this.authService.session(user));
    return user;
  }

  @Mutation(() => AuthenticatedUserModel)
  async refreshAccessToken(
    @Args('data') data: RefreshTokenInput,
    @Context() context: GraphQLContext
  ) {
    const userId = await this.authService.refreshToken(data.refreshToken);

    const user = await this.userService.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('Invalid refresh token');

    ({ accessToken: context.token, refreshToken: data.refreshToken } =
      await this.authService.session(user));

    return user;
  }

  @ResolveField(() => String, { nullable: true })
  async token(
    @Parent() _: AuthenticatedUserModel,
    @Context() context: GraphQLContext
  ) {
    return context.token;
  }

  @ResolveField(() => String, { nullable: true })
  async refreshToken(
    @Parent() _: AuthenticatedUserModel,
    @Context() context: GraphQLContext
  ) {
    return context.refreshToken;
  }
}
