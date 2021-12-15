import { CurrentUser } from '../utils/current-user-decorator/index';
import { GraphqlAuthGuard } from '../utils/nestjs-passport-graphql-auth-guard/graphql-auth.guard';
import { LikesContain, PassportUserFields } from '../types';
import {
  TrackWhereInput,
  TrackWhereUniqueInput,
} from '@spotify-clone-monorepo/model';
import { UseGuards } from '@nestjs/common';
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
import { GraphQLResolveInfo } from 'graphql';
import { FileUpload } from 'graphql-upload';
import { CreateTrackInput } from './dto/create-track.input';
import { UpdateTrackInput } from './dto/update-track.input';
import { Track } from './models/track.model';
import { TrackService } from './track.service';
import {
  IPaginationInfo,
  PaginationInfo,
} from '../utils/pagination-info.decorator';
import { UploadFile } from '../utils/upload-file.decorator';
import { AppConfigService } from '../environments/app.environment';

@Resolver(() => Track)
export class TrackResolver {
  private readonly defaultFields = {
    Track: {
      id: true,
      trackId: true,
    },
    Album: {
      id: true,
      imageId: true,
    },
  };

  constructor(
    private readonly trackService: TrackService,
    private readonly appEnvironment: AppConfigService
  ) {}

  @Query(() => [Track])
  async tracks(
    @PaginationInfo() p: IPaginationInfo,
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'where', nullable: true }) where?: TrackWhereInput
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: this.defaultFields,
    }).value.select;

    return this.trackService.findAll({
      select,
      where,
      ...p,
    });
  }

  @Query(() => Track)
  async track(
    @Args('where') where: TrackWhereUniqueInput,
    @Info() info: GraphQLResolveInfo
  ) {
    const select = new PrismaSelect(info, {
      defaultFields: {
        Track: { id: true },
      },
    }).value.select;
    return this.trackService.findOne({ where, select, rejectOnNotFound: true });
  }

  @Mutation(() => Track)
  async createTrack(
    @Args('data') data: CreateTrackInput,
    @UploadFile({
      name: 'trackFile',
      allowedTypes: ['audio/mpeg', 'audio/mp3'],
    })
    trackFile: FileUpload
  ) {
    console.log(trackFile);
    return this.trackService.create({ data, trackFile });
  }

  @Mutation(() => Track)
  async updateTrack(
    @Args('where') where: TrackWhereUniqueInput,
    @Args('data') data: UpdateTrackInput,
    @UploadFile({
      name: 'trackFile',
      allowedTypes: ['audio/mpeg', 'audio/mp3'],
      nullable: true,
    })
    trackFile?: FileUpload
  ) {
    return this.trackService.update({ where, data, trackFile });
  }

  @Mutation(() => Track)
  async removeTrack(@Args('where') where: TrackWhereUniqueInput) {
    return this.trackService.remove(where);
  }

  @Mutation(() => Track)
  @UseGuards(GraphqlAuthGuard)
  async likeTrack(
    @Args('where') where: TrackWhereUniqueInput,
    @CurrentUser() user: PassportUserFields
  ) {
    return this.trackService.like(where, user);
  }

  @Mutation(() => Track)
  @UseGuards(GraphqlAuthGuard)
  async unlikeTrack(
    @Args('where') where: TrackWhereUniqueInput,
    @CurrentUser() user: PassportUserFields
  ) {
    return this.trackService.unlike(where, user);
  }

  @Query(() => [LikesContain])
  @UseGuards(GraphqlAuthGuard)
  async trackLikesContain(
    @Args({ name: 'tracks', type: () => [String], nullable: false })
    tracks: Array<string>,
    @CurrentUser() user: PassportUserFields
  ) {
    return this.trackService.likesContain(tracks, user);
  }

  @ResolveField(() => String, { nullable: true })
  async trackUrl(@Parent() _: Track) {
    return _.trackId
      ? `${this.appEnvironment.cloudinaryBaseUrl}/video/upload/${_.trackId}`
      : undefined;
  }

  @Query(() => Number)
  async totalTracks(
    @Args({ name: 'where', nullable: true }) where?: TrackWhereInput
  ) {
    return this.trackService.count({ where });
  }
}
