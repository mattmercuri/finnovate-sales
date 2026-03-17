import NavBar from './_components/NavBar';

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
      {children}
    </>
  );
}
