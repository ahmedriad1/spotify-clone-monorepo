import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  readonly graphqlEndpoint = `http://localhost:3000/graphql`;
  readonly accessTokenExpiresIn = '1h'; // 1 hour
  readonly refreshTokenExpiresIn = '30d'; // 30 days

  get isAuthEnabled(): boolean {
    return this.configService.get('AUTH_ENABLED') === 'true';
  }

  get port() {
    return this.configService.get<number>('PORT') || 3000;
  }

  get nodeEnvironment() {
    return (
      this.configService.get<NodeEnvironment>('NODE_ENV') ||
      NodeEnvironment.Development
    );
  }

  get jwtSecretKey() {
    return this.configService.get('JWT_SECRET_KEY');
  }

  get cloudinaryCloudName() {
    return this.configService.get('CLOUDINARY_CLOUD_NAME');
  }

  get cloudinaryApiKey() {
    return this.configService.get('CLOUDINARY_API_KEY');
  }

  get cloudinaryApiSecret() {
    return this.configService.get('CLOUDINARY_API_SECRET');
  }

  get cloudinaryBaseUrl() {
    return `https://res.cloudinary.com/${this.cloudinaryCloudName}`;
  }

  isDevelopment() {
    return this.nodeEnvironment === NodeEnvironment.Development;
  }
}
