import Link from 'next/link';
import Logo from './Logo';
import SidebarLink from './SidebarLink';

const Sidebar = () => {
  return (
    <div className="w-[235px] h-full bg-[#040404] pt-6 flex-col hidden sm:flex [grid-area:side-bar]">
      <Link href="/">
        <a className="px-6 mb-[18px]">
          <Logo />
        </a>
      </Link>

      <ul>
        <SidebarLink href="/">
          <svg
            viewBox="0 0 512 512"
            className="w-6 h-6 fill-current mr-4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M448 463.746h-149.333v-149.333h-85.334v149.333h-149.333v-315.428l192-111.746 192 110.984v316.19z" />
          </svg>
          Home
        </SidebarLink>

        <SidebarLink href="/search">
          <svg
            viewBox="0 0 512 512"
            className="w-6 h-6 fill-current mr-4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M349.714 347.937l93.714 109.969-16.254 13.969-93.969-109.969q-48.508 36.825-109.207 36.825-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 37.841-14.73 71.619t-40.889 58.921zM224 377.397q43.428 0 80.254-21.461t58.286-58.286 21.461-80.254-21.461-80.254-58.286-58.285-80.254-21.46-80.254 21.46-58.285 58.285-21.46 80.254 21.46 80.254 58.285 58.286 80.254 21.461z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
          Search
        </SidebarLink>

        <SidebarLink href="/library">
          <svg
            viewBox="0 0 512 512"
            className="w-6 h-6 fill-current mr-4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M291.301 81.778l166.349 373.587-19.301 8.635-166.349-373.587zM64 463.746v-384h21.334v384h-21.334zM192 463.746v-384h21.334v384h-21.334z" />
          </svg>
          Your Library
        </SidebarLink>
      </ul>
    </div>
  );
};

export default Sidebar;
