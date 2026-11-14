'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';
import { CERTIFICATES } from '@/data/portfolioData';

export default function CertBanner() {
  return (
    <section className="section-block" style={{ padding: '60px 0' }}>
      <div className="cert-banner-box">
        <div className="cert-banner-metric mono">{CERTIFICATES.length}+</div>
        <div className="cert-banner-text">
          <h3>Verified Credentials & Achievements</h3>
          <p>
            Includes Google Cybersecurity, Meta Front-End JavaScript, Coursera, Udemy, and software engineering internships.
          </p>
        </div>
        <Link href="/certificates" className="btn-primary">
          <Award size={18} />
          <span>View All Certificates</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
