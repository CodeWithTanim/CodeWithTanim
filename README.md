# CodeWithTanim — Developer Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CSS3](https://img.shields.io/badge/Vanilla_CSS-Design_System-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

The official developer portfolio and engineering showcase of **MD Samiur Rahman Tanim** — Full-Stack Web Developer & Software Engineer. Built with **Next.js 15 (App Router)**, **TypeScript**, and a custom high-contrast editorial design system.

---

## 🌟 Overview & Highlights

- **High-Performance Architecture**: Static site generation and pre-rendered pages with Next.js 15 App Router and React 19 for instantaneous page loads.
- **Precision Design System**: Bespoke editorial aesthetic powered by custom CSS variables, robust typography tokens, and fluid layout scaling.
- **Theme Engine**: Seamless **Light Mode** (default) and **Dark Mode** toggle with instant `localStorage` persistence and zero-flicker hydration.
- **Instant Resume Access**: Single-click PDF viewing in a new tab alongside direct background download.
- **Interactive Projects Showcase**: Categorized portfolio filter (All, Web Applications, Python & Systems, Cybersecurity) with live demos and direct source code links.
- **Credential Verification Archive (`/certificates`)**: Searchable and filterable credentials vault (Coursera, Udemy, HackerRank, Internships) featuring interactive full-resolution image lightboxes and official verification URLs.
- **Responsive Navigation**: Desktop sticky header with active scroll-spy section tracking and an accessible mobile slide-out menu.

---

## 📑 Portfolio Sections

| # | Section | Description |
|---|---|---|
| **01** | **Overview** | Professional headline, availability badge, career summary, direct resume download CTA, and social channels. |
| **02** | **About Me** | Concise engineering journey, core focus pillars, spoken languages, and quick profile facts. |
| **03** | **Experience** | Chronological timeline of completed software development and security internships at Codec Technologies India. |
| **04** | **Education** | Academic background — 4th-year B.Tech in Computer Science & Engineering (2023–2027) with coursework highlights. |
| **05** | **Technical Skills** | Verified technical capabilities across Languages, Frontend, Backend, Databases, and Core Tooling. |
| **06** | **Projects** | 10 featured projects with tech badges, repository links, and live deployment previews. |
| **07** | **Certifications** | Banner preview linking to the dedicated `/certificates` route housing 28+ verified industry certifications. |
| **08** | **Contact** | Direct reach-out options including Email, WhatsApp direct messaging, and an interactive message form. |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Space Grotesk, JetBrains Mono, Syne
- **Styling**: Vanilla CSS Design Tokens (No bloated external UI frameworks)

---

## 📂 Project Structure

```text
CodeWithTanim-Portfolio/
├── public/
│   ├── Images/
│   │   ├── Certificates/       # Coursera, Udemy, and Internship certificates
│   │   ├── Personal/           # Profile portraits
│   │   └── Projects/           # High-resolution project previews
│   ├── CodeWithTanim_resume.pdf# Official downloadable CV
│   ├── robots.txt              # Search engine crawler directives
│   └── sitemap.xml             # Search engine index sitemap
├── src/
│   ├── app/
│   │   ├── certificates/
│   │   │   └── page.tsx        # Dedicated verified credentials route
│   │   ├── globals.css         # Core design tokens, theme engine & components
│   │   ├── layout.tsx          # Root layout with SEO metadata & Google fonts
│   │   ├── not-found.tsx       # Custom 404 error page
│   │   └── page.tsx            # Main single-page portfolio view
│   ├── components/
│   │   ├── AboutMe.tsx         # Story, profile details & core focus
│   │   ├── CertBanner.tsx      # Credentials teaser banner
│   │   ├── CertificatesView.tsx# Search, provider filters & modal lightbox
│   │   ├── ContactForm.tsx     # Direct contact links & message dispatch
│   │   ├── Education.tsx       # Degree and academic curriculum details
│   │   ├── Experience.tsx      # Internship timeline & deliverables
│   │   ├── Footer.tsx          # Brand identity, navigation links & copyright
│   │   ├── Hero.tsx            # Hero presentation, stats matrix & CTAs
│   │   ├── Navbar.tsx          # Sticky header, scroll-spy & theme toggle
│   │   ├── ProjectsGrid.tsx    # Filterable project showcase cards
│   │   └── TechStack.tsx       # Technical competencies grid
│   └── data/
│       └── portfolioData.ts    # Centralized typed data records
├── .gitignore
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally for development or customization:

### 1. Clone the Repository
```bash
git clone https://github.com/CodeWithTanim/CodeWithTanim-Portfolio.git
cd CodeWithTanim-Portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
To generate an optimized production bundle:
```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy

This repository is designed with clean client-side separation:
- All sensitive credentials, environment keys, and backend configs are strictly excluded from version control via `.gitignore`.
- Resume and certificate verification links point to authorized external issuers (Coursera, Udemy, HackerRank).

---

## 📬 Connect & Contact

- **Name**: MD Samiur Rahman Tanim
- **Email**: [codewithtanim@gmail.com](mailto:codewithtanim@gmail.com)
- **WhatsApp**: [+880 1326 157012](https://wa.me/8801326157012)
- **LinkedIn**: [linkedin.com/in/CodeWithTanim](https://www.linkedin.com/in/CodeWithTanim/)
- **GitHub**: [github.com/CodeWithTanim](https://github.com/CodeWithTanim)

---

*Designed and developed by **MD Samiur Rahman Tanim** · © 2026 CodeWithTanim. All rights reserved.*
