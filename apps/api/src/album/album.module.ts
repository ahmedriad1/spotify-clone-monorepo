import { PrismaModule } from '@spotify-clone-monorepo/model';
import { ArtistModule } from '../artist/artist.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';

import { AlbumResolver } from './album.resolver';
import { AlbumService } from './album.service';
import { ColorsModule } from '@spotify-clone-monorepo/colors';

@Module({
  imports: [
    PrismaModule,
    ArtistModule,
    CloudinaryModule,
    ColorsModule.register(),
  ],
  providers: [AlbumResolver, AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
