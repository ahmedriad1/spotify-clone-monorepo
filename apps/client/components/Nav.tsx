import { CSSProperties, Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuthStore } from '@spotify-clone-monorepo/auth';
import Link from 'next/link';
import { BackButton, LazyImage, toast } from '@spotify-clone-monorepo/ui';
import { ChevronDownIcon } from '@heroicons/react/outline';

const ProfileLink = ({ active, ...props }: { active: boolean }) => (
  <Link href="/profile">
    <a
      className={`block px-4 py-2 text-sm ${active && 'bg-[#131313]'}`}
      {...props}
    >
      Your Profile
    </a>
  </Link>
);
const ProfileDropdown = () => {
  const user = useAuthStore((state) => state.user);
  const setLogout = useAuthStore((state) => state.logout);

  const logout = (e) => {
    e.preventDefault();
    setLogout();
    toast('success', 'Logged out !');
  };

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="bg-black rounded-full py-2 px-8 text-sm text-white opacity-100 cursor-pointer no-underline flex items-center sp-ring">
          {user.name}
          <ChevronDownIcon className="w-4 h-4 ml-2" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
          <div className="py-1 rounded-md bg-[#040404] shadow-xs">
            <Menu.Item>
              {/* I did that because i wanted to pass the menu item props to the <a> not <Link> */}
              {({ active }) => <ProfileLink active={active} />}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/logout"
                  onClick={logout}
                  className={`block px-4 py-2 text-sm ${
                    active && 'bg-[#131313]'
                  }`}
                >
                  Sign out
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

interface NavProps {
  styles?: CSSProperties;
  scrolledStyles?: CSSProperties;
  scrolled: boolean;
}

const Nav: React.FC<NavProps> = ({ styles, scrolledStyles, scrolled }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="h-[60px] w-full sticky z-10 [grid-area:main-view]">
      <div
        className={`${
          scrolled
            ? scrolledStyles
              ? ''
              : 'bg-[rgba(9,9,9,0.78)]'
            : 'bg-transparent'
        } h-full w-full text-white py-2 px-4 transition-colors duration-300 ease-in-out flex items-center justify-between lg:px-8`}
        style={{ ...styles, ...(scrolled ? scrolledStyles : {}) }}
      >
        <BackButton />

        {!isLoggedIn ? (
          <div>
            <Link href="/register">
              <a className="text-white mr-5">Register</a>
            </Link>

            <Link href="/login">
              <a className="text-[#131313] rounded-[20px] py-2 px-[30px] text-sm bg-white cursor-pointer outline-none">
                Login
              </a>
            </Link>
          </div>
        ) : (
          <ProfileDropdown />
        )}
      </div>
    </div>
  );
};

export default Nav;
