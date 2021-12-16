import { isBrowser } from '@spotify-clone-monorepo/utils';
import App, { AppContext, AppProps } from 'next/app';
import { NextApiRequest } from 'next/types';
import { REFRESH_TOKEN_NAME } from './auth';
import { refreshTokenMutation } from './mutations';
import { initializeAuthStore } from './stores';

export const AppGetInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  if (isBrowser() || !appContext.ctx.req) return { ...appProps };

  const store = initializeAuthStore();

  const request = appContext.ctx.req as NextApiRequest;

  const refreshToken = request ? request.cookies[REFRESH_TOKEN_NAME] : null;

  if (refreshToken) {
    try {
      const { name, email, token } = await refreshTokenMutation(refreshToken);

      store.getState().login({ user: { name, email }, token });
    } catch (error) {
      delete request.cookies[REFRESH_TOKEN_NAME];
    }
  }

  return {
    ...appProps,
    initialZustandState: JSON.parse(JSON.stringify(store.getState())),
  };
};

export interface MyAppProps extends AppProps {
  initialZustandState: object;
}
