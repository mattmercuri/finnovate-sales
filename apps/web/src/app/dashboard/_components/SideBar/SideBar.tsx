import { categoryIcons, toolCategories } from "@/services/tools";
import styles from "./SideBar.module.scss";

export default function SideBar() {
  return (
    <div className={styles.sidebar}>
      {toolCategories.map((category) => (
        <button key={`category-${category}`}>
          {categoryIcons[category]}
          <span>{category}</span>
        </button>
      ))}
    </div>
  )
}
