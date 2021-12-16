import Head from 'next/head';
import Nav from './Nav';
import Sidebar from './Sidebar';

const Layout: React.FC<{ title?: string }> = ({
  title = 'Admin',
  children,
}) => {
  return (
    <>
      <Head>
        <title>Spotify Clone | {title}</title>
        <link rel="icon" href="/logo-main.png" />
      </Head>

      <div className="flex w-full h-screen overflow-hidden">
        <Sidebar />

        <main className="w-full min-h-screen bg-[#121212] flex-1 overflow-auto">
          <Nav />
          {/* <header className='bg-white shadow'>
            <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
              <h1 className='text-3xl font-bold leading-tight text-gray-900'>{title}</h1>
            </div>
          </header> */}
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-[calc(16px+64px)]">
            <div className="py-[30px]">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
