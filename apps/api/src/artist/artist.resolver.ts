import { CurrentUser } from '../utils/current-user-decorator';
import { GraphqlAuthGuard } from '../utils/nestjs-passport-graphql-auth-guard/graphql-auth.guard';
import {
  IPaginationInfo,
  PaginationInfo,
} from '../utils/pagination-info.decorator';
import {
  ArtistWhereInput,
  ArtistWhereUniqueInput,
} from '@spotify-clone-monorepo/model';
import { NotFoundException, UseGuards } from '@nestjs/common';
import {
  Args,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { UserModel } from '../user/models/user.model';
import { GraphQLResolveInfo } from 'graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { AppConfigService } from '../environments/app.environment';
import { ArtistService } from './artist.service';
import { CreateArtistInput, UpdateArtistInput } from './dto';
import { Artist } from './models/artist.model';

@Resolver(() => Artist)
export class ArtistResolver {
  constructor(
    private readonly artistService: ArtistService,
    private readonly appEnvironment: AppConfigService
  ) {}

  private readonly defaultFields = {
    Artist: {
      id: true,
      imageId: true,
    },
  };

  @Query(() => [Artist])
  async artists(
    @PaginationInfo() p: IPaginationInfo,
    @Info() info: GraphQLResolveInfo,
    @Args('where', { nullable: true }) where?: ArtistWhereInput
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;

    return this.artistService.findAll({
      where,
      select,
      ...p,
    });
  }

  @Query(() => Artist)
  async artist(
    @Args('where') where: ArtistWhereUniqueInput,
    @Info() info: GraphQLResolveInfo
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;

    const artist = await this.artistService.findOne({
      where,
      select,
      rejectOnNotFound: true,
    });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Artist)
  async createArtist(
    @Args('data') data: CreateArtistInput,
    @CurrentUser() user: UserModel,
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image?: FileUpload
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;
    return this.artistService.create({
      data,
      user,
      select,
      image,
    });
  }

  @Mutation(() => Artist)
  async updateArtist(
    @Args('where') where: ArtistWhereUniqueInput,
    @Args('data') data: UpdateArtistInput,
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image?: FileUpload
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;

    return this.artistService.update({ where, data, select, image });
  }

  @Mutation(() => Artist)
  async removeArtist(
    @Args('where') where: ArtistWhereUniqueInput,
    @Info() info: GraphQLResolveInfo
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;

    return this.artistService.remove({ where, select });
  }

  @ResolveField(() => String, { nullable: true })
  async imageUrl(@Parent() _: Artist) {
    return _.imageId
      ? `${this.appEnvironment.cloudinaryBaseUrl}/image/upload/${_.imageId}`
      : undefined;
  }

  @Query(() => Number)
  async totalArtists(
    @Args({ name: 'where', nullable: true }) where?: ArtistWhereInput
  ) {
    return this.artistService.count({ where });
  }
}
