'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Youtube, ExternalLink, GraduationCap } from 'lucide-react';

export interface CourseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  embedUrl?: string;
  href?: string;
  duration?: string;
  level?: string;
}

export const VIDEO_COURSES: CourseItem[] = [
  {
    id: '100-days-python',
    title: '100 Days of Python Challenge Course',
    category: 'Python Bootcamp',
    description: 'Comprehensive hands-on Python programming track covering language syntax, algorithms, data structures, and everyday scripting challenges.',
    embedUrl: 'https://www.youtube.com/embed/GWsMvg3MtH0?si=w110_FuoPHA78gsF',
    duration: '100 Lessons Challenge',
  },
  {
    id: 'termux-pro-course',
    title: 'Be Termux Pro User Course',
    category: 'Linux / Command Line',
    description: 'End-to-end command line course on Android terminal environments, Linux package setups, automation workflows, and terminal productivity.',
    embedUrl: 'https://www.youtube.com/embed/3RwZ73pBTMI?si=qVto-7MoJRmCiimB',
    duration: 'Complete Video Course',
  },
  {
    id: 'ip-course',
    title: 'Intellectual Property Course',
    category: 'Tech Law & Compliance',
    description: 'Foundational course on digital copyrights, patent frameworks, software licensing, and intellectual property protection for technologists.',
    embedUrl: 'https://www.youtube.com/embed/f9plA379QPs?si=3Df2V9YDN60XuAUA',
    duration: 'Complete Video Course',
  },
  {
    id: 'ms-word-course',
    title: 'Master MS Word in 2 Hours (Full Course)',
    category: 'Productivity & Office',
    description: 'Zero to mastery crash course covering academic thesis layouts, IEEE formatting, table designs, document styling, and productivity macros.',
    embedUrl: 'https://www.youtube.com/embed/DxN5U0VabSM?si=-RpLRF37',
    duration: '2 Hours Full Course',
  },
];

export default function Courses() {
  return (
    <section id="courses" className="section-block">
      <div className="section-grid">
        <div className="section-index-badge">
          <span className="number">07</span>
          <span className="label">Courses</span>
        </div>

        <div>
          {/* Header */}
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
                My Courses
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px', margin: 0 }}>
                Specialized curriculum, hands-on programming bootcamps, and technical walkthrough courses designed and taught by MD Samiur Rahman Tanim.
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

          {/* Featured Masterclass Hero Card */}
          <div className="course-featured-banner">
            <div className="course-featured-eyebrow mono">
              <Sparkles size={14} />
              <span>FLAGSHIP MASTERCLASS · ENROLLMENT OPEN</span>
            </div>
            <h3 className="course-featured-title">Python A–Z Comprehensive Course</h3>
            <p className="course-featured-desc">
              Zero-to-hero comprehensive Python masterclass covering computer science fundamentals, object-oriented programming, data structures, automation scripts, and real-world project development under direct 1-on-1 mentorship and verified completion certificate.
            </p>
            <div className="course-highlights-pills mono">
              <span>✓ 10+ Real-World Projects</span>
              <span>✓ Cybersecurity &amp; Scripting</span>
              <span>✓ Line-by-Line Code Reviews</span>
              <span>✓ Verified Course Certificate</span>
              <span>✓ bKash · Nagad · Bank Wire</span>
            </div>
            <div className="course-action-group">
              <Link href="/pythonCourse" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                <GraduationCap size={18} />
                <span>Enroll in Python A–Z</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/pythonCourse" className="btn-outline" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
                <span>View Full Curriculum &amp; Syllabus</span>
              </Link>
            </div>
          </div>

          {/* Video Courses Grid */}
          <div className="media-grid">
            {VIDEO_COURSES.map((course) => (
              <div key={course.id} className="video-card">
                <div className="video-aspect">
                  <iframe
                    src={course.embedUrl}
                    title={course.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    borderTop: '1px solid var(--border-faint)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
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
                      {course.category}
                    </span>
                    <span
                      className="mono"
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {course.duration}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      margin: '4px 0 2px',
                      lineHeight: 1.3,
                    }}
                  >
                    {course.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {course.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
