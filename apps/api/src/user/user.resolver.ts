import { CurrentUser } from '../utils/current-user-decorator';
import {
  GraphqlAuthGuard,
  OptionalGraphqlAuthGuard,
} from '../utils/nestjs-passport-graphql-auth-guard';
import { AuthService } from '../auth/auth.service';
import {
  UserWhereInput,
  UserWhereUniqueInput,
} from '@spotify-clone-monorepo/model';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { Prisma } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext, PassportUserFields } from '../types';
import {
  RefreshTokenInput,
  UserCreateInput,
  UserLoginInput,
  UserUpdateInput,
} from './dto';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';
import {
  IPaginationInfo,
  PaginationInfo,
} from '../utils/pagination-info.decorator';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => UserModel)
  async me(
    @CurrentUser() user: PassportUserFields,
    @Info() info: GraphQLResolveInfo
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: {
        User: { id: true },
      },
    }).value.select;

    return this.userService.findUnique({
      where: { id: user.id },
      select,
    });
  }

  @UseGuards(OptionalGraphqlAuthGuard)
  @Query(() => UserModel)
  async user(
    @Args('where') where: UserWhereUniqueInput,
    @Info() info: GraphQLResolveInfo
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: {
        User: { id: true },
      },
    }).value.select;

    return this.userService.findUnique({
      select,
      where,
      rejectOnNotFound: true,
    });
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [UserModel])
  async users(
    @PaginationInfo() p: IPaginationInfo,
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'where', nullable: true }) where?: UserWhereInput
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: {
        User: { id: true },
      },
    }).value.select;

    return this.userService.findAll({
      select,
      where,
      ...p,
    });
  }

  @Mutation(() => UserModel)
  async createUser(
    @Args('data') data: UserCreateInput,
    @Context() context: GraphQLContext
  ) {
    const user = await this.userService.create(data);
    ({ accessToken: context.token, refreshToken: context.refreshToken } =
      await this.authService.session(user));
    return user;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => UserModel)
  async updateUser(
    @Args('data') data: UserUpdateInput,
    @CurrentUser() user: PassportUserFields
  ) {
    return this.userService.update(
      { id: user.id },
      data as Prisma.UserUpdateInput
    );
  }

  @Mutation(() => UserModel)
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

  @Mutation(() => UserModel)
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
  async token(@Parent() _: UserModel, @Context() context: GraphQLContext) {
    return context.token;
  }

  @ResolveField(() => String, { nullable: true })
  async refreshToken(
    @Parent() _: UserModel,
    @Context() context: GraphQLContext
  ) {
    return context.refreshToken;
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Number)
  async totalUsers(
    @Args({ name: 'where', nullable: true }) where?: UserWhereInput
  ) {
    return this.userService.count({ where });
  }
}
