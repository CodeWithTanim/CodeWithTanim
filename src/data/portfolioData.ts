export interface Project {
  id: string;
  sheetNum: string;
  title: string;
  category: ('web' | 'python' | 'security')[];
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
    id: "cosmetics-products-management-system",
    sheetNum: "01/10",
    title: "Cosmetics Products Management System",
    category: ["web"],
    categoryLabel: "PHP / Inventory & E-Commerce",
    tagline: "PHP and MySQL-based online store for cosmetics and beauty products with inventory, order management, and PayPal payments.",
    description: "Web-based shopping and management system for cosmetics businesses. Customers can browse products, filter by category/brand, search, manage a cart, and place orders. Includes an administrator dashboard managing brands, products, inventory, orders, and sales reports.",
    image: "/Images/Projects/cpms.jpg",
    repoUrl: "https://github.com/CodeWithTanim/Cosmetics-Product-Management-System",
    liveUrl: "https://github.com/CodeWithTanim/Cosmetics-Product-Management-System/blob/main/CPMS_Project_Report.pdf",
    liveLabel: "Project Report PDF",
    tech: "MySQL • PHP 8.2 • Bootstrap • PayPal API",
    apiJsonUrl: "/API/cosmetics-products-management-system.project.json",
    challenges: [
      "Handling complex inventory variants (shades, sizes, stock levels) with atomic MySQL transactions to prevent race conditions during high-volume cart checkout.",
      "Implementing secure session management and role-based permissions in vanilla PHP without an enterprise framework.",
      "Seamless integration with PayPal Sandbox and handling asynchronous IPN (Instant Payment Notification) verification webhooks."
    ],
    improvements: [
      "Migrate backend to a modern REST API / GraphQL architecture using Node.js or Laravel.",
      "Add real-time stock alert notifications via SMS and automated email receipts.",
      "Implement an AI-powered product recommendation engine based on past customer purchasing habits."
    ]
  },
  {
    id: "cryptography-algorithms-implementation",
    sheetNum: "02/10",
    title: "Cryptography Algorithms Implementation",
    category: ["security", "python"],
    categoryLabel: "Cryptography / Security",
    tagline: "A Python internship project demonstrating AES, RSA, and hashing algorithms with examples and unit tests.",
    description: "Developed during an internship with Codec Technologies, this project provides hands-on implementations of core cryptography algorithms. It demonstrates symmetric encryption (AES), asymmetric encryption (RSA), digital signatures, and hashing through a modular Python codebase.",
    image: "/Images/Projects/Cryptography-Algorithms-Implementation.jpeg",
    repoUrl: "https://github.com/CodeWithTanim/Cryptography-Algorithms-Implementation",
    liveUrl: null,
    tech: "Python 3.8+ • AES • RSA • PyCryptodome",
    apiJsonUrl: "/API/cryptography-algorithms-implementation.project.json",
    challenges: [
      "Accurately implementing asymmetric key pair generation and padding schemes (PKCS#1 OAEP) to avoid side-channel information leakage.",
      "Benchmarking algorithmic execution time against large datasets without compromising entropy during key initialization.",
      "Creating clear, self-contained unit tests that validate cryptographic guarantees across edge cases."
    ],
    improvements: [
      "Extend support for modern post-quantum cryptography algorithms (such as Kyber and Dilithium).",
      "Build an interactive web GUI visualizer for educational demonstrations of ciphertext transformations.",
      "Package the suite into a reusable PyPI package with automated CI/CD security audits."
    ]
  },
  {
    id: "custom-ransomware-simulation",
    sheetNum: "03/10",
    title: "Custom Ransomware Simulation",
    category: ["security", "python"],
    categoryLabel: "Cybersecurity Sandbox",
    tagline: "A sandboxed Python educational simulation demonstrating ransomware-like file encryption and decryption.",
    description: "Educational cybersecurity demonstration showing reversible AES-256 file encryption and decryption concepts, key handling, and logging in a strictly isolated sandbox environment for defensive research.",
    image: "/Images/Projects/Custom-Ransomware-Simulation.jpeg",
    repoUrl: "https://github.com/CodeWithTanim/Custom-Ransomware-Simulation",
    liveUrl: null,
    liveLabel: "Live Demo",
    tech: "Python 3.8+ • AES-256 • Cryptography • Sandbox",
    apiJsonUrl: "/API/custom-ransomware-simulation.project.json",
    challenges: [
      "Ensuring strict sandbox isolation and kill-switch safeguards so cryptographic operations cannot escape the simulated directory.",
      "Implementing efficient AES-256 CTR stream encryption for large file payloads with deterministic key derivation.",
      "Designing an educational visual dashboard that demonstrates defensive detection mechanisms and entropy tracking."
    ],
    improvements: [
      "Integrate detection heuristic models based on Windows Event Logs and Sysmon traces.",
      "Add YARA rule generation capabilities based on simulated memory signatures.",
      "Provide an automated decrypter sandbox to test incident response recovery playbooks."
    ]
  },
  {
    id: "formfarm",
    sheetNum: "04/10",
    title: "FormFarm",
    category: ["web"],
    categoryLabel: "SaaS Backend Service",
    tagline: "Professional form backend service for collecting and managing form submissions without maintaining a dedicated backend for each project.",
    description: "A developer-friendly form backend service and private alternative to Formspree. Developers can point any HTML form or AJAX request to a unique endpoint to store submissions in MongoDB, send notifications, filter spam, and view submission metrics in a dashboard.",
    image: "/Images/Projects/formfarm.png",
    repoUrl: "https://github.com/CodeWithTanim/FormFarm",
    liveUrl: "http://form.codewithtanim.works/",
    liveLabel: "Live Service",
    tech: "TypeScript • Node.js • Express • MongoDB Atlas",
    apiJsonUrl: "/API/formfarm.project.json",
    challenges: [
      "Implementing reliable spam protection, rate limiting (anti-abuse token buckets), and bot filtration without degrading legitimate user submission speeds.",
      "Managing flexible JSON schema ingestion across arbitrary HTML forms while storing structured queryable records in MongoDB Atlas.",
      "Handling asynchronous email notifications via transactional SMTP without blocking HTTP response times."
    ],
    improvements: [
      "Add custom webhook triggers and Zapier/Make integrations for instant third-party workflow automation.",
      "Provide multi-tenant organization workspaces with role-based team access controls.",
      "Implement end-to-end PGP form payload encryption before persistent database storage."
    ]
  },
  {
    id: "full-stack-e-commerce",
    sheetNum: "05/10",
    title: "Premium Next.js Full-Stack E-Commerce Store",
    category: ["web"],
    categoryLabel: "Next.js 16 / Full-Stack",
    tagline: "A full-stack e-commerce platform with product catalogs, customer accounts, Stripe and COD checkout, and an admin fulfillment dashboard.",
    description: "Built as part of an internship at Codec Technologies, this e-commerce application combines a customer storefront with an admin fulfillment dashboard. Utilizes Next.js App Router, Prisma ORM, MySQL, and Stripe payments.",
    image: "/Images/Projects/ecommerce-store.png",
    repoUrl: "https://github.com/CodeWithTanim/Full-Stack-E-Commerce",
    liveUrl: null,
    liveLabel: "Live Demo",
    tech: "Next.js 16 • React 19 • Prisma • MySQL • Stripe",
    apiJsonUrl: "/API/full-stack-e-commerce.project.json",
    challenges: [
      "Coordinating complex Prisma database transactions between cart items, multi-variant inventory quantities, and Stripe webhook checkout sessions.",
      "Managing SSR (Server-Side Rendering) caching and revalidation states in Next.js App Router for dynamic stock levels.",
      "Enforcing secure HTTP-only cookie-based authentication with SameSite protections across storefront and admin portals."
    ],
    improvements: [
      "Implement a customer review and rating moderation system with verified purchase badges.",
      "Add automated order tracking notifications via WhatsApp and email transactional services.",
      "Introduce multi-currency and multi-language localization support for international customers."
    ]
  },
  {
    id: "ghost-hand",
    sheetNum: "06/10",
    title: "GHOST-HAND",
    category: ["python"],
    categoryLabel: "Python Remote Automation",
    tagline: "A modular Telegram-controlled Windows administration and automation bot with system monitoring, file transfer, and guarded remote actions.",
    description: "A Python-based remote administration tool designed to manage Windows workstations securely through a Telegram bot. Features a modular handler architecture, long polling, administrator allow-listing, system monitoring, file transfers, and power controls.",
    image: "/Images/Projects/ghost-hand.png",
    repoUrl: "https://github.com/CodeWithTanim/GHOST-HAND",
    liveUrl: "https://github.com/CodeWithTanim/GHOST-HAND/blob/main/RUN.md",
    liveLabel: "Run Guide",
    tech: "Python 3.12+ • Telegram Bot API • Windows API",
    apiJsonUrl: "/API/ghost-hand.project.json",
    challenges: [
      "Implementing robust Windows API subprocess hooks while maintaining real-time responsiveness through Telegram long-polling.",
      "Creating strict Telegram chat ID allowlisting and HMAC message validation to prevent unauthorized administrative execution.",
      "Handling large binary file streaming and screenshot uploads over constrained network connections."
    ],
    improvements: [
      "Migrate communication protocol to mutual TLS webhooks with end-to-end payload signature verification.",
      "Develop cross-platform support for Linux (systemd services) and macOS daemons.",
      "Add an interactive web-based monitoring dashboard for multiple remote nodes."
    ]
  },
  {
    id: "investflow",
    sheetNum: "07/10",
    title: "InvestFlow",
    category: ["web"],
    categoryLabel: "FinTech / Asset Management",
    tagline: "Next-Gen HYIP Investment & Asset Management Platform",
    description: "A financial investment and asset management web platform designed for investment programs, financial tracking, multi-tier referrals, automated interest distribution, two-factor authentication, and compliance workflows.",
    image: "/Images/Projects/investflow.png",
    repoUrl: "https://github.com/CodeWithTanim/InvestFlow",
    liveUrl: null,
    liveLabel: "Live Demo",
    tech: "PHP 8.2 • MySQL / MariaDB • Vanilla ES6+ • 2FA TOTP",
    apiJsonUrl: "/API/investflow.project.json",
    challenges: [
      "Designing mathematical precision logic for multi-tier referral calculations and automated compound interest distribution to avoid rounding errors.",
      "Implementing two-factor authentication (TOTP RFC 6238) and strict session invalidation upon privilege escalation.",
      "Defending financial transaction endpoints against CSRF, SQL injection, and double-spending attempts."
    ],
    improvements: [
      "Integrate cryptocurrency payment gateways (Bitcoin, USDT TRC20/ERC20) with automated blockchain confirmation listeners.",
      "Add AI-assisted fraud detection for abnormal deposit and withdrawal velocity patterns.",
      "Build native mobile companion apps using React Native."
    ]
  },
  {
    id: "online-learning-management-system",
    sheetNum: "08/10",
    title: "Online Learning Management System (LMS)",
    category: ["web"],
    categoryLabel: "Vue 3 + Django REST",
    tagline: "A full-stack learning platform with course discovery, interactive lessons, quizzes, PDF certificates, instructor tools, and admin moderation.",
    description: "Developed during an internship with Codec Technologies, this LMS combines a public course catalog and student learning player with instructor course-building tools. Features quizzes, QR-stamped PDF certificates, instructor analytics, and course moderation.",
    image: "/Images/Projects/lms-platform.png",
    repoUrl: "https://github.com/CodeWithTanim/Online-Learning-Management-System",
    liveUrl: null,
    liveLabel: "Live Demo",
    tech: "Vue 3 Composition API • Django 5.0 REST • PostgreSQL",
    apiJsonUrl: "/API/online-learning-management-system.project.json",
    challenges: [
      "Managing asynchronous communication between a Vue 3 Composition API frontend and a Django REST Framework backend with token-based authentication.",
      "Generating cryptographic QR-stamped PDF completion certificates on the fly while maintaining high server throughput.",
      "Structuring nested course curricula, interactive lesson progression, and timed quiz evaluation logic."
    ],
    improvements: [
      "Introduce live interactive video classroom sessions via WebRTC and Zoom integration.",
      "Add automated coding exercise sandboxes with Dockerized execution environments for programming courses.",
      "Implement gamification mechanics (badges, leaderboards, and streak counters)."
    ]
  },
  {
    id: "online-quiz-app",
    sheetNum: "09/10",
    title: "Online Quiz App",
    category: ["web"],
    categoryLabel: "PHP & Examination System",
    tagline: "A PHP-based online examination and quiz system with instant results, student progress tracking, and admin-managed quizzes.",
    description: "Online examination system built with PHP, MySQL, and Bootstrap. Features separate student and administrator sections with timed question sets, instant grading, test history, and competitive rankings.",
    image: "/Images/Projects/Online-Quiz-App.jpg",
    repoUrl: "https://github.com/CodeWithTanim/Online-Quiz-App",
    liveUrl: "https://github.com/CodeWithTanim/Online-Quiz-App/blob/main/Project%20Report/Project_Final_Report_Online_Quiz_App.pdf",
    liveLabel: "Project Report PDF",
    tech: "PHP • MySQL • Bootstrap • Examination Engine",
    apiJsonUrl: "/API/online-quiz-app.project.json",
    challenges: [
      "Enforcing tamper-resistant server-side timers and preventing student answer manipulation via browser inspect tools.",
      "Calculating percentile rankings and instantaneous report cards for concurrent test-takers with minimal database query overhead.",
      "Designing an intuitive administration question bank builder supporting multiple question categories and weightings."
    ],
    improvements: [
      "Add randomized question shuffling and negative marking algorithms for competitive exam simulations.",
      "Introduce AI-powered question generation from uploaded PDF textbooks or notes.",
      "Replatform the user interface with React for seamless single-page application transitions."
    ]
  },
  {
    id: "password-cracking-and-hashing-algorithms",
    sheetNum: "10/10",
    title: "Password Cracking & Hashing Algorithms",
    category: ["security", "python"],
    categoryLabel: "Security & Hash Labs",
    tagline: "A Python internship project exploring password hashing, salting, and password-cracking concepts with examples and tests.",
    description: "Developed during an internship with Codec Technologies, this project explores password hashing with and without cryptographic salts, dictionary attacks, and brute-force cracking concepts accompanied by runnable scripts and tests.",
    image: "/Images/Projects/Password-Cracking-and-Hashing-Algorithms.jpg",
    repoUrl: "https://github.com/CodeWithTanim/Password-Cracking-and-Hashing-Algorithms",
    liveUrl: null,
    liveLabel: "Live Demo",
    tech: "Python 3.8+ • Hashlib • Bcrypt • Argon2",
    apiJsonUrl: "/API/password-cracking-and-hashing-algorithms.project.json",
    challenges: [
      "Demonstrating the comparative performance costs and memory hardness between MD5/SHA-256 vs. Bcrypt and Argon2.",
      "Implementing efficient multi-threaded dictionary attacks and rule-based permutation generators in pure Python.",
      "Structuring safe educational guidelines to ensure the codebase serves exclusively defensive research purposes."
    ],
    improvements: [
      "Add GPU acceleration benchmarking via OpenCL or CUDA for high-throughput hash cracking simulations.",
      "Integrate password strength entropy estimation algorithms (zxcvbn) for live password audit reports.",
      "Build a containerized Docker lab for university cybersecurity coursework demonstrations."
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
  // {
  //   id: "edu-2",
  //   degree: "Higher Secondary Certificate (HSC / Grade 12)",
  //   field: "Science Division",
  //   institution: "Bogura Cantonment Public School & College",
  //   location: "Bogura, Bangladesh",
  //   period: "2020 – 2022",
  //   graduationYear: "2022",
  //   status: "Completed",
  //   board: "Rajshahi Education Board",
  //   grade: "GPA 4.92 / 5.00",
  //   gradeLabel: "Result",
  //   description: "Completed higher secondary education in the Science stream with high distinction in Information & Communication Technology (ICT), Mathematics, and Physics.",
  //   highlights: [
  //     "Excellence in ICT, Higher Mathematics, and Physics under the Rajshahi Board",
  //     "Cultivated deep interest in computing logic, algorithmic reasoning, and scripting foundations",
  //     "Graduated from one of the premier cantonment colleges in northern Bangladesh"
  //   ]
  // },
  // {
  //   id: "edu-3",
  //   degree: "Secondary School Certificate (SSC / Grade 10)",
  //   field: "Science Division",
  //   institution: "Bogura Zilla School",
  //   location: "Bogura, Bangladesh",
  //   period: "2018 – 2020",
  //   graduationYear: "2020",
  //   status: "Completed",
  //   board: "Rajshahi Education Board",
  //   grade: "GPA 5.00 / 5.00",
  //   gradeLabel: "Result (Golden A+)",
  //   description: "Graduated with highest academic honors (Golden A+) from the historic Bogura Zilla School, one of Bangladesh's most prestigious secondary institutions.",
  //   highlights: [
  //     "Perfect GPA 5.00 / 5.00 (Golden A+) across all science curriculum disciplines",
  //     "Strong analytical foundation in mathematics, physics, and computational thinking",
  //     "Represented school in regional science fairs and academic competitions"
  //   ]
  // }
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



