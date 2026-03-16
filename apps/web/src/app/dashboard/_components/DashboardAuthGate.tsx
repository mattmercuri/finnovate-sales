'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "../_hooks/useRequireAuth";

export default function DashboardAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status } = useRequireAuth();

  useEffect(() => {
    if (status === "error") {
      router.replace("/");
    }
  }, [router, status]);

  if (status === "loading") {
    return <div>Checking your session...</div>;
  }

  return <>{children}</>;
}