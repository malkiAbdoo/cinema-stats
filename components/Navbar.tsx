import Link from 'next/link';
import Image from 'next/image';
import { FC, useState } from 'react';
import NavbarMenu from './NavbarMenu';
import { motion } from 'framer-motion';
import { easeExpInOut } from '@malkiii/d3-ease';
import ColorSchemeButton from './ColorSchemeButton';
import { withRouter, NextRouter } from 'next/router';
import { useSession } from 'next-auth/react';

type NavbarProps = {
  router: NextRouter;
};

const navVariants = {
  hidden: { y: 110, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: easeExpInOut
    }
  }
};

const Logo: FC = () => {
  return (
    <Link href="/">
      <Image
        src="/logotype.svg"
        alt="scatch logo"
        width={144}
        height={39}
        className="logo"
      />
    </Link>
  );
};

const Navbar: FC<NavbarProps> = ({ router }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  function toggleMenu() {
    setIsOpen(!isOpen);
    disableScrolling();
  }

  function disableScrolling() {
    const bodyClasses = document.body.classList;
    const isOnMobile = navigator.userAgent.includes('Mobile');
    if (isOnMobile && !isOpen) bodyClasses.add('overflow-y-hidden');
    else bodyClasses.remove('overflow-y-hidden');
  }

  const animationProps =
    router.pathname == '/'
      ? { variants: navVariants, initial: 'hidden', animate: 'visible' }
      : null;

  return (
    <>
      <header className="relative h-20 w-full px-5">
        <motion.nav
          {...animationProps}
          className="flex items-center justify-between max-w-7xl h-full mx-auto overflow-y-hidden"
        >
          <Logo />
          <div className="hidden md:flex items-center">
            <Link href="/search" className="theme-link">
              Search
            </Link>
            <Link href="/albums" className="theme-link">
              My albums
            </Link>
            <ColorSchemeButton
              containerClassName="inline-flex items-center gap-3 mr-10"
              buttonClassName="w-10 h-5"
            />
            <Link href="/login" className="theme-btn">
              Login
            </Link>
          </div>
          <button className="nav-menu-btn" onClick={toggleMenu}></button>
        </motion.nav>
      </header>
      <NavbarMenu isOpen={isOpen} toggle={toggleMenu} />
    </>
  );
};
export default withRouter(Navbar);
