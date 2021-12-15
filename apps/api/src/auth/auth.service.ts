import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from '../environments/app.environment';
import { UserModel } from '../user/models/user.model';
import { SessionTokenFields } from './types';

/**
 * Authentication service.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appEnvironment: AppConfigService
  ) {}

  /**
   * Returns accessToken.
   */
  async session(user: Pick<UserModel, 'id'>) {
    const date = new Date();

    const payload: SessionTokenFields = {
      sub: user.id,
    };

    const accessTokenExpiresIn = this.appEnvironment.accessTokenExpiresIn;
    const refreshTokenExpiresIn = this.appEnvironment.refreshTokenExpiresIn;

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpiresIn,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpiresIn,
      }),
      accessTokenExpiresAt: date.getTime() + accessTokenExpiresIn,
      refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn,
    };
  }

  /**
   * Get user from store by refresh token and return new session.
   */
  public async refreshToken(token) {
    try {
      const { sub } = await this.jwtService.verify(token);
      return sub;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
