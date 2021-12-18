import { CSSProperties, Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuthStore } from '@spotify-clone-monorepo/auth';
import Link from 'next/link';
import { BackButton } from '@spotify-clone-monorepo/ui';

interface NavProps {
  styles?: CSSProperties;
}

const Nav: React.FC<NavProps> = ({ styles }) => {
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset >= 40) setScrolled(false);
      else setScrolled(true);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="h-[60px] w-full sticky z-10 [grid-area:main-view]">
      <div
        className={`${
          scrolled ? 'bg-[rgba(9,9,9,0.78)]' : 'bg-transparent'
        } h-full w-full text-white py-2 px-4 transition-colors duration-300 ease-in-out flex items-center justify-between lg:px-8`}
        style={styles}
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
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="bg-black rounded-[20px] py-2 px-[30px] text-sm text-white opacity-100 cursor-pointer no-underline flex items-center sp-ring">
              {user.name}
              <svg
                className="w-[10px] h-[10px] transform -rotate-90 ml-2 align-middle"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M15.54 21.15L5.095 12.23 15.54 3.31l.65.76-9.555 8.16 9.555 8.16"
                />
              </svg>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute right-0 w-44 mt-2 origin-top-right bg-[#040404] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/profile">
                      <a
                        className={`${
                          active && 'bg-[#131313]'
                        } hover:bg-[#131313] py-3 px-8 block`}
                      >
                        Profile
                      </a>
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active && 'bg-[#131313]'
                      } hover:bg-[#131313] py-3 px-8 w-full text-left`}
                      onClick={() => logout()}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  );
};

export default Nav;
