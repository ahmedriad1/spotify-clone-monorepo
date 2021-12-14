import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/tailwind.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Welcome to admin!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default App;
