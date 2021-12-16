import Head from 'next/head';

const HeadlessLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Spotify Clone | Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen w-full bg-[#121212]">{children}</div>
    </>
  );
};

export default HeadlessLayout;
