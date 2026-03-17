import { categoryIcons, toolCategories } from "@/services/tools";
import styles from "./SideBar.module.scss";

export default function SideBar() {
  return (
    <div className={styles.sidebar}>
      {toolCategories.map((category) => (
        <button key={`category-${category}`}>
          <span>{category}</span>
          {categoryIcons[category]}
        </button>
      ))}
    </div>
  )
}
