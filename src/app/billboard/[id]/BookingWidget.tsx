'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Phone, Percent, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatINR, calculateGST } from '@/lib/currency';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

export default function BookingWidget({ billboard }: { billboard: any }) {
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(billboard.pricePerDay);
  
  // Date Picker States
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (selectedDate < startDate) {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
      setShowCalendar(false);
    }
  };

  const isSelected = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (startDate && d.toDateString() === startDate.toDateString()) || 
           (endDate && d.toDateString() === endDate.toDateString());
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return d > startDate && d < endDate;
  };

  const formatDateRange = () => {
    if (!startDate) return 'Pick your dates';
    if (!endDate) return `${startDate.toLocaleDateString()} - ...`;
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateDays();
  const currentPrice = isBidding ? bidAmount : billboard.pricePerDay;

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
          <div className={styles.dateInputWrapper} onClick={() => setShowCalendar(!showCalendar)}>
            <CalendarIcon size={18} className={styles.inputIcon} />
            <div className={styles.dateDisplay}>
              {formatDateRange()}
            </div>
            
            <AnimatePresence>
              {showCalendar && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={styles.calendarDropdown}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.calendarHeader}>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
                      <ChevronLeft size={16} />
                    </button>
                    <span>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  <div className={styles.calendarGrid}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                      <div key={d} className={styles.weekday}>{d}</div>
                    ))}
                    {Array.from({ length: firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => {
                      const day = i + 1;
                      return (
                        <div 
                          key={day} 
                          className={`${styles.calendarDay} ${isSelected(day) ? styles.selected : ''} ${isInRange(day) ? styles.inRange : ''}`}
                          onClick={() => handleDateClick(day)}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            <span>{isBidding ? 'Your Bid (Per Day)' : 'Price per day'}</span>
            <span>{formatINR(currentPrice)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Days</span>
            <span>{totalDays} {totalDays === 1 ? '(Min)' : ''}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>GST (18%)</span>
            <span>{formatINR(calculateGST(currentPrice * totalDays).gstAmount)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total Incl. GST</span>
            <span>{formatINR(calculateGST(currentPrice * totalDays).totalAmount)}</span>
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
