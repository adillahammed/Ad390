'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import styles from './page.module.css';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationSelector from '@/components/LocationSelector';

export default function Home() {
  const router = useRouter();
  const [selection, setSelection] = useState<{ districtId: string | null, placeId: string | null }>({
    districtId: null,
    placeId: null
  });

  const handleSearch = () => {
    if (selection.districtId) {
      const params = new URLSearchParams();
      params.append('districtId', selection.districtId);
      if (selection.placeId) params.append('placeId', selection.placeId);
      router.push(`/locations?${params.toString()}`);
    } else {
      router.push('/locations');
    }
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image 
            src="/images/locations/kochi.png" 
            alt="Kochi Skyline" 
            fill 
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay} />
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
            Discover, book, and manage premium billboard spaces across India with our futuristic booking platform.
          </motion.p>
          
          <motion.div 
            className={`${styles.homeSearchWrapper} glass`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LocationSelector onSelectionChange={(d, p) => setSelection({ districtId: d, placeId: p })} />
            <button className={`${styles.searchBtn} glow`} onClick={handleSearch}>
              <Search size={20} />
              <span>Find Billboards</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Location Showcase */}
      <section className={styles.locationShowcase}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Explore Top <span className="text-gradient">Locations</span></h2>
            <p className="text-muted">High-impact zones across Kerala's major hubs.</p>
          </div>
          
          <div className={styles.locationGrid}>
            {[
              { name: 'Kochi', image: '/images/locations/kochi.png', count: 45, slug: 'kochi' },
              { name: 'Kozhikode', image: '/images/locations/kozhikode.png', count: 32, slug: 'kozhikode' },
              { name: 'Trivandrum', image: '/images/locations/trivandrum.png', count: 28, slug: 'thiruvananthapuram' },
            ].map((loc, i) => (
              <motion.div 
                key={loc.name}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/locations/${loc.slug}`} className={`${styles.locationCard} glass`}>
                  <div className={styles.locationImageWrapper}>
                    <Image src={loc.image} alt={loc.name} fill className={styles.locationImage} />
                    <div className={styles.locationOverlay}>
                      <h3>{loc.name}</h3>
                      <p>{loc.count} Active Spots</p>
                      <div className={styles.exploreLink}>
                        View Map <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
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
