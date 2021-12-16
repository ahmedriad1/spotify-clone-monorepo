import { useLayoutEffect } from 'react';
import createContext from 'zustand/context';
import { isBrowser } from '@spotify-clone-monorepo/utils';
import create, { StoreApi, UseBoundStore } from 'zustand';
import { setToken, setRefreshToken } from '../auth';
import { IUser } from '../types';

interface IAuthStore {
  user: null | IUser;
  isLoggedIn: boolean;
  token: string | null;
  login: (data: { user: IUser; token: string; refreshToken?: string }) => void;
  updateUser: (user: IUser) => void;
  refreshToken: (token: string) => void;
  logout: () => void;
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

export const useCreateAuthStore = (initialState: object) => {
  if (!isBrowser()) return () => initializeAuthStore(initialState);

  store = store || initializeAuthStore(initialState);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState,
      });
    }
  }, [initialState]);

  return () => store;
};

export const getAuthStore = () => store;
