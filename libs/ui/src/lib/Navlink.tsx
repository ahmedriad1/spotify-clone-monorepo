import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

interface NavlinkProps extends LinkProps {
  exact?: boolean;
  children: (props: { active: boolean }) => React.ReactNode;
}

const Navlink: React.FC<NavlinkProps> = ({ href, exact = false, children }) => {
  const hrefString = href.toString();
  const router = useRouter();
  const active = exact
    ? router.pathname === hrefString
    : router.pathname.startsWith(hrefString);

  return <Link href={href}>{children({ active })}</Link>;
};

export default Navlink;
