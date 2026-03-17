import DashboardAuthGate from "./_components/DashboardAuthGate";
import NavBar from "./_components/NavBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <DashboardAuthGate>{children}</DashboardAuthGate>
      </main>
    </>
  )
}
