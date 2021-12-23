import {
  IPaginationInfo,
  PaginationInfo,
} from '../utils/pagination-info.decorator';
import {
  GenreWhereUniqueInput,
  GenreWhereInput,
} from '@spotify-clone-monorepo/model';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';
import { GenreCreateInput, GenreUpdateInput } from './dto';
import { GenreService } from './genre.service';
import { Genre } from './models/genre.model';

@Resolver(() => Genre)
export class GenreResolver {
  private readonly defaultFields = {
    Genre: { id: true },
    Album: {
      id: true,
      image: true,
    },
    Image: {
      cloudinaryId: true,
    },
  };

  constructor(private readonly genreService: GenreService) {}

  @Query(() => [Genre])
  async genres(
    @PaginationInfo() p: IPaginationInfo,
    @Info() info: GraphQLResolveInfo,
    @Args('where', { nullable: true }) where?: GenreWhereInput
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;
    return this.genreService.findAll({
      where,
      select,
      ...p,
    });
  }

  @Query(() => Genre)
  async genre(
    @Args('where') where: GenreWhereUniqueInput,
    @Info() info: GraphQLResolveInfo
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;

    return this.genreService.findUnique({
      select,
      where,
      rejectOnNotFound: true,
    });
  }

  @Mutation(() => Genre)
  async createGenre(@Args('data') data: GenreCreateInput) {
    return await this.genreService.createGenre(data);
  }

  @Mutation(() => Genre)
  async updateGenre(
    @Args('data') data: GenreUpdateInput,
    @Args('where') where: GenreWhereUniqueInput
  ) {
    const genre = await this.genreService.findUnique({
      where,
      rejectOnNotFound: true,
    });

    return this.genreService.update({
      data,
      where: { id: genre.id },
    });
  }

  // @Mutation(() => User)
  // @UseGuards(GraphqlAuthGuard)
  // async updateUser(
  //     @Args('data') data: UserUpdateInput,
  //     @CurrentUser() user: PassportUserFields,
  // ) {
  //     return this.userService.update({ id: user.id }, data as Prisma.UserUpdateInput);
  // }

  // @ResolveField(() => String, { nullable: true })
  // async token(@Parent() _: User, @Context() context: GraphQLContext) {
  //     return context.token;
  // }

  // @ResolveField(() => Float, { nullable: true })
  // async refreshToken(@Parent() _: Genre, @Context() context: GraphQLContext) {
  //     return context.refreshToken;
  // }

  @Query(() => Number)
  async totalGenres(
    @Args({ name: 'where', nullable: true }) where?: GenreWhereInput
  ) {
    return this.genreService.count({ where });
  }
}
