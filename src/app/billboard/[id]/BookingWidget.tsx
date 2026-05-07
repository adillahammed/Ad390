'use client';

import { useState } from 'react';
import { Calendar, Phone, Percent } from 'lucide-react';
import { formatINR, calculateGST } from '@/lib/currency';
import styles from './page.module.css';

export default function BookingWidget({ billboard }: { billboard: any }) {
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(billboard.pricePerDay);

  return (
    <div className={`${styles.bookingWidget} glass sticky`}>
      <h3>{isBidding ? 'High Demand: Place Bid' : 'Book this Space'}</h3>
      
      {isBidding && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
          <strong>Notice:</strong> Another client has already requested these dates. You must place a higher bid to secure this booking.
        </div>
      )}

      <form className={styles.bookingForm} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.inputGroup}>
          <label>Select Dates</label>
          <div className={styles.dateInputWrapper}>
            <Calendar size={18} className={styles.inputIcon} />
            <input type="text" placeholder="Start Date - End Date" className={styles.input} />
          </div>
        </div>
        
        <div className={styles.inputGroup}>
          <label>Campaign Name</label>
          <input type="text" placeholder="Enter campaign name" className={styles.input} />
        </div>

        {isBidding && (
          <div className={styles.inputGroup}>
            <label style={{ color: '#ef4444', fontWeight: 'bold' }}>Your Bid (Per Day)</label>
            <input 
              type="number" 
              value={bidAmount} 
              onChange={(e) => setBidAmount(Number(e.target.value))} 
              className={styles.input} 
              min={billboard.pricePerDay + 100}
              style={{ border: '1px solid #ef4444' }}
            />
          </div>
        )}
        
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>{isBidding ? 'Current Highest Bid' : 'Price per day'}</span>
            <span>{formatINR(isBidding ? billboard.pricePerDay + 500 : billboard.pricePerDay)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Days</span>
            <span>1 (Sample)</span>
          </div>
          <div className={styles.summaryRow}>
            <span>GST (18%)</span>
            <span>{formatINR(calculateGST(isBidding ? billboard.pricePerDay + 500 : billboard.pricePerDay).gstAmount)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total Incl. GST</span>
            <span>{formatINR(calculateGST(isBidding ? billboard.pricePerDay + 500 : billboard.pricePerDay).totalAmount)}</span>
          </div>
        </div>
        
        <button 
          className={`${styles.bookBtn} glow`} 
          style={isBidding ? { background: '#ef4444' } : {}}
          disabled={!billboard.available}
        >
          {billboard.available ? (isBidding ? 'Submit Bid' : 'Request Booking') : 'Not Available'}
        </button>
        
        <button className={styles.whatsappBtn}>
          <Phone size={18} /> Contact via WhatsApp
        </button>

        {/* Temporary button for testing the UI toggle during dev */}
        <button 
          type="button" 
          onClick={() => setIsBidding(!isBidding)} 
          style={{ marginTop: '1rem', background: 'transparent', color: 'var(--muted-text)', fontSize: '0.8rem', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          [Dev: Toggle Bidding UI]
        </button>
      </form>
    </div>
  );
}
