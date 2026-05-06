'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/auth.module.css';
import { Shield } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      router.push('/admin-dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard} glass`} style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div className={styles.authHeader}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ef4444' }}>
            <Shield size={48} />
          </div>
          <h1>System Administration</h1>
          <p className="text-muted">Restricted Access</p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Admin ID (Email)</label>
            <input type="email" id="email" name="email" className={styles.input} required />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Security Key</label>
            <input type="password" id="password" name="password" className={styles.input} required />
          </div>

          <button type="submit" className={`${styles.submitBtn} glow`} style={{ background: '#ef4444' }} disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
}
