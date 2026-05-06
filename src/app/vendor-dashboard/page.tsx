'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Building, LayoutList, PieChart, DollarSign } from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

export default function VendorDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/vendor-login');
    router.refresh();
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={`${styles.sidebar} glass`}>
        <div className={styles.sidebarHeader}>
          <Building size={32} className={styles.avatar} style={{ background: 'var(--accent-color)' }} />
          <div className={styles.userInfo}>
            <h3>Vendor Panel</h3>
            <p className="text-muted">Manage your inventory</p>
          </div>
        </div>
        
        <nav className={styles.nav}>
          <a href="#" className={`${styles.navItem} ${styles.vendorActive}`}><PieChart size={20} /> Analytics</a>
          <a href="#" className={styles.navItem}><LayoutList size={20} /> My Billboards</a>
          <a href="#" className={styles.navItem}><DollarSign size={20} /> Earnings</a>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <h1>Vendor Overview</h1>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} glass`} style={{ borderTop: '4px solid var(--accent-color)' }}>
            <h3>Total Billboards</h3>
            <div className={styles.statNumber}>8</div>
          </div>
          <div className={`${styles.statCard} glass`} style={{ borderTop: '4px solid var(--accent-color)' }}>
            <h3>Active Bookings</h3>
            <div className={styles.statNumber}>5</div>
          </div>
          <div className={`${styles.statCard} glass`} style={{ borderTop: '4px solid var(--accent-color)' }}>
            <h3>Monthly Revenue</h3>
            <div className={styles.statNumber}>$12,400</div>
          </div>
        </div>
        
        <div className={`${styles.recentActivity} glass`}>
          <h2>Pending Approvals</h2>
          <p className="text-muted">You have no pending booking requests at this time.</p>
        </div>
      </main>
    </div>
  );
}
