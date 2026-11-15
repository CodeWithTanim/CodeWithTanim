'use client';

import React from 'react';
import { Youtube, ExternalLink } from 'lucide-react';

export const TUTORIAL_VIDEOS = [
  {
    id: 'A3yCRuOFBAg',
    title: 'Python Programming Tutorial',
    embedUrl: 'https://www.youtube.com/embed/A3yCRuOFBAg?si=9N1lIaRvbhv2K1Fj',
    category: 'Python',
  },
  {
    id: 'rqD_XEzpGO8',
    title: 'Web Development Guide',
    embedUrl: 'https://www.youtube.com/embed/rqD_XEzpGO8?si=4lTKG48yp8FQffOj',
    category: 'Web Dev',
  },
  {
    id: 'MseArBB8AT4',
    title: 'JavaScript Tutorial for Beginners',
    embedUrl: 'https://www.youtube.com/embed/MseArBB8AT4?si=Rccooewgn_9eFr76',
    category: 'JavaScript',
  },
  {
    id: 'NYdC12iRbfA',
    title: 'Termux Setup Tutorial',
    embedUrl: 'https://www.youtube.com/embed/NYdC12iRbfA?si=qmCFBDRMwjNDB92i',
    category: 'Linux / Termux',
  },
  {
    id: 'cSxTb2xPA6o',
    title: 'Free Domain & Hosting Guide',
    embedUrl: 'https://www.youtube.com/embed/cSxTb2xPA6o?si=57kZ2sEcxAApGz75',
    category: 'Cloud / Web',
  },
  {
    id: 'KyCAwgT4FP0',
    title: 'Scraping Leads from Google Maps',
    embedUrl: 'https://www.youtube.com/embed/KyCAwgT4FP0?si=7rzCObVn64npGDAD',
    category: 'Automation',
  },
  {
    id: 'f9plA379QPs',
    title: 'Intellectual Property Course',
    embedUrl: 'https://www.youtube.com/embed/f9plA379QPs?si=3Df2V9YDN60XuAUA',
    category: 'Law / Tech',
  },
  {
    id: '3RwZ73pBTMI',
    title: 'Be Termux Pro User Course',
    embedUrl: 'https://www.youtube.com/embed/3RwZ73pBTMI?si=qVto-7MoJRmCiimB',
    category: 'Security',
  },
  {
    id: 'GWsMvg3MtH0',
    title: '100 Days of Python',
    embedUrl: 'https://www.youtube.com/embed/GWsMvg3MtH0?si=w110_FuoPHA78gsF',
    category: 'Python',
  },
  {
    id: 'DxN5U0VabSM',
    title: 'Master MS Word in 2 Hours',
    embedUrl: 'https://www.youtube.com/embed/DxN5U0VabSM?si=-RpLRF37',
    category: 'Productivity',
  },
];

export default function TutorialVideos() {
  return (
    <section id="videos" className="section-block">
      <div className="section-grid">
        <div className="section-index-badge">
          <span className="number">07</span>
          <span className="label">Videos</span>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div>
              <h2 className="section-heading-title" style={{ marginBottom: '8px' }}>
                Programming Tutorial Videos ({TUTORIAL_VIDEOS.length})
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px' }}>
                Step-by-step programming courses, development setups, and technical walkthroughs from my official YouTube channel.
              </p>
            </div>
            <a
              href="https://www.youtube.com/@CodeWithTanim"
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{
                fontSize: '0.82rem',
                color: 'var(--accent-signal)',
                fontWeight: 700,
                border: '1px solid var(--accent-signal)',
                padding: '6px 14px',
                background: 'var(--accent-tint)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              <Youtube size={16} />
              <span>Visit @CodeWithTanim</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="media-grid">
            {TUTORIAL_VIDEOS.map((video) => (
              <div key={video.id} className="video-card">
                <div className="video-aspect">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    borderTop: '1px solid var(--border-faint)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      margin: 0,
                    }}
                  >
                    {video.title}
                  </h3>
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--accent-signal)',
                      fontWeight: 700,
                      background: 'var(--accent-tint)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {video.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
