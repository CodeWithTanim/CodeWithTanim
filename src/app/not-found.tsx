import React from 'react';
import Link from 'next/link';
import { Home, Award, FolderGit2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | CodeWithTanim',
  description: 'The requested page could not be found on MD SAMIUR RAHMAN TANIM (CodeWithTanim) portfolio.',
};

export default function NotFound() {
  return (
    <div className="not-found-wrapper">
      <div className="not-found-card">
        <div className="not-found-code-badge">
          <span className="pulse-dot"></span>
          <span>HTTP ERROR 404 / ROUTE_UNDEFINED</span>
        </div>

        <h1 className="not-found-title">404</h1>
        <div className="not-found-subtitle">Document Not Located</div>

        <p className="not-found-desc">
          The requested path or resource does not exist in the system index. It may have been relocated, removed, or the URL might have been typed incorrectly.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="btn-primary">
            <Home size={16} />
            <span>Return to Overview</span>
          </Link>
          <Link href="/certificates" className="btn-outline">
            <Award size={16} />
            <span>View Certificates</span>
          </Link>
          <Link href="/#projects" className="btn-outline">
            <FolderGit2 size={16} />
            <span>Explore Projects</span>
          </Link>
        </div>

        <div className="not-found-diagnostics">
          <div>
            <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.68rem' }}>REGISTRY</span>
            <span>CodeWithTanim Official Portfolio</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.68rem' }}>PROTOCOL</span>
            <span>Next.js 15 App Router</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.68rem' }}>STATUS</span>
            <span style={{ color: 'var(--accent-signal)', fontWeight: 700 }}>404 Not Found</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.68rem' }}>RECOMMENDED ACTION</span>
            <span>Navigate to root index (/)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
