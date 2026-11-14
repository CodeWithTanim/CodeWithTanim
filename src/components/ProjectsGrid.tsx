'use client';

import React, { useState } from 'react';
import { PROJECTS } from '@/data/portfolioData';
import { ExternalLink, Github } from 'lucide-react';

type FilterType = 'all' | 'web' | 'python' | 'security';

export default function ProjectsGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredProjects = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category.includes(activeFilter));

  const filterTabs: { label: string; value: FilterType; count: number }[] = [
    { label: 'All Projects', value: 'all', count: PROJECTS.length },
    { label: 'Web & Full-Stack', value: 'web', count: PROJECTS.filter(p => p.category.includes('web')).length },
    { label: 'Python & Automation', value: 'python', count: PROJECTS.filter(p => p.category.includes('python')).length },
    { label: 'Cybersecurity', value: 'security', count: PROJECTS.filter(p => p.category.includes('security')).length },
  ];

  return (
    <section id="projects" className="section-block">
      <div className="section-grid">
        <div className="section-index-badge">
          <span className="number">06</span>
          <span className="label">Work</span>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div>
              <h2 className="section-heading-title" style={{ marginBottom: '8px' }}>
                Featured Projects ({PROJECTS.length})
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px' }}>
                Verified software systems, cloud tools, and research repositories loaded directly from official project specifications.
              </p>
            </div>
            <span
              className="mono"
              style={{
                fontSize: '0.82rem',
                color: 'var(--accent-signal)',
                fontWeight: 700,
                border: '1px solid var(--accent-signal)',
                padding: '4px 10px',
                background: 'var(--accent-tint)',
              }}
            >
              Showing {filteredProjects.length} of {PROJECTS.length}
            </span>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`filter-btn ${activeFilter === tab.value ? 'active' : ''}`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Bento Grid of Projects */}
          <div className="projects-bento">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-thumbnail-wrapper">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-thumbnail-img"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                <div className="project-details">
                  <div className="project-meta-row">
                    <span>{project.sheetNum}</span>
                    <span className="tag">{project.categoryLabel}</span>
                  </div>

                  <h3 className="project-title">{project.title}</h3>

                  {project.tagline && (
                    <div
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        marginBottom: '8px',
                        lineHeight: 1.4,
                      }}
                    >
                      {project.tagline}
                    </div>
                  )}

                  <p className="project-desc">{project.description}</p>

                  <div className="project-tech-bar">
                    <strong style={{ color: 'var(--text-main)' }}>Stack: </strong>
                    {project.tech}
                  </div>

                  <div className="project-links" style={{ flexWrap: 'wrap', gap: '8px' }}>
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-btn"
                        title="View GitHub Repository"
                      >
                        <Github size={14} />
                        <span>Source Code</span>
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-btn"
                        style={{
                          borderColor: 'var(--accent-signal)',
                          backgroundColor: 'var(--accent-tint)',
                          color: 'var(--accent-signal)',
                          fontWeight: 700,
                        }}
                        title={`Open ${project.liveLabel || 'Live Demo'}`}
                      >
                        <ExternalLink size={14} />
                        <span>{project.liveLabel || 'Live Demo'}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
