export interface Project {
  id: string;
  sheetNum: string;
  title: string;
  category: ('web' | 'python' | 'security' | 'desktop')[];
  categoryLabel: string;
  tagline: string;
  description: string;
  image: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
  liveLabel?: string;
  tech: string;
  apiJsonUrl?: string;
  challenges: string[];
  improvements: string[];
  features?: string[];
}

export interface Certificate {
  id: string;
  title: string;
  provider: 'Coursera' | 'Udemy' | 'HackerRank' | 'Internship';
  description: string;
  issueDate: string;
  image: string;
  verifyUrl: string;
  isExternalLink?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl: string;
  period: string;
  description: string;
  highlightProjects: { name: string; url: string }[];
}

export const PROFILE = {
  name: "MD SAMIUR RAHMAN TANIM",
  headline: "Full-Stack Web Developer & Software Engineer",
  statusFlag: "Available for Full-Time Software Engineering Roles",
  bio: "I am a Full-Stack Web Developer and 4th-year Computer Science & Engineering student dedicated to crafting clean, responsive web applications and reliable software systems. With hands-on internship experience spanning full-stack web engineering, Python development, and cybersecurity fundamentals, I combine intuitive user experiences with well-structured, scalable backends. Passionate about solving real-world engineering challenges, writing maintainable code, and contributing effectively to collaborative engineering teams.",
  portraitImage: "/Images/Personal/CodeWithTanim_HeroSection.jpg",
  resumePdf: "/CodeWithTanim_resume.pdf",
  email: "codewithtanim@gmail.com",
  whatsapp: "+880 1326 157012",
  whatsappUrl: "https://wa.me/8801326157012",
  phones: [
    { label: "Phone", number: "+880 1326 157012" }
  ],
  locations: "Guwahati, Assam, India | Pabna, Rajshahi, Bangladesh",
  stats: [
    { label: "Projects Completed", value: "10" },
    { label: "Industry Internships", value: "03" },
    { label: "Verified Credentials", value: "28+" },
    { label: "Academic Standing", value: "4th Year (CSE)" },
    { label: "Current Availability", value: "Open to Hire" }
  ],
  socialLinks: [
    { name: "GitHub", url: "https://github.com/CodeWithTanim", icon: "github" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/CodeWithTanim/", icon: "linkedin" },
    { name: "Facebook", url: "https://www.facebook.com/CodeWithTanim/", icon: "facebook" },
    { name: "YouTube", url: "https://www.youtube.com/@CodeWithTanim", icon: "youtube" },
    { name: "Discord", url: "https://discord.gg/5Ed5WzMbjb", icon: "discord" }
  ]
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "2 Month Web Developer Intern",
    company: "Codec Technologies India",
    companyUrl: "https://codectechnologies.in/",
    period: "July 01, 2026 – August 31, 2026",
    description: "Built full-stack web platforms including high-performance commerce and course management engines.",
    highlightProjects: [
      { name: "Full-Stack E-Commerce Store", url: "https://github.com/CodeWithTanim/Full-Stack-E-Commerce" },
      { name: "Online Learning Management System", url: "https://github.com/CodeWithTanim/Online-Learning-Management-System" }
    ]
  },
  {
    id: "exp-2",
    role: "2-Month Cyber Security Intern",
    company: "Codec Technologies India",
    companyUrl: "https://codectechnologies.in/",
    period: "July 01, 2025 – August 31, 2025",
    description: "Conducted hands-on security labs, cryptanalysis, hash cracking simulations, and ransomware sandboxing.",
    highlightProjects: [
      { name: "Cryptography-Algorithms-Implementation", url: "https://github.com/CodeWithTanim/Cryptography-Algorithms-Implementation" },
      { name: "Password-Cracking-and-Hashing-Algorithms", url: "https://github.com/CodeWithTanim/Password-Cracking-and-Hashing-Algorithms" },
      { name: "Custom-Ransomware-Simulation", url: "https://github.com/CodeWithTanim/Custom-Ransomware-Simulation" }
    ]
  },
  {
    id: "exp-3",
    role: "1-Month Python Developer Intern",
    company: "Codec Technologies India",
    companyUrl: "https://codectechnologies.in/",
    period: "June 10, 2025 – July 10, 2025",
    description: "Developed Python data analysis systems, interactive dashboards, and NLP document parsing algorithms.",
    highlightProjects: [
      { name: "Real-Time-Stock-Market-Dashboard", url: "https://github.com/CodeWithTanim/real-time-stock-market-dashboard" },
      { name: "Automated-Resume-Parser", url: "https://github.com/CodeWithTanim/automated-resume-parser" }
    ]
  }
];

export interface TechSkill {
  name: string;
  category: string;
}

export const TECH_STACK: TechSkill[] = [
  { name: "Python", category: "Language" },
  { name: "HTML/CSS", category: "Frontend" },
  { name: "JavaScript", category: "Language" },
  { name: "ReactJS", category: "Frontend" },
  { name: "NextJS", category: "Framework" },
  { name: "BetterAuth", category: "Auth & Security" },
  { name: "MongoDB", category: "Database" },
  { name: "MySQL", category: "Database" },
  { name: "PHP", category: "Backend" },
  { name: "Digital Marketing", category: "Marketing & Growth" },
  { name: "Git & GitHub", category: "Tooling" }
];

export const PROJECTS: Project[] = [
  {
    "id": "lms-platform",
    "sheetNum": "01/26",
    "title": "Online LMS Platform",
    "category": [
      "web",
      "python"
    ],
    "categoryLabel": "Vue 3 + Django",
    "tagline": "Full-stack LMS built with Vue 3 TypeScript & Pinia on frontend and Django REST Framework + PostgreSQL on backend.",
    "description": "A comprehensive Online Learning Management System featuring interactive course catalogs, student enrollment workflows, lesson progress tracking, multimedia video lectures, and instructor administrative controls.",
    "image": "/Images/Projects/lms-platform.png",
    "repoUrl": "https://github.com/CodeWithTanim/Online-Learning-Management-System",
    "liveUrl": null,
    "tech": "Vue 3 • TypeScript • Django REST • PostgreSQL",
    "challenges": [
      "Structuring modular state management with Pinia across nested course module trees.",
      "Building responsive HTML5 video and lesson players with persistent progress state sync."
    ],
    "improvements": [
      "Integrate live video classrooms via WebRTC / Zoom.",
      "Add automated quiz evaluations and downloadable PDF course completion certificates."
    ]
  },
  {
    "id": "full-stack-e-commerce",
    "sheetNum": "02/26",
    "title": "Full-Stack E-Commerce Store",
    "category": [
      "web"
    ],
    "categoryLabel": "Next.js 16 / SaaS",
    "tagline": "High-performance storefront and admin back-office panel built on Next.js 16, Prisma, MySQL, and Stripe.",
    "description": "Built during an internship at Codec Technologies, this e-commerce application combines a customer storefront with an admin fulfillment dashboard. Utilizes Next.js App Router, Prisma ORM, MySQL, and Stripe payments.",
    "image": "/Images/Projects/ecommerce-store.png",
    "repoUrl": "https://github.com/CodeWithTanim/Full-Stack-E-Commerce",
    "liveUrl": null,
    "tech": "Next.js 16 • React 19 • Prisma • MySQL • Stripe",
    "challenges": [
      "Coordinating complex Prisma database transactions between cart items, inventory levels, and Stripe webhooks.",
      "Managing SSR caching and revalidation states in Next.js App Router."
    ],
    "improvements": [
      "Add multi-currency support and real-time shipment courier tracking API."
    ]
  },
  {
    "id": "telegram-parallel",
    "sheetNum": "03/26",
    "title": "Telegram-Parallel",
    "category": [
      "desktop"
    ],
    "categoryLabel": "Electron App",
    "tagline": "Run and manage multiple Telegram accounts in one lightweight desktop application built with Electron.",
    "description": "Lightweight multi-account desktop utility built with Electron + Vite + Tailwind CSS. Allows switching between multiple active Telegram profiles seamlessly without logging out.",
    "image": "/Images/Projects/telegram-parallel.png",
    "repoUrl": "https://github.com/CodeWithTanim/Telegram-Parallel",
    "liveUrl": null,
    "tech": "Electron • Vite • Tailwind CSS • Node.js",
    "challenges": [
      "Isolating local session storage and webview partition contexts between multiple parallel accounts.",
      "Optimizing memory consumption for background idling processes."
    ],
    "improvements": [
      "Add global keyboard shortcuts for instantaneous account switching.",
      "Include custom tray minimization and badge notification counters."
    ]
  },
  {
    "id": "whatsapp-parallel",
    "sheetNum": "04/26",
    "title": "WhatsApp-Parallel",
    "category": [
      "desktop"
    ],
    "categoryLabel": "Electron App",
    "tagline": "Desktop multi-account management application built with Electron, Vite, and Tailwind CSS.",
    "description": "Allows running multiple simultaneous WhatsApp Web sessions inside isolated electron webview containers with independent cookies and notifications.",
    "image": "/Images/Projects/whatsapp-parallel.png",
    "repoUrl": "https://github.com/CodeWithTanim/WhatsApp-Parallel",
    "liveUrl": null,
    "tech": "Electron • Vite • Tailwind CSS • Webviews",
    "challenges": [
      "Managing multiple separate browser sessions and session partitions without cross-account cookie leakage.",
      "Ensuring smooth audio/video permissions inside Electron webview environments."
    ],
    "improvements": [
      "Add auto-backup of chat exports and custom notification alert sounds."
    ]
  },
  {
    "id": "ghost-hand",
    "sheetNum": "05/26",
    "title": "GHOST HAND",
    "category": [
      "python",
      "security"
    ],
    "categoryLabel": "Python Remote",
    "tagline": "Modular Windows automation system controlled remotely via Telegram Bot API for administrative tasks.",
    "description": "A professional, modular, and secure Windows automation system controlled entirely via Telegram. Perform remote file access, command execution, system monitoring, and diagnostic alerts from anywhere.",
    "image": "/Images/Projects/ghost-hand.png",
    "repoUrl": "https://github.com/CodeWithTanim/GHOST-HAND",
    "liveUrl": null,
    "tech": "Python • Telegram Bot API • Windows API • PyAutoGUI",
    "challenges": [
      "Ensuring authorized Telegram Chat ID verification and robust cryptographic command authentication.",
      "Managing stealthy, non-blocking background workers on Windows hosts."
    ],
    "improvements": [
      "Add encrypted file upload/download transfer protocols.",
      "Implement end-to-end command logging to secure remote audit logs."
    ]
  },
  {
    "id": "red-eye-lead-hunter",
    "sheetNum": "06/26",
    "title": "RED-EYE-LEAD-HUNTER",
    "category": [
      "web",
      "security"
    ],
    "categoryLabel": "Chrome Extension",
    "tagline": "High-performance Chrome extension for automated B2B lead scraping and contact harvesting from Google Maps.",
    "description": "A high-performance, dark-themed Chrome Extension (Manifest V3) for automated lead extraction from Google Maps. Scrapes business names, phone numbers, websites, emails, and ratings into downloadable CSV and XLSX tables.",
    "image": "/Images/Projects/red-eye-lead-hunter.png",
    "repoUrl": "https://github.com/CodeWithTanim/RED-EYE-LEAD-HUNTER",
    "liveUrl": null,
    "tech": "JavaScript • Manifest V3 • Web Scraping • XLSX Engine",
    "challenges": [
      "Navigating Google Maps infinite scrolling DOM virtualization without trigger rate limits.",
      "Parsing website homepages in background service workers to detect contact emails and social media handles."
    ],
    "improvements": [
      "Add direct CRM synchronization (HubSpot / Google Sheets API).",
      "Integrate phone number carrier validation and WhatsApp link generation."
    ]
  },
  {
    "id": "edutrack",
    "sheetNum": "07/26",
    "title": "EduTrack Homework Manager",
    "category": [
      "web"
    ],
    "categoryLabel": "EdTech",
    "tagline": "Homework and assignment management system for students and educational institutions.",
    "description": "A modern homework and assignment tracking web application designed to help students organize deadlines, syllabus milestones, and project submissions.",
    "image": "/Images/Projects/edutrack.png",
    "repoUrl": "https://github.com/CodeWithTanim/EduTrack",
    "liveUrl": null,
    "tech": "React • Node.js • Express • MongoDB",
    "challenges": [
      "Building intuitive calendar milestone views with real-time deadline countdown alerts.",
      "Creating multi-class scheduling support with progress bars."
    ],
    "improvements": [
      "Add mobile push notifications and Discord / Telegram webhook reminder bots."
    ]
  },
  {
    "id": "nitro-rush",
    "sheetNum": "08/26",
    "title": "Nitro-Rush Game",
    "category": [
      "web"
    ],
    "categoryLabel": "Game / JS",
    "tagline": "High-speed arcade racing game built with custom HTML5 Canvas physics engine.",
    "description": "A high-speed retro arcade racing game featuring custom pseudo-3D curve mathematics, collision detection, procedural obstacle generation, and sound synthesis.",
    "image": "/Images/Projects/nitro-rush.png",
    "repoUrl": "https://github.com/CodeWithTanim/Nitro-Rush",
    "liveUrl": null,
    "tech": "HTML5 Canvas • JavaScript • Web Audio API",
    "challenges": [
      "Implementing 60 FPS smooth rendering on Canvas without external game engines.",
      "Fine-tuning car acceleration curves, drift friction, and lane collision bounds."
    ],
    "improvements": [
      "Add multiplayer leaderboard sync via Firebase / WebSockets.",
      "Add mobile on-screen touch virtual joystick controls."
    ]
  },
  {
    "id": "formfarm",
    "sheetNum": "09/26",
    "title": "FormFarm (Formspree Clone)",
    "category": [
      "web"
    ],
    "categoryLabel": "Web SaaS",
    "tagline": "SaaS backend platform for managing form submissions easily across static websites.",
    "description": "A developer-friendly form backend service. Point any HTML form or AJAX request to a FormFarm endpoint to parse payloads, send email alerts, block spam, and review submission analytics.",
    "image": "/Images/Projects/formfarm.png",
    "repoUrl": "https://github.com/CodeWithTanim/FormFarm",
    "liveUrl": "http://form.codewithtanim.works/",
    "liveLabel": "Live Service",
    "tech": "TypeScript • Express • MongoDB Atlas • JWT",
    "challenges": [
      "Building high-throughput spam filtering and honeypot trapping without slowing response times.",
      "Managing dynamic JSON payloads in MongoDB Atlas."
    ],
    "improvements": [
      "Add Webhooks and Telegram Bot alerts for instant real-time dispatch."
    ]
  },
  {
    "id": "investflow",
    "sheetNum": "10/26",
    "title": "InvestFlow Platform",
    "category": [
      "web"
    ],
    "categoryLabel": "FinTech / Web",
    "tagline": "Investment tracking platform with real-time portfolio management and secure transactions.",
    "description": "Full-featured financial investment and portfolio tracking platform with user authentication, interest rate calculators, deposit/withdrawal ledgers, and administrative verification.",
    "image": "/Images/Projects/investflow.png",
    "repoUrl": "https://github.com/CodeWithTanim/InvestFlow",
    "liveUrl": "/payment",
    "liveLabel": "Billing Portal",
    "tech": "PHP • MySQL • Bootstrap • Chart.js",
    "challenges": [
      "Implementing secure ledger mathematics with double-entry accounting checks.",
      "Preventing SQL injection and transaction concurrency deadlocks."
    ],
    "improvements": [
      "Add cryptocurrency deposit gateways and automated yield calculation crons."
    ]
  },
  {
    "id": "ai-image-gen",
    "sheetNum": "11/26",
    "title": "Ai-Image-Generator",
    "category": [
      "web"
    ],
    "categoryLabel": "SaaS / AI",
    "tagline": "Modern SaaS platform leveraging generative AI APIs to produce high-resolution imagery based on prompts.",
    "description": "Web-based generative art studio allowing users to enter natural language descriptions, choose style filters (cyberpunk, photorealism, anime), and download AI-generated visuals.",
    "image": "/Images/Projects/ai-image-gen.png",
    "repoUrl": "https://github.com/CodeWithTanim/Ai-Image-Generator",
    "liveUrl": null,
    "tech": "React • Next.js • HuggingFace / OpenAI API • Tailwind CSS",
    "challenges": [
      "Streaming image generation progress over asynchronous polling endpoints.",
      "Handling rate-limiting and fallback model routing across different open-source AI models."
    ],
    "improvements": [
      "Add image-to-image style transfer and upscaling filters."
    ]
  },
  {
    "id": "data-splitter",
    "sheetNum": "12/26",
    "title": "Data-Splitter",
    "category": [
      "desktop",
      "python"
    ],
    "categoryLabel": "Desktop Utility",
    "tagline": "Desktop tool for splitting large TXT, XLSX, XML, and CSV datasets into manageable parts.",
    "description": "A powerful, user-friendly desktop application for splitting massive datasets into smaller chunks with customizable row limits, header preservation, and batch processing.",
    "image": "/Images/Projects/data-splitter.png",
    "repoUrl": "https://github.com/CodeWithTanim/Data-Splitter",
    "liveUrl": null,
    "tech": "Python • PyQt5 • Pandas • OpenPyXL",
    "challenges": [
      "Chunking gigabyte-sized CSV/XLSX files without running into memory allocation limits.",
      "Preserving spreadsheet formulas and metadata across divided sub-sheets."
    ],
    "improvements": [
      "Add multi-threaded parallel chunk writing for extreme speed on NVMe storage."
    ]
  },
  {
    "id": "taskflow",
    "sheetNum": "13/26",
    "title": "TaskFlow Task Manager",
    "category": [
      "web"
    ],
    "categoryLabel": "Productivity",
    "tagline": "Modern task management dashboard for productivity and workflow organization.",
    "description": "Interactive task organizer with Kanban drag-and-drop boards, priority matrix categorization, deadline tags, and browser local storage synchronization.",
    "image": "/Images/Projects/TaskFlow.jpg",
    "repoUrl": "https://github.com/CodeWithTanim/TaskFlow",
    "liveUrl": null,
    "tech": "React • Tailwind CSS • HTML5 Drag & Drop",
    "challenges": [
      "Smooth touch and pointer drag-and-drop reordering without stuttering on mobile.",
      "Designing clean responsive layout across mobile and wide ultrawide monitors."
    ],
    "improvements": [
      "Add cloud sync with Supabase and team collaboration sharing links."
    ]
  },
  {
    "id": "custom-ransomware-simulation",
    "sheetNum": "14/26",
    "title": "Custom Ransomware Simulation",
    "category": [
      "security",
      "python"
    ],
    "categoryLabel": "Cybersecurity Sandbox",
    "tagline": "A sandboxed Python educational simulation demonstrating ransomware-like file encryption and decryption.",
    "description": "Educational cybersecurity demonstration showing reversible AES-256 file encryption and decryption concepts, key handling, and logging in a strictly isolated sandbox environment for defensive research.",
    "image": "/Images/Projects/Custom-Ransomware-Simulation.jpeg",
    "repoUrl": "https://github.com/CodeWithTanim/Custom-Ransomware-Simulation",
    "liveUrl": null,
    "tech": "Python 3.8+ • AES-256 • Cryptography • Sandbox",
    "challenges": [
      "Ensuring strict sandbox isolation and kill-switch safeguards so operations never escape target folder.",
      "Implementing efficient AES-256 stream encryption."
    ],
    "improvements": [
      "Add detection heuristic models based on Sysmon event traces."
    ]
  },
  {
    "id": "password-cracking-and-hashing-algorithms",
    "sheetNum": "15/26",
    "title": "Password Cracking & Hashing Algorithms",
    "category": [
      "security",
      "python"
    ],
    "categoryLabel": "Security & Hash Labs",
    "tagline": "A Python internship project exploring password hashing, salting, and password-cracking concepts with examples and tests.",
    "description": "Developed during an internship with Codec Technologies, this project explores password hashing with and without cryptographic salts, dictionary attacks, and brute-force cracking concepts accompanied by runnable scripts and tests.",
    "image": "/Images/Projects/Password-Cracking-and-Hashing-Algorithms.jpg",
    "repoUrl": "https://github.com/CodeWithTanim/Password-Cracking-and-Hashing-Algorithms",
    "liveUrl": null,
    "tech": "Python 3.8+ • Hashlib • Bcrypt • Argon2",
    "challenges": [
      "Demonstrating performance and memory hardness between MD5/SHA-256 vs. Bcrypt and Argon2.",
      "Implementing multi-threaded dictionary attacks in pure Python."
    ],
    "improvements": [
      "Add GPU acceleration benchmarking via OpenCL or CUDA."
    ]
  },
  {
    "id": "cryptography-algorithms-implementation",
    "sheetNum": "16/26",
    "title": "Cryptography Algorithms Implementation",
    "category": [
      "security",
      "python"
    ],
    "categoryLabel": "Cryptography / Security",
    "tagline": "A Python internship project demonstrating AES, RSA, and hashing algorithms with examples and unit tests.",
    "description": "Hands-on implementations of core cryptography algorithms created during internship with Codec Technologies. Demonstrates symmetric encryption (AES), asymmetric encryption (RSA), digital signatures, and hashing.",
    "image": "/Images/Projects/Cryptography-Algorithms-Implementation.jpeg",
    "repoUrl": "https://github.com/CodeWithTanim/Cryptography-Algorithms-Implementation",
    "liveUrl": null,
    "tech": "Python 3.8+ • AES • RSA • PyCryptodome",
    "challenges": [
      "Implementing asymmetric key pair generation and padding schemes (PKCS#1 OAEP).",
      "Benchmarking algorithmic execution time against large datasets."
    ],
    "improvements": [
      "Extend support for post-quantum cryptography algorithms."
    ]
  },
  {
    "id": "automated-resume-parser",
    "sheetNum": "17/26",
    "title": "Automated Resume Parser",
    "category": [
      "python"
    ],
    "categoryLabel": "Python / NLP",
    "tagline": "NLP tool extracting skills, contact info, and education from PDF resumes into structured output.",
    "description": "An automated resume parser using Python to extract structured data (candidate name, email, phone numbers, tech skills, educational background) from PDF and DOCX files.",
    "image": "/Images/Projects/Automated-Resume-Parser.jpg",
    "repoUrl": "https://github.com/CodeWithTanim/automated-resume-parser",
    "liveUrl": null,
    "tech": "Python • spaCy • PyPDF2 • Regular Expressions • NLP",
    "challenges": [
      "Parsing multi-column resume layouts without losing text order.",
      "Training custom entity recognition for tech skill taxonomy extraction."
    ],
    "improvements": [
      "Add automated match score against candidate job descriptions."
    ]
  },
  {
    "id": "real-time-stock-market-dashboard",
    "sheetNum": "18/26",
    "title": "Real-Time Stock Market Dashboard",
    "category": [
      "python"
    ],
    "categoryLabel": "Python / Streamlit",
    "tagline": "Interactive dashboard using Python, Streamlit, and Plotly to visualize live stock prices and indicators.",
    "description": "Built during an internship at Codec Technologies, this web dashboard pulls live ticker data via Yahoo Finance API, calculating moving averages, Bollinger bands, and candlestick charts.",
    "image": "/Images/Projects/Real-Time-Stock-Market-Dashboard.jpg",
    "repoUrl": "https://github.com/CodeWithTanim/real-time-stock-market-dashboard",
    "liveUrl": null,
    "tech": "Python • Streamlit • Plotly • Yahoo Finance API",
    "challenges": [
      "Handling financial time-series resamplings and live cache invalidation.",
      "Rendering interactive responsive financial charts."
    ],
    "improvements": [
      "Add sentiment analysis of live financial news feeds."
    ]
  },
  {
    "id": "online-quiz-app",
    "sheetNum": "19/26",
    "title": "Online Quiz Application",
    "category": [
      "web"
    ],
    "categoryLabel": "Web App",
    "tagline": "Quiz platform with Firebase authentication, real-time scoring, and dynamic questions.",
    "description": "A full online quiz platform featuring timed quizzes, randomized questions, real-time score calculation, and user test histories.",
    "image": "/Images/Projects/Online-Quiz-App.jpg",
    "repoUrl": "https://github.com/CodeWithTanim/Online-Quiz-App",
    "liveUrl": "https://github.com/CodeWithTanim/Online-Quiz-App/blob/main/Project%20Report/Project_Final_Report_Online_Quiz_App.pdf",
    "liveLabel": "Project Report PDF",
    "tech": "PHP • MySQL • Bootstrap • JavaScript",
    "challenges": [
      "Tamper-resistant client-side countdown timer safeguards.",
      "Instant grading computation with concurrent test-takers."
    ],
    "improvements": [
      "Add competitive multiplayer head-to-head quiz battles."
    ]
  },
  {
    "id": "tik-tak-toe",
    "sheetNum": "20/26",
    "title": "Tic-Tac-Toe Game",
    "category": [
      "python"
    ],
    "categoryLabel": "Python Game",
    "tagline": "Terminal and GUI Tic-Tac-Toe game written in Python with AI opponent.",
    "description": "Classic Tic-Tac-Toe game implemented with a clean graphical interface and an unbeatable AI opponent driven by the Minimax decision algorithm.",
    "image": "/Images/Projects/Tik-Tak-Toe.jpg",
    "repoUrl": "https://github.com/CodeWithTanim/Tik-Tak-Toe",
    "liveUrl": null,
    "tech": "Python • Tkinter • Minimax Algorithm",
    "challenges": [
      "Implementing optimal Minimax tree recursion without noticeable move evaluation lag.",
      "Creating responsive grid graphics using Tkinter Canvas."
    ],
    "improvements": [
      "Port to web using PyScript or WebAssembly."
    ]
  },
  {
    "id": "enc",
    "sheetNum": "21/26",
    "title": "TOXIC-ENC (ENC)",
    "category": [
      "security",
      "python"
    ],
    "categoryLabel": "Security / Cryptography",
    "tagline": "Python security tool to encrypt scripts with AES-256 encryption for source protection.",
    "description": "A command-line security obfuscator and encryptor for Python developers. Protects sensitive codebases by packing logic into AES-encrypted payloads with dynamic loaders.",
    "image": "/Images/Projects/enc.jpg",
    "repoUrl": "https://github.com/CodeWithTanim/ENC",
    "liveUrl": null,
    "tech": "Python • AES-256 • AST Obfuscation • Base64",
    "challenges": [
      "Creating in-memory bytecode decryption without leaving unencrypted temporary files on disk.",
      "Preserving compatibility across multiple Python versions."
    ],
    "improvements": [
      "Add multi-stage polymorphic decryptor stubs."
    ]
  },
  {
    "id": "password-gen",
    "sheetNum": "22/26",
    "title": "Password Generator",
    "category": [
      "security"
    ],
    "categoryLabel": "Security Tool",
    "tagline": "Secure generator tool for producing strong, random passwords for digital protection.",
    "description": "Lightweight tool for generating cryptographically secure random passwords with configurable character sets (alphanumeric, symbols, custom rules).",
    "image": "/Images/Projects/password-gen.png",
    "repoUrl": "https://github.com/CodeWithTanim/Password-Generator",
    "liveUrl": null,
    "tech": "Python • Secrets Module • Cryptographic Entropy",
    "challenges": [
      "Ensuring high statistical randomness by using OS entropy pools rather than pseudorandom generators."
    ],
    "improvements": [
      "Add password strength meter with crack-time estimator."
    ]
  },
  {
    "id": "cosmetics-products-management-system",
    "sheetNum": "23/26",
    "title": "Cosmetics Product Management",
    "category": [
      "web"
    ],
    "categoryLabel": "PHP / MySQL",
    "tagline": "PHP & MySQL inventory management system for cosmetics with admin dashboard and reporting tools.",
    "description": "Web-based shopping and management system for cosmetics businesses. Customers can browse products, filter by category/brand, search, manage a cart, and place orders. Includes an admin dashboard.",
    "image": "/Images/Projects/cpms.jpg",
    "repoUrl": "https://github.com/CodeWithTanim/Cosmetics-Product-Management-System",
    "liveUrl": "https://github.com/CodeWithTanim/Cosmetics-Product-Management-System/blob/main/CPMS_Project_Report.pdf",
    "liveLabel": "Project Report PDF",
    "tech": "PHP 8.2 • MySQL • Bootstrap 5 • Apache",
    "challenges": [
      "Handling complex inventory variants with atomic MySQL transactions.",
      "Implementing secure session management in vanilla PHP."
    ],
    "improvements": [
      "Add real-time stock alert notifications via automated email."
    ]
  },
  {
    "id": "unclickable-love",
    "sheetNum": "24/26",
    "title": "Unclickable Love",
    "category": [
      "web"
    ],
    "categoryLabel": "Interactive Web",
    "tagline": "Interactive fun web project with evasive buttons and playful animations.",
    "description": "A creative web page with an evasive 'No' button that calculates cursor trajectory and relocates dynamically across the screen with smooth physics.",
    "image": "/Images/Projects/unclickable-love.png",
    "repoUrl": "https://github.com/CodeWithTanim/Unclickable-Love",
    "liveUrl": null,
    "tech": "HTML5 • CSS3 Keyframes • Vanilla JavaScript",
    "challenges": [
      "Calculating real-time mouse vector proximity and clamping button coordinates within viewport boundaries."
    ],
    "improvements": [
      "Add mobile accelerometer tilt controls."
    ]
  },
  {
    "id": "termux-setup-pro",
    "sheetNum": "25/26",
    "title": "TERMUX-SETUP-PRO",
    "category": [
      "python",
      "security"
    ],
    "categoryLabel": "CLI / Automation",
    "tagline": "Automation script to configure a full-fledged Termux development environment with packages and developer tools.",
    "description": "Automated bash toolchain configuring Android Termux with zsh, essential development compilers (Python, Node.js, C/C++, Git), and cybersecurity packages in one command.",
    "image": "/Images/Projects/termux-setup-command.jpg",
    "repoUrl": "https://github.com/CodeWithTanim/TERMUX-SETUP-PRO",
    "liveUrl": null,
    "tech": "Bash • Shell Scripting • Linux / Termux",
    "challenges": [
      "Handling Android architecture variations (aarch64, arm, x86_64) across package mirrors."
    ],
    "improvements": [
      "Add automated backup of Termux home environments to cloud storage."
    ]
  },
  {
    "id": "coming-soon",
    "sheetNum": "26/26",
    "title": "COMING SOON",
    "category": [
      "web"
    ],
    "categoryLabel": "Upcoming",
    "tagline": "Exciting new software projects currently in active development.",
    "description": "Upcoming full-stack and AI engineering projects, micro-SaaS applications, and open-source contributions scheduled for release in 2026.",
    "image": "/Images/Projects/coming-soon.png",
    "repoUrl": "https://github.com/CodeWithTanim",
    "liveUrl": "https://github.com/CodeWithTanim",
    "liveLabel": "GitHub Profile",
    "tech": "Next.js • AI Agents • Full-Stack",
    "challenges": [
      "Building multi-agent autonomous engineering pipelines with rigorous benchmarks."
    ],
    "improvements": [
      "Public beta release announcements."
    ]
  }
];

export const CERTIFICATES: Certificate[] = [
  // Coursera
  {
    id: "coursera-1",
    title: "Programming with JavaScript",
    provider: "Coursera",
    description: "Core JavaScript concepts, variables, functions, objects, and event-driven web development by Meta.",
    issueDate: "Dec 16, 2023",
    image: "/Images/Certificates/Coursera/Programming-with-JavaScript.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/MYNSX43JV3YT"
  },
  {
    id: "coursera-2",
    title: "Programming for Everybody (Python)",
    provider: "Coursera",
    description: "Python programming basics, syntax, variables, loops, and computational problem-solving.",
    issueDate: "Jan 17, 2024",
    image: "/Images/Certificates/Coursera/Programming-for-Everybody-Getting-Started-wih-Python.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/S355YLDRVJZQ"
  },
  {
    id: "coursera-3",
    title: "Qualitative Research Design",
    provider: "Coursera",
    description: "Methodologies for planning, conducting, and analyzing qualitative academic & industrial research.",
    issueDate: "Apr 10, 2024",
    image: "/Images/Certificates/Coursera/Qualitative-Research-Design.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/MRRNFVMTWNKE"
  },
  {
    id: "coursera-4",
    title: "Build a Professional Resume using Canva",
    provider: "Coursera",
    description: "Designing and structuring professional resumes using modern visual hierarchy and Canva's suite.",
    issueDate: "Apr 12, 2024",
    image: "/Images/Certificates/Coursera/Build-a-Professional-Resum-using-Canva.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/4NJA2MMN2RA7"
  },
  {
    id: "coursera-5",
    title: "English for Career Development",
    provider: "Coursera",
    description: "Professional English for international job searching, interview communication, and cross-border networking.",
    issueDate: "Apr 12, 2024",
    image: "/Images/Certificates/Coursera/English-for-Career-Development.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/F558VJA5SQQC"
  },
  {
    id: "coursera-6",
    title: "Ethics, Technology and Engineering",
    provider: "Coursera",
    description: "Ethical principles and socio-technical accountability applied to software engineering and AI systems.",
    issueDate: "May 1, 2024",
    image: "/Images/Certificates/Coursera/Ethics-Technolog-and-Engineering.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/EAZH4MZ8XRXB"
  },
  {
    id: "coursera-7",
    title: "Foundations of Cybersecurity",
    provider: "Coursera",
    description: "Google Cybersecurity Specialization covering security principles, threat models, and risk defense frameworks.",
    issueDate: "May 22, 2024",
    image: "/Images/Certificates/Coursera/Foundations-of-Cybersecurity.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/EUK9VEJUCZ32"
  },
  {
    id: "coursera-8",
    title: "Play It Safe: Manage Security Risks",
    provider: "Coursera",
    description: "Google Cybersecurity course on assessing and mitigating enterprise security risks with NIST CSF & CIS Controls.",
    issueDate: "May 22, 2024",
    image: "/Images/Certificates/Coursera/Play-It-Safe-Manage-Security-Risks.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/3EUACNSRHBDR"
  },
  {
    id: "coursera-9",
    title: "Introduction to Python for Cybersecurity",
    provider: "Coursera",
    description: "Applying Python for automated log auditing, packet inspection, IP validation, and cyber defensive tooling.",
    issueDate: "May 22, 2024",
    image: "/Images/Certificates/Coursera/Introduction-to-Python-for-Cybersecurity.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/45NHQ4ZQX3VR"
  },
  {
    id: "coursera-10",
    title: "Communication Skills for Engineering Scholars",
    provider: "Coursera",
    description: "Academic and professional communication skills tailored for engineering collaboration and technical presentations.",
    issueDate: "Oct 26, 2024",
    image: "/Images/Certificates/Coursera/Communication-skills-for-engineering-scholars.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/LMFO9KPICWW9"
  },
  {
    id: "coursera-11",
    title: "Foundations of Digital Marketing & E-commerce",
    provider: "Coursera",
    description: "Google Professional Certificate on consumer acquisition funnels, digital marketing analytics, and commerce infrastructure.",
    issueDate: "Oct 27, 2024",
    image: "/Images/Certificates/Coursera/Foundations-of-Digital-Marketing-and-E-commerce.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/3TXO600PGX3Q"
  },
  {
    id: "coursera-12",
    title: "International Leadership & Organizational Behavior",
    provider: "Coursera",
    description: "Organizational psychology, team leadership dynamics, and cross-cultural decision-making in tech teams.",
    issueDate: "Nov 3, 2024",
    image: "/Images/Certificates/Coursera/International-Leadership-and-Organizational.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/NZL6T9WFPYOW"
  },
  {
    id: "coursera-13",
    title: "Introduction to Python Programming",
    provider: "Coursera",
    description: "Advanced computational concepts, data structures, modular programming, and algorithmic problem-solving in Python.",
    issueDate: "Nov 11, 2024",
    image: "/Images/Certificates/Coursera/Introduction-to-Python-Programming.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/S69AQPBSHTJM"
  },
  {
    id: "coursera-14",
    title: "Introduction to Hardware and Operating Systems",
    provider: "Coursera",
    description: "Computer hardware architecture, memory hierarchies, BIOS/UEFI, and Linux/Windows OS core mechanics.",
    issueDate: "Mar 18, 2025",
    image: "/Images/Certificates/Coursera/Introduction-to-Hardware-an-Operating-Systems.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/YU3I61UTQ94J"
  },
  {
    id: "coursera-15",
    title: "Social Impact Strategy",
    provider: "Coursera",
    description: "Tools for designing, launching, and scaling high-impact social initiatives and sustainable technology.",
    issueDate: "May 8, 2025",
    image: "/Images/Certificates/Coursera/Social-Impact-Strateg-Tools-for-Entrepreneurs.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/QZDYMILN53DW"
  },
  {
    id: "coursera-16",
    title: "Operating Systems Fundamentals",
    provider: "Coursera",
    description: "Deep dive into process scheduling, virtual memory paging, file systems, IPC, and concurrent synchronization.",
    issueDate: "May 8, 2025",
    image: "/Images/Certificates/Coursera/Operating-Systems-Fundamentals.png",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/ON6PS23T947H"
  },

  // Udemy
  {
    id: "udemy-1",
    title: "Project Management with ChatGPT",
    provider: "Udemy",
    description: "Applying generative AI and ChatGPT for project workflows, sprint documentation, automated user stories, and scheduling.",
    issueDate: "May 30, 2024",
    image: "/Images/Certificates/Udemy/Project-Management-with-ChatGPT-Complete-Guide.jpg",
    verifyUrl: "https://www.udemy.com/certificate/UC-829fb715-f90f-4502-b433-5736b207eb88/"
  },
  {
    id: "udemy-2",
    title: "Adobe Photoshop CC Masterclass",
    provider: "Udemy",
    description: "Mastered professional photo manipulation, UI design assets, color grading, vector masks, and high-impact graphics.",
    issueDate: "May 26, 2024",
    image: "/Images/Certificates/Udemy/Ultimate-Adobe-Photoshop-CC-Masterclass-Basics-To-Advanced.jpg",
    verifyUrl: "https://www.udemy.com/certificate/UC-b2ef72db-7b55-41b8-9f40-2afd27f060c8/"
  },
  {
    id: "udemy-3",
    title: "T-Shirt Design Masterclass in Photoshop",
    provider: "Udemy",
    description: "Commercial typography, raster graphics, branding creation, and production-ready design files for digital commerce.",
    issueDate: "May 26, 2024",
    image: "/Images/Certificates/Udemy/T-Shirt-Design-Masterclass-In-Photoshop-Sell-Your-T-Shirt.jpg",
    verifyUrl: "https://www.udemy.com/certificate/UC-6e7efeda-89bf-48d8-84b0-4dc963205819/"
  },
  {
    id: "udemy-4",
    title: "Essential Photoshop Course for Beginners to Advanced",
    provider: "Udemy",
    description: "Digital design foundations, compositing techniques, non-destructive editing workflows, and export pipelines.",
    issueDate: "May 26, 2024",
    image: "/Images/Certificates/Udemy/Essential-Photoshop-Course-for-Beginne-To-Advanced.jpg",
    verifyUrl: "https://www.udemy.com/certificate/UC-697e03ac-79b2-4ab2-9447-9ce9c3448189/"
  },

  // Internships
  {
    id: "intern-1",
    title: "1-Month Python Developer Internship",
    provider: "Internship",
    description: "Official internship completion certificate from Codec Technologies India for building data and NLP tools.",
    issueDate: "July 10, 2025",
    image: "/Images/Certificates/Internship/Python_Dev_Intern.png",
    verifyUrl: "/Images/Certificates/Internship/Python_Dev_Intern.png"
  },
  {
    id: "intern-2",
    title: "2-Month Cyber Security Internship",
    provider: "Internship",
    description: "Official internship certificate for hands-on cryptographic algorithms, vulnerability testing, and defensive engineering.",
    issueDate: "August 31, 2025",
    image: "/Images/Certificates/Internship/Cyber_Security_Intern.png",
    verifyUrl: "/Images/Certificates/Internship/Cyber_Security_Intern.png"
  },
  {
    id: "intern-3",
    title: "2-Month Web Developer Internship",
    provider: "Internship",
    description: "Official internship completion certificate from Codec Technologies India (AICTE & ICAC Approved) as Web Developer Intern, building full-stack web platforms and commerce solutions.",
    issueDate: "August 31, 2026",
    image: "/Images/Certificates/Internship/Web_Dev_Intern.jpg",
    verifyUrl: "/Images/Certificates/Internship/Web_Dev_Intern.jpg"
  },

  // HackerRank
  {
    id: "hackerrank-1",
    title: "Problem Solving (Intermediate) Certificate",
    provider: "HackerRank",
    description: "Certified intermediate algorithmic problem-solving covering complex dynamic data structures, recursion, graph/tree traversals, and algorithms.",
    issueDate: "December 5, 2025",
    image: "/Images/Certificates/HackerRank/problem_solving_intermediate.jpg",
    verifyUrl: "https://www.hackerrank.com/certificates/27d319a8214d"
  },
  {
    id: "hackerrank-2",
    title: "Problem Solving (Basic) Certificate",
    provider: "HackerRank",
    description: "Assessment of foundational algorithmic problem-solving, data structure operations, array manipulations, and time-complexity optimization.",
    issueDate: "December 5, 2025",
    image: "/Images/Certificates/HackerRank/problem_solving_basic.jpg",
    verifyUrl: "https://www.hackerrank.com/certificates/c9806df21bc8"
  },
  {
    id: "hackerrank-3",
    title: "Python (Basic) Certificate",
    provider: "HackerRank",
    description: "Validates fundamental Python programming fluency, including data structures, functional paradigms, list comprehensions, and control flow.",
    issueDate: "December 5, 2025",
    image: "/Images/Certificates/HackerRank/python_basic.jpg",
    verifyUrl: "https://www.hackerrank.com/certificates/1faf4b8bd96e"
  },
  {
    id: "hackerrank-4",
    title: "Java (Basic) Certificate",
    provider: "HackerRank",
    description: "Demonstrated understanding of core Java concepts including variables, data types, OOP principles, inheritance, and standard libraries.",
    issueDate: "October 26, 2024",
    image: "/Images/Certificates/HackerRank/java_basic.jpg",
    verifyUrl: "https://www.hackerrank.com/certificates/b73207f2402e"
  },
  {
    id: "hackerrank-5",
    title: "CSS (Basic) Certificate",
    provider: "HackerRank",
    description: "Validates proficiency in CSS cascade, selectors, box model, responsive layouts, flexbox, and modern web styling properties.",
    issueDate: "October 26, 2024",
    image: "/Images/Certificates/HackerRank/css.jpg",
    verifyUrl: "https://www.hackerrank.com/certificates/6873cd8b13a6"
  }
];

export interface EducationItem {
  id: string;
  degree: string;
  field?: string;
  institution: string;
  location: string;
  period: string;
  graduationYear: string;
  status: 'Pursuing' | 'Completed';
  grade?: string;
  gradeLabel?: string;
  board?: string;
  description: string;
  highlights: string[];
}

export const EDUCATION: EducationItem[] = [
  {
    id: "edu-1",
    degree: "B.Tech in Computer Science & Engineering",
    field: "Computer Science & Engineering",
    institution: "Assam down town University",
    location: "Guwahati, Assam, India",
    period: "2023 – 2027",
    graduationYear: "2027",
    status: "Pursuing",
    grade: "4th Year Pursuing",
    gradeLabel: "Current Standing",
    description: "Four-year Bachelor of Technology degree in Computer Science & Engineering. Focused on software engineering, distributed systems, full-stack web platforms, algorithms, network security, and applied cryptography.",
    highlights: [
      "Core Curriculum: Data Structures & Algorithms, Object-Oriented Programming, Operating Systems, Database Management Systems (DBMS), Computer Networks, and Theory of Computation",
      "Applied Engineering: Full-Stack Web Architecture (Next.js, React, Node.js, PHP), Cloud Databases (MongoDB, MySQL), and Python Systems Scripting",
      "Cybersecurity & Labs: Cryptographic algorithm implementations (AES, RSA), sandboxed defensive simulations, and secure web application development",
      "Academic Standing: 4th Year Pursuing candidate actively building open-source software, leading peer coding labs, and shipping production-ready web tools"
    ]
  },
  {
    id: "edu-2",
    degree: "Higher Secondary Certificate (HSC / Grade 12)",
    field: "Science Division",
    institution: "Bogura Cantonment Public School & College",
    location: "Bogura, Bangladesh",
    period: "2020 – 2022",
    graduationYear: "2022",
    status: "Completed",
    board: "Rajshahi Education Board",
    grade: "GPA 4.92 / 5.00",
    gradeLabel: "Result",
    description: "Completed higher secondary education in the Science stream with high distinction in Information & Communication Technology (ICT), Mathematics, and Physics.",
    highlights: [
      "Excellence in ICT, Higher Mathematics, and Physics under the Rajshahi Board",
      "Cultivated deep interest in computing logic, algorithmic reasoning, and scripting foundations",
      "Graduated from one of the premier cantonment colleges in northern Bangladesh"
    ]
  },
  {
    id: "edu-3",
    degree: "Secondary School Certificate (SSC / Grade 10)",
    field: "Science Division",
    institution: "Bogura Zilla School",
    location: "Bogura, Bangladesh",
    period: "2018 – 2020",
    graduationYear: "2020",
    status: "Completed",
    board: "Rajshahi Education Board",
    grade: "GPA 5.00 / 5.00",
    gradeLabel: "Result (Golden A+)",
    description: "Graduated with highest academic honors (Golden A+) from the historic Bogura Zilla School, one of Bangladesh's most prestigious secondary institutions.",
    highlights: [
      "Perfect GPA 5.00 / 5.00 (Golden A+) across all science curriculum disciplines",
      "Strong analytical foundation in mathematics, physics, and computational thinking",
      "Represented school in regional science fairs and academic competitions"
    ]
  }
];

export const ABOUT_ME = {
  eyebrow: "Full-Stack Web Developer",
  heading: "Crafting High-Performance Web Applications & Scalable Software",
  intro: [
    "I am a Full-Stack Web Developer and 4th-year Computer Science & Engineering undergraduate focused on building fast, accessible, and production-grade applications. My core engineering strengths lie in crafting intuitive frontend interfaces with React and Next.js, backed by reliable, secure services built with Node.js, Python, PHP, and modern databases.",
    "With 3 completed industry internships and 10 software projects under my belt, I prioritize clean code structure, defensive security principles, and seamless user experiences. Driven by curiosity and discipline, I am ready to bring immediate value to collaborative engineering teams."
  ],
  focusPills: [
    "Full-Stack Web (React & Next.js)",
    "API & Backend Architecture",
    "Python Automation & Tools",
    "Database Engineering (SQL & NoSQL)"
  ],
  personalDetails: {
    nationality: "Bangladeshi",
    currentLocation: "Guwahati, Assam, India",
    hometown: "Pabna, Rajshahi, Bangladesh",
    languages: ["English (Proficient)", "Bengali (Native)", "Hindi (Fluent)"]
  }
};



