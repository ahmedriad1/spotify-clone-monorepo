import { getRefreshToken } from './auth';
import { refreshTokenMutation } from './mutations';
import { getAuthStore } from './stores';
import axios, { AxiosRequestConfig } from 'axios';
import { unstable_batchedUpdates } from 'react-dom';
import { createRequestBody } from './functions';
import { isBrowser } from '@spotify-clone-monorepo/utils';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const logout = () => {
  unstable_batchedUpdates(() => {
    getAuthStore()?.getState().logout();
  });
};

export const axiosGql = async <T>(
  doc: string,
  variables?: object,
  config?: AxiosRequestConfig
): Promise<T> => {
  if (isBrowser()) {
    const token = getAuthStore()?.getState().token;
    if (token)
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const { data } = await instance.post<{ data: T }>(
    '/graphql',
    createRequestBody(doc, variables),
    config
  );

  return data.data;
};

instance.interceptors.response.use(undefined, async (error) => {
  const {
    response: { status },
    config,
  } = error;

  if (status !== 401 || !config) return Promise.reject(error);

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    logout();
    return Promise.reject(error);
  }

  try {
    const { token } = await refreshTokenMutation(refreshToken);
    if (isBrowser()) getAuthStore()?.getState().refreshToken(token);
    config.headers['Authorization'] = `Bearer ${token}`;
    return instance.request(config);
  } catch (error) {
    logout();
    return Promise.reject('Logged out');
  }
});

export default instance;
