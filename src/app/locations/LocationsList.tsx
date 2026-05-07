'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Map, LayoutGrid, Loader2 } from 'lucide-react';
import BillboardCard from '@/components/BillboardCard';
import LocationSelector from '@/components/LocationSelector';
import styles from './page.module.css';

export default function LocationsList({ initialBillboards }: { initialBillboards: any[] }) {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [billboards, setBillboards] = useState(initialBillboards);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<{ districtId: string | null, placeId: string | null }>({
    districtId: null,
    placeId: null
  });

  const handleLocationChange = (districtId: string | null, placeId: string | null) => {
    setFilters({ districtId, placeId });
  };

  useEffect(() => {
    const fetchBillboards = async () => {
      setIsLoading(true);
      try {
        let url = '/api/billboards';
        const params = new URLSearchParams();
        if (filters.districtId) params.append('districtId', filters.districtId);
        if (filters.placeId) params.append('placeId', filters.placeId);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setBillboards(data);
      } catch (error) {
        console.error('Error fetching billboards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Skip the first fetch since we have initialBillboards
    if (filters.districtId !== null || filters.placeId !== null) {
      fetchBillboards();
    }
  }, [filters]);

  return (
    <div className={styles.locationsPage}>
      <div className={`${styles.heroBanner} glass`}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroContent}
          >
            <h1>Kerala Advertising <span className="text-gradient">Network</span></h1>
            <p>Premium outdoor media spots across the God's Own Country.</p>
            
            <div className={`${styles.searchBox} glass`}>
              <LocationSelector onSelectionChange={handleLocationChange} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className={`container ${styles.header}`}>
        <div className={styles.titleSection}>
          <h2>{isLoading ? 'Searching...' : `${billboards.length} Spots Available`}</h2>
          <p className="text-muted">Filtered by your selected Kerala locations.</p>
        </div>
        
        <div className={styles.controls}>
          <div className={`${styles.viewToggle} glass`}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'map' ? styles.active : ''}`}
              onClick={() => setViewMode('map')}
            >
              <Map size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.resultsPanel}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <Loader2 size={48} className="animate-spin text-primary" />
              <p>Fetching Kerala billboard inventory...</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className={styles.grid}>
              {billboards.map((billboard, index) => {
                const shouldAnimate = index < 12;
                return (
                  <motion.div
                    key={billboard.id}
                    initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={shouldAnimate ? { delay: index * 0.05 } : { duration: 0 }}
                  >
                    <BillboardCard billboard={billboard} />
                  </motion.div>
                );
              })}
              {billboards.length === 0 && (
                <div className={styles.emptyState}>
                  <h3>No spots found</h3>
                  <p>Try selecting a different area or district in Kerala.</p>
                </div>
              )}
            </div>
          ) : (
            <div className={`${styles.mapPlaceholder} glass`}>
              <Map size={48} className={styles.mapIcon} />
              <h3>Kerala Interactive Map</h3>
              <p>Mapbox visualization coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
