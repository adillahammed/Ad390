'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sun, Moon } from 'lucide-react';
import styles from './page.module.css';

export default function BillboardImagePreview({ src, title }: { src: string, title: string }) {
  const [isNight, setIsNight] = useState(false);

  return (
    <div className={styles.heroImageContainer}>
      <Image 
        src={src} 
        alt={title} 
        fill 
        className={`${styles.heroImage} ${isNight ? styles.nightView : ''}`} 
        priority
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+ZNPQAIXwMwFBy6fQAAAABJRU5ErkJggg=="
      />
      <div className={styles.heroOverlay} />
      
      <div className={styles.previewToggle}>
        <button 
          className={`${styles.toggleBtn} ${!isNight ? styles.active : ''}`}
          onClick={() => setIsNight(false)}
        >
          <Sun size={16} /> Day View
        </button>
        <button 
          className={`${styles.toggleBtn} ${isNight ? styles.active : ''}`}
          onClick={() => setIsNight(true)}
        >
          <Moon size={16} /> Night View
        </button>
      </div>
    </div>
  );
}
