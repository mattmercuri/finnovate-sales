'use client';

import { useCallback, type JSX } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Grip, MailPlus, Scale } from 'lucide-react';
import { toolCategories, type ToolCategory } from '@/services/tools';
import styles from './SideBar.module.scss';


type ToolCategoryParams = ToolCategory | 'all';

export default function SideBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const toolParam = searchParams.get('tool') as ToolCategoryParams | undefined;

  const defaultIconColour = '#f0f0f0';
  const defaultStrokeWidth = 1;
  const categoryIcons: Record<ToolCategory, JSX.Element> = {
    Enrichment: <MailPlus color={defaultIconColour} strokeWidth={defaultStrokeWidth} />,
    Operations: <Scale color={defaultIconColour} strokeWidth={defaultStrokeWidth} />
  };

  const totaCount = toolCategories.length;

  function getCategoryCount(category: ToolCategory) {
    return toolCategories.filter((cat) => cat === category).length;
  }

  const getCategoryFilterParams = useCallback((category: ToolCategoryParams) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tool', category);

    return params.toString();

  }, [searchParams]);

  const getIsActive = useCallback((category: ToolCategoryParams) => {
    if (category === 'all') {
      return !toolParam || toolParam === 'all';
    }

    return toolParam === category;
  }, [toolParam]);

  return (
    <div className={styles.sidebar}>
      <Link
        href={pathname + '?' + getCategoryFilterParams('all')}
        className={getIsActive('all') ? styles.active : ''}
      >
        <Grip color={defaultIconColour} strokeWidth={defaultStrokeWidth} />
        <p>All Tools</p>
        <span className={styles.count}>{totaCount}</span>
      </Link>
      {toolCategories.map((category) => (
        <Link
          href={pathname + '?' + getCategoryFilterParams(category)}
          className={getIsActive(category) ? styles.active : ''} key={`category-${category}`}
        >
          {categoryIcons[category]}
          <p>{category}</p>
          <span className={styles.count}>{getCategoryCount(category)}</span>
        </Link>
      ))}
    </div>
  );
}
