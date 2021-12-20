import { UseGuards } from '@nestjs/common';
import {
  GraphqlAuthGuard,
  OptionalGraphqlAuthGuard,
} from '../utils/nestjs-passport-graphql-auth-guard';

export const useAuth = () => UseGuards(GraphqlAuthGuard);
export const useOptionalAuth = () => UseGuards(OptionalGraphqlAuthGuard);
