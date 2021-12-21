import { CurrentUser } from '../utils/current-user-decorator';
import {
  UserWhereInput,
  UserWhereUniqueInput,
} from '@spotify-clone-monorepo/model';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Prisma, User } from '@prisma/client';
import { UserUpdateInput } from './dto';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';
import {
  IPaginationInfo,
  PaginationInfo,
} from '../utils/pagination-info.decorator';
import { useAuth, useOptionalAuth } from '../auth/use-auth.decorator';
import { QuerySelect } from '../utils/query-select.decorator';

@Resolver(() => UserModel)
export class UserResolver {
  private readonly defaultFields = {
    defaultFields: {
      User: { id: true },
    },
  };

  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  @useAuth()
  async me(
    @CurrentUser() user: UserModel,
    @QuerySelect({ User: { id: true } }) select
  ) {
    return this.userService.findUnique({
      where: { id: user.id },
      select,
    });
  }

  @Query(() => UserModel)
  @useOptionalAuth()
  async user(
    @Args('where') where: UserWhereUniqueInput,
    @QuerySelect({ User: { id: true } }) select
  ) {
    return this.userService.findUnique({
      select,
      where,
      rejectOnNotFound: true,
    });
  }

  @Mutation(() => UserModel)
  @useAuth()
  async updateUser(
    @Args('data') data: UserUpdateInput,
    @CurrentUser() user: User
  ) {
    return this.userService.update(
      { id: user.id },
      data as Prisma.UserUpdateInput
    );
  }

  @Query(() => [UserModel])
  @useAuth()
  async users(
    @PaginationInfo() p: IPaginationInfo,
    @QuerySelect({ User: { id: true } }) select,
    @Args({ name: 'where', nullable: true }) where?: UserWhereInput
  ) {
    return this.userService.findAll({
      select,
      where,
      ...p,
    });
  }

  @Query(() => Number)
  @useAuth()
  async totalUsers(
    @Args({ name: 'where', nullable: true }) where?: UserWhereInput
  ) {
    return this.userService.count({ where });
  }
}
