'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CERTIFICATES, Certificate } from '@/data/portfolioData';
import { Search, ExternalLink, Eye, X, ArrowLeft, Award } from 'lucide-react';

type ProviderFilter = 'All' | 'Coursera' | 'Udemy' | 'HackerRank' | 'Internship';

export default function CertificatesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProvider, setActiveProvider] = useState<ProviderFilter>('All');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const filteredCerts = CERTIFICATES.filter((cert) => {
    const matchesProvider = activeProvider === 'All' || cert.provider === activeProvider;
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  const providers: { label: string; value: ProviderFilter }[] = [
    { label: 'All Certifications', value: 'All' },
    { label: 'HackerRank', value: 'HackerRank' },
    { label: 'Coursera', value: 'Coursera' },
    { label: 'Udemy', value: 'Udemy' },
    { label: 'Internships', value: 'Internship' },
  ];

  return (
    <div style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      {/* Top Banner Box */}
      <div className="page-hero-banner">
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Link href="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
              <ArrowLeft size={16} />
              <span>Back to Main Portfolio</span>
            </Link>
          </div>
          <h1>Verified Credentials</h1>
          <p>
            Official certifications and verified accomplishments across software engineering, computer science, and cybersecurity.
          </p>
        </div>
        <div className="badge-counter mono">
          {CERTIFICATES.length}+ VERIFIED AWARDS
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="cert-search-bar">
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <input
            type="text"
            className="cert-search-input"
            placeholder="Search credentials by topic, name, provider (e.g. Python, Meta, Security)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-faint)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div className="filter-bar" style={{ marginBottom: 0 }}>
          {providers.map((p) => (
            <button
              key={p.value}
              onClick={() => setActiveProvider(p.value)}
              className={`filter-btn ${activeProvider === p.value ? 'active' : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div
        className="mono"
        style={{
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Displaying {filteredCerts.length} verified certification{filteredCerts.length === 1 ? '' : 's'}</span>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{ color: 'var(--accent-signal)', textDecoration: 'underline' }}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Certificates Grid */}
      <div className="certs-grid">
        {filteredCerts.map((cert, index) => (
          <div key={cert.id} className="cert-card">
            <div
              className="cert-image-frame"
              onClick={() => setSelectedCert(cert)}
              title="Click to preview credential full-size"
            >
              <img
                src={cert.image}
                alt={cert.title}
                className="cert-cover"
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="cert-zoom-overlay">
                <Eye size={18} />
                <span>Enlarge View</span>
              </div>
            </div>

            <div className="cert-card-body">
              <div className="cert-badge-row">
                <span className={`cert-provider-tag ${cert.provider}`}>{cert.provider}</span>
                <span className="cert-date">{cert.issueDate}</span>
              </div>

              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-desc">{cert.description}</p>

              <div className="cert-action-row">
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="cert-verify-link"
                  style={{ cursor: 'pointer' }}
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </button>

                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-verify-link"
                  style={{ color: 'var(--accent-signal)' }}
                >
                  <span>Verify Credential</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Lightbox for viewing certificate images full-size */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{selectedCert.title}</div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedCert(null)}
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-image-container">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="modal-cert-image"
              />
            </div>

            <div className="modal-footer">
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Provider: <strong style={{ color: 'var(--text-main)' }}>{selectedCert.provider}</strong> · Issued: {selectedCert.issueDate}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={selectedCert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                >
                  <span>Open Verification Link</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
