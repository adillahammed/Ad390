'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Shield, Users, Activity, Settings } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import styles from '@/styles/dashboard.module.css';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin-login');
    router.refresh();
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={`${styles.sidebar} glass`} style={{ borderRight: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div className={styles.sidebarHeader}>
          <Shield size={32} className={styles.avatar} style={{ background: '#ef4444' }} />
          <div className={styles.userInfo}>
            <h3>Super Admin</h3>
            <p className="text-muted">System Management</p>
          </div>
        </div>
        
        <nav className={styles.nav}>
          <a href="#" className={`${styles.navItem} ${styles.adminActive}`}><Activity size={20} /> Platform Overview</a>
          <a href="#" className={styles.navItem}><Users size={20} /> User Management</a>
          <a href="#" className={styles.navItem}><Settings size={20} /> System Settings</a>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} /> Terminate Session
          </button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <h1>System Operations</h1>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} glass`} style={{ borderTop: '4px solid #ef4444' }}>
            <h3>Total Platform Revenue</h3>
            <div className={styles.statNumber}>{formatINR(45020000)}</div>
          </div>
          <div className={`${styles.statCard} glass`} style={{ borderTop: '4px solid #ef4444' }}>
            <h3>Active Users</h3>
            <div className={styles.statNumber}>1,240</div>
          </div>
          <div className={`${styles.statCard} glass`} style={{ borderTop: '4px solid #ef4444' }}>
            <h3>Registered Vendors</h3>
            <div className={styles.statNumber}>45</div>
          </div>
        </div>
        
        <div className={`${styles.recentActivity} glass`}>
          <h2>System Audit Log</h2>
          <p className="text-muted">No critical alerts detected in the last 24 hours.</p>
        </div>
      </main>
    </div>
  );
}
