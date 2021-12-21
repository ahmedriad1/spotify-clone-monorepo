import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from '../environments/app.environment';
import { UserModel } from '../user/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService
  ) {}

  async session(user: Pick<UserModel, 'id'>) {
    const date = new Date();

    const payload = {
      sub: user.id,
    };

    const accessTokenExpiresIn = this.configService.accessTokenExpiresIn;
    const refreshTokenExpiresIn = this.configService.refreshTokenExpiresIn;

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpiresIn,
      }),
      accessTokenExpiresAt: date.getTime() + accessTokenExpiresIn,
      refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn,
    };
  }

  public async refreshToken(token) {
    try {
      const { sub } = await this.jwtService.verify(token);
      return sub;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
