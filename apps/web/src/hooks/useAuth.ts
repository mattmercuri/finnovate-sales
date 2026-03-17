import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetApiAuthMe,
  usePostApiAuthLogout,
} from "@/api/authentication/authentication";
import { AUTH_EXPIRED_EVENT } from "@/api/custom-fetch";
import type { GetApiAuthMe200 } from "@/schemas";


type AuthStatus = "loading" | "authenticated" | "error"

const SESSION_STALE_TIME_MS = 5 * 60 * 1000;

export default function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const query = useGetApiAuthMe(
    {
      query: {
        retry: false,
        staleTime: SESSION_STALE_TIME_MS,
        refetchOnWindowFocus: true,
      },
    }
  );
  const mutation = usePostApiAuthLogout({
    mutation: {
      onSuccess: () => {
        queryClient.clear()
        router.replace('/')
      }
    }
  })

  useEffect(() => {
    function handleAuthExpired() {
      queryClient.clear()
      router.replace('/')
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    }
  }, [queryClient, router])

  function getStatus(query: ReturnType<typeof useGetApiAuthMe>): AuthStatus {
    if (query.isPending) {
      return "loading";
    }

    if (query.isError) {
      return "error";
    }

    return "authenticated";
  };

  function logout() {
    mutation.mutate();
  }

  return {
    status: getStatus(query),
    user: query.data?.data as GetApiAuthMe200 | undefined,
    logout,
  };
}
