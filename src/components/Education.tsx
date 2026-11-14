'use client';

import React from 'react';
import { EDUCATION } from '@/data/portfolioData';
import { GraduationCap, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function Education() {
  return (
    <section id="education" className="section-block">
      <div className="section-grid">
        <div className="section-index-badge">
          <span className="number">04</span>
          <span className="label">Academic</span>
        </div>

        <div>
          <div className="section-header-flex">
            <div>
              <h2 className="section-heading-title">Educational Qualifications</h2>
              <p className="section-sub-desc">
                Academic foundation in Computer Science & Engineering, mathematics, and software development.
              </p>
            </div>
            <div className="badge-counter mono">
              UNDERGRADUATE DEGREE
            </div>
          </div>

          <div className="education-list">
            {EDUCATION.map((edu, index) => (
              <div key={edu.id} className="education-card">
                <div className="edu-card-header">
                  <div className="edu-title-group">
                    <div className="edu-icon-badge">
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <div className="edu-level-eyebrow mono">
                        <span>UNDERGRADUATE DEGREE · 4TH YEAR</span>
                        {edu.board && <span className="edu-board-tag">· {edu.board}</span>}
                      </div>
                      <h3 className="edu-degree-title">{edu.degree}</h3>
                      <div className="edu-institution-name">{edu.institution}</div>
                    </div>
                  </div>

                  <div className="edu-meta-badges">
                    <div className="edu-period-pill mono">
                      <Calendar size={13} />
                      <span>{edu.period}</span>
                    </div>
                    {edu.grade && (
                      <div className="edu-grade-pill mono">
                        <Award size={13} />
                        <span>{edu.grade}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="edu-card-body">
                  <div className="edu-location mono">
                    <MapPin size={13} />
                    <span>{edu.location}</span>
                  </div>

                  <p className="edu-desc">{edu.description}</p>

                  {edu.highlights && edu.highlights.length > 0 && (
                    <div className="edu-highlights-wrap">
                      <div className="edu-highlights-title mono">Key Academic Highlights & Curriculum:</div>
                      <ul className="edu-highlights-list">
                        {edu.highlights.map((item, hIdx) => (
                          <li key={hIdx}>
                            <CheckCircle2 size={14} className="edu-check-icon" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
