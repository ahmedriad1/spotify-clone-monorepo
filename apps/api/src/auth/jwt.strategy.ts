import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../environments/app.environment';
import { UserService } from '../user/user.service';
import { PassportUserFields } from './types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: AppConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecretKey,
    });
  }

  async validate(payload: { sub: string }): Promise<PassportUserFields> {
    const user = await this.userService.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
