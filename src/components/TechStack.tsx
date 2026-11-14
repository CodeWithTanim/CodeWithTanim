'use client';

import React, { useState } from 'react';
import { TECH_STACK } from '@/data/portfolioData';

type FilterCategory = 'All' | 'Frontend & Framework' | 'Backend & Language' | 'Database' | 'Security & Tools';

export default function TechStack() {
  const [activeTab, setActiveTab] = useState<FilterCategory>('All');

  const filterMap: Record<FilterCategory, string[]> = {
    'All': [],
    'Frontend & Framework': ['HTML/CSS', 'ReactJS', 'NextJS'],
    'Backend & Language': ['Python', 'JavaScript', 'PHP'],
    'Database': ['MongoDB', 'MySQL'],
    'Security & Tools': ['BetterAuth', 'Git & GitHub', 'Digital Marketing'],
  };

  const filteredSkills = activeTab === 'All'
    ? TECH_STACK
    : TECH_STACK.filter(s => filterMap[activeTab].includes(s.name));

  const tabs: { label: FilterCategory; count: number }[] = [
    { label: 'All', count: TECH_STACK.length },
    { label: 'Frontend & Framework', count: TECH_STACK.filter(s => filterMap['Frontend & Framework'].includes(s.name)).length },
    { label: 'Backend & Language', count: TECH_STACK.filter(s => filterMap['Backend & Language'].includes(s.name)).length },
    { label: 'Database', count: TECH_STACK.filter(s => filterMap['Database'].includes(s.name)).length },
    { label: 'Security & Tools', count: TECH_STACK.filter(s => filterMap['Security & Tools'].includes(s.name)).length },
  ];

  return (
    <section id="skills" className="section-block">
      <div className="section-grid">
        <div className="section-index-badge">
          <span className="number">05</span>
          <span className="label">Stack</span>
        </div>

        <div>
          <div className="section-header-flex">
            <div>
              <h2 className="section-heading-title">Tech Stack & Technologies</h2>
              <p className="section-sub-desc">
                Core technologies, languages, and frameworks used across my software development projects.
              </p>
            </div>
            <div className="badge-counter mono">
              {TECH_STACK.length} CORE TECHNOLOGIES
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="filter-bar" style={{ marginTop: '8px', marginBottom: '20px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`filter-btn ${activeTab === tab.label ? 'active' : ''}`}
              >
                <span>{tab.label}</span>
                <span className="mono" style={{ fontSize: '0.72rem', opacity: 0.85, marginLeft: '6px' }}>
                  ({tab.count})
                </span>
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="skills-grid">
            {filteredSkills.map((tech, index) => (
              <div key={index} className="skill-card">
                <span className="skill-name">{tech.name}</span>
                <span className="skill-category-tag">{tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
