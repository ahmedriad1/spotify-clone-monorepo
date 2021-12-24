import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

export interface GraphQLContext {
  token?: string;
  refreshToken?: string;
  req: Request;
}

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): GqlModuleOptions {
    return {
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      autoTransformHttpErrors: true,
      context: (data) => {
        return {
          token: undefined,
          refreshToken: undefined,
          req: data.req,
        } as GraphQLContext;
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
  }
}
