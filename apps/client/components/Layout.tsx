import Head from 'next/head';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import Nav from './Nav';
import Sidebar from './Sidebar';

interface LayoutProps {
  title: string;
  innerStyle?: CSSProperties;
  scrolledNavStyles?: CSSProperties;
}

const Layout: React.FC<LayoutProps> = ({
  title,
  innerStyle,
  scrolledNavStyles,
  children,
}) => {
  const ref = useRef<HTMLDivElement>();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const div = ref.current;

    const handleScroll = () => {
      if (div.scrollTop >= 40) setScrolled(true);
      else setScrolled(false);
    };

    div.addEventListener('scroll', handleScroll);

    return () => {
      div.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  return (
    <>
      <Head>
        <title>Spotify | {title}</title>
        <link rel="icon" href="/logo-main.png" />
      </Head>

      <Sidebar />
      <Nav scrolledStyles={scrolledNavStyles} scrolled={scrolled} />

      <div className="bg-[#121212] w-full h-full relative [grid-area:main-view] overflow-hidden">
        <div
          className="text-white px-4 pr-[calc(2rem+30px)] pt-20 pb-6 lg:px-8 h-full overflow-y-auto"
          ref={ref}
          style={innerStyle}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
