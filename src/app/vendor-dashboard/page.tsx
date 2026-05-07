'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import VendorStats from '@/components/vendor/VendorStats';
import BillboardList from '@/components/vendor/BillboardList';
import BillboardForm from '@/components/vendor/BillboardForm';
import styles from '@/styles/dashboard.module.css';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/vendor-login');
    router.refresh();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <>
            <h1>Vendor Overview</h1>
            <VendorStats />
            <div className={`${styles.recentActivity} glass`}>
              <h2>System Alerts</h2>
              <p className="text-muted">No critical alerts. Your billboards are performing well.</p>
            </div>
          </>
        );
      case 'listings':
        return (
          <>
            <div className={styles.contentHeader}>
              <h1>My Billboard Inventory</h1>
              <button onClick={() => setActiveTab('add')} className={styles.primaryBtn}>
                Add New Billboard
              </button>
            </div>
            <BillboardList />
          </>
        );
      case 'add':
        return (
          <>
            <h1>Add New Billboard Listing</h1>
            <BillboardForm onSuccess={() => setActiveTab('listings')} />
          </>
        );
      default:
        return <h1>Coming Soon</h1>;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <VendorSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      
      <main className={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
}
