import Head from 'next/head';

interface HeadlessLayoutProps {
  title: string;
}

const HeadlessLayout: React.FC<HeadlessLayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>Spotify | {title}</title>
      </Head>

      <div className="bg-[#121212] w-screen min-h-screen relative">
        {children}
      </div>
    </>
  );
};

export default HeadlessLayout;
