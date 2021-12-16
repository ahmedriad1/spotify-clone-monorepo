import Head from 'next/head';
import { CSSProperties } from 'react';
import Nav from './Nav';
import Sidebar from './Sidebar';

interface LayoutProps {
  title: string;
  innerStyle?: CSSProperties;
}

const Layout: React.FC<LayoutProps> = ({ title, innerStyle, children }) => {
  return (
    <>
      <Head>
        <title>Spotify | {title}</title>
      </Head>
      <main
        className="w-full min-h-screen grid grid-cols-[auto,1fr] grid-rows-[1fr,auto] overflow-hidden"
        style={{
          gridTemplateAreas:
            "'side-bar main-view buddy-feed' 'now-playing-bar now-playing-bar now-playing-bar'",
        }}
      >
        <Nav />
        <Sidebar />
        <div className="bg-[#121212] w-full h-full relative [grid-area:main-view]">
          <div
            className="text-white px-4 pr-[calc(1rem+15px)] pt-[calc(24px+60px)] pb-6 lg:px-8 lg:pr-[calc(2rem+15px)] h-full"
            style={innerStyle}
          >
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default Layout;
