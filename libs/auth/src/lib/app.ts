import { isBrowser } from '@spotify-clone-monorepo/utils';
import App, { AppContext, AppProps } from 'next/app';
import { REFRESH_TOKEN_NAME } from './auth';
import refreshTokenMutation from './mutations/refreshTokenMutation';
import { initializeAuthStore } from './stores/useAuthStore';

export const AppGetInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  if (isBrowser() || !appContext.ctx.req) return { ...appProps };

  const store = initializeAuthStore();

  const request: any = appContext.ctx.req;

  const refreshToken = request ? request.cookies[REFRESH_TOKEN_NAME] : null;

  if (refreshToken) {
    try {
      const { name, email, token } = await refreshTokenMutation(refreshToken);

      store.getState().login({ user: { name, email }, token });
    } catch (error) {
      request.cookies[REFRESH_TOKEN_NAME] = null;
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
