'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User, Search, Bookmark, MessageSquare } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import styles from '@/styles/dashboard.module.css';

export default function ClientDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/client-login');
    router.refresh();
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={`${styles.sidebar} glass`}>
        <div className={styles.sidebarHeader}>
          <User size={32} className={styles.avatar} />
          <div className={styles.userInfo}>
            <h3>Client Panel</h3>
            <p className="text-muted">Welcome back</p>
          </div>
        </div>
        
        <nav className={styles.nav}>
          <a href="#" className={`${styles.navItem} ${styles.active}`}><Search size={20} /> Browse Billboards</a>
          <a href="#" className={styles.navItem}><Bookmark size={20} /> My Bookings</a>
          <a href="#" className={styles.navItem}><MessageSquare size={20} /> Messages</a>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <h1>Dashboard Overview</h1>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} glass`}>
            <h3>Active Campaigns</h3>
            <div className={styles.statNumber}>2</div>
          </div>
          <div className={`${styles.statCard} glass`}>
            <h3>Saved Locations</h3>
            <div className={styles.statNumber}>12</div>
          </div>
          <div className={`${styles.statCard} glass`}>
            <h3>Total Spent</h3>
            <div className={styles.statNumber}>{formatINR(45000)}</div>
          </div>
        </div>
        
        <div className={`${styles.recentActivity} glass`}>
          <h2>Recent Bookings</h2>
          <p className="text-muted">You have no recent bookings in the past 30 days.</p>
        </div>
      </main>
    </div>
  );
}
