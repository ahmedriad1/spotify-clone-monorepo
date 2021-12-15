import { PrismaModule } from '@spotify-clone-monorepo/model';
import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ArtistResolver } from './artist.resolver';
import { ArtistService } from './artist.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [ArtistResolver, ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
