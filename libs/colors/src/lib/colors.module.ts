import { DynamicModule, Module } from '@nestjs/common';
import { ColorsService } from './colors.service';

@Module({})
export class ColorsModule {
  static register(): DynamicModule {
    return {
      module: ColorsModule,
      providers: [ColorsService],
      exports: [ColorsService],
    };
  }
}
