import { NextPage } from 'next/types';
import { REFRESH_TOKEN_NAME } from '../auth';
import { useAuthStore as UseAuthStore } from '../stores/useAuthStore';
import withConditionalRedirect from './withConditionalRedirect';

export const withGuest = (WrappedComponent: NextPage, location = '/') => {
  return withConditionalRedirect({
    WrappedComponent,
    location,
    clientCondition: () => {
      const isLoggedIn = UseAuthStore((state) => state.isLoggedIn);
      return isLoggedIn;
    },
    serverCondition: (ctx: any) => !!ctx.req?.cookies[REFRESH_TOKEN_NAME],
  });
};
