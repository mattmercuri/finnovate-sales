'use client'

import { usePostAuthGoogle } from "@/api/authentication/authentication"

export default function GoogleLoginButton() {
  const mutate = usePostAuthGoogle()

  return (
    <button onClick={() => mutate.mutate()} disabled={mutate.isPending}>
      Sign in with Google
    </button>
  )
}
