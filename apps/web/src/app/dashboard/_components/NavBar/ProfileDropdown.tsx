import styles from "./ProfileDropdown.module.scss"

const items = [
  { label: 'Logout', href: '/' },
] as const

type ProfileDropdownProps = {
  isOpen: boolean;
}

export default function ProfileDropdown({ isOpen }: ProfileDropdownProps) {
  return (
    <div className={styles.dropdown}>
      {isOpen && (
        <ul>
          {items.map((item) => (
            <li key={`dropdown-item-${item.label}`}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
