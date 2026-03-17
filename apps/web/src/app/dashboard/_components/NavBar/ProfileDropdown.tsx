import styles from "./ProfileDropdown.module.scss"

const items = [
  { label: 'Logout', href: '/' },
] as const

type ProfileDropdownProps = {
  isOpen: boolean;
  logoutFunction: () => void;
}

export default function ProfileDropdown({ isOpen, logoutFunction }: ProfileDropdownProps) {
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logoutFunction();
  }

  return (
    <div className={styles.dropdown}>
      {isOpen && (
        <ul>
          {items.map((item) => {
            if (item.label === 'Logout') {
              return (
                <li key={`dropdown-item-${item.label}`}>
                  <button onClick={handleLogout}>{item.label}</button>
                </li>
              )
            }
            return (
              <li key={`dropdown-item-${item.label}`}>
                <a href={item.href}>{item.label}</a>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
