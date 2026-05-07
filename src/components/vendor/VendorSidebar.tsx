'use client';

import { LayoutList, PieChart, IndianRupee, PlusCircle, Settings, LogOut } from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function VendorSidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    { id: 'listings', label: 'My Billboards', icon: <LayoutList size={20} /> },
    { id: 'add', label: 'Add New Billboard', icon: <PlusCircle size={20} /> },
    { id: 'earnings', label: 'Earnings & Payouts', icon: <IndianRupee size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`${styles.sidebar} glass`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.avatar} style={{ background: 'var(--accent-color)' }}>V</div>
        <div className={styles.userInfo}>
          <h3>Vendor Panel</h3>
          <p className="text-muted">Kerala Ad Hub</p>
        </div>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`${styles.navItem} ${activeTab === item.id ? styles.vendorActive : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className={styles.sidebarFooter}>
        <button onClick={onLogout} className={styles.logoutBtn}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
