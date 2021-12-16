import {
  AppGetInitialProps,
  AuthStoreProvider,
  MyAppProps,
  useCreateAuthStore,
} from '@spotify-clone-monorepo/auth';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles/tailwind.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1800000,
      cacheTime: 1800000,
    },
  },
});

const MyApp = ({ Component, pageProps, initialZustandState }: MyAppProps) => {
  const createStore = useCreateAuthStore(initialZustandState);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthStoreProvider createStore={createStore}>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="text-white">
          <Component {...pageProps} />
        </div>
      </AuthStoreProvider>
    </QueryClientProvider>
  );
};

MyApp.getInitialProps = AppGetInitialProps;

export default MyApp;
