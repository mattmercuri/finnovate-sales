import Link from 'next/link';
import Image from 'next/image';
import styles from './ToolCard.module.scss';
import { type Tool } from '@/services/tools';
import StatusLabel from './StatusLabel';

type ToolCardsProps = Tool

export default function ToolCard({
  name,
  description,
  category,
  status,
  href,
  imageSrc
}: ToolCardsProps) {
  return (
    <Link href={href} className={styles.toolCard}>
      <StatusLabel status={status} />
      <div className={styles.imageContainer}>
        <Image src={imageSrc} alt={`${name} image`} fill />
      </div>
      <p className={styles.category}>{category}</p>
      <h3>{name}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  );
}
