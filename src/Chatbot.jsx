import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, Sparkles, RefreshCw, ChevronDown, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || "";

const ADITYA_CONTEXT = `
You are Aditya's Portfolio AI Assistant, an interactive chatbot for Aditya Kumar Mishra's portfolio website.

STRICT RULE & INSTRUCTION:
- You must strictly answer questions ONLY about Aditya Kumar Mishra, his portfolio, skills, projects, education, experience, achievements, and contact details.
- If the user asks about anything unrelated to Aditya (such as general knowledge, coding help unrelated to his projects, weather, sports, math, trivia, general AI questions, etc.), you MUST politely refuse and state: "I am Aditya's Portfolio Assistant! I can only answer questions related to Aditya Kumar Mishra, his projects, skills, education, and experience."

ADITYA'S COMPREHENSIVE INFORMATION:
- Name: Aditya Kumar Mishra
- Title/Roles: Full Stack Developer, Flutter App Developer, AI & Algorithmic Problem Solver
- Current Status: Pursuing B.Tech in Computer Science & Engineering at Lovely Professional University (Aug 2023 - Present)
- GitHub: https://github.com/Aditya1787
- Phone: +91 8601326062
- Email: adityam8787@gmail.com
- LinkedIn: https://www.linkedin.com/in/adityakumishra/

EDUCATION & SCHOOLING DETAILS:
1. B.Tech (Computer Science & Engineering) - Lovely Professional University (LPU), Phagwara, Punjab (Aug 2023 - Present)
2. Intermediate (Class XII) - S J Vidya Niketan Inter College, Kanpur, Uttar Pradesh (Score: 78%, Apr 2021 - Feb 2022)
3. Highschool / Matriculation (Class X) - S J Vidya Niketan Inter College, Kanpur, Uttar Pradesh (Score: 87%, Apr 2019 - Feb 2020)
4. Full Stack Development Training - Hands-on trainee in React.js, Node.js, Express, MongoDB, MySQL, REST APIs (May 2025 - July 2025)

KEY SKILLS & TECH STACK:
- Languages: C, C++, JavaScript (ES6+), TypeScript, Python, Java, Dart
- Web & APIs: HTML5, CSS3, React.js, Next.js, Tailwind CSS, Node.js, Express.js, RESTful APIs, JWT Auth
- Databases: MySQL, PostgreSQL, MongoDB, Firebase, Supabase
- Tools & Platforms: Git, GitHub, VS Code, Android Studio, Postman, Cloudinary CDN
- Core CS Concepts: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Computer Networks, Operating Systems

FEATURED PROJECTS:
1. SplitLedge – Full-Stack Group Expense Platform (O(N log N) Greedy Debt Simplification with Min/Max heaps)
2. Intvester – AI Equity Research Terminal (LangGraph multi-agent pipeline with 6 specialized agents)
3. DevTrackr – AI Telemetry Analytics Console (GitHub Octokit telemetry aggregator & Gemini AI diagnostics)
4. Jibble – College Circle Social Media App (Flutter, Supabase Realtime & Auth, Cloudinary CDN)
5. SmartFolio – Wealth & Portfolio Dashboard (React.js, Tailwind, Node, MongoDB - Live on Vercel)
6. Code2 Placement – Placement Mastery Platform (React, Node, Express, MongoDB, JWT)

ACHIEVEMENTS & CERTIFICATIONS:
- 600+ DSA Problems solved across LeetCode & GeeksforGeeks
- LeetCode Max Rating: 1481 (Knight Rank)
- SAP Hackfest Qualifier (State-Level Round)
- OCI 2025 Certified AI Foundations Associate (Oracle University)
- Oracle Data Platform 2025 Certified Foundations Associate (Oracle University)

Tone: Friendly, professional, concise, enthusiastic, and direct.
`;

const SUGGESTED_PROMPTS = [
  "Tell me about Aditya's schooling & college",
  "What are Aditya's key skills?",
  "Tell me about the Intvester AI project",
  "How does SplitLedge work?",
  "How can I contact Aditya?"
];

// Offline fallback intelligence engine for complete accuracy
const getSmartResponse = (query) => {
  const q = query.toLowerCase();

  // Schooling / Education / College
  if (
    q.includes('school') || q.includes('schooling') || q.includes('10th') || q.includes('10') || 
    q.includes('12th') || q.includes('12') || q.includes('college') || q.includes('university') || 
    q.includes('education') || q.includes('study') || q.includes('studies') || q.includes('kanpur') || 
    q.includes('lpu') || q.includes('academic') || q.includes('percentage') || q.includes('marks') ||
    q.includes('highschool') || q.includes('intermediate') || q.includes('b.tech') || q.includes('degree')
  ) {
    return `🎓 **Aditya's Educational & Schooling Background:**\n\n` +
           `1. **B.Tech in Computer Science & Engineering**\n` +
           `   • *Institution:* Lovely Professional University (LPU), Phagwara, Punjab\n` +
           `   • *Period:* Aug 2023 – Present (Pursuing)\n\n` +
           `2. **Intermediate (Class XII)**\n` +
           `   • *School:* S J Vidya Niketan Inter College, Kanpur, UP\n` +
           `   • *Score:* 78%\n` +
           `   • *Period:* Apr 2021 – Feb 2022\n\n` +
           `3. **Highschool / Matriculation (Class X)**\n` +
           `   • *School:* S J Vidya Niketan Inter College, Kanpur, UP\n` +
           `   • *Score:* 87%\n` +
           `   • *Period:* Apr 2019 – Feb 2020\n\n` +
           `4. **Full Stack Engineering Trainee**\n` +
           `   • *Duration:* May 2025 – July 2025 (React.js, Node.js, Express & MongoDB)`;
  }

  // Projects
  if (q.includes('project') || q.includes('build') || q.includes('splitledge') || q.includes('intvester') || q.includes('devtrackr') || q.includes('jibble') || q.includes('smartfolio') || q.includes('code2')) {
    return `🚀 **Aditya's Featured Engineering Projects:**\n\n` +
           `1. **SplitLedge** – Group expense ledger using an O(N log N) greedy debt simplification algorithm with Min/Max heaps & 20+ CSV validation rules.\n` +
           `2. **Intvester** – AI equity research terminal orchestrating 6 specialized AI agents on LangGraph for automated investment verdicts & technical indicators.\n` +
           `3. **DevTrackr** – GitHub telemetry aggregator & generative AI diagnostics console (MongoDB bulkWrite optimized, 90%+ write latency reduction).\n` +
           `4. **Jibble** – Campus networking app built with Flutter, Supabase Realtime/Auth & Cloudinary CDN.\n` +
           `5. **SmartFolio** – Financial portfolio dashboard live on Vercel.\n` +
           `6. **Code2 Placement** – Placement & technical interview preparation portal.`;
  }

  // Skills
  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('know') || q.includes('framework')) {
    return `💻 **Aditya's Technical Arsenal:**\n\n` +
           `• **Languages:** C, C++, JavaScript (ES6+), TypeScript, Python, Java, Dart\n` +
           `• **Frontend & Web:** React.js, Next.js, HTML5, CSS3, Tailwind CSS\n` +
           `• **Backend & APIs:** Node.js, Express.js, RESTful APIs, JWT Auth\n` +
           `• **Databases:** Supabase, PostgreSQL, MongoDB, MySQL, Firebase\n` +
           `• **Mobile Systems:** Flutter App Development\n` +
           `• **AI Engineering:** LangChain, LangGraph, Gemini & Groq APIs\n` +
           `• **Core CS:** Data Structures & Algorithms (600+ solved), OOP, Computer Networks, Operating Systems`;
  }

  // Achievements & Competitions
  if (q.includes('achievement') || q.includes('leetcode') || q.includes('gfg') || q.includes('rating') || q.includes('rank') || q.includes('hackathon') || q.includes('sap')) {
    return `🏆 **Achievements & Competitive Programming Milestones:**\n\n` +
           `• **600+ DSA Problems Solved** across LeetCode, GeeksforGeeks & CodeStudio\n` +
           `• **LeetCode Max Rating:** 1481 (Knight Rank)\n` +
           `• **SAP Hackfest State-Level Qualifier** for software innovation\n` +
           `• **5+ Production Applications Shipped**`;
  }

  // Certifications
  if (q.includes('certificate') || q.includes('certification') || q.includes('oracle') || q.includes('oci') || q.includes('nptel') || q.includes('udemy')) {
    return `🎓 **Verified Industry Certifications:**\n\n` +
           `1. **OCI 2025 Certified AI Foundations Associate** – Oracle University\n` +
           `2. **Oracle Data Platform 2025 Certified Foundations Associate** – Oracle University\n` +
           `3. **Cloud Computing** – NPTEL Verified Credential\n` +
           `4. **Data Structures & Algorithms** – NPTEL / Neo Colab\n` +
           `5. **Master Generative AI & Tools** – Udemy Credential`;
  }

  // Contact
  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone') || q.includes('reach') || q.includes('linkedin') || q.includes('github')) {
    return `📫 **Get in Touch with Aditya Kumar Mishra:**\n\n` +
           `• **Email:** adityam8787@gmail.com\n` +
           `• **Phone:** +91 8601326062\n` +
           `• **LinkedIn:** linkedin.com/in/adityakumishra/\n` +
           `• **GitHub:** github.com/Aditya1787\n` +
           `• **Location:** LPU, Phagwara, Punjab / Kanpur, UP`;
  }

  // Default about response
  return `👋 **Hi! I am Aditya's Portfolio AI Assistant.**\n\n` +
         `Aditya Kumar Mishra is a Full Stack & Mobile Systems Engineer pursuing B.Tech in CSE at Lovely Professional University. ` +
         `He specializes in React.js, Next.js, Node.js, Flutter, and Multi-Agent AI architecture with LangGraph.\n\n` +
         `Feel free to ask me about his **schooling**, **college**, **skills**, **projects**, **achievements**, or **contact info**!`;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi! I'm Aditya's AI Assistant. Ask me anything about Aditya's schooling, college, projects, skills, or background!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice States
  const [isAutoVoiceEnabled, setIsAutoVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      rec.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please try Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Mic start error:', e);
      }
    }
  };

  // Text-to-Speech Handler
  const speakText = (text, msgId = null) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop any existing speech

    if (speakingMsgId === msgId && msgId !== null) {
      setSpeakingMsgId(null);
      return;
    }

    const cleanText = text.replace(/[*_#`•🎓🚀💻🏆📫1-9.]/g, ''); // strip markdown formatting for natural voice
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (msgId) setSpeakingMsgId(msgId);

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newMessages = [...messages, { id: userMsgId, sender: 'user', text: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = newMessages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const payload = {
        system_instruction: {
          parts: [{ text: ADITYA_CONTEXT }]
        },
        contents: conversationHistory
      };

      let botReply = null;

      // Only attempt API if key is set
      if (GEMINI_API_KEY && !GEMINI_API_KEY.startsWith("AQ.")) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        }
      }

      // If API fails or is unconfigured, fallback seamlessly to smart offline intelligence
      if (!botReply) {
        botReply = getSmartResponse(query);
      }

      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, sender: 'bot', text: botReply }]);

      if (isAutoVoiceEnabled) {
        speakText(botReply, botMsgId);
      }

    } catch (err) {
      console.error('Chatbot Error:', err);
      const fallbackText = getSmartResponse(query);
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, sender: 'bot', text: fallbackText }]);

      if (isAutoVoiceEnabled) {
        speakText(fallbackText, botMsgId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Toggle Button */}
      <motion.button
        className="chatbot-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle Aditya AI Assistant"
      >
        <div className="btn-glow-pulse" />
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {!isOpen && (
          <span className="chatbot-badge">
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Ask AI 🎙️
          </span>
        )}
      </motion.button>

      {/* Chatbot Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-title-area">
                <div className="bot-avatar">
                  <Bot size={20} />
                </div>
                <div>
                  <h4>Aditya's Portfolio AI</h4>
                  <p className="online-indicator">
                    <span className="dot" /> Online • Voice Enabled 🎙️
                  </p>
                </div>
              </div>
              <div className="chatbot-actions">
                <button
                  onClick={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
                  className={`icon-action-btn ${isAutoVoiceEnabled ? 'active-voice' : ''}`}
                  title={isAutoVoiceEnabled ? "Auto Voice Reading Active" : "Enable Auto Voice Reading"}
                  style={{ color: isAutoVoiceEnabled ? 'var(--accent-primary)' : 'inherit' }}
                >
                  {isAutoVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button 
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setMessages([{ id: 'welcome', sender: 'bot', text: "Hi! Ask me anything about Aditya's schooling, college, projects, skills, or background!" }]);
                  }}
                  className="icon-action-btn"
                  title="Reset Chat"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setIsOpen(false);
                  }} 
                  className="icon-action-btn" 
                  title="Close"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="chatbot-body">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.sender === 'bot' && (
                    <div className="msg-avatar bot">
                      <Bot size={14} />
                    </div>
                  )}
                  
                  <div style={{ position: 'relative' }}>
                    <div className="chat-bubble">
                      {msg.text}
                    </div>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        style={{
                          position: 'absolute',
                          bottom: '-8px',
                          right: '-24px',
                          background: 'none',
                          border: 'none',
                          color: speakingMsgId === msg.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                        title="Read message aloud"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="msg-avatar user">
                      <User size={14} />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div className="chat-bubble-wrapper bot-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="msg-avatar bot">
                    <Bot size={14} />
                  </div>
                  <div className="chat-bubble typing-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Prompts */}
            {messages.length < 5 && (
              <div className="chatbot-quick-prompts">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    className="quick-prompt-chip"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              className="chatbot-footer"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <button
                type="button"
                onClick={toggleMic}
                className={`icon-action-btn ${isListening ? 'mic-listening' : ''}`}
                style={{
                  background: isListening ? '#ef4444' : 'var(--bg-card-hover)',
                  color: isListening ? '#ffffff' : 'var(--text-secondary)',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px'
                }}
                title={isListening ? "Listening... Click to stop" : "Speak to AI Assistant"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <input
                type="text"
                placeholder={isListening ? "Listening to your voice..." : "Ask about Aditya's schooling, skills, projects..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="chatbot-send-btn"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

