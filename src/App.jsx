import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { 
  Moon, Sun, Menu, X, Github, Linkedin, Mail, Download, 
  ExternalLink, ChevronRight, Award, GraduationCap, 
  Code2, Database, Layout, Smartphone, BookOpen, Terminal, CheckCircle2,
  Trophy, Target, Layers, Star, Cpu, Globe, Wrench, Filter
} from 'lucide-react';
import { Link } from 'react-scroll';

// New Animation Dependencies
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import paperCraftAvatar from './assets/paper_craft_avatar.png';
import Chatbot from './Chatbot';

// Booking & Admin System Components
import BookingSection from './components/BookingSection';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// --- DATA ---
const NAV_LINKS = ['Home', 'About', 'Skills', 'Projects', 'Achievements', 'Education', 'Training', 'Certificates', 'Appointment', 'Contact'];

const SKILLS = [
  // Languages
  { name: 'C', category: 'languages', color: '#00599C' },
  { name: 'C++', category: 'languages', color: '#00599C' },
  { name: 'JavaScript (ES6+)', category: 'languages', color: '#F7DF1E' },
  { name: 'TypeScript', category: 'languages', color: '#3178C6' },
  { name: 'Python', category: 'languages', color: '#3776AB' },
  { name: 'Java', category: 'languages', color: '#ED8B00' },
  // Web & Frontend
  { name: 'HTML5', category: 'web', color: '#E34F26' },
  { name: 'CSS3', category: 'web', color: '#1572B6' },
  { name: 'React.js', category: 'web', color: '#61DAFB' },
  { name: 'Next.js', category: 'web', color: '#000000' },
  { name: 'Tailwind CSS', category: 'web', color: '#06B6D4' },
  // Backend & APIs
  { name: 'Node.js', category: 'web', color: '#339933' },
  { name: 'Express.js', category: 'web', color: '#000000' },
  { name: 'RESTful APIs', category: 'web', color: '#2563EB' },
  { name: 'JWT Auth', category: 'web', color: '#D63AF9' },
  // Databases
  { name: 'MySQL', category: 'db', color: '#4479A1' },
  { name: 'PostgreSQL', category: 'db', color: '#4169E1' },
  { name: 'MongoDB', category: 'db', color: '#47A248' },
  { name: 'Firebase', category: 'db', color: '#FFCA28' },
  { name: 'Supabase', category: 'db', color: '#3ECF8E' },
  // Tools & Platforms
  { name: 'Git', category: 'tools', color: '#F05032' },
  { name: 'GitHub', category: 'tools', color: '#181717' },
  { name: 'VS Code', category: 'tools', color: '#007ACC' },
  { name: 'Android Studio', category: 'tools', color: '#3DDC84' },
  { name: 'Postman', category: 'tools', color: '#FF6C37' },
  { name: 'Cloudinary', category: 'tools', color: '#3448C5' },
  // Core Concepts
  { name: 'DSA', category: 'core', color: '#2563EB' },
  { name: 'OOP', category: 'core', color: '#16A34A' },
  { name: 'Computer Networks', category: 'core', color: '#0284C7' },
  { name: 'Operating Systems', category: 'core', color: '#9333EA' },
];

const EXPERTISE_LEVELS = [
  { name: 'React.js & Next.js Frontend', level: 92 },
  { name: 'Node.js & Express API Architectures', level: 88 },
  { name: 'Flutter & Mobile App Development', level: 88 },
  { name: 'Multi-Agent AI Engineering (LangGraph & Gemini)', level: 85 },
  { name: 'Data Structures & Algorithmic Optimization', level: 90 },
  { name: 'SQL & NoSQL Database Design (MongoDB/PostgreSQL)', level: 86 }
];

const PROJECTS = [
  {
    id: 1,
    title: 'SplitLedge – Full-Stack Group Expense Platform',
    subtitle: 'O(N log N) Greedy Debt Simplification Algorithm with Min/Max Heaps',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Recharts'],
    features: [
      'Engineered a production-grade shared-expense ledger using an O(N log N) greedy debt-simplification algorithm with Min/Max heaps to minimize peer-to-peer settlement transactions.',
      'Built a CSV data-import engine with a 20+ rule anomaly-detection pipeline (duplicate entries, currency mismatches, temporal exclusions) to ensure data integrity.',
      'Designed a responsive glassmorphic & neomorphic UI with real-time credit/debt visualizations using Recharts, improving financial transparency.'
    ],
    demoLink: 'https://github.com/Aditya1787',
    githubLink: 'https://github.com/Aditya1787',
    icon: <Layers />,
    badge: 'Min/Max Heap Algorithm'
  },
  {
    id: 2,
    title: 'Intvester – AI Equity Research Terminal',
    subtitle: 'Orchestrated 6 Specialized AI Agents on LangGraph for Financial Intelligence',
    tech: ['Next.js', 'React (TypeScript)', 'LangChain', 'LangGraph', 'Gemini & Groq APIs', 'Recharts'],
    features: [
      'Architected a multi-agent AI research pipeline on LangGraph, orchestrating six specialized agents to generate automated, data-backed investment verdicts.',
      'Developed a technical-indicator engine computing RSI, MACD, EMA crossovers, and Bollinger Bands, plus a multi-ticker stock comparison hub.',
      'Enabled multi-page PDF report exports, democratizing institutional-grade financial intelligence for retail investors.'
    ],
    demoLink: 'https://github.com/Aditya1787',
    githubLink: 'https://github.com/Aditya1787',
    icon: <Cpu />,
    badge: 'LangGraph & 6 AI Agents'
  },
  {
    id: 3,
    title: 'DevTrackr – AI Telemetry Analytics Console',
    subtitle: 'GitHub Telemetry Aggregator & Generative AI Diagnostics Engine',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'GitHub API (Octokit)', 'Gemini API', 'Node-Cron'],
    features: [
      'Built a full-stack analytics console aggregating GitHub telemetry into a weighted Developer Productivity Score (0-100) to surface delivery bottlenecks.',
      'Integrated Google Gemini API for generative AI diagnostics, sprint-pacing analysis, and workload reports; optimized MongoDB writes via bulkWrite, cutting write latency by 90%+.',
      'Automated data synchronization and inactivity detection using Node-Cron job scheduling, supporting fair workload distribution.'
    ],
    demoLink: 'https://github.com/Aditya1787',
    githubLink: 'https://github.com/Aditya1787',
    icon: <Terminal />,
    badge: 'Gemini AI & bulkWrite 90%+'
  },
  {
    id: 4,
    title: 'Jibble – College Circle Social Media App',
    subtitle: 'Secure College-Exclusive Campus Networking Platform',
    tech: ['Flutter', 'Dart', 'Supabase (PostgreSQL, Realtime, Auth)', 'Cloudinary CDN'],
    features: [
      'Developed a secure, college-exclusive social media platform for campus networking and collaboration.',
      'Integrated Cloudinary CDN for optimized image and media storage.',
      'Implemented user authentication, role-based access control, and real-time database management.'
    ],
    demoLink: 'https://github.com/Aditya1787',
    githubLink: 'https://github.com/Aditya1787',
    icon: <Smartphone />,
    badge: 'Supabase Realtime & Auth'
  },
  {
    id: 5,
    title: 'SmartFolio – Wealth & Portfolio Dashboard',
    subtitle: 'Centralized Stock, Mutual Fund & Cash Management Hub',
    tech: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB'],
    features: [
      'Developed a centralized financial dashboard consolidating stocks, mutual funds, and cash holdings into a single intuitive interface.',
      'Built a fast, component-based frontend with dynamic portfolio asset distribution charts.'
    ],
    demoLink: 'http://smartfolio-nine.vercel.app/',
    githubLink: 'https://github.com/Aditya1787',
    icon: <Layout />,
    badge: 'Live on Vercel'
  },
  {
    id: 6,
    title: 'Code2 Placement – Interview & Placement Mastery Platform',
    subtitle: 'Comprehensive Placement Preparation & Interview Portal',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    features: [
      'Engineered a comprehensive placement preparation platform helping engineering students master coding skills and technical interviews.',
      'Implemented curated coding problem roadmaps, user authentication, progress tracking, and interactive practice modules.',
      'Built a fast component-based React interface connected to Node.js/Express backend APIs.'
    ],
    demoLink: 'https://code2-placement-uvrp.vercel.app/',
    githubLink: 'https://github.com/Aditya1787',
    icon: <Code2 />,
    badge: 'Live Platform'
  }
];

const ACHIEVEMENTS = [
  { label: 'DSA Problems Solved', value: 600, suffix: '+', icon: <Target size={32} />, desc: 'Across LeetCode & GeeksforGeeks', color: '#2563eb' },
  { label: 'LeetCode Rating', value: 1481, suffix: '', icon: <Star size={32} />, desc: 'Consistent competitive programmer', color: '#eab308' },
  { label: 'SAP Hackfest Qualifier', value: 1, suffix: 'st', icon: <Trophy size={32} />, desc: 'State-Level Round for software innovation', color: '#16a34a' },
  { label: 'Production Apps', value: 5, suffix: '+', icon: <Layers size={32} />, desc: 'AI Terminals, FinTech & Telemetry Consoles', color: '#06b6d4' },
];

const PLATFORMS = [
  {
    name: 'LeetCode',
    handle: '@adityakm8787',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.08)',
    border: 'rgba(234,179,8,0.25)',
    emoji: '🟡',
    stats: [
      { label: 'Problems Solved', value: '350+' },
      { label: 'Max Rating', value: '1481' },
      { label: 'Contest Rank', value: 'Knight' },
    ],
    link: 'https://leetcode.com/u/adityakm8787/'
  },
  {
    name: 'GeeksForGeeks',
    handle: '@adityam8787',
    color: '#16a34a',
    bg: 'rgba(22,163,74,0.08)',
    border: 'rgba(22,163,74,0.25)',
    emoji: '🟢',
    stats: [
      { label: 'Problems Solved', value: '250+' },
      { label: 'Score', value: '900+' },
      { label: 'Institute Rank', value: 'Top 10%' },
    ],
    link: 'https://www.geeksforgeeks.org/user/adityam8787/'
  },
];

const TICKER_ITEMS = [
  '🏆 LeetCode Rating: 1481 (Knight)',
  '⚡ 600+ DSA Problems Solved across LeetCode & GFG',
  '🥇 Selected for SAP Hackfest State-Level Round',
  '🚀 5+ Full-Stack Production Projects Built',
  '🤖 Multi-Agent AI Architecture with LangGraph & Gemini',
  '🎓 Oracle OCI 2025 AI Foundations Certified',
  '📱 Production-Grade Web & Flutter Developer',
];

const CERTS = [
  {
    id: 1,
    title: 'OCI 2025 Certified AI Foundations Associate',
    issuer: 'Oracle University',
    period: '2025',
    hours: 'Oracle Certified Associate Credentials in Artificial Intelligence & Generative Models',
    color: '#ea580c',
    tag: 'AI & Cloud',
    link: 'https://education.oracle.com/'
  },
  {
    id: 2,
    title: 'Oracle Data Platform 2025 Certified Foundations Associate',
    issuer: 'Oracle University',
    period: '2025',
    hours: 'Oracle Certified Associate Credentials in Enterprise Data Management & Analytics',
    color: '#2563eb',
    tag: 'Data Engineering',
    link: 'https://education.oracle.com/'
  },
  {
    id: 3,
    title: 'Cloud Computing',
    issuer: 'NPTEL',
    period: '2024',
    hours: 'National Programme on Technology Enhanced Learning Verified Credential',
    color: '#06b6d4',
    tag: 'Cloud Systems',
    link: 'https://nptel.ac.in/'
  },
  {
    id: 4,
    title: 'Data Structures & Algorithms',
    issuer: 'NPTEL / Neo Colab',
    period: '2024',
    hours: 'Core Computer Science Algorithmic Efficiency & Data Structures Mastery',
    color: '#16a34a',
    tag: 'Algorithms & DSA',
    link: '#'
  },
  {
    id: 5,
    title: 'Master Generative AI & Generative AI Tools',
    issuer: 'Udemy',
    period: '2025',
    hours: 'Generative AI Engineering, ChatGPT, Prompt Design & LLM Tool Integrations',
    color: '#9333ea',
    tag: 'Generative AI',
    link: 'https://udemy.com'
  },
  {
    id: 6,
    title: 'Full Stack Development In React and Node',
    issuer: 'Meta',
    period: '2025',
    hours: 'Full Stack Web Development, REST APIs, Database Design & Cloud Deployment',
    color: '#ea33e1ff',
    tag: 'Full Stack',
    link: 'https://udemy.com'
  }
];

const EDUCATION = [
  {
    school: 'Lovely Professional University',
    location: 'Phagwara, Punjab, India',
    degree: 'Bachelor of Technology (B.Tech) - Computer Science & Engineering',
    score: 'Grade: Pursuing B.Tech CSE',
    period: 'Aug 2023 - Present'
  },
  {
    school: 'S J Vidya Niketan Inter College',
    location: 'Kanpur, Uttar Pradesh, India',
    degree: 'Intermediate (Class XII)',
    score: 'Percentage: 78%',
    period: 'Apr 2021 - Feb 2022'
  },
  {
    school: 'S J Vidya Niketan Inter College',
    location: 'Kanpur, Uttar Pradesh, India',
    degree: 'Highschool / Matriculation (Class X)',
    score: 'Percentage: 87%',
    period: 'Apr 2019 - Feb 2020'
  }
];

const TRAINING = [
  {
    title: 'Full Stack Development Trainee (React.js & Node.js)',
    period: 'May 2025 - July 2025',
    details: [
      'Completed hands-on training in end-to-end web application development: HTML5, CSS3, JavaScript (ES6+), React.js, Node.js, Express.js, RESTful APIs, MySQL, MongoDB, Git/GitHub, and responsive design.',
      'Built reusable React components and scalable Express.js backends with CRUD operations, API integration, and database connectivity, following industry-standard software development practices.'
    ]
  }
];

// --- OFFICIAL SKILL LOGOS MAP ---
const SKILL_LOGOS = {
  'C': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'JavaScript (ES6+)': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'HTML5': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'CSS3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'React.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'Express.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'RESTful APIs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'JWT Auth': 'https://jwt.io/img/pic_logo.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
  'Flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  'Dart': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'VS Code': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  'Android Studio': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg',
  'Postman': 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg',
  'Cloudinary': 'https://res.cloudinary.com/cloudinary/image/upload/new_cloudinary_logo_square.png'
};

const CERTIFICATES = [
  { title: 'Full Stack Web Development', period: 'May\' 25 - Jul\' 25' },
  { title: 'Flutter App Development', period: 'Aug\' 25 - Oct\' 25' }
];

// --- SKILL ICON MAP ---
const SKILL_ICONS = {
  'C': '💻', 'C++': '⚡', 'JavaScript (ES6+)': '🟨', 'TypeScript': '📘', 'Python': '🐍', 'Java': '☕',
  'HTML5': '🔷', 'CSS3': '🎨', 'React.js': '⚛️', 'Next.js': '▲', 'Tailwind CSS': '💨',
  'Node.js': '🟩', 'Express.js': '🚀', 'RESTful APIs': '🔌', 'JWT Auth': '🔑',
  'MySQL': '🗄️', 'PostgreSQL': '🐘', 'MongoDB': '🍃', 'Firebase': '🔥', 'Supabase': '🟢',
  'Git': '🔀', 'GitHub': '🐙', 'VS Code': '📝', 'Android Studio': '📱', 'Postman': '📮', 'Cloudinary': '☁️',
  'DSA': '🧠', 'OOP': '🏗️', 'Computer Networks': '🌐', 'Operating Systems': '💻'
};

const SKILL_CATEGORIES = [
  { key: 'all', label: 'All Skills' },
  { key: 'languages', label: 'Languages' },
  { key: 'web', label: 'Web & APIs' },
  { key: 'db', label: 'Databases' },
  { key: 'tools', label: 'Tools & DevOps' },
  { key: 'core', label: 'Core CS' },
];

const InteractiveSkillsGrid = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = activeCategory === 'all'
    ? SKILLS
    : SKILLS.filter(s => s.category === activeCategory);

  return (
    <div className="skills-interactive-section">
      {/* Category Filter Tabs */}
      <motion.div 
        className="skills-filter-tabs"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {SKILL_CATEGORIES.map((cat) => (
          <motion.button
            key={cat.key}
            className={`skill-filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Skills Grid with Liquid Morph Chips */}
      <motion.div className="skills-cards-grid" layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="liquid-skill-chip"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              whileHover={{ scale: 1.06, y: -4 }}
            >
              <div style={{ width: '28px', height: '28px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {SKILL_LOGOS[skill.name] ? (
                  <img src={SKILL_LOGOS[skill.name]} alt={skill.name} style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
                ) : (
                  <Code2 size={24} style={{ color: skill.color }} />
                )}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {skill.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {skill.category}
                </div>
              </div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: skill.color, flexShrink: 0 }} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// --- ANIMATION VARIANTS (ON SCROLL) ---
const slideLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideUp = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// --- CUSTOM ANIMATION COMPONENTS ---
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.closest('a') || 
        e.target.closest('button') || 
        e.target.closest('.social-toggle') || 
        e.target.closest('.project-card') ||
        e.target.closest('.navbar-link') ||
        e.target.tagName.toLowerCase() === 'input' ||
        e.target.tagName.toLowerCase() === 'textarea' ||
        e.target.closest('.theme-toggle')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="cursor-dot"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
      <motion.div
        className="cursor-outline"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(99, 102, 241, 0.15)" : "transparent",
          borderColor: isHovering ? "rgba(99, 102, 241, 0.8)" : "rgba(168, 85, 247, 0.5)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
      />
    </>
  );
};

const TypewriterText = ({ sequence }) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let currentText = sequence[index];
    let charIndex = 0;
    let isDeleting = false;
    let timer;

    const type = () => {
      if (!isDeleting) {
        setText(currentText.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentText.length) {
          isDeleting = true;
          timer = setTimeout(type, 2000); // pause at end
        } else {
          timer = setTimeout(type, 80);
        }
      } else {
        setText(currentText.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          setIndex((prev) => (prev + 1) % sequence.length);
          timer = setTimeout(type, 500);
        } else {
          timer = setTimeout(type, 40);
        }
      }
    };
    
    timer = setTimeout(type, 100);
    return () => clearTimeout(timer);
  }, [index, sequence]);

  return <>{text}<span className="typing-cursor">_</span></>;
};

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / value));
        
        const timer = setInterval(() => {
          start += Math.ceil(value / 50);
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, stepTime);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}</span>;
};


// --- CERTIFICATE LIGHTBOX COMPONENT ---
const CertificateLightbox = ({ cert, certs, onClose, onNav }) => {
  const currentIdx = certs.findIndex(c => c.id === cert.id);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onNav]);

  return (
    <motion.div
      className="cert-lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="cert-lightbox-box"
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="cert-lb-close" onClick={onClose}><X size={22}/></button>

        {/* Image */}
        <img src={cert.image} alt={cert.title} className="cert-lb-img" />

        {/* Info bar */}
        <div className="cert-lb-info">
          <div>
            <div className="cert-lb-title">{cert.title}</div>
            <div className="cert-lb-meta">{cert.issuer} · {cert.period}</div>
          </div>
          <div className="cert-lb-counter">{currentIdx + 1} / {certs.length}</div>
        </div>

        {/* Nav arrows */}
        <button className="cert-lb-nav cert-lb-prev" onClick={() => onNav(-1)}>&#8249;</button>
        <button className="cert-lb-nav cert-lb-next" onClick={() => onNav(1)}>&#8250;</button>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [authUser, setAuthUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [particlesInit, setParticlesInit] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Unauthenticated');
      })
      .then(data => setAuthUser(data.user))
      .catch(() => setAuthUser(null))
      .finally(() => setCheckingAuth(false));

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLoginSuccess = (user) => {
    setAuthUser(user);
    window.history.pushState({}, '', '/admin/dashboard');
    setCurrentPath('/admin/dashboard');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setAuthUser(null);
    window.history.pushState({}, '', '/admin/login');
    setCurrentPath('/admin/login');
  };

  if (currentPath === '/admin/login') {
    if (authUser) {
      return <><CustomCursor /><AdminDashboard currentUser={authUser} onLogout={handleLogout} /></>;
    }
    return <><CustomCursor /><AdminLogin onLoginSuccess={handleLoginSuccess} /></>;
  }

  if (currentPath === '/admin/dashboard') {
    if (checkingAuth) {
      return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spin" style={{ width: '32px', height: '32px', border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      );
    }
    if (!authUser) {
      return <><CustomCursor /><AdminLogin onLoginSuccess={handleLoginSuccess} /></>;
    }
    return <><CustomCursor /><AdminDashboard currentUser={authUser} onLogout={handleLogout} /></>;
  }

  const handleCertNav = (dir) => {
    const idx = CERTS.findIndex(c => c.id === selectedCert.id);
    const next = CERTS[(idx + dir + CERTS.length) % CERTS.length];
    setSelectedCert(next);
  };
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Parallax effects
  const profileY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Init Particles background
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  const particlesOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 120,
    interactivity: { events: { onHover: { enable: true, mode: "repulse" } }, modes: { repulse: { distance: 100, duration: 0.4 } } },
    particles: {
      color: { value: theme === 'dark' ? "#6366f1" : "#0f172a" },
      links: { color: theme === 'dark' ? "#6366f1" : "#0f172a", distance: 150, enable: true, opacity: 0.15, width: 1 },
      move: { enable: true, random: false, speed: 1.2, straight: false },
      number: { density: { enable: true, area: 800 }, value: 40 },
      opacity: { value: 0.2 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } }
    },
    detectRetina: true
  };

  return (
    <>
      <CustomCursor />
      {/* Certificate Lightbox */}
      <AnimatePresence>
        {selectedCert && (
          <CertificateLightbox
            cert={selectedCert}
            certs={CERTS}
            onClose={() => setSelectedCert(null)}
            onNav={handleCertNav}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Ambient Background Lighting Layer */}
      <div className="ambient-lighting-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
        <div className="ambient-orb ambient-orb-4" />
      </div>
      <div className="cursor-ambient-spotlight" />

      {/* Background Particles layer */}
      {particlesInit && <Particles id="tsparticles" options={particlesOptions} className="particles-container" />}

      {/* Top Scroll Progress Bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%', backgroundColor: 'var(--accent-primary)', height: '4px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001 }}
      />

      {/* Navbar with active layout animations */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="home" smooth={true} className="navbar-logo">AKAYM</Link>
          
          <ul className="navbar-links">
            {NAV_LINKS.map(link => (
              <li key={link} style={{ position: 'relative' }}>
                <Link 
                  to={link.toLowerCase()} 
                  spy={true} 
                  smooth={true} 
                  offset={0} 
                  duration={500} 
                  className={`navbar-link ${activeSection === link ? 'active' : ''}`}
                  onSetActive={() => setActiveSection(link)}
                >
                  {link}
                  {activeSection === link && (
                    <motion.div layoutId="nav-active" className="nav-active-bg" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mobile-menu"
            >
              {NAV_LINKS.map(link => (
                <Link 
                  key={link} to={link.toLowerCase()} spy={true} smooth={true} offset={0} duration={500}
                  className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}
                >
                  {link}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 5. Typing Text Animation & 8. Image Parallax in Hero */}
      {/* Hero Section with Neomorphism Fluid Organic Profile Frame */}
      <section id="home" className="hero">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        
        <div className="container">
          <div className="hero-content-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px', flexWrap: 'wrap' }}>
            <motion.div className="hero-content" style={{ textAlign: 'left', alignItems: 'flex-start', flex: '1 1 500px', maxWidth: '650px' }} initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={slideLeft} className="neo-pill-widget" style={{ marginBottom: '24px' }}>
                <div className="dot" style={{ width: '10px', height: '10px', background: 'var(--accent-green)', borderRadius: '50%' }}></div> Available for Opportunities
              </motion.div>
              
              <motion.h1 variants={slideLeft} className="hero-name">
                Hi, I'm <span className="hero-name-gradient">Aditya Kumar Mishra</span>
              </motion.h1>
              
              <motion.h2 variants={slideLeft} className="hero-title" style={{ textAlign: 'left' }}>
                &gt; <span className="hero-name-gradient">
                  <TypewriterText sequence={[
                    'Full Stack Developer',
                    'Flutter App Developer',
                    'Problem Solver'
                  ]} />
                </span>
              </motion.h2>
              
              <motion.p variants={slideLeft} className="hero-description" style={{ textAlign: 'left' }}>
                Building scalable web applications and robust mobile experiences with a touch of art and engineering.
              </motion.p>
              
              <motion.div variants={slideLeft} className="hero-actions" style={{ justifyContent: 'flex-start' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="contact" smooth={true} offset={-70} duration={500} className="btn btn-primary">
                    Contact Me <ChevronRight size={18} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a href="https://drive.google.com/file/d/1DlVc30ojFuMN7Hx2fjnZtMZhZfUY-51w/view?usp=sharing" className="btn btn-outline" target="_blank" rel="noreferrer">
                    <Download size={18} /> Download Resume
                  </a>
                </motion.div>
              </motion.div>
              
              <motion.div variants={slideLeft} className="hero-stats" style={{ justifyContent: 'flex-start' }}>
                {[ 
                  { icon: <Github size={22}/>, link: "https://github.com/Aditya1787", color: "var(--text-primary)" }, 
                  { icon: <Linkedin size={22}/>, link: "https://www.linkedin.com/in/adityakumishra/", color: "#0a66c2" }, 
                  { icon: <Mail size={22}/>, link: "mailto:adityam8787@gmail.com", color: "#ef4444" }
                ].map((item, i) => (
                  <motion.a 
                    key={i} href={item.link} target="_blank" rel="noreferrer" className="neo-dock-icon"
                    whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column: Paper Craft Sticker Profile Cutout Frame */}
            <motion.div 
              className="hero-image-col"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: 'relative', flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Floating Weather/Status Pill Widget above profile frame */}
              <motion.div 
                className="neo-pill-widget"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ position: 'absolute', top: '-20px', right: '-10px', zIndex: 10, background: '#ffffff', fontSize: '13px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
              >
                <span>☀️ 28°</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>Active Engineer</span>
              </motion.div>

              {/* Paper Craft Sticker Cutout Container */}
              <div className="paper-cut-frame">
                <img src={paperCraftAvatar} alt="Aditya Kumar Mishra" className="paper-cut-img" />
                <div className="neo-star-badge" title="Developer Craft Avatar" style={{ background: '#ffffff' }}>⭐</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Section Slide Animation: About (slide left) */}
      <section id="about" className="section">
        <div className="container">
          <div className="about-grid" style={{ alignItems: 'center' }}>
            {/* Left Column: Text & Cards */}
            <motion.div className="about-content" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              <div style={{ textAlign: 'left' }}>
                <motion.div variants={slideLeft} className="section-badge" style={{ marginBottom: '16px' }}>
                  <Terminal size={16}/> Who am I?
                </motion.div>
                <motion.h2 variants={slideLeft} className="section-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '20px', textAlign: 'left' }}>
                  About Me
                </motion.h2>
              </div>

              <motion.div className="about-text" variants={slideLeft} style={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: '600', lineHeight: '1.8', marginBottom: '16px' }}>
                  I am <span style={{ color: 'var(--accent-primary)', fontWeight: '800' }}>Aditya Kumar Mishra</span>, a passionate Full Stack & Mobile Systems Engineer pursuing B.Tech in Computer Science & Engineering at Lovely Professional University.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.8', marginBottom: '24px' }}>
                  I architect end-to-end digital solutions—ranging from **multi-agent AI equity terminals** on LangGraph to **O(N log N) algorithmic debt simplification ledgers** and **developer telemetry analytics consoles**.
                </p>
                
                <div className="about-highlights" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '24px' }}>
                  {[
                    { title: '⚡ Algorithmic Thinking', desc: '600+ DSA & 1481 LeetCode' },
                    { title: '🤖 Multi-Agent AI', desc: 'LangGraph & Gemini APIs' },
                    { title: '🚀 Full Stack & APIs', desc: 'MERN & Next.js Systems' },
                    { title: '📱 Mobile Systems', desc: 'Flutter & Supabase Auth' }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="liquid-skill-chip" 
                      style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '14px 18px', gap: '4px' }}
                      whileHover={{ scale: 1.05, y: -4 }}
                    >
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '600' }}>{item.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="about-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }} variants={slideUp}>
                {[
                  { title: 'Full Stack Engineering', desc: 'Building high-performance web systems using React.js, Next.js, Node.js, Express, MongoDB, and RESTful APIs.' },
                  { title: 'Multi-Agent AI Systems', desc: 'Orchestrating specialized LLM agents with LangChain, LangGraph, and generative diagnostic engines.' },
                  { title: 'Cross-Platform Mobile', desc: 'Engineering fast mobile applications with Flutter, Supabase Realtime, and Cloudinary CDN.' }
                ].map((card, i) => (
                  <motion.div key={i} className="liquid-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-primary)' }} whileHover={{ y: -6, scale: 1.02 }}>
                    <h4 style={{ marginBottom: '8px', color: 'var(--accent-primary)', fontSize: '1.05rem', fontWeight: '700' }}>{card.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{card.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column: Neomorphic Widget Stack & Van Gogh Art Card */}
            <motion.div className="about-image-wrapper" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
              
              {/* Focus Mode Neomorphic Widget */}
              <div className="neo-widget-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>⭐</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Focus Mode</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Do not disturb · Active Coding</div>
                  </div>
                </div>
                <div className="neo-pill-widget" style={{ padding: '6px 14px', background: 'var(--accent-primary)', color: 'white', cursor: 'pointer', fontSize: '12px' }}>
                  Active ⚡
                </div>
              </div>

              {/* Coding Energy Circular Widget */}
              <div className="neo-widget-box" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-primary)', boxShadow: 'var(--neo-in)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>88%</span>
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Full Stack & DSA Battery</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>High problem-solving capacity & continuous learning streak</div>
                </div>
              </div>

              {/* Van Gogh Quote Widget */}
              <div className="van-gogh-quote">
                <div className="van-gogh-quote-icon">“</div>
                <div>
                  <div style={{ fontSize: '0.92rem', lineHeight: '1.5', fontWeight: '500' }}>
                    I dream of painting and then I paint my dream.
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '6px', fontWeight: '700' }}>
                    — Vincent van Gogh
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Section Slide Animation: Skills (slide right) */}
      <section id="skills" className="section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight}>
            <div className="section-badge"><Code2 size={16}/> Technical Arsenal</div>
            <h2 className="section-title">My Skills</h2>
          </motion.div>

          <div className="skills-wrapper">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <InteractiveSkillsGrid />
            </motion.div>

            {/* Full Stack Engineering Mastery Dashboard */}
            <motion.div 
              className="liquid-card" style={{ padding: '36px', marginTop: '32px' }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                    <Code2 size={26} style={{ color: 'var(--accent-primary)' }} /> Full-Stack Engineering Dashboard
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Production system capabilities, architectural proficiencies & algorithmic performance metrics
                  </div>
                </div>

                <div className="neo-pill-widget" style={{ padding: '6px 16px', background: 'var(--accent-secondary)', color: '#ffffff', fontWeight: '700', fontSize: '12px' }}>
                  ⚡ Production Ready Engineer
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {EXPERTISE_LEVELS.map((skill, index) => (
                  <motion.div 
                    key={index} 
                    className="neo-inset-box" 
                    style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    variants={slideUp}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.98rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={18} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
                          {skill.name}
                        </span>
                        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent-primary)', flexShrink: 0 }}>
                          {skill.level}%
                        </span>
                      </div>

                      <div className="progress-track" style={{ height: '10px', background: '#cbd5e1', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                        <motion.div 
                          className="progress-fill" 
                          style={{ height: '100%', background: 'var(--gradient-1)', borderRadius: '10px' }}
                          initial={{ width: 0 }} 
                          whileInView={{ width: `${skill.level}%` }} 
                          viewport={{ once: true }} 
                          transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }} 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      <span>Production Capability: Verified</span>
                      <span>High Efficiency</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
            <div className="section-badge"><Layout size={16}/> CV Projects Portfolio</div>
            <h2 className="section-title">Featured Engineering Projects</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
              Production-grade applications featuring algorithmic debt simplification, multi-agent AI pipelines, and telemetry analytics consoles.
            </p>
          </motion.div>

          <motion.div className="projects-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
            {PROJECTS.map((project) => (
              <motion.div 
                key={project.id} 
                variants={slideUp} 
                className="liquid-card"
                style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-primary)', boxShadow: 'var(--neo-in-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                      {project.icon}
                    </div>
                    <span className="neo-pill-widget" style={{ fontSize: '11px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.08)', color: 'var(--accent-primary)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                      {project.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                    {project.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: '600', marginBottom: '16px' }}>
                    {project.subtitle}
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {project.features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: '700', flexShrink: 0 }}>▸</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                    {project.tech.map((t, i) => (
                      <span key={i} className="tech-badge" style={{ background: 'rgba(22, 163, 74, 0.08)', color: '#16a34a', border: '1px solid rgba(22, 163, 74, 0.2)', fontSize: '11px', fontWeight: '700' }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a href={project.demoLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary" style={{ flex: 1, textDecoration: 'none' }}>
                      Live Demo <ExternalLink size={14} />
                    </a>
                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" style={{ flex: 1, textDecoration: 'none' }}>
                      <Github size={14} /> GitHub Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === ACHIEVEMENTS SECTION === */}
      <section id="achievements" className="section achieve-section">
        <div className="container">
          {/* Header */}
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft}>
            <div className="section-badge"><Trophy size={16}/> Hall of Fame</div>
            <h2 className="section-title">Achievements</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
              A snapshot of my coding journey — from competitive programming milestones to shipped products.
            </p>
          </motion.div>

          {/* ── Scrolling Ticker ── */}
          <motion.div
            className="achieve-ticker-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="achieve-ticker">
              <div className="achieve-ticker-track">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                  <span key={i} className="achieve-ticker-item">{item}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Bento Grid ── */}
          <div className="achieve-bento">

            {/* Big stat: DSA Problems */}
            <motion.div
              className="achieve-bento-cell achieve-hero-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -6 }}
              style={{ '--card-color': '#6366f1' }}
            >
              <div className="achieve-hero-bg-number">600</div>
              <div className="achieve-hero-icon">⚡</div>
              <div className="achieve-hero-value">
                <AnimatedCounter value={600} />+
              </div>
              <div className="achieve-hero-label">DSA Problems Solved</div>
              <div className="achieve-hero-sub">LeetCode · GFG · CodeStudio</div>
              <div className="achieve-platforms-pill">
                <span>🟡 LeetCode</span>
                <span>🟢 GFG</span>
                <span>🟠 CodeStudio</span>
              </div>
            </motion.div>

            {/* LeetCode Rating */}
            <motion.div
              className="achieve-bento-cell achieve-stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -6 }}
              style={{ '--card-color': '#f59e0b' }}
            >
              <div className="achieve-stat-top">
                <span className="achieve-stat-emoji">🏆</span>
                <span className="achieve-stat-badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>LeetCode</span>
              </div>
              <div className="achieve-stat-value" style={{ color: '#f59e0b' }}>
                <AnimatedCounter value={1481} />
              </div>
              <div className="achieve-stat-label">Max Rating</div>
              <div className="achieve-stat-sub">Competitive Programming</div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              className="achieve-bento-cell achieve-stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={{ y: -6 }}
              style={{ '--card-color': '#a855f7' }}
            >
              <div className="achieve-stat-top">
                <span className="achieve-stat-emoji">🎓</span>
                <span className="achieve-stat-badge" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }}>Certified</span>
              </div>
              <div className="achieve-stat-value" style={{ color: '#a855f7' }}>
                <AnimatedCounter value={2} />
              </div>
              <div className="achieve-stat-label">Certifications</div>
              <div className="achieve-stat-sub">Full-Stack · Flutter</div>
            </motion.div>

            {/* Platform Cards - Full Width Row */}
            {PLATFORMS.map((platform, idx) => (
              <motion.a
                key={platform.name}
                href={platform.link}
                target="_blank"
                rel="noreferrer"
                className="achieve-bento-cell achieve-platform-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  '--card-color': platform.color,
                  background: platform.bg,
                  borderColor: platform.border,
                }}
              >
                <div className="achieve-platform-header">
                  <div className="achieve-platform-name">
                    <span style={{ fontSize: '1.5rem' }}>{platform.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: platform.color }}>{platform.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Fira Code', monospace" }}>{platform.handle}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: platform.color, opacity: 0.7 }} />
                </div>
                <div className="achieve-platform-stats">
                  {platform.stats.map((s, si) => (
                    <div key={si} className="achieve-platform-stat">
                      <div className="achieve-platform-stat-val" style={{ color: platform.color }}>{s.value}</div>
                      <div className="achieve-platform-stat-key">{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.a>
            ))}

          </div>{/* end bento grid */}
        </div>
      </section>

      {/* Education */}
      <section id="education" className="section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight}>
            <div className="section-badge"><GraduationCap size={16}/> Academic Journey</div>
            <h2 className="section-title">Education</h2>
          </motion.div>

          <div className="education-timeline">
            {EDUCATION.map((edu, index) => (
              <motion.div key={index} className="education-item" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft}>
                <motion.div className="glass-card education-card" whileHover={{ x: 10 }}>
                  <div className="education-header">
                    <div><h3 className="education-school">{edu.school}</h3><div className="education-location">{edu.location}</div></div>
                    <span className="education-period">{edu.period}</span>
                  </div>
                  <h4 className="education-degree">{edu.degree}</h4>
                  <div className="cgpa-badge">{edu.score}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Training */}
      <section id="training" className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
            <div className="section-badge"><BookOpen size={16}/> Continuous Learning</div>
            <h2 className="section-title">Training</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft}>
            {TRAINING.map((training, i) => (
              <motion.div key={i} className="glass-card training-card" style={{ padding: '32px', marginBottom: '20px' }} whileHover={{ scale: 1.01, x: 6 }}>
                <div className="training-header">
                  <h4 className="training-title" style={{ color: 'var(--accent-primary)', fontSize: '1.25rem' }}>{training.title}</h4>
                  <span className="education-period">{training.period}</span>
                </div>
                <ul className="training-list" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {training.details.map((detail, j) => <li key={j} style={{ display: 'flex', gap: '10px', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>▸</span>{detail}</li>)}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === CERTIFICATES SECTION === */}
      <section id="certificates" className="section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
            <div className="section-badge"><Award size={16}/> Verified Credentials</div>
            <h2 className="section-title">Certifications & Credentials</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
              Industry-recognized credentials in Artificial Intelligence, Enterprise Data Platforms, Cloud Systems, and Algorithmic Engineering.
            </p>
          </motion.div>

          <motion.div
            className="certs-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}
          >
            {CERTS.map((cert) => (
              <motion.a
                key={cert.id}
                href={cert.link}
                target="_blank"
                rel="noreferrer"
                className="liquid-card"
                variants={slideUp}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none', borderLeft: `4px solid ${cert.color}` }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span className="neo-pill-widget" style={{ fontSize: '11px', padding: '4px 12px', background: `${cert.color}15`, color: cert.color, border: `1px solid ${cert.color}35`, fontWeight: '700' }}>
                      {cert.tag}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Fira Code', monospace", fontWeight: '600' }}>
                      {cert.period}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.18rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    {cert.title}
                  </h3>

                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: '700', marginBottom: '12px' }}>
                    {cert.issuer}
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                    {cert.hours}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: cert.color, fontWeight: '700' }}>
                  <span>Verify Credential</span>
                  <ExternalLink size={14} />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <BookingSection />

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
            <div className="section-badge"><Mail size={16}/> Get In Touch</div>
            <h2 className="section-title">Contact Me</h2>
          </motion.div>

          <div className="contact-wrapper">
            <motion.div className="contact-info" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft}>
              <h3>Let's work together!</h3>
              <p>I'm currently looking for new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!</p>
              
              <div className="contact-links">
                <motion.a href="mailto:adityam8787@gmail.com" className="contact-link-item" whileHover={{ scale: 1.05, x: 10 }}>
                  <div className="contact-link-icon" style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}><Mail /></div>
                  <div className="contact-link-text"><span>Email Me</span><span>adityam8787@gmail.com</span></div>
                </motion.a>
                
                <motion.a href="tel:+918601326062" className="contact-link-item" whileHover={{ scale: 1.05, x: 10 }}>
                  <div className="contact-link-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}><Smartphone /></div>
                  <div className="contact-link-text"><span>Call Me</span><span>+91 8601326062</span></div>
                </motion.a>

                <motion.a href="https://www.linkedin.com/in/adityakumishra/" target="_blank" rel="noreferrer" className="contact-link-item" whileHover={{ scale: 1.05, x: 10 }}>
                  <div className="contact-link-icon" style={{background: 'rgba(10, 102, 194, 0.1)', color: '#0a66c2'}}><Linkedin /></div>
                  <div className="contact-link-text"><span>LinkedIn</span><span>Aditya Kumar Mishra</span></div>
                </motion.a>

                <motion.a href="https://github.com/Aditya1787" target="_blank" rel="noreferrer" className="contact-link-item" whileHover={{ scale: 1.05, x: 10 }}>
                  <div className="contact-link-icon" style={{background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)'}}><Github /></div>
                  <div className="contact-link-text"><span>GitHub</span><span>Aditya1787</span></div>
                </motion.a>
              </div>
            </motion.div>

            <motion.div className="glass-card" style={{ padding: '40px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight}>
              <form className="contact-form" onSubmit={(e) => {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                window.location.href = `mailto:adityam8787@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " <" + email + ">\n\n" + message)}`;
              }}>
                <div className="form-group"><label htmlFor="name">Your Name</label><input type="text" id="name" placeholder="John Doe" required /></div>
                <div className="form-group"><label htmlFor="email">Your Email</label><input type="email" id="email" placeholder="john@example.com" required /></div>
                <div className="form-group"><label htmlFor="subject">Subject</label><input type="text" id="subject" placeholder="Project Inquiry" required /></div>
                <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" rows="5" placeholder="Hello Aditya, I'd like to discuss..." required></textarea></div>
                <motion.button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} whileHover={{ scale: 1.05 }}>
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Designed & Built by <span className="footer-gradient">Aditya Kumar Mishra</span>.</p>
        </div>
      </footer>

      {/* AI Portfolio Assistant Chatbot */}
      <Chatbot />
    </>
  );
}

export default App;
