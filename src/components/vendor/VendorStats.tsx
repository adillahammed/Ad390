'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, LayoutList, TrendingUp, Users, Eye, MessageSquare } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import styles from '@/styles/dashboard.module.css';

export default function VendorStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/vendor/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading analytics...</div>;

  const statCards = [
    { title: 'Total Earnings', value: formatINR(stats.totalEarnings), icon: <IndianRupee />, color: '#10b981' },
    { title: 'Active Listings', value: stats.activeListings, icon: <LayoutList />, color: '#3b82f6' },
    { title: 'Pending Bookings', value: stats.pendingBookings, icon: <TrendingUp />, color: '#f59e0b' },
    { title: 'Monthly Revenue', value: formatINR(stats.monthlyRevenue), icon: <TrendingUp />, color: '#8b5cf6' },
  ];

  return (
    <div className={styles.statsGrid}>
      {statCards.map((card, i) => (
        <div key={i} className={`${styles.statCard} glass`} style={{ borderTop: `4px solid ${card.color}` }}>
          <div className={styles.statHeader}>
            <h3>{card.title}</h3>
            <div className={styles.statIcon} style={{ color: card.color }}>{card.icon}</div>
          </div>
          <div className={styles.statNumber}>{card.value}</div>
        </div>
      ))}
      
      <div className={`${styles.statsChart} glass`}>
        <h3>Listing Performance</h3>
        <div className={styles.performanceGrid}>
          <div className={styles.perfItem}>
            <Eye size={20} />
            <div>
              <small>Total Views</small>
              <strong>2,450</strong>
            </div>
          </div>
          <div className={styles.perfItem}>
            <MessageSquare size={20} />
            <div>
              <small>Inquiries</small>
              <strong>{stats.inquiryCount}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.featuredStat} glass`}>
        <h3>Most Viewed Billboard</h3>
        <div className={styles.featuredContent}>
          <div className={styles.featuredText}>
            <strong>{stats.mostViewedBillboard}</strong>
            <p className="text-muted">High Traffic Junction, Kozhikode</p>
          </div>
          <div className={styles.growthBadge}>+12% this week</div>
        </div>
      </div>
    </div>
  );
}
