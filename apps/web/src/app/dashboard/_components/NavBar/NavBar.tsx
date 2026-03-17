import Image from 'next/image';
import Link from 'next/link';
import ProfileSection from './ProfileSection';
import styles from './NavBar.module.scss';

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <Link href='/dashboard' className={styles.logoContainer}>
        <Image src='/logo-white.svg' alt='finnovate logo in navigation bar' fill />
      </Link>
      <span>|</span>
      <p className={styles.appName}>Sales</p>
      <ProfileSection />
    </nav>
  );
}
