import { PrismaModule } from '@spotify-clone-monorepo/model';
import { AuthModule } from '../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserExistsValidator } from './validators/user-exists.validator';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [UserService, UserResolver, UserExistsValidator],
  exports: [UserService],
})
export class UserModule {}
