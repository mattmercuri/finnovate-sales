'use client'

import { useGetApiAuthMe } from "@/api/authentication/authentication";
import type { GetApiAuthMe200 } from "@/schemas";

const SESSION_STALE_TIME_MS = 5 * 60 * 1000;

type AuthStatus = "loading" | "authenticated" | "error"

type UseRequireAuth = {
  status: AuthStatus;
  user?: GetApiAuthMe200
}

export function useRequireAuth(): UseRequireAuth {
  const query = useGetApiAuthMe(
    {
      query: {
        retry: false,
        staleTime: SESSION_STALE_TIME_MS,
        refetchOnWindowFocus: true,
      },
    }
  );

  if (query.isPending) {
    return {
      status: "loading",
    };
  }

  if (query.isError) {
    return {
      status: "error",
    }
  }

  return {
    status: "authenticated",
    user: query.data?.data as GetApiAuthMe200,
  };
}
