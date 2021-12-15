import { CurrentUser } from '../utils/current-user-decorator/index';
import { GraphqlAuthGuard } from '../utils/nestjs-passport-graphql-auth-guard/graphql-auth.guard';
import {
  IPaginationInfo,
  PaginationInfo,
} from '../utils/pagination-info.decorator';
import { LikesContain, PassportUserFields } from '../types';
import {
  AlbumWhereInput,
  AlbumWhereUniqueInput,
} from '@spotify-clone-monorepo/model';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Float,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { AlbumService } from './album.service';
import { CreateAlbumInput, UpdateAlbumInput } from './dto';
import { Album } from './models/album.model';
import { AppConfigService } from '../environments/app.environment';

@Resolver(() => Album)
export class AlbumResolver {
  private readonly defaultFields = {
    Album: {
      id: true,
      imageId: true,
    },
  };

  constructor(
    private readonly albumService: AlbumService,
    // private readonly artistService: ArtistService,
    private readonly appEnvironment: AppConfigService
  ) {}

  @Query(() => [Album])
  async albums(
    @PaginationInfo() p: IPaginationInfo,
    @Info() info: GraphQLResolveInfo,
    @Args('where', { nullable: true }) where?: AlbumWhereInput
  ) {
    this.appEnvironment.cloudinaryCloudName;
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;
    return this.albumService.findAll({
      where,
      select,
      ...p,
    });
  }

  @Query(() => Album)
  async album(
    @Args('where') where: AlbumWhereUniqueInput,
    @Info() info: GraphQLResolveInfo
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;
    return this.albumService.findOne({ where, select, rejectOnNotFound: true });
  }

  @Mutation(() => Album)
  @UseGuards(GraphqlAuthGuard)
  async createAlbum(
    @Args('data') data: CreateAlbumInput,
    @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload
    // @CurrentUser() user,
  ) {
    // const artist = await this.artistService.findOne({
    //     where: { userId: user.id },
    //     rejectOnNotFound: true,
    // });

    return this.albumService.create({ data, image });
  }

  @Mutation(() => Album)
  @UseGuards(GraphqlAuthGuard)
  async updateAlbum(
    @Args('where') where: AlbumWhereUniqueInput,
    @Args('data') data: UpdateAlbumInput,
    // @CurrentUser() user,
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image?: FileUpload
  ) {
    // const artist = await this.artistService.findOne({
    //     where: { userId: user.id },
    //     rejectOnNotFound: true,
    // });

    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;

    return this.albumService.update({
      where,
      data,
      image,
      select,
    });
  }

  @Mutation(() => Album)
  async removeAlbum(@Args('where') where: AlbumWhereUniqueInput) {
    return this.albumService.remove(where);
  }

  @Mutation(() => Album)
  @UseGuards(GraphqlAuthGuard)
  async likeAlbum(
    @Args('where') where: AlbumWhereUniqueInput,
    @CurrentUser() user: PassportUserFields
  ) {
    return this.albumService.like(where, user);
  }

  @Mutation(() => Album)
  @UseGuards(GraphqlAuthGuard)
  async unlikeAlbum(
    @Args('where') where: AlbumWhereUniqueInput,
    @CurrentUser() user: PassportUserFields
  ) {
    return this.albumService.unlike(where, user);
  }

  @Query(() => [LikesContain])
  @UseGuards(GraphqlAuthGuard)
  async albumLikesContain(
    @Args({ name: 'tracks', type: () => [String], nullable: false })
    tracks: Array<string>,
    @CurrentUser() user: PassportUserFields
  ) {
    return this.albumService.likesContain(tracks, user);
  }

  @ResolveField(() => String, { nullable: true })
  async imageUrl(@Parent() _: Album) {
    return _.imageId
      ? `${this.appEnvironment.cloudinaryBaseUrl}/image/upload/${_.imageId}`
      : undefined;
  }

  @ResolveField(() => Float, { nullable: true })
  async tracksDuration(@Parent() _: Album) {
    return this.albumService.tracksDuration(_);
  }

  @Query(() => Number)
  async totalAlbums(
    @Args({ name: 'where', nullable: true }) where?: AlbumWhereInput
  ) {
    return this.albumService.count({ where });
  }
}
