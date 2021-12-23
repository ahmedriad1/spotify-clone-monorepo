import {
  AppGetInitialProps,
  AuthStoreProvider,
  MyAppProps,
  useCreateAuthStore,
} from '@spotify-clone-monorepo/auth';
// import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import Player from '../components/Player';
import '../styles/tailwind.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1800000,
      cacheTime: 1800000,
      refetchOnMount: false,
    },
  },
});

const MyApp = ({ Component, pageProps, initialZustandState }: MyAppProps) => {
  const createStore = useCreateAuthStore(initialZustandState);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthStoreProvider createStore={createStore}>
        <Toaster position="top-right" reverseOrder={false} />

        <main
          className="w-full h-screen grid grid-cols-[auto,1fr] grid-rows-[1fr,auto] overflow-hidden font-circular-medium text-white"
          style={{
            gridTemplateAreas:
              "'side-bar main-view main-view' 'now-playing-bar now-playing-bar now-playing-bar'",
          }}
        >
          <Component {...pageProps} />
          <Player />
        </main>
      </AuthStoreProvider>
    </QueryClientProvider>
  );
};

MyApp.getInitialProps = AppGetInitialProps;

export default MyApp;
