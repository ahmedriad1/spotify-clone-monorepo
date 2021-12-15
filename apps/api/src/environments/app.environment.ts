import { GqlModuleOptions } from '@nestjs/graphql';
// import { Env } from '@nestjs-steroids/environment';
// import { Transform } from 'class-transformer';
// import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

@Injectable()
class AppConfigService {
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

// class AppEnvironment {
//   @Env('PORT')
//   @Transform(({ value }) => Number.parseInt(value, 10))
//   @IsNumber()
//   @Min(0)
//   @Max(65535)
//   readonly port = 3000;

//   @Env('NODE_ENV')
//   @IsEnum(NodeEnvironment)
//   readonly nodeEnvironment = NodeEnvironment.Development;

//   isDevelopment() {
//     return this.nodeEnvironment === NodeEnvironment.Development;
//   }

//   @Env('GRAPHQL_ENDPOINT')
//   readonly graphqlEndpoint = `http://localhost:3000/graphql`;

//   readonly accessTokenExpiresIn = '1h'; // 1 hour
//   readonly refreshTokenExpiresIn = '30d'; // 30 days

//   @Env('JWT_SECRET_KEY')
//   readonly jwtSecretKey = '';

//   @Env('CLOUDINARY_CLOUD_NAME')
//   readonly cloudinaryCloudName = '';

//   @Env('CLOUDINARY_API_KEY')
//   readonly cloudinaryApiKey = '';

//   @Env('CLOUDINARY_API_SECRET')
//   readonly cloudinaryApiSecret = '';

//   cloudinaryBaseUrl() {
//     return `https://res.cloudinary.com/${this.cloudinaryCloudName}`;
//   }
// }

interface MyGqlOptions extends GqlModuleOptions {
  context: (data) => Record<string, any>;
}

const graphqlModuleFactory = async (): Promise<MyGqlOptions> => {
  return {
    sortSchema: true,
    autoSchemaFile: '~schema.gql',
    playground: true,
    autoTransformHttpErrors: true,
    context: (data: any) => {
      return {
        token: undefined as string | undefined,
        refreshToken: undefined as string | undefined,
        req: data.req as Request,
      };
    },
    formatError: (error: GraphQLError) => {
      if (error.message !== 'VALIDATION_ERROR') return error;

      const extensions: any = {
        code: 'VALIDATION_ERROR',
        errors: [],
      };

      for (const key of Object.keys(error.extensions?.invalidArgs)) {
        const constraints: any[] = [];
        for (const _key of Object.keys(
          error.extensions?.invalidArgs[key].constraints
        )) {
          constraints.push(
            error?.extensions?.invalidArgs[key]?.constraints[_key]
          );
        }

        extensions.errors.push({
          field: error.extensions?.invalidArgs[key].property,
          errors: constraints,
        });
      }

      return {
        message: 'VALIDATION_ERROR',
        extensions: extensions,
      };
    },
  };
};

export { AppConfigService, graphqlModuleFactory };
