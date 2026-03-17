import Link from "next/link"
import styles from "./ToolCard.module.scss"
import { type Tool } from "@/services/tools"

type ToolCardsProps = Tool

export default function ToolCard({
  name,
  description,
  status,
  href
}: ToolCardsProps) {
  return (
    <Link href={href} className={styles.toolCard}>
      <h3>{name}</h3>
      <p>{description}</p>
      <p>{status}</p>
    </Link>
  )
}
