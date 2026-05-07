import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.brandInfo}>
            <Link href="/" className={styles.logo}>
              Ad<span className="text-gradient">Scape</span>
            </Link>
            <p className={styles.description}>
              The premium platform for discovering, booking, and managing high-value billboard spaces in India.
            </p>
          </div>
          
          <div className={styles.linksGroup}>
            <h4 className={styles.groupTitle}>Platform</h4>
            <Link href="/locations" className={styles.link}>Browse Locations</Link>
            <Link href="/client-dashboard" className={styles.link}>User Dashboard</Link>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.groupTitle}>Company</h4>
            <Link href="/contact" className={styles.link}>Contact</Link>
            <Link href="/careers" className={styles.link}>Careers</Link>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.groupTitle}>Legal</h4>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link href="/terms" className={styles.link}>Terms of Service</Link>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} AdScape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
