'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getGetApiAuthMeQueryKey,
  usePostApiAuthGoogleCallback,
} from '@/api/authentication/authentication';

export default function GoogleCallbackHandler() {
  const { mutateAsync, isPending } = usePostApiAuthGoogleCallback();
  const hasRun = useRef(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasRun.current) return;

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      console.error('Missing code or state in Google callback URL');
      return;
    }

    hasRun.current = true;

    void mutateAsync({
      data: {
        code,
        state,
      },
    })
      .then(async () => {
        await queryClient.invalidateQueries({
          queryKey: getGetApiAuthMeQueryKey(),
        });
        router.replace('/dashboard');
      })
      .catch((error) => {
        hasRun.current = false;
        console.error('Google callback failed', error);
      });
  }, [mutateAsync, queryClient, router, searchParams]);

  return isPending ? <div>Signing you in...</div> : null;
}
