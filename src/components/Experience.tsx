'use client';

import React from 'react';
import { EXPERIENCES } from '@/data/portfolioData';
import { ExternalLink } from 'lucide-react';

export default function Experience() {
  return (
    <section id="experience" className="section-block">
      <div className="section-grid">
        <div className="section-index-badge">
          <span className="number">03</span>
          <span className="label">History</span>
        </div>

        <div>
          <h2 className="section-heading-title">Experience (3 Internships)</h2>

          <div className="experience-list">
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="experience-item">
                <h3 className="exp-title">{exp.role}</h3>
                <div className="exp-meta">
                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer">
                    {exp.company}
                  </a>{' '}
                  · {exp.period}
                </div>
                <p className="exp-desc">{exp.description}</p>
                <div className="exp-tags">
                  {exp.highlightProjects.map((p, idx) => (
                    <a
                      key={idx}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="exp-tag-pill"
                    >
                      {p.name} <ExternalLink size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
