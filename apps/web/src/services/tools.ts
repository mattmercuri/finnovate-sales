export const toolCategories = ['Enrichment'] as const;
export type ToolCategory = (typeof toolCategories)[number];

type ToolStatus = 'experimental' | 'stable' | 'deprecated';

export type Tool = {
  name: string,
  description: string,
  status: ToolStatus,
  category: ToolCategory,
  href: string,
  imageSrc: string
}

export const tools = [
  {
    name: 'Crunchy V2',
    description: "Enrich crunchbase exported sheets with best point-of-contact's email and phone number.",
    status: 'experimental',
    category: 'Enrichment',
    href: '/dashboard/tools/crunchy-v2',
    imageSrc: '/crunchy.png'
  }
] as const satisfies Tool[];
