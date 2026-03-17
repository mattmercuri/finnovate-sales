'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useRequireAuth } from "./hooks/useRequireAuth"
import styles from "./ProfileSection.module.scss"


export default function ProfileSection() {
  const { status, user } = useRequireAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === "error" || (status === "authenticated" && !user)) {
      router.replace('/')
    }
  }, [status, user, router])

  return (
    <div className={styles.profile}>
      <p>{user?.name}</p>
      {user?.profilePicture && (
        <div className={styles.profilePictureContainer}>
          <Image src={user?.profilePicture} alt={`${user?.name}'s profile picture`} fill />
        </div>
      )}
    </div>
  )
}
