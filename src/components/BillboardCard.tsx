import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Maximize, CircleDollarSign } from 'lucide-react';
import { Billboard } from '@/data/mockBillboards';
import styles from './BillboardCard.module.css';

interface Props {
  billboard: Billboard;
}

export default function BillboardCard({ billboard }: Props) {
  return (
    <Link href={`/locations/${billboard.id}`} className={`${styles.card} glass`}>
      <div className={styles.imageContainer}>
        {/* We use standard img instead of next/image for external URLs to avoid config issues initially */}
        <img src={billboard.image} alt={billboard.title} className={styles.image} />
        <div className={styles.typeTag}>{billboard.type}</div>
        {!billboard.available && <div className={styles.bookedTag}>Booked</div>}
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{billboard.title}</h3>
          <p className={styles.price}>
            <span className={styles.amount}>${billboard.pricePerDay}</span>
            <span className={styles.unit}>/day</span>
          </p>
        </div>
        
        <p className={styles.location}>
          <MapPin size={16} /> {billboard.location}, {billboard.city}
        </p>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <Users size={16} />
            <span>{(billboard.dailyTraffic / 1000).toFixed(0)}k/day</span>
          </div>
          <div className={styles.statItem}>
            <Maximize size={16} />
            <span>{billboard.size}</span>
          </div>
        </div>
        
        <div className={styles.tags}>
          {billboard.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
          {billboard.tags.length > 2 && (
            <span className={styles.tag}>+{billboard.tags.length - 2}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
