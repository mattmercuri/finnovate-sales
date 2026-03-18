export const toolCategories = ['Enrichment', 'Operations'] as const;
export type ToolCategory = (typeof toolCategories)[number];

export type ToolStatus = 'experimental' | 'stable' | 'deprecated' | 'coming soon';

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
    description: 'Enrich crunchbase exported sheets with best point-of-contact.',
    status: 'experimental',
    category: 'Enrichment',
    href: '/dashboard/tools/crunchy-v2',
    imageSrc: '/crunchy.png'
  },
  {
    name: 'SOW Generator',
    description: 'Generate SOW templates based on project details.',
    status: 'coming soon',
    category: 'Operations',
    href: '/dashboard/tools/sow-generator',
    imageSrc: '/sow-generator.png'
  }
] as const satisfies Tool[];
