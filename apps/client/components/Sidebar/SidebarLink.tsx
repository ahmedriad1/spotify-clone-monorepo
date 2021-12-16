import Link from 'next/link';
import { useRouter } from 'next/router';

const SidebarLink = ({ href, children }) => {
  const router = useRouter();
  const active = router.pathname === href;

  return (
    <li className="text-[#b3b3b3] text-sm leading-4 tracking-normal cursor-pointer transition-all duration-300 ease-in-out hover:text-white font-bold px-2">
      <Link href={href}>
        <a
          className={`w-full rounded py-2 px-3 flex items-center ${
            active ? 'bg-[#282828] text-white' : ''
          }`}
        >
          {children}
        </a>
      </Link>
    </li>
  );
};

export default SidebarLink;
