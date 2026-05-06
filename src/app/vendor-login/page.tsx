'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/auth.module.css';

export default function VendorLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const company = formData.get('company');

    const endpoint = isLogin ? '/api/auth/vendor/login' : '/api/auth/vendor/register';
    const body = isLogin ? { email, password } : { name, email, password, company };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      router.push('/vendor-dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard} glass`}>
        <div className={styles.authHeader}>
          <span className={styles.roleTag} style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-color)' }}>Vendor Portal</span>
          <h1>{isLogin ? 'Vendor Login' : 'Become a Partner'}</h1>
          <p className="text-muted">
            {isLogin ? 'Manage your billboard listings and earnings' : 'List your billboards and reach thousands of brands'}
          </p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="company">Company/Agency Name</label>
                <input type="text" id="company" name="company" className={styles.input} required />
              </div>
            </>
          )}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Business Email</label>
            <input type="email" id="email" name="email" className={styles.input} required />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className={styles.input} required />
          </div>

          <button type="submit" className={`${styles.submitBtn} glow`} style={{ background: 'var(--accent-color)' }} disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Apply Now')}
          </button>
        </form>

        <div className={styles.authFooter}>
          {isLogin ? (
            <p>New vendor? <span className={styles.link} onClick={() => setIsLogin(false)}>Apply here</span></p>
          ) : (
            <p>Already a partner? <span className={styles.link} onClick={() => setIsLogin(true)}>Sign In</span></p>
          )}
          <div style={{ marginTop: '1.5rem', fontSize: '0.8rem' }}>
            <Link href="/client-login" className={styles.link}>Looking to book a billboard instead?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
