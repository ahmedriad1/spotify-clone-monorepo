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
import { GraphQLError } from 'graphql';
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
      useFactory: () => ({
        autoSchemaFile: true,
        sortSchema: true,
        playground: true,
        autoTransformHttpErrors: true,
        context: (data) => {
          return {
            token: undefined as string | undefined,
            refreshToken: undefined as string | undefined,
            req: data.req as Request,
          };
        },
        formatError: (error: GraphQLError) => {
          if (error.message !== 'VALIDATION_ERROR') return error;

          const extensions: any = {
            code: 'VALIDATION_ERROR',
            errors: [],
          };

          for (const key of Object.keys(error.extensions?.invalidArgs)) {
            const constraints: any[] = [];
            for (const _key of Object.keys(
              error.extensions?.invalidArgs[key].constraints
            )) {
              constraints.push(
                error?.extensions?.invalidArgs[key]?.constraints[_key]
              );
            }

            extensions.errors.push({
              field: error.extensions?.invalidArgs[key].property,
              errors: constraints,
            });
          }

          return {
            message: 'VALIDATION_ERROR',
            extensions: extensions,
          };
        },
      }),
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
