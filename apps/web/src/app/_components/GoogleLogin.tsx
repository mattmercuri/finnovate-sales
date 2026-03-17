'use client';

import { usePostApiAuthGoogle } from '@/api/authentication/authentication';

export default function GoogleLoginButton() {
  const mutate = usePostApiAuthGoogle({
    mutation: {
      onSuccess: (data) => {
        window.location.href = data.data.redirectTo;
      }
    }
  });

  return (
    <button onClick={() => mutate.mutate()} disabled={mutate.isPending}>
      Sign in with Google
    </button>
  );
}
