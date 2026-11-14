'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';

const SECTIONS = ['overview', 'about', 'experience', 'education', 'skills', 'projects', 'contact'];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = useState<string>('overview');
  const pathname = usePathname();

  useEffect(() => {
    // Theme initialization (Light Mode default)
    const saved = localStorage.getItem('cwt_theme') as 'light' | 'dark' | null;
    const initial = saved === 'dark' ? 'dark' : 'light';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);

    // Initial hash check
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (SECTIONS.includes(hash)) {
        setActiveSection(hash);
      }
    }

    // Live Scroll Spy Observer
    const handleScroll = () => {
      // If at bottom of page, activate contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      const headerOffset = 100;
      let currentSection = 'overview';

      for (const sectionId of SECTIONS) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset && rect.bottom >= headerOffset) {
            currentSection = sectionId;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cwt_theme', next);
  };

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  const isCertificatesPage = pathname.includes('/certificate');
  const isHome = pathname === '/';
  const getSectionHref = (sectionId: string) => (isHome ? `#${sectionId}` : `/#${sectionId}`);

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand-logo" onClick={() => handleNavClick('overview')}>
          CODE<span className="accent">WITH</span>TANIM
        </Link>

        {/* Desktop Navigation */}
        <nav>
          <ul className="nav-desktop">
            {!isCertificatesPage ? (
              <>
                <li>
                  <a
                    href={getSectionHref('overview')}
                    className={`nav-link ${activeSection === 'overview' && isHome ? 'active' : ''}`}
                    onClick={() => handleNavClick('overview')}
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    href={getSectionHref('about')}
                    className={`nav-link ${activeSection === 'about' && isHome ? 'active' : ''}`}
                    onClick={() => handleNavClick('about')}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href={getSectionHref('experience')}
                    className={`nav-link ${activeSection === 'experience' && isHome ? 'active' : ''}`}
                    onClick={() => handleNavClick('experience')}
                  >
                    Experience
                  </a>
                </li>
                <li>
                  <a
                    href={getSectionHref('education')}
                    className={`nav-link ${activeSection === 'education' && isHome ? 'active' : ''}`}
                    onClick={() => handleNavClick('education')}
                  >
                    Education
                  </a>
                </li>
                <li>
                  <a
                    href={getSectionHref('skills')}
                    className={`nav-link ${activeSection === 'skills' && isHome ? 'active' : ''}`}
                    onClick={() => handleNavClick('skills')}
                  >
                    Stack
                  </a>
                </li>
                <li>
                  <a
                    href={getSectionHref('projects')}
                    className={`nav-link ${activeSection === 'projects' && isHome ? 'active' : ''}`}
                    onClick={() => handleNavClick('projects')}
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <Link href="/certificates" className="nav-link">
                    Certificates
                  </Link>
                </li>
                <li>
                  <a
                    href={getSectionHref('contact')}
                    className={`btn-nav-cta ${activeSection === 'contact' && isHome ? 'active' : ''}`}
                    onClick={() => handleNavClick('contact')}
                  >
                    Contact
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/" className="nav-link">
                    Home Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/certificates" className="nav-link active">
                    All Credentials
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="btn-nav-cta">
                    Get in Touch
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="nav-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        {!isCertificatesPage ? (
          <>
            <a
              href={getSectionHref('overview')}
              className={`mobile-nav-link ${activeSection === 'overview' && isHome ? 'active' : ''}`}
              onClick={() => handleNavClick('overview')}
            >
              Overview
            </a>
            <a
              href={getSectionHref('about')}
              className={`mobile-nav-link ${activeSection === 'about' && isHome ? 'active' : ''}`}
              onClick={() => handleNavClick('about')}
            >
              About Me
            </a>
            <a
              href={getSectionHref('experience')}
              className={`mobile-nav-link ${activeSection === 'experience' && isHome ? 'active' : ''}`}
              onClick={() => handleNavClick('experience')}
            >
              Experience (3 Internships)
            </a>
            <a
              href={getSectionHref('education')}
              className={`mobile-nav-link ${activeSection === 'education' && isHome ? 'active' : ''}`}
              onClick={() => handleNavClick('education')}
            >
              Education
            </a>
            <a
              href={getSectionHref('skills')}
              className={`mobile-nav-link ${activeSection === 'skills' && isHome ? 'active' : ''}`}
              onClick={() => handleNavClick('skills')}
            >
              Tech Stack
            </a>
            <a
              href={getSectionHref('projects')}
              className={`mobile-nav-link ${activeSection === 'projects' && isHome ? 'active' : ''}`}
              onClick={() => handleNavClick('projects')}
            >
              Projects (10)
            </a>
            <Link
              href="/certificates"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Certificates (28+)
            </Link>
            <a
              href={getSectionHref('contact')}
              className={`mobile-nav-link ${activeSection === 'contact' && isHome ? 'active' : ''}`}
              onClick={() => handleNavClick('contact')}
            >
              Contact Me
            </a>
          </>
        ) : (
          <>
            <Link href="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              Main Portfolio
            </Link>
            <Link href="/certificates" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              Certificates Archive
            </Link>
            <Link href="/#contact" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              Contact Me
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
