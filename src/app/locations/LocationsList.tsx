'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Map, LayoutGrid } from 'lucide-react';
import BillboardCard from '@/components/BillboardCard';
import styles from './page.module.css';

export default function LocationsList({ initialBillboards }: { initialBillboards: any[] }) {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  return (
    <div className={styles.locationsPage}>
      <div className={`container ${styles.header}`}>
        <div className={styles.titleSection}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Discover Locations
          </motion.h1>
          <p className="text-muted">Find the perfect billboard for your next campaign.</p>
        </div>
        
        <div className={styles.controls}>
          <button className={`${styles.filterBtn} glass`}>
            <SlidersHorizontal size={18} /> Filters
          </button>
          
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
        <div className={styles.filtersPanel}>
          <div className={`${styles.filterGroup} glass`}>
            <h3>City</h3>
            <div className={styles.checkboxes}>
              <label><input type="checkbox" defaultChecked /> New York</label>
              <label><input type="checkbox" /> San Francisco</label>
              <label><input type="checkbox" /> Tokyo</label>
              <label><input type="checkbox" /> London</label>
            </div>
          </div>
          
          <div className={`${styles.filterGroup} glass`}>
            <h3>Type</h3>
            <div className={styles.checkboxes}>
              <label><input type="checkbox" defaultChecked /> Digital</label>
              <label><input type="checkbox" /> Static</label>
              <label><input type="checkbox" defaultChecked /> 3D Digital</label>
            </div>
          </div>
        </div>
        
        <div className={styles.resultsPanel}>
          {viewMode === 'grid' ? (
            <div className={styles.grid}>
              {initialBillboards.map((billboard, index) => (
                <motion.div
                  key={billboard.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BillboardCard billboard={billboard} />
                </motion.div>
              ))}
              {initialBillboards.length === 0 && (
                <p className="text-muted">No billboards found in the database. Please run the seeder.</p>
              )}
            </div>
          ) : (
            <div className={`${styles.mapPlaceholder} glass`}>
              <Map size={48} className={styles.mapIcon} />
              <h3>Interactive Map View</h3>
              <p>Mapbox integration will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
