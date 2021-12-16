import {
  CollectionIcon,
  ArchiveIcon,
  MusicNoteIcon,
  HomeIcon,
  MicrophoneIcon,
} from '@heroicons/react/outline';
import { LazyImage } from '@spotify-clone-monorepo/ui';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SidebarItem: React.FC<{ to: string; exact?: boolean }> = ({
  to,
  exact = false,
  children,
}) => {
  const router = useRouter();
  const active = exact
    ? router.pathname === to
    : router.pathname.startsWith(to);
  return (
    <Link href={to}>
      <a
        className={`w-full hover:bg-sp-green flex justify-center items-center py-6 transition-colors duration-75 ease-in ${
          active ? 'bg-sp-green' : ''
        }`}
      >
        {children}
      </a>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-16 sticky min-w-[64px] bg-black min-h-screen py-10 flex items-center flex-col">
      <Link href="/">
        <a className="w-full flex justify-center items-center mb-10">
          <LazyImage
            width={40}
            height={40}
            className="mx-auto h-10 w-auto"
            src="/logo-main.png"
            alt="Logo"
          />
        </a>
      </Link>

      <SidebarItem to="/" exact>
        <HomeIcon className="w-6 h-6" />
      </SidebarItem>

      <SidebarItem to="/albums">
        <ArchiveIcon className="w-6 h-6" />
      </SidebarItem>

      <SidebarItem to="/genres">
        <CollectionIcon className="w-6 h-6" />
      </SidebarItem>

      <SidebarItem to="/tracks">
        <MusicNoteIcon className="w-6 h-6" />
      </SidebarItem>

      <SidebarItem to="/artists">
        <MicrophoneIcon className="w-6 h-6" />
      </SidebarItem>

      {/* <h1>sidebar</h1> */}
    </aside>
  );
};

export default Sidebar;
