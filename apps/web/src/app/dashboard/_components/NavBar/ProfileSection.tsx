'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import useAuth from "@/hooks/useAuth"
import styles from "./ProfileSection.module.scss"
import ProfileDropdown from "./ProfileDropdown"


export default function ProfileSection() {
  const { status, user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (status === "error" || (status === "authenticated" && !user)) {
      router.replace('/')
    }
  }, [status, user, router])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <div className={styles.profile}>
      <p>{user?.name}</p>
      {user?.profilePicture && (
        <div ref={containerRef} className={styles.profileDropdown}>
          <button
            type="button"
            className={styles.profilePictureContainer}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
            aria-controls="nav-dropdown-menu"
          >
            <Image src={user?.profilePicture} alt={`${user?.name}'s profile picture`} fill />
          </button>
          <ProfileDropdown isOpen={isDropdownOpen} logoutFunction={logout} />
        </div>
      )}
    </div>
  )
}
