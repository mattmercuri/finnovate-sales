import { toolCategories, type ToolCategory } from "@/services/tools";
import { Grip, MailPlus } from "lucide-react";
import styles from "./SideBar.module.scss";
import { type JSX } from "react";

export default function SideBar() {
  const defaultIconColour = '#f0f0f0'
  const defaultStrokeWidth = 1;
  const categoryIcons: Record<ToolCategory, JSX.Element> = {
    Enrichment: <MailPlus color={defaultIconColour} strokeWidth={defaultStrokeWidth} />
  }

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
