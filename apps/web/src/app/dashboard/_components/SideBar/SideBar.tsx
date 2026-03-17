import { categoryIcons, defaultIconColour, defaultStrokeWidth, toolCategories, type ToolCategory } from "@/services/tools";
import { Grip } from "lucide-react";
import styles from "./SideBar.module.scss";

export default function SideBar() {
  const totaCount = toolCategories.length;

  function getCategoryCount(category: ToolCategory) {
    return toolCategories.filter((cat) => cat === category).length;
  }

  return (
    <div className={styles.sidebar}>
      <button>
        <Grip color={defaultIconColour} strokeWidth={defaultStrokeWidth} />
        <p>All Tools</p>
        <span className={styles.count}>{totaCount}</span>
      </button>
      {toolCategories.map((category) => (
        <button key={`category-${category}`}>
          {categoryIcons[category]}
          <p>{category}</p>
          <span className={styles.count}>{getCategoryCount(category)}</span>
        </button>
      ))}
    </div>
  )
}
