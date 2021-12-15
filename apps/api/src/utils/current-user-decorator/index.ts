import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';

/**
 * Extract request.user property (which is written by passport).
 */
export const CurrentUser = createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
        let request;
        if (context.getType() === 'http') request = context.switchToHttp().getRequest();
        else if (context.getType<GqlContextType>() === 'graphql')
            request = context.getArgByIndex(2).req;
        else throw new Error('Not implemented');

        return request?.user;
    },
);
