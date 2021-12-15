import { Module } from '@nestjs/common';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TrackResolver } from './track.resolver';
import { TrackService } from './track.service';

@Module({
    imports: [CloudinaryModule],
    providers: [TrackResolver, TrackService],
    exports: [TrackService],
})
export class TrackModule {}
