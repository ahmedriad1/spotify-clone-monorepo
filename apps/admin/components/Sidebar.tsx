import {
  CollectionIcon,
  ArchiveIcon,
  MusicNoteIcon,
  HomeIcon,
  MicrophoneIcon,
} from '@heroicons/react/outline';
import { LazyImage, Navlink } from '@spotify-clone-monorepo/ui';
import Link from 'next/link';

const SidebarItem: React.FC<{ href: string; exact?: boolean }> = ({
  href,
  exact,
  children,
}) => {
  return (
    <Navlink href={href} exact={exact}>
      {({ active }) => (
        <a
          className={`w-full hover:bg-sp-green flex justify-center items-center py-6 transition-colors duration-75 ease-in ${
            active ? 'bg-sp-green' : ''
          }`}
        >
          {children}
        </a>
      )}
    </Navlink>
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

      <SidebarItem href="/" exact>
        <HomeIcon className="w-6 h-6" />
      </SidebarItem>

      <SidebarItem href="/albums">
        <ArchiveIcon className="w-6 h-6" />
      </SidebarItem>

      <SidebarItem href="/genres">
        <CollectionIcon className="w-6 h-6" />
      </SidebarItem>

      <SidebarItem href="/tracks">
        <MusicNoteIcon className="w-6 h-6" />
      </SidebarItem>

      <SidebarItem href="/artists">
        <MicrophoneIcon className="w-6 h-6" />
      </SidebarItem>

      {/* <h1>sidebar</h1> */}
    </aside>
  );
};

export default Sidebar;
