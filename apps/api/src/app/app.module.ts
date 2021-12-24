import { PrismaModule } from '@spotify-clone-monorepo/model';
import { Global, Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ArtistModule } from '../artist/artist.module';
import { UserModule } from '../user/user.module';
import { AlbumModule } from '../album/album.module';
import { GenreModule } from '../genre/genre.module';
import { TrackModule } from '../track/track.module';
import { AppConfigService } from '../environments/app.environment';
import { ConfigModule } from '@nestjs/config';
import { GqlConfigService } from '../utils/gql-config.service';
@Global()
@Module({
  imports: [
    PrismaModule.registerAsync({
      inject: [AppConfigService],
      useFactory: async (appEnvironment: AppConfigService) => {
        return {
          logQueries: appEnvironment.isDevelopment(),
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    GraphQLModule.forRootAsync({
      useClass: GqlConfigService,
    }),
    UserModule,
    ArtistModule,
    AlbumModule,
    GenreModule,
    TrackModule,
  ],
  providers: [Logger, AppConfigService],
  exports: [Logger, AppConfigService],
})
export class AppModule {}
