'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sun, Moon, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

export default function BillboardImagePreview({ media, title }: { media: { url: string, type: string }[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNight, setIsNight] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <div className={styles.heroImageContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Image 
            src={media[currentIndex].url} 
            alt={`${title} - ${currentIndex + 1}`} 
            fill 
            className={`${styles.heroImage} ${isNight ? styles.nightView : ''}`} 
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+ZNPQAIXwMwFBy6fQAAAABJRU5ErkJggg=="
          />
        </motion.div>
      </AnimatePresence>
      
      <div className={styles.heroOverlay} />
      
      {media.length > 1 && (
        <>
          <button className={`${styles.galleryNav} ${styles.prev}`} onClick={prevImage}>
            <ChevronLeft size={24} />
          </button>
          <button className={`${styles.galleryNav} ${styles.next}`} onClick={nextImage}>
            <ChevronRight size={24} />
          </button>
          <div className={styles.galleryDots}>
            {media.map((_, i) => (
              <div 
                key={i} 
                className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        </>
      )}

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
