import Image from 'next/image';
import styles from './page.module.scss';
import GoogleLoginButton from '@/app/_components/GoogleLogin';

export default function Home() {
  return (
    <main className={styles.main}>
      <Image src="/logo.svg" alt="Finnovate Logo" width={430} height={95} />
      <GoogleLoginButton />
    </main>
  );
}
