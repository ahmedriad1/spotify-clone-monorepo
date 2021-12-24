import { GraphqlAuthGuard } from './graphql-auth.guard';

export class OptionalGraphqlAuthGuard extends GraphqlAuthGuard {
  handleRequest(err, user, info, context, status) {
    try {
      user = super.handleRequest(err, user, info, context, status);
    } catch {
      user = undefined;
    }
    return user;
  }
}
