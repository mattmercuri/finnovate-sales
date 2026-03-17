'use client';

import ToolCard from './ToolCard';
import { useSearchParams } from 'next/navigation';
import { ToolCategory, tools } from '@/services/tools';
import styles from './ToolCards.module.scss';

export default function ToolCards() {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get('tool') as ToolCategory | 'all' | undefined;
  const filteredTools = tools.filter((tool) => {
    if (!toolParam || toolParam === 'all') return true;
    return tool.category === toolParam;
  });

  return (
    <div className={styles.toolCards}>
      {filteredTools.map((tool) => (
        <ToolCard key={`tool-${tool.name}`} {...tool} />
      ))}
    </div>
  );
}
