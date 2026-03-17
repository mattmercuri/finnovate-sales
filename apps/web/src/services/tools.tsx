import { MailPlus } from "lucide-react";
import { JSX } from "react";

export const toolCategories = ['Enrichment'] as const;
type ToolCategory = (typeof toolCategories)[number];

type ToolStatus = 'experimental' | 'stable' | 'deprecated';

export type Tool = {
  name: string,
  description: string,
  tags: ToolStatus,
  category: ToolCategory,
  href: string
}

export const tools = [
  {
    name: 'Crunchy V2',
    description: "Enrich crunchbase exported sheets with best point-of-contact's email and phone number.",
    tags: 'experimental',
    category: 'Enrichment',
    href: '/dashboard/tools/crunchy-v2'
  }
] as const satisfies Tool[];

const defaultIconColour = '#f0f0f0'
export const categoryIcons: Record<ToolCategory, JSX.Element> = {
  Enrichment: <MailPlus color={defaultIconColour} strokeWidth={1} />
}
