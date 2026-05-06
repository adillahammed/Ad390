'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} glass`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Ad<span className="text-gradient">Scape</span>
        </Link>
        
        <div className={styles.desktopLinks}>
          <Link href="/locations" className={styles.link}>Locations</Link>
          
          <button onClick={toggleTheme} className={styles.iconBtn} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link href="/client-login" className={`${styles.loginBtn} glow`}>Sign In</Link>
        </div>

        <button 
          className={styles.mobileToggle} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/locations" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Locations</Link>
          <div className={styles.mobileActions}>
            <button onClick={toggleTheme} className={styles.iconBtn}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} Toggle Theme
            </button>
            <Link href="/client-login" className={styles.loginBtn}>Sign In</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
