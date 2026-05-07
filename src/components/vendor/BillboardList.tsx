'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Pause, Play, ExternalLink, MoreVertical, Search, Filter } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import Image from 'next/image';
import styles from './BillboardList.module.css';

export default function BillboardList() {
  const [billboards, setBillboards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBillboards();
  }, []);

  const fetchBillboards = async () => {
    try {
      const res = await fetch('/api/vendor/billboards');
      const data = await res.json();
      setBillboards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APPROVED': return styles.statusApproved;
      case 'PENDING': return styles.statusPending;
      case 'REJECTED': return styles.statusRejected;
      default: return '';
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading your inventory...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input type="text" placeholder="Search billboards..." />
        </div>
        <button className={styles.filterBtn}>
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Billboard</th>
              <th>Location</th>
              <th>Type/Size</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {billboards.map((b) => (
              <tr key={b.id}>
                <td>
                  <div className={styles.billboardInfo}>
                    <div className={styles.thumbnail}>
                      <Image src={b.image} alt={b.title} width={60} height={40} />
                    </div>
                    <div>
                      <span className={styles.title}>{b.title}</span>
                      <small className={styles.id}>ID: {b.id.slice(0,8)}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.location}>
                    <span>{b.location}</span>
                    <small>{b.city}</small>
                  </div>
                </td>
                <td>
                  <div className={styles.typeSize}>
                    <span className={styles.typeBadge}>{b.type}</span>
                    <small>{b.size}</small>
                  </div>
                </td>
                <td>
                  <span className={styles.price}>{formatINR(b.pricePerDay)}/day</span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusStyle(b.status)}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button title="Edit" className={styles.actionBtn}><Edit size={16} /></button>
                    <button title="Delete" className={styles.actionBtn}><Trash2 size={16} /></button>
                    <button title="Options" className={styles.actionBtn}><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
