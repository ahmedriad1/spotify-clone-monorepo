import { useLayoutEffect } from 'react';
import createContext from 'zustand/context';
import { isBrowser } from '@spotify-clone-monorepo/utils';
import create, { StoreApi, UseBoundStore } from 'zustand';
import { setToken, setRefreshToken } from '../auth';
import { IUser } from '../types';

interface IAuthStore {
  isLoggedIn: boolean;
  user: null | IUser;
  login: (data: { user: IUser; token: string; refreshToken?: string }) => void;
  updateUser: (user: IUser) => void;
  logout: () => void;
  refreshToken: (token: string) => void;
  token: null | string;
}

let store: UseBoundStore<IAuthStore, StoreApi<IAuthStore>> | null;

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const AuthStoreContext = createContext<IAuthStore>();
export const AuthStoreProvider = AuthStoreContext.Provider;

export const useAuthStore = AuthStoreContext.useStore;

export const initializeAuthStore = (preloadedState = {}) => {
  return create<IAuthStore>((set) => ({
    ...initialState,
    ...preloadedState,
    login: ({ user, token, refreshToken }) =>
      set((_state) => {
        if (refreshToken) setRefreshToken(refreshToken);
        setToken(token);
        return { isLoggedIn: true, user, token };
      }),
    updateUser: (user) => set((_state) => ({ user })),
    logout: () =>
      set((_state) => {
        setRefreshToken(null);
        setToken(null);
        return { isLoggedIn: false, user: null, token: null };
      }),
    refreshToken: (newToken) =>
      set((_state) => {
        setToken(newToken);
        return { token: newToken };
      }),
  }));
};

export function useCreateAuthStore(initialState: object) {
  if (!isBrowser()) return () => initializeAuthStore(initialState);

  store = store || initializeAuthStore(initialState);
  useLayoutEffect(() => {
    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState,
      });
    }
  }, [initialState]);

  return () => store;
}

export const getStore = () => store;
