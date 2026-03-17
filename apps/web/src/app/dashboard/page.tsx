import SideBar from "./_components/SideBar";
import ToolCards from "./_components/ToolCards";
import styles from './page.module.scss';

export default function DashboardPage() {
  return (
    <main className={styles.dashboard}>
      <SideBar />
      <ToolCards />
    </main>
  )
}
