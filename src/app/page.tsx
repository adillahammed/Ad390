'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, TrendingUp, Shield } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.gradientOrb1} />
          <div className={styles.gradientOrb2} />
        </div>
        
        <div className={`container ${styles.heroContent}`}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Own the <span className="text-gradient">Skyline</span>
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover, book, and manage premium billboard spaces globally with our futuristic booking platform.
          </motion.p>
          
          <motion.div 
            className={`${styles.searchBar} glass`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.searchInputGroup}>
              <MapPin className={styles.searchIcon} size={20} />
              <input type="text" placeholder="Where do you want to advertise?" className={styles.searchInput} />
            </div>
            <button className={`${styles.searchBtn} glow`}>
              <Search size={20} />
              <span>Search</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`section ${styles.featuresSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Why Choose AdScape?</h2>
            <p className="text-muted">Experience the future of outdoor advertising.</p>
          </div>
          
          <div className={styles.featuresGrid}>
            <motion.div 
              className={`${styles.featureCard} glass`}
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className={styles.featureIconWrapper}>
                <TrendingUp size={32} className={styles.featureIcon} />
              </div>
              <h3>Data-Driven Insights</h3>
              <p>Get real-time traffic estimates, demographic data, and engagement analytics for every billboard.</p>
            </motion.div>
            
            <motion.div 
              className={`${styles.featureCard} glass`}
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className={styles.featureIconWrapper}>
                <Shield size={32} className={styles.featureIcon} />
              </div>
              <h3>Secure Booking</h3>
              <p>Transparent pricing, verified owners, and secure payment processing for peace of mind.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
