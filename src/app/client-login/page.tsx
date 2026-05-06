'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/auth.module.css';

export default function ClientLogin() {
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

    const endpoint = isLogin ? '/api/auth/client/login' : '/api/auth/client/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      router.push('/client-dashboard');
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
          <span className={styles.roleTag}>Client Portal</span>
          <h1>{isLogin ? 'Welcome Back' : 'Create an Account'}</h1>
          <p className="text-muted">
            {isLogin ? 'Sign in to manage your bookings' : 'Join AdScape to start booking billboards'}
          </p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" className={styles.input} required />
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" className={styles.input} required />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className={styles.input} required />
          </div>

          <button type="submit" className={`${styles.submitBtn} glow`} disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className={styles.authFooter}>
          {isLogin ? (
            <p>Don't have an account? <span className={styles.link} onClick={() => setIsLogin(false)}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span className={styles.link} onClick={() => setIsLogin(true)}>Sign In</span></p>
          )}
          <div style={{ marginTop: '1.5rem', fontSize: '0.8rem' }}>
            <Link href="/vendor-login" className={styles.link}>Are you a Billboard Owner?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
