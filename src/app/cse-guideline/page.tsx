'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Youtube, Code, Shield, Cpu, Terminal, ExternalLink, CheckCircle } from 'lucide-react';

export default function CseGuidelinePage() {
  const channels = [
    { name: 'CodeWithHarry', url: 'https://www.youtube.com/@codewithharry', desc: 'Python, Web Dev & C++ in Hindi' },
    { name: 'Neso Academy', url: 'https://www.youtube.com/@nesoacademy', desc: 'Operating Systems, Digital Logic & Theory' },
    { name: 'Gate Smashers', url: 'https://www.youtube.com/@GateSmashers', desc: 'DBMS, Algorithms & Computer Networks' },
    { name: 'Sheryians Coding School', url: 'https://www.youtube.com/@sheryians', desc: 'Full-Stack JavaScript & Animations' },
    { name: 'notyourcollege', url: 'https://www.youtube.com/@notyourcollege', desc: 'College Guidance & Tech Roadmaps' },
  ];

  const yearRoadmaps = [
    {
      year: 'Year 1: Foundations & Logic',
      focus: 'Programming Fundamentals, Mathematics & Core Tools',
      points: [
        'Master one foundational language deeply (C / C++ or Python).',
        'Learn Git and GitHub workflow: push commits daily.',
        'Understand Discrete Mathematics, Linear Algebra, and Calculus.',
        'Get comfortable with the Linux terminal / Bash command line.',
      ],
    },
    {
      year: 'Year 2: Data Structures & Core CS',
      focus: 'Algorithms, Object-Oriented Design & System Architecture',
      points: [
        'Master Data Structures: Arrays, Linked Lists, Trees, Graphs, Hash Maps.',
        'Practice LeetCode / HackerRank problem solving regularly.',
        'Study Computer Organization and Operating Systems (Processes, Threads, Memory).',
        'Database Management Systems (SQL, Normalization, Indexing).',
      ],
    },
    {
      year: 'Year 3: Specialization & Full-Stack',
      focus: 'Industry Tech Stacks, Frameworks & Internships',
      points: [
        'Pick a track: Full-Stack Web Development, Cybersecurity, or Machine Learning.',
        'Build 3+ production-grade end-to-end full-stack projects.',
        'Apply for summer internships and contribute to open-source.',
        'Learn Cloud fundamentals (Docker, AWS / Vercel, CI/CD pipelines).',
      ],
    },
    {
      year: 'Year 4: Capstone & Career Placement',
      focus: 'System Design, Major Project & Job Interviews',
      points: [
        'Build a scalable, distributed Capstone Engineering Project.',
        'Prepare High-Level & Low-Level System Design (HLD / LLD).',
        'Technical Mock Interviews, Resume crafting, and portfolio polish.',
        'Secure full-time software engineering roles or higher research admissions.',
      ],
    },
  ];

  const careers = [
    {
      role: 'Full-Stack Software Engineer',
      skills: ['React / Next.js', 'Node.js / Python / Go', 'PostgreSQL / MongoDB', 'System Design'],
    },
    {
      role: 'Cybersecurity Analyst / Researcher',
      skills: ['Network Security', 'Cryptography', 'Linux & PenTesting', 'SIEM / Threat Defense'],
    },
    {
      role: 'AI / Machine Learning Engineer',
      skills: ['Python & PyTorch', 'Data Pipelines', 'Deep Learning / NLP', 'Model Deployment'],
    },
    {
      role: 'DevOps & Cloud Engineer',
      skills: ['Docker & Kubernetes', 'AWS / GCP / Azure', 'CI/CD Automation', 'Linux SysAdmin'],
    },
  ];

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      {/* Back button */}
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

      {/* Header Box */}
      <div
        style={{
          border: '2px solid var(--border-strong)',
          background: 'var(--bg-panel)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '3rem',
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--accent-signal)',
            background: 'var(--accent-tint)',
            padding: '4px 10px',
            border: '1px solid var(--accent-signal)',
            display: 'inline-block',
            marginBottom: '1rem',
          }}
        >
          Academic & Technical Roadmap
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}
        >
          BTech Computer Science Complete Roadmap
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '800px' }}>
          A curated 4-year engineering curriculum guide, recommended YouTube courses, programming milestones, and career specialization paths crafted by MD SAMIUR RAHMAN TANIM.
        </p>
      </div>

      {/* 4-Year Roadmap Cards */}
      <div style={{ marginBottom: '3.5rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            borderBottom: '2px solid var(--border-strong)',
            paddingBottom: '0.5rem',
          }}
        >
          4-Year Engineering Milestone Blueprint
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {yearRoadmaps.map((yr, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-panel)',
                border: '2px solid var(--border-strong)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-signal)', fontWeight: 700 }}>
                PHASE 0{idx + 1}
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.35rem 0 0.5rem' }}>{yr.year}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500 }}>
                {yr.focus}
              </p>
              <ul style={{ paddingLeft: '1.1rem', fontSize: '0.88rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {yr.points.map((p, pIdx) => (
                  <li key={pIdx}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended YouTube Channels */}
      <div style={{ marginBottom: '3.5rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            borderBottom: '2px solid var(--border-strong)',
            paddingBottom: '0.5rem',
          }}
        >
          Recommended Channels & Resources
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {channels.map((ch, idx) => (
            <a
              key={idx}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'var(--bg-panel)',
                border: '2px solid var(--border-strong)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Youtube size={16} color="var(--accent-signal)" />
                  <span>{ch.name}</span>
                </h4>
                <ExternalLink size={14} color="var(--text-muted)" />
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>{ch.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Career Specializations */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            borderBottom: '2px solid var(--border-strong)',
            paddingBottom: '0.5rem',
          }}
        >
          Key Career Tracks
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {careers.map((c, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-panel)',
                border: '2px solid var(--border-strong)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>{c.role}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                {c.skills.map((s, sIdx) => (
                  <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} color="var(--accent-signal)" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
