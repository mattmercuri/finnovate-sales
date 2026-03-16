'use client'

import { usePostAuthGoogleCallback } from "@/api/authentication/authentication"
import { useLayoutEffect } from "react"

export default function GoogleCallbackHandler() {
  const mutate = usePostAuthGoogleCallback({
    mutation: {
      onSuccess: () => {
        window.location.href = window.location.origin + '/dashboard'
      }
    }
  })

  useLayoutEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')

    if (code && state) {
      mutate.mutate({
        data: {
          code,
          state
        }
      })
    } else {
      console.error('Missing code or state in Google callback URL')
    }
  }, [mutate])

  return (
    <></>
  )
}
