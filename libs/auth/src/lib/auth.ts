import cookie from 'js-cookie';
import axios from './axios';

export const REFRESH_TOKEN_NAME = 'spotify-clone.refresh_token';

export const setToken = (token: string | null) => {
  if (!token) axios.defaults.headers.common['Authorization'] = null;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getRefreshToken = () => cookie.get(REFRESH_TOKEN_NAME);

export const setRefreshToken = (refreshToken: string | null) => {
  if (!refreshToken) return cookie.remove(REFRESH_TOKEN_NAME);
  cookie.set(REFRESH_TOKEN_NAME, refreshToken);
};
