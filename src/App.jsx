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
import profilePic from './assets/profile pic.png';

// --- DATA ---
const NAV_LINKS = ['Home', 'About', 'Skills', 'Projects', 'Achievements', 'Education', 'Training', 'Certificates', 'Contact'];

const SKILLS = [
  { name: 'C++', category: 'languages', color: '#00599C' },
  { name: 'JavaScript', category: 'languages', color: '#F7DF1E' },
  { name: 'Java', category: 'languages', color: '#ED8B00' },
  { name: 'PHP', category: 'languages', color: '#777BB4' },
  { name: 'Dart', category: 'languages', color: '#0175C2' },
  { name: 'HTML5', category: 'web', color: '#E34F26' },
  { name: 'CSS3', category: 'web', color: '#1572B6' },
  { name: 'React.js', category: 'web', color: '#61DAFB' },
  { name: 'Node.js', category: 'web', color: '#339933' },
  { name: 'Express.js', category: 'web', color: '#000000' },
  { name: 'Tailwind CSS', category: 'web', color: '#06B6D4' },
  { name: 'Git', category: 'tools', color: '#F05032' },
  { name: 'Redux', category: 'tools', color: '#764ABC' },
  { name: 'TypeScript', category: 'tools', color: '#3178C6' },
  { name: 'Postman', category: 'tools', color: '#FF6C37' },
  { name: 'Firebase', category: 'tools', color: '#FFCA28' },
  { name: 'Supabase', category: 'tools', color: '#3ECF8E' },
  { name: 'MySQL', category: 'db', color: '#4479A1' },
  { name: 'MongoDB', category: 'db', color: '#47A248' },
  { name: 'PostgreSQL', category: 'db', color: '#4169E1' },
];

const EXPERTISE_LEVELS = [
  { name: 'React.js & Web Frontend', level: 90 },
  { name: 'Flutter App Development', level: 85 },
  { name: 'Node.js / Express Backend', level: 80 },
  { name: 'Data Structures & Algorithms', level: 88 },
  { name: 'Database Management (SQL/NoSQL)', level: 82 }
];

const PROJECTS = [
  {
    id: 1,
    title: 'Jibble – College Circle Social Media App',
    duration: 'Jan\' 26 - Feb\' 26',
    description: 'Developed a secure, college-exclusive social media platform for campus networking and collaboration. Integrated Cloudinary CDN for optimized image and media storage. Implemented user authentication, role-based access, and secure database management.',
    tech: ['Flutter', 'Dart', 'Supabase (PostgreSQL, Realtime, Auth)', 'Cloudinary'],
    link: '#',
    image: '/jibble_app_1773991049174.png',
    icon: <Smartphone />
  },
  {
    id: 2,
    title: 'SmartFolio – Portfolio & Wealth Dashboard',
    duration: 'Nov\' 25 - Dec\' 25',
    description: 'Developed a centralized financial dashboard that consolidates stocks, mutual funds, and cash holdings into a single, intuitive interface for better financial decision-making. Built a fast, component-based frontend.',
    tech: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB'],
    link: 'http://smartfolio-nine.vercel.app/',
    image: '/smartfolio_dashboard_1773991112527.png',
    icon: <Layout />
  },
  {
    id: 3,
    title: 'Code2 Placement',
    duration: '2025',
    description: 'Developed a comprehensive placement preparation website designed to help students and developers master coding skills and engineering interviews.',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    link: 'https://code2-placement-uvrp.vercel.app/',
    image: '/code2_placement_1773991129841.png',
    icon: <Terminal />
  },
  {
    id: 4,
    title: 'Task Manager App',
    duration: '2025',
    description: 'A mobile application engineered for efficient task tracking, scheduling, and placement preparation. Helps students organize their preparation milestones flawlessly.',
    tech: ['Flutter', 'Dart', 'State Management'],
    link: '#',
    image: '/task_manager_flutter_1773991200494.png',
    icon: <Smartphone />
  },
  {
    id: 5,
    title: 'Portfolio Website',
    duration: 'Oct\' 25 - Nov\' 25',
    description: 'Created a personal portfolio website using React.js to showcase projects, technical skills, and academic details. Implemented responsive design and 3D interactions.',
    tech: ['React JS', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
    link: '#',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop',
    icon: <Code2 />
  }
];

const ACHIEVEMENTS = [
  { label: 'DSA Problems Solved', value: 600, suffix: '+', icon: <Target size={32} />, desc: 'Across LeetCode, GFG & CodeStudio', color: '#6366f1' },
  { label: 'LeetCode Rating', value: 1481, suffix: '', icon: <Star size={32} />, desc: 'Active competitive programmer', color: '#f59e0b' },
  { label: 'Projects Built', value: 5, suffix: '+', icon: <Layers size={32} />, desc: 'Full-stack web & mobile apps', color: '#10b981' },
  { label: 'Certifications', value: 2, suffix: '', icon: <Award size={32} />, desc: 'Industry-recognized credentials', color: '#a855f7' },
];

const PLATFORMS = [
  {
    name: 'LeetCode',
    handle: '@adityakm8787',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    emoji: '🟡',
    stats: [
      { label: 'Problems Solved', value: '350+' },
      { label: 'Max Rating', value: '1481' },
      { label: 'Contest Rating', value: 'Knight' },
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
      { label: 'Problems Solved', value: '200+' },
      { label: 'Score', value: '900+' },
      { label: 'Institute Rank', value: 'Top 10%' },
    ],
    link: 'https://www.geeksforgeeks.org/user/adityam8787/'
  },
];

const TICKER_ITEMS = [
  '🏆 LeetCode Rating: 1481',
  '⚡ 600+ DSA Problems Solved',
  '🚀 5+ Full-Stack Projects Shipped',
  '🥇 Top 10% on GeeksForGeeks',
  '📱 2 Production-Grade Mobile Apps',
  '🎓 2 Industry Certifications',
  '💡 MERN + Flutter Developer',
  '🔥 Consistent Coder – Daily Streak',
];

const CERTS = [
  {
    id: 1,
    title: 'Java Programming',
    issuer: 'iamneo / LPU',
    period: 'Jan 2025 – May 2025',
    hours: '72 Hours',
    color: '#ec4899',
    image: '/certificates/Java Programming .png',
    tag: 'Programming'
  },
  {
    id: 2,
    title: 'C++ Programming',
    issuer: 'neo colab / LPU',
    period: 'Aug 2024 – Dec 2024',
    hours: '72 Hours',
    color: '#f59e0b',
    image: '/certificates/C++ programming.png',
    tag: 'Core CS'
  },
  {
    id: 3,
    title: 'C Programming',
    issuer: 'neo colab / LPU',
    period: 'Jan 2024 – May 2024',
    hours: '72 Hours',
    color: '#06b6d4',
    image: '/certificates/C programming.png',
    tag: 'Programming'
  },
  {
    id: 4,
    title: 'Data Structures & Algorithms',
    issuer: 'neo colab / LPU',
    period: 'Aug 2024 – Dec 2024',
    hours: '72 Hours',
    color: '#6366f1',
    image: '/certificates/Data structure and algorithm.png',
    tag: 'DSA'
  },
  {
    id: 5,
    title: 'Full Stack Development',
    issuer: 'LPU Centre for Professional Enhancement',
    period: 'Jun 2025 – Jul 2025',
    hours: 'Grade B',
    color: '#f97316',
    image: '/certificates/mern stack.png',
    tag: 'Full Stack'
  },
  {
    id: 6,
    title: 'App Development',
    issuer: 'IBM / Coursera',
    period: 'Mar 2026',
    hours: 'Verified Certificate',
    color: '#1d4ed8',
    image: '/certificates/App Development.png',
    tag: 'Mobile Dev'
  },
];

const EDUCATION = [
  {
    school: 'Lovely Professional University',
    location: 'Phagwara, Punjab',
    degree: 'Bachelor of Technology - Computer Science and Engineering',
    score: 'CGPA: 6.51',
    period: 'Aug\' 23 - Present'
  },
  {
    school: 'S J Vidya Niketan Inter College',
    location: 'Kanpur, Uttar Pradesh',
    degree: 'Intermediate',
    score: 'Percentage: 78%',
    period: 'Apr\' 21 - Feb\' 22'
  },
  {
    school: 'S J Vidya Niketan Inter College',
    location: 'Kanpur, Uttar Pradesh',
    degree: 'Matriculation',
    score: 'Percentage: 87%',
    period: 'Apr\' 19 - Feb\' 20'
  }
];

const TRAINING = [
  {
    title: 'Full Stack Development (React & Node)',
    period: 'May\' 25 - Jul\' 25',
    details: [
      'Worked on Building full stack Web applications using React JS for frontend and Node JS with Express JS for backend, following a client-server architecture.',
      'Developed and integrated RESTful APIs to manage request-response cycles and seamless data exchange between frontend and backend.'
    ]
  }
];

const CERTIFICATES = [
  { title: 'Full Stack Web Development', period: 'May\' 25 - Jul\' 25' },
  { title: 'Flutter App Development', period: 'Aug\' 25 - Oct\' 25' }
];

// --- SKILL ICON MAP ---
const SKILL_ICONS = {
  'C++': '⚡', 'JavaScript': '🟨', 'Java': '☕', 'PHP': '🐘', 'Dart': '🎯',
  'HTML5': '🔷', 'CSS3': '🎨', 'React.js': '⚛️', 'Node.js': '🟩', 'Express.js': '🚀',
  'Tailwind CSS': '💨', 'Git': '🔀', 'Redux': '🔮', 'TypeScript': '📘', 'Postman': '📮',
  'Firebase': '🔥', 'Supabase': '🟢', 'MySQL': '🗄️', 'MongoDB': '🍃', 'PostgreSQL': '🐘',
  'Flutter': '💙'
};

const SKILL_CATEGORIES = [
  { key: 'all', label: 'All Skills', icon: null },
  { key: 'languages', label: 'Languages', icon: null },
  { key: 'web', label: 'Web & Frameworks', icon: null },
  { key: 'tools', label: 'Tools & DevOps', icon: null },
  { key: 'db', label: 'Databases', icon: null },
];

const InteractiveSkillsGrid = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState(null);

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

      {/* Skills Grid */}
      <motion.div className="skills-cards-grid" layout>
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className={`skill-card ${hoveredSkill === skill.name ? 'hovered' : ''}`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ scale: 1.08, y: -6 }}
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
              style={{ '--skill-color': skill.color }}
            >
              <div className="skill-card-glow" />
              <div className="skill-card-icon">
                {SKILL_ICONS[skill.name] || '💡'}
              </div>
              <div className="skill-card-name">{skill.name}</div>
              <div className="skill-card-dot" style={{ background: skill.color }} />
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
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [particlesInit, setParticlesInit] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

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

      {/* Background Particles layer */}
      {particlesInit && <Particles id="tsparticles" options={particlesOptions} className="particles-container" />}

      {/* Top Scroll Progress Bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%', backgroundColor: 'var(--accent-primary)', height: '4px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001 }}
      />

      {/* Navbar with active layout animations */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="home" smooth={true} className="navbar-logo">AKM</Link>
          
          <ul className="navbar-links">
            {NAV_LINKS.map(link => (
              <li key={link} style={{ position: 'relative' }}>
                <Link 
                  to={link.toLowerCase()} 
                  spy={true} 
                  smooth={true} 
                  offset={-70} 
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
                  key={link} to={link.toLowerCase()} spy={true} smooth={true} offset={-70} duration={500}
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
      <section id="home" className="hero">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        
        <div className="container">
          <div className="hero-content-wrapper">
            <motion.div className="hero-content" initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={slideLeft} className="hero-badge">
                <div className="dot"></div> Available for Opportunities
              </motion.div>
              
              <motion.h1 variants={slideLeft} className="hero-name">
                Hi, I'm <span className="hero-name-gradient">Aditya Kumar Mishra</span>
              </motion.h1>
              
              <motion.h2 variants={slideLeft} className="hero-title">
                &gt; <span className="hero-name-gradient">
                  <TypewriterText sequence={[
                    'Full Stack Developer',
                    'Flutter App Developer',
                    'Problem Solver'
                  ]} />
                </span>
              </motion.h2>
              
              <motion.p variants={slideLeft} className="hero-description">
                &gt; Flutter App Dev_<br/>
                I specialize in building scalable web applications and robust mobile experiences. 
                Proficient in React, Node.js, and Flutter, I engineer solutions that are both beautiful and performant.
              </motion.p>
              
              {/* 4. Button Hover Animation */}
              <motion.div variants={slideLeft} className="hero-actions">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link to="contact" smooth={true} offset={-70} duration={500} className="btn btn-primary">
                    Contact Me <ChevronRight size={18} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <a href="https://drive.google.com/file/d/1DlVc30ojFuMN7Hx2fjnZtMZhZfUY-51w/view?usp=sharing" className="btn btn-outline" target="_blank" rel="noreferrer">
                    <Download size={18} /> Download Resume
                  </a>
                </motion.div>
              </motion.div>
              
              {/* 12. Floating Social Icons */}
              <motion.div variants={slideLeft} className="hero-stats">
                {[ 
                  { icon: <Github size={24}/>, link: "https://github.com/Aditya1787", color: "var(--text-primary)" }, 
                  { icon: <Linkedin size={24}/>, link: "https://www.linkedin.com/in/adityakumishra/", color: "#0a66c2" }, 
                  { icon: <Mail size={24}/>, link: "mailto:adityam8787@gmail.com", color: "#ef4444" }
                ].map((item, i) => (
                  <motion.a 
                    key={i} href={item.link} target="_blank" rel="noreferrer" className="social-toggle"
                    whileHover={{ scale: 1.2, rotate: 10, boxShadow: `0 0 15px ${item.color}`, color: item.color, borderColor: item.color }}
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </motion.div>
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
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '16px' }}>I am Aditya Kumar Mishra, an aspiring software engineer pursuing B.Tech in Computer Science and Engineering at Lovely Professional University.</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '24px' }}>My passion lies in crafting efficient, scalable, and user-friendly digital solutions. I have cultivated a strong foundation in both <strong>Full Stack Web Development</strong> (MERN stack) and <strong>Mobile App Development</strong> (Flutter & Dart).</p>
                
                <div className="about-highlights">
                  {['💡 Problem-Solving', '🚀 Quick Learner', '📊 Project Mgmt.', '🧠 Analytical Thinking'].map((t, i) => (
                    <div key={i} className="about-highlight-item" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>{t}</div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="about-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', flexDirection: 'unset' }} variants={slideUp}>
                {[
                  { title: 'Web Development', desc: 'Building dynamic and state-of-the-art web applications using React.js, Tailwind CSS, Node.js.' },
                  { title: 'App Development', desc: 'Engineering cross-platform mobile experiences with Flutter and Supabase.' },
                  { title: 'Core CS Fundamentals', desc: 'Deep understanding of Data Structures & Algorithms and Database Management Systems.' }
                ].map((card, i) => (
                  <motion.div key={i} className="glass-card about-card" style={{ padding: '20px', borderLeft: '3px solid var(--accent-primary)' }}>
                    <h4 style={{ marginBottom: '8px', color: 'var(--accent-primary)' }}>{card.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{card.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column: Profile Image */}
            <motion.div className="about-image-wrapper" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '400px', aspectRatio: '4/5', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
                <img src={profilePic} alt="Aditya Kumar Mishra" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 40%)', opacity: 0.6 }} />
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

            {/* 6. Skill Progress Bar Animation */}
            <motion.div 
              className="glass-card" style={{ padding: '40px' }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            >
              <h3 style={{ marginBottom: '24px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={24} style={{ color: 'var(--accent-primary)' }} /> Expertise Overview
              </h3>
              <div className="skills-progress-list">
                {EXPERTISE_LEVELS.map((skill, index) => (
                  <motion.div key={index} className="progress-item" variants={slideUp}>
                    <div className="progress-header" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '1.05rem' }}>
                        <CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} />
                        {skill.name}
                      </span>

                    </div>
                    <div className="progress-track" style={{ height: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      {/* Loading Bar filling up on display */}
                      <motion.div 
                        className="progress-fill" 
                        style={{ height: '100%', background: 'var(--gradient-1)', borderRadius: '10px', position: 'relative' }}
                        initial={{ width: 0 }} 
                        whileInView={{ width: `${skill.level}%` }} 
                        viewport={{ once: true }} 
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }} 
                      >
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '30%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Section Slide Animation & 3. Project Hover Animation */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
            <div className="section-badge"><Layout size={16}/> Portfolio</div>
            <h2 className="section-title">Featured Projects</h2>
          </motion.div>

          <motion.div className="projects-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            {PROJECTS.map((project) => (
              <motion.div 
                key={project.id} 
                variants={slideUp} 
                className="glass-card project-card"
                whileHover={{ scale: 1.05, y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="project-image-container">
                  <img src={project.image} alt={project.title} className="project-thumbnail" />
                  <div className="project-icon-overlay">{project.icon}</div>
                </div>
                <div className="project-content">
                  <div className="project-header">
                    <span className="project-date">{project.duration}</span>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech-stack">
                    {project.tech.map((tech, i) => <span key={i} className="tech-badge">{tech}</span>)}
                  </div>
                  <div className="project-links">
                    <motion.a href={project.link} className="btn btn-sm btn-outline" whileHover={{ scale: 1.1 }}>
                      View Project <ExternalLink size={14} />
                    </motion.a>
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
            <h2 className="section-title">Certificates</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
              Click any certificate to view it in full detail.
            </p>
          </motion.div>

          <motion.div
            className="certs-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {CERTS.map((cert, i) => (
              <motion.div
                key={cert.id}
                className="cert-card"
                variants={slideUp}
                whileHover={{ y: -8, scale: 1.03 }}
                onClick={() => setSelectedCert(cert)}
                style={{ '--cert-color': cert.color }}
              >
                {/* Top color stripe */}
                <div className="cert-card-stripe" style={{ background: cert.color }} />

                {/* Preview thumbnail */}
                <div className="cert-card-thumb">
                  <img src={cert.image} alt={cert.title} />
                  <div className="cert-card-overlay">
                    <div className="cert-card-view-btn">
                      <ExternalLink size={20} /> View Certificate
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="cert-card-body">
                  <span className="cert-card-tag" style={{ background: `${cert.color}22`, color: cert.color, border: `1px solid ${cert.color}44` }}>
                    {cert.tag}
                  </span>
                  <h3 className="cert-card-title">{cert.title}</h3>
                  <div className="cert-card-meta">
                    <span className="cert-card-issuer">{cert.issuer}</span>
                    <span className="cert-card-period">{cert.period}</span>
                  </div>
                  <div className="cert-card-hours" style={{ color: cert.color }}>{cert.hours}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
      <footer className="footer" style={{ position: 'relative', zIndex: 10 }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Designed & Built by <span className="footer-gradient">Aditya Kumar Mishra</span>.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
