import Image from "next/image";
import styles from "./page.module.scss";
import GoogleLoginButton from "@/_components/GoogleLogin";
import Script from "next/script";

export default function Home() {
  return (
    <main className={styles.main}>
      <Image src="/logo.svg" alt="Finnovate Logo" width={430} height={95} />
      <GoogleLoginButton />
      <Script src='https://accounts.google.com/gsi/client' />
    </main>
  );
}
