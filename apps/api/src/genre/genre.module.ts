import { PrismaModule } from '@spotify-clone-monorepo/model';
import { Module } from '@nestjs/common';
import { GenreResolver } from './genre.resolver';
import { GenreService } from './genre.service';

@Module({
  imports: [PrismaModule],
  providers: [GenreService, GenreResolver],
  exports: [GenreService],
})
export class GenreModule {}
