'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Mail, ShieldAlert } from 'lucide-react';

export default function PaymentPage() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem 1rem',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/"
          className="mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--text-main)',
            border: '2px solid var(--border-strong)',
            padding: '8px 16px',
            background: 'var(--bg-panel)',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          background: 'var(--bg-panel)',
          border: '2px solid var(--border-strong)',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-tint)',
            color: 'var(--accent-signal)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.4rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}
        >
          Action Required
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '2rem',
          }}
        >
          Your requested service, software deployment, or private demo access requires administrative authorization or pending billing confirmation. Please reach out directly to complete your request.
        </p>

        <a
          href="mailto:codewithtanim@gmail.com?subject=Billing%20Authorization%20Request"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px 28px',
            background: 'var(--text-main)',
            color: 'var(--bg-panel)',
            border: '2px solid var(--border-strong)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.88rem',
            textTransform: 'uppercase',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Mail size={16} />
          <span>Contact Administration</span>
        </a>
      </div>
    </div>
  );
}
