import { BadgeAlert, BadgeCheck, FlaskConical } from "lucide-react"
import { type ToolStatus } from "@/services/tools"
import { type JSX } from "react"
import styles from "./StatusLabel.module.scss"


type StatusLabelProps = {
  status: ToolStatus
}

export default function StatusLabel({ status }: StatusLabelProps) {
  const colourMap: Record<ToolStatus, string> = {
    'deprecated': '#a20000',
    'experimental': '#8b00fd',
    'stable': '#006b29'
  }

  const statusIconStyles = {
    color: colourMap[status],
    strokeWidth: 2,
    size: 18
  }

  const statusIcons: Record<ToolStatus, JSX.Element> = {
    'deprecated': <BadgeAlert {...statusIconStyles} />,
    'experimental': <FlaskConical {...statusIconStyles} />,
    'stable': <BadgeCheck {...statusIconStyles} />
  }

  return (
    <span
      className={styles.statusLabel}
      style={{ color: colourMap[status], background: colourMap[status] + '30' }}
    >
      {statusIcons[status]} {status}
    </span>
  )
}
