'use client';

import React from 'react';
import { ABOUT_ME } from '@/data/portfolioData';
import {
  Code,
  MapPin,
  Globe,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function AboutMe() {
  return (
    <section id="about" className="section-block">
      <div className="section-grid">
        <div className="section-index-badge">
          <span className="number">02</span>
          <span className="label">About</span>
        </div>

        <div>
          <h2 className="section-heading-title">About Me</h2>

          {/* Intro Story & Quick Facts Grid */}
          <div className="about-narrative-grid">
            <div className="about-story-col">
              <div className="about-badge-tag">
                <Code size={14} />
                <span>{ABOUT_ME.eyebrow}</span>
              </div>
              <h3 className="about-story-heading">{ABOUT_ME.heading}</h3>
              <div className="about-lead-paragraphs">
                {ABOUT_ME.intro.map((p, idx) => (
                  <p key={idx} className="about-lead-p">{p}</p>
                ))}
              </div>
              <div className="about-focus-pills">
                {ABOUT_ME.focusPills.map((pill, idx) => (
                  <span key={idx} className="about-focus-pill mono">
                    <span className="pill-dot"></span>
                    <span>{pill}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="about-facts-card">
              <div className="facts-card-header">
                <span className="mono facts-label">Quick Profile Details</span>
                <span className="pulse-dot"></span>
              </div>
              <ul className="facts-list">
                <li className="facts-item">
                  <span className="facts-item-label">
                    <Globe size={15} /> Nationality
                  </span>
                  <span className="facts-item-val font-bold">Bangladeshi</span>
                </li>
                <li className="facts-item">
                  <span className="facts-item-label">
                    <MapPin size={15} /> Present Base
                  </span>
                  <span className="facts-item-val">Guwahati, Assam, India</span>
                </li>
                <li className="facts-item">
                  <span className="facts-item-label">
                    <MapPin size={15} /> Permanent
                  </span>
                  <span className="facts-item-val">Pabna, Rajshahi, Bangladesh</span>
                </li>
                <li className="facts-item">
                  <span className="facts-item-label">
                    <Award size={15} /> Education
                  </span>
                  <span className="facts-item-val">B.Tech CSE (2023–2027)</span>
                </li>
                <li className="facts-item">
                  <span className="facts-item-label">
                    <CheckCircle2 size={15} /> Availability
                  </span>
                  <span className="facts-item-val accent-text font-bold">Open to Opportunities</span>
                </li>
              </ul>

              <div className="facts-languages">
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Spoken Languages:
                </span>
                <div className="lang-chips">
                  {ABOUT_ME.personalDetails.languages.map((lang, lIdx) => (
                    <span key={lIdx} className="lang-chip">{lang}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
