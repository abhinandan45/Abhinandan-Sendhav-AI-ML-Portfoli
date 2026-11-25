/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useInView,
  useScroll,
  useSpring,
} from 'motion/react';
import {
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Briefcase,
  Check,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileSearch,
  Github,
  GraduationCap,
  Layers,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquareCode,
  Rocket,
  Send,
  Server,
  Workflow,
  X,
} from 'lucide-react';
import { NeuralCanvas } from './components/NeuralCanvas';
import {
  AskMyAiPanel,
  ChatMessage,
  FloatingAskAiWidget,
} from './components/AskMyAiWidget';

// ============================================================================
// EDITABLE PORTFOLIO DATA — Update all links, projects, skills & bio here.
// ============================================================================

export type ProjectCategory = 'ML' | 'GenAI/RAG' | 'Client Work';
export type ProjectFilterTab = 'All' | 'ML' | 'GenAI/RAG' | 'Client Work';

export interface ProjectItem {
  id: string;
  title: string;
  categories: ProjectCategory[];
  featured?: boolean;
  clientWork?: boolean;
  badge?: string;
  highlightMetric: string;
  businessImpact: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface StatItem {
  numericTarget?: number;
  suffix?: string;
  staticValue?: string;
  label: string;
  detail: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  benefit: string;
  deliverables: string;
  icon: 'chatbot' | 'rag' | 'automation' | 'ml';
}

export interface WorkflowStep {
  step: string;
  title: string;
  detail: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  icon: 'code' | 'brain' | 'layers' | 'chart' | 'server' | 'database';
  items: string[];
}

export interface TimelineItem {
  id: string;
  period: string;
  title: string;
  organization: string;
  type: 'experience' | 'program' | 'education';
  description: string;
}

const WHATSAPP_PREFILL =
  'Hi Abhinandan, I saw your portfolio and want to discuss a project';

export type AudienceMode = 'balanced' | 'recruiter' | 'client';

export const PORTFOLIO_DATA = {
  profile: {
    name: 'Abhinandan Sendhav',
    roleLine: 'AI/ML Engineer & Freelance AI Developer',
    terminalIntro: '> building AI that actually ships_',
    headline: 'AI/ML Engineer who builds AI that ships.',
    subheadline: 'Open to AI/ML roles & freelance projects.',
    statusText: 'Available: Full-time / Internship / Freelance',
    location: 'Indore, MP',
    heroImage: '/assets/aistudio/image_9ef2982a.png',
    heroImageAlt: 'Abhinandan Sendhav, AI/ML Engineer',
    resumeUrl: '/assets/aistudio/Abhinandan_Sendhav_AI_ML_7539cce9.pdf',
    email: 'abhinandansendhav540@gmail.com',
    whatsappUrl: `https://wa.me/917974055114?text=${encodeURIComponent(
      WHATSAPP_PREFILL
    )}`,
    githubUrl: 'https://github.com/abhinandan45',
    linkedinUrl: 'https://linkedin.com/in/abhinandan-sendhav-540206342',
    fiverrUrl: 'https://www.fiverr.com/',
  },

  navLinks: [
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Ask AI', href: '#ask-ai', id: 'ask-ai' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ],

  services: [
    {
      id: 'ai-chatbots',
      title: 'AI Chatbots (WhatsApp / Website)',
      benefit:
        'Automate 24/7 customer support and qualify incoming leads before you even open your inbox.',
      deliverables: 'WhatsApp Business Cloud API · Web Chat · Structured Intake',
      icon: 'chatbot',
    },
    {
      id: 'rag-systems',
      title: 'RAG Systems',
      benefit:
        'Let your team or customers chat directly with your PDFs, SOPs, and company data without hallucinations.',
      deliverables: 'LangChain · FAISS / Vector DB · Grounded Citations',
      icon: 'rag',
    },
    {
      id: 'automation-followup',
      title: 'Automation & Lead Follow-up',
      benefit:
        'Eliminate manual follow-up gaps with automated WhatsApp drip flows and CRM-ready data capture.',
      deliverables: 'WhatsApp Drip · Candidate/Lead Screening · API Webhooks',
      icon: 'automation',
    },
    {
      id: 'ml-solutions',
      title: 'ML Solutions',
      benefit:
        'Turn historical business data into actionable predictions, fraud alerts, and smart recommendations.',
      deliverables: 'XGBoost · SHAP Explainability · FastAPI Deployment',
      icon: 'ml',
    },
  ] as ServiceItem[],

  workflowSteps: [
    {
      step: '01',
      title: 'Discuss need',
      detail: 'Share your workflow bottleneck, dataset, or target use case on a quick call or chat.',
    },
    {
      step: '02',
      title: 'Plan & quote',
      detail: 'Receive a clear architecture plan, realistic timeline, and transparent project scope.',
    },
    {
      step: '03',
      title: 'Build & demo',
      detail: 'I build rapidly and share a working interactive demo so you can test real behavior early.',
    },
    {
      step: '04',
      title: 'Deploy & support',
      detail: 'Production cloud deployment, API integration, handover docs, and ongoing support.',
    },
  ] as WorkflowStep[],

  workflowTagline: 'Fast delivery. Clear communication. Working demo first.',

  stats: [
    {
      numericTarget: 5,
      suffix: '+',
      label: 'Production Projects',
      detail: 'ML, RAG & client automation builds',
    },
    {
      numericTarget: 4,
      suffix: '',
      label: 'Live Deployments',
      detail: 'Running on Streamlit, FastAPI & Render',
    },
    {
      staticValue: 'RAG & ML',
      label: 'Core Focus',
      detail: 'Grounded AI & explainable models',
    },
  ] as StatItem[],

  about: {
    heading: 'Engineering AI systems that hold up in production.',
    bio: 'Final-year B.Sc. Computer Science student at DAVV University, Indore (2024–2027), with hands-on expertise in Machine Learning, Deep Learning, NLP and Generative AI. Strong in end-to-end ML pipelines: data preprocessing, model building, explainability and cloud deployment. Also experienced in freelance client work building production AI chatbots and automation tools.',
  },

  projects: [
    {
      id: 'credit-card-fraud',
      title: 'Credit Card Fraud Detection System',
      categories: ['ML'],
      featured: true,
      badge: 'Featured',
      highlightMetric: '88% Recall · 4% Gap',
      businessImpact:
        'Protects banking revenue by catching 88% of fraudulent transactions while keeping false-alarm overfitting low and every decision explainable.',
      problem:
        'Severe class imbalance across 284,807 transactions (0.17% fraud) caused baseline models to overfit with a 16% train-test recall gap.',
      solution:
        'Benchmarked Logistic Regression, Random Forest, and XGBoost with SMOTE; tuned scale_pos_weight & regularization, added SHAP explainability, and deployed FastAPI + Streamlit.',
      result:
        'Achieved 88% recall while cutting the train-test recall gap from 16% to 4% with banking-grade per-transaction feature attribution.',
      stack: ['Python', 'XGBoost', 'SMOTE', 'SHAP', 'FastAPI', 'Streamlit'],
      liveUrl: 'https://credit-card-fraud-detection-a45.streamlit.app/',
      githubUrl: 'https://github.com/abhinandan45/credit-card-fraud-detection',
    },
    {
      id: 'whatsapp-hiring-bot',
      title: 'WhatsApp Hiring Assistant Bot',
      categories: ['GenAI/RAG', 'Client Work'],
      clientWork: true,
      badge: 'Real Client Work',
      highlightMetric: 'WhatsApp Cloud API',
      businessImpact:
        'Reduces hallucinated info in candidate communication while automating job Q&A and structured lead/applicant intake inside WhatsApp.',
      problem:
        'Recruiters spent repetitive hours answering candidate FAQs while risking inconsistent salary, benefits, or interview details.',
      solution:
        'Built a LangChain RAG agent integrated with WhatsApp Business Cloud API using strict knowledge-base guardrails and structured intake.',
      result:
        'Prevents hallucinated compensation claims and automatically collects candidate name, experience, location, and resume inside WhatsApp chat.',
      stack: ['Python', 'LangChain', 'RAG', 'WhatsApp Business Cloud API'],
    },
    {
      id: 'nexus-ai',
      title: 'Nexus AI — RAG Assistant for AI/ML Learners',
      categories: ['GenAI/RAG'],
      highlightMetric: 'FAISS + DeepSeek · Code Gen',
      businessImpact:
        'Eliminates unreliable generic answers by grounding technical explanations and runnable AI/ML code in verified papers and textbooks.',
      problem:
        'Generic LLM outputs often fabricate ML theory, cite nonexistent papers, or miss implementation nuances needed by learners.',
      solution:
        'Built a PDF ingestion pipeline using PyPDFLoader, text chunking, Sentence Transformer embeddings, and FAISS search paired with DeepSeek LLM and code generation.',
      result:
        'Delivers context-grounded technical explanations and AI/ML code directly traceable to trusted source documents.',
      stack: [
        'Python',
        'LangChain',
        'FAISS',
        'Sentence Transformers',
        'DeepSeek',
        'Streamlit',
      ],
      liveUrl: 'https://nexus-ai-assistant-001.streamlit.app/',
      githubUrl: 'https://github.com/abhinandan45/Nexus-AI',
    },
    {
      id: 'medibot',
      title: 'MediBot — Medical RAG Chatbot',
      categories: ['GenAI/RAG'],
      highlightMetric: 'Grounded Clinical PDFs',
      businessImpact:
        'Reduces hallucinated health information by constraining every answer strictly to verified medical reference PDFs.',
      problem:
        'Standard conversational models risk hallucinating dosages, symptoms, or clinical guidance when answering health queries.',
      solution:
        'Built a LangChain RAG workflow backed by a dense Vector DB indexed exclusively on trusted medical PDFs with strict grounding prompts.',
      result:
        'Delivers reliable, source-grounded health answers inside a fast, accessible Streamlit web interface.',
      stack: ['Python', 'LangChain', 'RAG', 'Vector DB', 'Streamlit'],
      liveUrl: 'https://medical-chatbot-medibot01.streamlit.app/',
      githubUrl: 'https://github.com/abhinandan45/medical-chatbot',
    },
    {
      id: 'kaggle-recommender',
      title: 'Kaggle Dataset Recommendation System',
      categories: ['ML'],
      highlightMetric: 'Topic-Matched Search',
      businessImpact:
        'Saves hours of manual dataset hunting by matching plain-text project topics to relevant Kaggle datasets in seconds.',
      problem:
        'Data science learners lose hours manually sifting through thousands of noisy datasets before finding clean training data.',
      solution:
        'Implemented an NLP similarity recommendation engine packaged in a lightweight Flask service deployed on Render.',
      result:
        'Surfaces top-ranked, topic-relevant Kaggle datasets from natural-language learner queries.',
      stack: ['Python', 'Recommendation Engine', 'Flask', 'Render'],
      liveUrl: 'https://dataset-recomandation.onrender.com',
      githubUrl: 'https://github.com/abhinandan45/dataset-Recomandation-',
    },
  ] as ProjectItem[],

  skills: [
    {
      id: 'languages',
      title: 'Languages',
      icon: 'code',
      items: ['Python', 'SQL'],
    },
    {
      id: 'ml-dl',
      title: 'ML / Deep Learning',
      icon: 'brain',
      items: ['Scikit-learn', 'TensorFlow', 'Keras', 'XGBoost'],
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      icon: 'chart',
      items: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn'],
    },
    {
      id: 'nlp-genai',
      title: 'NLP & GenAI',
      icon: 'layers',
      items: [
        'Transformers',
        'LangChain',
        'SentenceTransformers',
        'RAG',
        'LLM Fine-Tuning',
        'FAISS',
        'Vector Databases',
        'HuggingFace',
        'OpenRouter',
      ],
    },
    {
      id: 'deployment',
      title: 'Web & Deployment',
      icon: 'server',
      items: ['Flask', 'FastAPI', 'Streamlit', 'Docker', 'Render', 'Git', 'GitHub'],
    },
    {
      id: 'databases',
      title: 'Databases & Tools',
      icon: 'database',
      items: ['MySQL', 'VS Code', 'Google Colab'],
    },
  ] as SkillGroup[],

  timeline: [
    {
      id: 'freelance-ai',
      period: '2024 – Present',
      title: 'Freelance AI Developer',
      organization: 'Client Projects & Automation',
      type: 'experience',
      description:
        'Building production WhatsApp chatbots, grounded RAG knowledge assistants, and lead-capture automation workflows for business clients.',
    },
    {
      id: 'ds-program',
      period: '2024',
      title: 'Data Science & AI Placement-Oriented Program',
      organization: 'Intensive Hands-On Training',
      type: 'program',
      description:
        'End-to-end training across ML, NLP, LLM apps, RAG systems, and cloud deployment across the full data science lifecycle.',
    },
    {
      id: 'davv-bsc',
      period: '2024 – 2027',
      title: 'B.Sc. Computer Science',
      organization: 'DAVV University, Indore',
      type: 'education',
      description:
        'Govt. Nirbhay Singh Patel Science College, Indore. Strong focus on algorithms, databases, and applied AI.',
    },
  ] as TimelineItem[],

  contact: {
    heading: "Have an idea? Let's build it.",
    subtext:
      'Whether you need a WhatsApp AI chatbot, a custom RAG system for your company docs, or an AI/ML engineer on your team — let’s talk.',
    replyTime: 'I usually reply within 24 hours.',
  },
};

// ============================================================================
// MOTION & INTERACTION PRIMITIVES
// ============================================================================

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.45, ease: EASE_OUT },
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function useTerminalTyping(text: string, speedMs = 36) {
  const reducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(text);
      return;
    }
    let idx = 2;
    setDisplayed(text.slice(0, idx));
    const timer = window.setInterval(() => {
      idx += 1;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) {
        window.clearInterval(timer);
      }
    }, speedMs);
    return () => window.clearInterval(timer);
  }, [text, speedMs, reducedMotion]);

  return displayed;
}

function AnimatedStatValue({ item }: { item: StatItem }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(item.numericTarget ?? 0);

  useEffect(() => {
    if (item.numericTarget === undefined) return;
    if (reducedMotion) {
      setCount(item.numericTarget);
      return;
    }
    if (!isInView) return;

    const target = item.numericTarget;
    const duration = 650;
    const start = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    setCount(0);
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, item.numericTarget, reducedMotion]);

  return (
    <p
      ref={ref}
      className="font-display text-3xl sm:text-4xl font-bold text-white tabular-nums tracking-tight"
    >
      {item.numericTarget !== undefined
        ? `${count}${item.suffix ?? ''}`
        : item.staticValue}
    </p>
  );
}

// Subtle magnetic hover wrapper for primary CTAs
function MagneticButton({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
    setOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition:
          offset.x === 0 && offset.y === 0
            ? 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 60ms linear',
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}

// 3D Tilt + Cursor-Following Glowing Border Project Card
function TiltProjectCard({
  children,
  featuredWide,
  index,
}: {
  children: React.ReactNode;
  featuredWide: boolean;
  index: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursor({ x, y, active: true });

    if (!reducedMotion && window.innerWidth >= 1024) {
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      setTilt({ rx: -py * 4.2, ry: px * 4.2 });
    }
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setCursor((prev) => ({ ...prev, active: false }));
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.06, 0.24),
        ease: EASE_OUT,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: cursor.active
          ? 'transform 90ms ease-out'
          : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative rounded-2xl p-[1px] bg-white/[0.08] overflow-hidden ${
        featuredWide ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Glowing border radial spotlight following cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: cursor.active ? 1 : 0,
          background: `radial-gradient(420px circle at ${cursor.x}px ${cursor.y}px, rgba(139, 92, 246, 0.6), transparent 65%)`,
        }}
      />

      {/* Inner card surface */}
      <div className="relative h-full rounded-[15px] bg-[#090B14]/95 backdrop-blur-xl p-7 sm:p-9 flex flex-col justify-between">
        {/* Subtle inner spotlight wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[15px] transition-opacity duration-200"
          style={{
            opacity: cursor.active ? 1 : 0,
            background: `radial-gradient(500px circle at ${cursor.x}px ${cursor.y}px, rgba(139, 92, 246, 0.06), transparent 60%)`,
          }}
        />
        <div className="relative z-10 flex flex-col justify-between h-full">
          {children}
        </div>
      </div>
    </motion.article>
  );
}

function ServiceIcon({ type }: { type: ServiceItem['icon'] }) {
  const cls = 'w-5 h-5 text-violet-400';
  switch (type) {
    case 'chatbot':
      return <MessageSquareCode className={cls} aria-hidden="true" />;
    case 'rag':
      return <FileSearch className={cls} aria-hidden="true" />;
    case 'automation':
      return <Workflow className={cls} aria-hidden="true" />;
    case 'ml':
      return <BrainCircuit className={cls} aria-hidden="true" />;
  }
}

function SkillIcon({ type }: { type: SkillGroup['icon'] }) {
  const cls = 'w-4 h-4 text-violet-400';
  switch (type) {
    case 'code':
      return <Code2 className={cls} aria-hidden="true" />;
    case 'brain':
      return <BrainCircuit className={cls} aria-hidden="true" />;
    case 'layers':
      return <Layers className={cls} aria-hidden="true" />;
    case 'chart':
      return <BarChart3 className={cls} aria-hidden="true" />;
    case 'server':
      return <Server className={cls} aria-hidden="true" />;
    case 'database':
      return <Database className={cls} aria-hidden="true" />;
  }
}

function TimelineIcon({ type }: { type: TimelineItem['type'] }) {
  const cls = 'w-3.5 h-3.5 text-violet-400';
  switch (type) {
    case 'experience':
      return <Briefcase className={cls} aria-hidden="true" />;
    case 'program':
      return <Rocket className={cls} aria-hidden="true" />;
    case 'education':
      return <GraduationCap className={cls} aria-hidden="true" />;
  }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

export default function App() {
  const {
    profile,
    navLinks,
    services,
    workflowSteps,
    workflowTagline,
    stats,
    about,
    projects,
    skills,
    timeline,
    contact,
  } = PORTFOLIO_DATA;

  const typedTerminal = useTerminalTyping(profile.terminalIntro);
  const [audienceMode, setAudienceMode] = useState<AudienceMode>(() => {
    if (typeof window === 'undefined') return 'balanced';
    const param = new URLSearchParams(window.location.search).get('for');
    if (param === 'recruiter') return 'recruiter';
    if (param === 'client') return 'client';
    return 'balanced';
  });
  const [activeFilter, setActiveFilter] = useState<ProjectFilterTab>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  // Shared Ask My AI Chat State (syncs in-page section + floating widget)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hi! I'm Abhinandan's AI assistant. Ask me about his AI/ML skills, notice period, projects, WhatsApp chatbots, or how to hire him.",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Project Inquiry Form State (opens prefilled mailto)
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('AI Chatbot (WhatsApp / Website)');
  const [inquiryBudget, setInquiryBudget] = useState('₹15,000 – ₹40,000 ($200 – $500)');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryNotice, setInquiryNotice] = useState<string | null>(null);

  // Top scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);
      setShowBackToTop(y > 480);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [navLinks, audienceMode]);

  const handleAudienceSelect = (nextMode: AudienceMode) => {
    const resolved = audienceMode === nextMode ? 'balanced' : nextMode;
    setAudienceMode(resolved);
    setActiveFilter('All');

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (resolved === 'balanced') {
        url.searchParams.delete('for');
      } else {
        url.searchParams.set('for', resolved);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const orderedProjects = useMemo(() => {
    if (audienceMode !== 'client') return projects;
    return [...projects].sort((a, b) => {
      const score = (p: ProjectItem) =>
        (p.clientWork ? 2 : 0) + (p.liveUrl ? 1 : 0);
      return score(b) - score(a);
    });
  }, [audienceMode, projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return orderedProjects;
    return orderedProjects.filter((p) => p.categories.includes(activeFilter));
  }, [activeFilter, orderedProjects]);

  const filterCounts = useMemo(
    () => ({
      All: projects.length,
      ML: projects.filter((p) => p.categories.includes('ML')).length,
      'GenAI/RAG': projects.filter((p) => p.categories.includes('GenAI/RAG')).length,
      'Client Work': projects.filter((p) => p.categories.includes('Client Work'))
        .length,
    }),
    [projects]
  );

  const handleSmoothNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.slice(1);
    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const handleSendChat = async (presetQuestion?: string) => {
    const textToSend = (presetQuestion ?? chatInput).trim();
    if (!textToSend || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend,
    };

    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    if (!presetQuestion) setChatInput('');
    setChatError(null);
    setChatLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: chatMessages
            .filter((m) => m.id !== 'welcome')
            .slice(-6)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.reply) {
        throw new Error(
          data?.error ||
            'Unable to get a response right now. Please reach out via WhatsApp or Email.'
        );
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
        },
      ]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to reach AI assistant. Please contact Abhinandan directly.';
      setChatError(msg);
    } finally {
      setChatLoading(false);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = inquiryName.trim();
    const cleanEmail = inquiryEmail.trim();
    const cleanMsg = inquiryMessage.trim();

    if (!cleanName || !cleanEmail || !cleanMsg) {
      setInquiryNotice('Please fill in your name, email, and project details.');
      return;
    }

    const subject = `[Portfolio Inquiry] ${inquiryType} — ${cleanName}`;
    const body = [
      `Hi Abhinandan,`,
      ``,
      `Name: ${cleanName}`,
      `Email: ${cleanEmail}`,
      `Project Type: ${inquiryType}`,
      `Budget Range: ${inquiryBudget}`,
      ``,
      `Project Details:`,
      cleanMsg,
    ].join('\n');

    const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoHref;
    setInquiryNotice(
      'Opening your email app with all project details pre-filled. Or message directly on WhatsApp for the fastest reply.'
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#05070C] text-slate-100 relative overflow-x-hidden">
        {/* Faint architectural grid canvas */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 bg-subtle-grid opacity-80"
        />

        {/* Subtle single-accent neon violet atmospheric radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 h-[660px] bg-[radial-gradient(ellipse_68%_50%_at_50%_-10%,rgba(139,92,246,0.18),transparent)]"
        />

        {/* Thin Scroll-Progress Bar at the top */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX }}
          className="fixed top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-600 via-violet-400 to-purple-400 origin-left z-[60] pointer-events-none"
        />

        {/* ================================================================
            STICKY NAVBAR (3-Zone Top Bar Contract + Scroll Blur + Active State)
            ================================================================ */}
        <header
          className={`sticky top-0 z-50 transition-all duration-200 ${
            isScrolled
              ? 'border-b border-white/[0.08] bg-[#05070C]/80 backdrop-blur-xl shadow-lg shadow-black/30'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
            {/* Zone 1: Single-line Brand Wordmark */}
            <a
              href="#top"
              onClick={(e) => handleSmoothNav(e, '#top')}
              className="font-display text-base sm:text-lg font-semibold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400"
            >
              {profile.name}
            </a>

            {/* Zone 2: Concise single-line Navigation Links */}
            <nav
              aria-label="Primary Navigation"
              className="hidden md:flex items-center gap-7 text-sm font-medium"
            >
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleSmoothNav(e, link.href)}
                    className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400 ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-violet-400 transition-transform duration-200 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            {/* Zone 3: Always-visible Resume + Let's Talk + Mobile Hamburger */}
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={profile.resumeUrl}
                download="Abhinandan_Sendhav_AI_ML_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-slate-100 text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              >
                <Download className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
                Resume
              </a>

              <a
                href="#contact"
                onClick={(e) => handleSmoothNav(e, '#contact')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
              >
                Let&apos;s Talk
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 hover:text-white hover:border-white/20 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                aria-label="Mobile Navigation"
                className="md:hidden border-t border-white/[0.08] bg-[#070B13]/95 backdrop-blur-xl px-5 py-4 flex flex-col gap-1.5"
              >
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleSmoothNav(e, link.href)}
                      className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-violet-500/15 text-violet-300'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  <a
                    href={profile.resumeUrl}
                    download="Abhinandan_Sendhav_AI_ML_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4 text-violet-400" aria-hidden="true" />
                    Resume
                  </a>
                  <a
                    href="#contact"
                    onClick={(e) => handleSmoothNav(e, '#contact')}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
                  >
                    Let&apos;s Talk
                  </a>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        <main id="top" className="relative z-10">
          {/* ================================================================
              1. CREATIVE AI-NATIVE HERO
              ================================================================ */}
          <section className="relative overflow-hidden border-b border-white/[0.06]">
            {/* Lightweight Interactive Neural Canvas */}
            <NeuralCanvas />

            <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-20 sm:pb-28">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Left Column on Desktop (Below Photo on Mobile) */}
                <div className="lg:col-span-7 order-2 lg:order-1">
                  {/* Status Pill with Pulsing Green Dot */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.04, ease: EASE_OUT }}
                    className="flex flex-wrap items-center gap-3 mb-7"
                  >
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] text-xs font-medium text-emerald-300 whitespace-nowrap">
                      <span className="relative flex h-2 w-2" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      {profile.statusText}
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-slate-300 whitespace-nowrap">
                      <MapPin className="w-3 h-3 text-violet-400" aria-hidden="true" />
                      {profile.location} · Immediate Joiner
                    </span>
                  </motion.div>

                  {/* Terminal-Style Typing Intro Line */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
                    className="mb-4 min-h-[1.75rem]"
                  >
                    <p className="font-mono text-sm sm:text-base text-violet-400 tracking-tight">
                      <span>{typedTerminal}</span>
                      <span
                        aria-hidden="true"
                        className="inline-block w-[7px] h-[1em] ml-1 align-middle bg-violet-400 animate-cursor"
                      />
                    </p>
                  </motion.div>

                  {/* Main Value-Focused Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.48, delay: 0.16, ease: EASE_OUT }}
                    className="font-display font-bold tracking-tight text-white text-balance leading-[1.06]"
                    style={{ fontSize: 'clamp(2.15rem, 4.3vw, 3.65rem)' }}
                  >
                    {profile.headline}
                  </motion.h1>

                  {/* Identity & Proof Subheadline */}
                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.24, ease: EASE_OUT }}
                    className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl"
                  >
                    {profile.subheadline}
                  </motion.p>

                  {/* Audience Switch Pill Toggle ("I'm Hiring" | "I Need a Project Built") */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, delay: 0.27, ease: EASE_OUT }}
                    className="mt-6 flex flex-wrap items-center gap-3"
                  >
                    <div
                      role="group"
                      aria-label="Tailor view by audience"
                      className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full border border-white/12 bg-white/[0.03] backdrop-blur-md"
                    >
                      <button
                        type="button"
                        onClick={() => handleAudienceSelect('recruiter')}
                        aria-pressed={audienceMode === 'recruiter'}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                          audienceMode === 'recruiter'
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                            : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
                        I&apos;m Hiring
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAudienceSelect('client')}
                        aria-pressed={audienceMode === 'client'}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                          audienceMode === 'client'
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                            : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        <Rocket className="w-3.5 h-3.5" aria-hidden="true" />
                        I Need a Project Built
                      </button>
                    </div>

                    {audienceMode !== 'balanced' && (
                      <button
                        type="button"
                        onClick={() => handleAudienceSelect('balanced')}
                        className="text-xs text-slate-400 hover:text-violet-300 transition-colors cursor-pointer"
                      >
                        Reset to balanced view
                      </button>
                    )}
                  </motion.div>

                  {/* Primary Hero CTAs (Balanced or Audience-Tailored) */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.3, ease: EASE_OUT }}
                    className="mt-7 flex flex-wrap items-center gap-4"
                  >
                    {audienceMode === 'client' ? (
                      <>
                        <MagneticButton>
                          <a
                            href={profile.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/cta inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-sm sm:text-base font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 shadow-lg shadow-violet-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                          >
                            <MessageCircle className="w-4 h-4" aria-hidden="true" />
                            Start a Project
                            <ArrowUpRight
                              className="w-4 h-4 transition-transform duration-150 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </a>
                        </MagneticButton>

                        <MagneticButton>
                          <a
                            href={profile.fiverrUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-violet-400/50 text-white text-sm sm:text-base font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                          >
                            <ExternalLink className="w-4 h-4 text-violet-400" aria-hidden="true" />
                            Fiverr Profile
                          </a>
                        </MagneticButton>
                      </>
                    ) : audienceMode === 'recruiter' ? (
                      <>
                        <MagneticButton>
                          <a
                            href={profile.resumeUrl}
                            download="Abhinandan_Sendhav_AI_ML_Resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-sm sm:text-base font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 shadow-lg shadow-violet-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                          >
                            <Download className="w-4 h-4" aria-hidden="true" />
                            Download Resume
                          </a>
                        </MagneticButton>

                        <MagneticButton>
                          <a
                            href="#projects"
                            onClick={(e) => handleSmoothNav(e, '#projects')}
                            className="group/cta inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-violet-400/50 text-white text-sm sm:text-base font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                          >
                            View Projects &amp; Metrics
                            <ArrowUpRight
                              className="w-4 h-4 transition-transform duration-150 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </a>
                        </MagneticButton>
                      </>
                    ) : (
                      <>
                        <MagneticButton>
                          <a
                            href={profile.resumeUrl}
                            download="Abhinandan_Sendhav_AI_ML_Resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-violet-400/45 bg-violet-500/15 hover:bg-violet-500/25 text-white text-sm sm:text-base font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                          >
                            <Download className="w-4 h-4 text-violet-300" aria-hidden="true" />
                            Download Resume
                          </a>
                        </MagneticButton>

                        <MagneticButton>
                          <a
                            href="#contact"
                            onClick={(e) => handleSmoothNav(e, '#contact')}
                            className="group/cta inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-sm sm:text-base font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 shadow-lg shadow-violet-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                          >
                            Hire Me for a Project
                            <ArrowUpRight
                              className="w-4 h-4 transition-transform duration-150 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </a>
                        </MagneticButton>
                      </>
                    )}
                  </motion.div>

                  {/* Quiet Profile & Quick Links */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.38, ease: EASE_OUT }}
                    className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-400"
                  >
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" aria-hidden="true" />
                      GitHub
                    </a>
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                      LinkedIn
                    </a>
                    <a
                      href={profile.fiverrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
                      Fiverr
                    </a>
                    <a
                      href="#ask-ai"
                      onClick={(e) => handleSmoothNav(e, '#ask-ai')}
                      className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                      Ask My AI
                    </a>
                  </motion.div>
                </div>

                {/* Right Column on Desktop (Stacked Above Text on Mobile): Circular Profile Photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.12, ease: EASE_OUT }}
                  className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-[350px] lg:h-[350px]"
                  >
                    {/* Very soft purple ambient glow behind the photo (no extra border/ring) */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-6 rounded-full bg-violet-600/20 blur-3xl"
                    />

                    {/* Circular mask clipping outer black corners cleanly */}
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      {!heroImgFailed ? (
                        <img
                          src={profile.heroImage}
                          alt={profile.heroImageAlt}
                          width={350}
                          height={350}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() => setHeroImgFailed(true)}
                          className="w-full h-full object-cover object-center scale-[1.06]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/60 to-[#090B14]">
                          <BrainCircuit
                            className="w-16 h-16 text-violet-400"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ================================================================
              AUDIENCE-ADAPTIVE SECTIONS (Smoothly Reordered & Highlighted)
              ================================================================ */}
          <LayoutGroup>
            <div className="flex flex-col">
              {(audienceMode === 'recruiter'
                ? (['about', 'projects', 'services'] as const)
                : (['services', 'projects', 'about'] as const)
              ).map((sectionKey, orderIndex) => {
                if (sectionKey === 'services') {
                  const isClientHighlighted = audienceMode === 'client';
                  return (
                    <motion.section
                      key="services"
                      layout="position"
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      id="services"
                      className={`max-w-6xl w-full mx-auto px-5 sm:px-8 py-24 sm:py-32 ${
                        orderIndex > 0 ? 'border-t border-white/[0.06]' : ''
                      } ${
                        audienceMode === 'recruiter'
                          ? 'opacity-90 hover:opacity-100 transition-opacity'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <p className="text-xs font-mono text-violet-400 tracking-wide">
                              Services for Businesses &amp; Founders
                            </p>
                            {isClientHighlighted && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-violet-400/40 bg-violet-500/15 text-[11px] font-medium text-violet-300">
                                Prioritized for Your Project
                              </span>
                            )}
                          </div>
                          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            How I can help your business
                          </h2>
                        </div>
                        <p className="text-sm sm:text-base text-slate-400 max-w-md leading-relaxed">
                          Focused AI engineering that cuts manual support hours,
                          prevents hallucinations, and turns raw data into
                          measurable outcomes.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service, idx) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{
                              duration: 0.38,
                              delay: idx * 0.06,
                              ease: EASE_OUT,
                            }}
                            className={`glass-surface rounded-2xl p-7 sm:p-8 hover:border-violet-400/35 transition-colors duration-200 flex flex-col justify-between ${
                              isClientHighlighted
                                ? 'border-violet-500/25 shadow-lg shadow-violet-950/15'
                                : ''
                            }`}
                          >
                            <div>
                              <div className="w-11 h-11 rounded-2xl border border-violet-500/30 bg-violet-500/10 flex items-center justify-center mb-5">
                                <ServiceIcon type={service.icon} />
                              </div>
                              <h3 className="font-display text-xl font-semibold text-white">
                                {service.title}
                              </h3>
                              <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed">
                                {service.benefit}
                              </p>
                            </div>
                            <p className="mt-6 pt-4 border-t border-white/[0.07] font-mono text-xs text-violet-400">
                              {service.deliverables}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      {/* HOW I WORK (4-Step Timeline + Client CTAs) */}
                      <div
                        className={`mt-14 glass-surface rounded-2xl p-7 sm:p-10 ${
                          isClientHighlighted ? 'border-violet-500/30' : ''
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
                          <div>
                            <p className="text-xs font-mono text-violet-400">
                              How I Work
                            </p>
                            <h3 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-white">
                              From idea to live deployment
                            </h3>
                          </div>
                          <p className="text-sm font-medium text-violet-300">
                            {workflowTagline}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {workflowSteps.map((item) => (
                            <div key={item.step} className="relative">
                              <span className="font-mono text-xs font-semibold text-violet-400 tabular-nums">
                                Step {item.step}
                              </span>
                              <h4 className="mt-1.5 font-display text-base font-semibold text-white">
                                {item.title}
                              </h4>
                              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                                {item.detail}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                          <p className="text-xs sm:text-sm text-slate-400">
                            Ready to scope a WhatsApp bot, RAG tool, or ML workflow?
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            <a
                              href={profile.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                              Start a Project on WhatsApp
                            </a>
                            <a
                              href={profile.fiverrUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
                              Hire via Fiverr
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.section>
                  );
                }

                if (sectionKey === 'projects') {
                  return (
                    <motion.section
                      key="projects"
                      layout="position"
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      id="projects"
                      className={`max-w-6xl w-full mx-auto px-5 sm:px-8 py-24 sm:py-32 ${
                        orderIndex > 0 ? 'border-t border-white/[0.06]' : ''
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <p className="text-xs font-mono text-violet-400 tracking-wide">
                              Proof of Execution
                            </p>
                            {audienceMode === 'client' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-violet-400/40 bg-violet-500/15 text-[11px] font-medium text-violet-300">
                                Client Work &amp; Live Demos First
                              </span>
                            )}
                            {audienceMode === 'recruiter' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-violet-400/40 bg-violet-500/15 text-[11px] font-medium text-violet-300">
                                Tech Stack &amp; Measured Metrics
                              </span>
                            )}
                          </div>
                          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Featured Projects &amp; Client Work
                          </h2>
                        </div>

                        {/* Filter Tabs: All | ML | GenAI/RAG | Client Work */}
                        <div
                          role="tablist"
                          aria-label="Filter projects by category"
                          className="inline-flex flex-wrap items-center gap-1 p-1.5 rounded-2xl border border-white/10 bg-white/[0.02] self-start md:self-auto"
                        >
                          {(['All', 'ML', 'GenAI/RAG', 'Client Work'] as const).map(
                            (tab) => {
                              const active = activeFilter === tab;
                              return (
                                <button
                                  key={tab}
                                  type="button"
                                  role="tab"
                                  aria-selected={active}
                                  onClick={() => setActiveFilter(tab)}
                                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                                    active
                                      ? 'bg-violet-600 text-white font-semibold shadow-sm'
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {tab} ({filterCounts[tab]})
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                        {filteredProjects.map((project, index) => {
                          const isFeaturedWide =
                            filteredProjects.length % 2 === 1 && index === 0;

                          return (
                            <TiltProjectCard
                              key={project.id}
                              featuredWide={isFeaturedWide}
                              index={index}
                            >
                              <div>
                                {/* Badges Row: Category, Featured / Real Client Work, Try It Live */}
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="text-slate-400">
                                      {project.categories.join(' · ')}
                                    </span>

                                    {project.badge && (
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${
                                          project.clientWork
                                            ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                                            : 'border border-violet-500/40 bg-violet-500/15 text-violet-300'
                                        }`}
                                      >
                                        {project.badge}
                                      </span>
                                    )}

                                    {project.liveUrl && (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-violet-400/30 bg-violet-400/10 text-violet-300 font-medium">
                                        Try it live
                                      </span>
                                    )}
                                  </div>

                                  {project.featured ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full border border-violet-400/45 bg-violet-500/15 font-mono text-xs font-semibold text-violet-300 tabular-nums">
                                      88% Recall · 4% Gap
                                    </span>
                                  ) : (
                                    <span className="font-mono text-xs text-violet-400 tabular-nums">
                                      {project.highlightMetric}
                                    </span>
                                  )}
                                </div>

                                <h3 className="font-display text-2xl sm:text-[1.65rem] font-semibold text-white tracking-tight text-balance leading-snug">
                                  {project.title}
                                </h3>

                                {/* Short Business Impact Line */}
                                <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                                  <span className="font-semibold text-violet-400">
                                    Business impact:{' '}
                                  </span>
                                  {project.businessImpact}
                                </p>

                                {/* Problem -> Solution -> Result Breakdown */}
                                <div
                                  className={`mt-6 pt-6 border-t border-white/[0.08] grid gap-5 ${
                                    isFeaturedWide
                                      ? 'grid-cols-1 md:grid-cols-3'
                                      : 'grid-cols-1'
                                  }`}
                                >
                                  <div>
                                    <p className="text-xs font-medium text-slate-400">
                                      Problem
                                    </p>
                                    <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                                      {project.problem}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-violet-400">
                                      Solution
                                    </p>
                                    <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                                      {project.solution}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-200">
                                      Result
                                    </p>
                                    <p
                                      className={`mt-1 text-sm leading-relaxed ${
                                        project.featured
                                          ? 'text-violet-200 font-medium'
                                          : 'text-slate-300'
                                      }`}
                                    >
                                      {project.result}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-7 pt-6 border-t border-white/[0.08] flex flex-col gap-5">
                                {/* Tech Pills */}
                                <div className="flex flex-wrap gap-2">
                                  {project.stack.map((tech) => (
                                    <span
                                      key={tech}
                                      className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] font-mono text-xs text-slate-300 whitespace-nowrap"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-3">
                                  {project.liveUrl && (
                                    <a
                                      href={project.liveUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group/btn inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                                    >
                                      <ExternalLink
                                        className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                                        aria-hidden="true"
                                      />
                                      Live Demo
                                    </a>
                                  )}

                                  {project.githubUrl && (
                                    <a
                                      href={project.githubUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                                    >
                                      <Github className="w-3.5 h-3.5" aria-hidden="true" />
                                      GitHub
                                    </a>
                                  )}

                                  {!project.liveUrl && !project.githubUrl && (
                                    <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                                      <Lock
                                        className="w-3.5 h-3.5 text-slate-500"
                                        aria-hidden="true"
                                      />
                                      Private Client Deployment · No Public Demo Link
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TiltProjectCard>
                          );
                        })}
                      </div>
                    </motion.section>
                  );
                }

                // sectionKey === 'about'
                const isRecruiterHighlighted = audienceMode === 'recruiter';
                return (
                  <motion.section
                    key="about"
                    layout="position"
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    id="about"
                    className={`max-w-6xl w-full mx-auto px-5 sm:px-8 py-24 sm:py-32 ${
                      orderIndex > 0 ? 'border-t border-white/[0.06]' : ''
                    } ${
                      audienceMode === 'client'
                        ? 'opacity-90 hover:opacity-100 transition-opacity'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <p className="text-xs font-mono text-violet-400 tracking-wide">
                            Profile, Skills &amp; Education
                          </p>
                          {isRecruiterHighlighted && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-violet-400/40 bg-violet-500/15 text-[11px] font-medium text-violet-300">
                              Recruiter Overview · Immediate Joiner
                            </span>
                          )}
                        </div>
                        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                          About, Metrics &amp; Technical Skills
                        </h2>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <a
                          href={profile.resumeUrl}
                          download="Abhinandan_Sendhav_AI_ML_Resume.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden="true" />
                          Download Resume
                        </a>
                        <a
                          href={profile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" aria-hidden="true" />
                          GitHub
                        </a>
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-colors"
                        >
                          <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                          LinkedIn
                        </a>
                      </div>
                    </div>

                    {/* Bento Row 1: About Card (7 cols) + Animated Stats Stack (5 cols) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                      <div
                        className={`lg:col-span-7 glass-surface rounded-2xl p-7 sm:p-9 flex flex-col justify-between ${
                          isRecruiterHighlighted ? 'border-violet-500/30' : ''
                        }`}
                      >
                        <div>
                          <p className="text-xs font-mono text-violet-400">
                            About Abhinandan
                          </p>
                          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
                            {about.heading}
                          </h3>
                          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-[1.75]">
                            {about.bio}
                          </p>
                        </div>

                        <div className="mt-7 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                          <span className="text-xs text-slate-400">
                            B.Sc. Computer Science · DAVV University, Indore (2024–2027)
                          </span>
                          <a
                            href={profile.resumeUrl}
                            download="Abhinandan_Sendhav_AI_ML_Resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            <Download className="w-4 h-4" aria-hidden="true" />
                            Download Resume PDF
                          </a>
                        </div>
                      </div>

                      <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                        {stats.map((item) => (
                          <div
                            key={item.label}
                            className={`glass-surface rounded-2xl px-6 py-5 flex items-center justify-between gap-4 ${
                              isRecruiterHighlighted ? 'border-violet-500/25' : ''
                            }`}
                          >
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {item.label}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                {item.detail}
                              </p>
                            </div>
                            <AnimatedStatValue item={item} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bento Row 2: Skills Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {skills.map((group, groupIndex) => (
                        <motion.div
                          key={group.id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.15 }}
                          transition={{
                            duration: 0.38,
                            delay: groupIndex * 0.05,
                            ease: EASE_OUT,
                          }}
                          className={`glass-surface rounded-2xl p-6 sm:p-7 ${
                            isRecruiterHighlighted ? 'border-violet-500/25' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl border border-violet-500/30 bg-violet-500/10 flex items-center justify-center shrink-0">
                              <SkillIcon type={group.icon} />
                            </div>
                            <h3 className="font-display text-base sm:text-lg font-semibold text-white">
                              {group.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {group.items.map((skill, skillIndex) => (
                              <motion.span
                                key={skill}
                                initial={{ opacity: 0, scale: 0.92 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                  duration: 0.24,
                                  delay: groupIndex * 0.04 + skillIndex * 0.025,
                                  ease: EASE_OUT,
                                }}
                                className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs text-slate-200 whitespace-nowrap"
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bento Row 3: Experience & Education Timeline */}
                    <div
                      className={`glass-surface rounded-2xl p-7 sm:p-9 ${
                        isRecruiterHighlighted ? 'border-violet-500/30' : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
                        <div>
                          <p className="text-xs font-mono text-violet-400">
                            Experience, Training &amp; Education
                          </p>
                          <h3 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-white">
                            Background Timeline
                          </h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {timeline.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="w-8 h-8 rounded-xl border border-violet-500/30 bg-violet-500/10 flex items-center justify-center">
                                  <TimelineIcon type={item.type} />
                                </span>
                                <span className="font-mono text-xs text-violet-400 tabular-nums">
                                  {item.period}
                                </span>
                              </div>
                              <h4 className="font-display text-base font-semibold text-white">
                                {item.title}
                              </h4>
                              <p className="mt-1 text-xs font-medium text-slate-300">
                                {item.organization}
                              </p>
                              <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </LayoutGroup>

          {/* ================================================================
              2. IN-PAGE LIVE "ASK MY AI" SECTION
              ================================================================ */}
          <motion.section
            id="ask-ai"
            {...sectionReveal}
            className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32 border-t border-white/[0.06]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs font-mono text-violet-400 tracking-wide">
                  Interactive Assistant
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance leading-[1.12]">
                  Ask My AI anything before we talk.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
                  Powered by Gemini with a strict portfolio-grounded system prompt.
                  Ask about Abhinandan&apos;s RAG systems, WhatsApp chatbot architecture,
                  tech stack, or availability for your project or role.
                </p>

                <div className="mt-7 space-y-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" aria-hidden="true" />
                    Answers strictly from verified portfolio &amp; resume facts
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" aria-hidden="true" />
                    No fabricated stats, reviews, or unverified claims
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" aria-hidden="true" />
                    Also accessible anytime from the bottom-right chat button
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="animated-gradient-border shadow-2xl shadow-violet-950/25">
                  <AskMyAiPanel
                    messages={chatMessages}
                    input={chatInput}
                    isLoading={chatLoading}
                    error={chatError}
                    onInputChange={setChatInput}
                    onSend={handleSendChat}
                    whatsappUrl={profile.whatsappUrl}
                    email={profile.email}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* ================================================================
              6. CONTACT / CTA SECTION (WhatsApp + Email + LinkedIn + Inquiry Form)
              ================================================================ */}
          <motion.section
            id="contact"
            {...sectionReveal}
            className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-28 sm:pb-36 border-t border-white/[0.06]"
          >
            <div className="animated-gradient-border">
              <div className="rounded-[15px] bg-[#080C14]/95 backdrop-blur-xl p-7 sm:p-12 relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
                />

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
                  {/* Left: Direct Conversion CTAs */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-mono text-violet-400 tracking-wide">
                        Start a Conversation
                      </p>
                      <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance leading-[1.12]">
                        {contact.heading}
                      </h2>
                      <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                        {contact.subtext}
                      </p>

                      <p className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-violet-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                        {contact.replyTime}
                      </p>
                    </div>

                    <div className="mt-8 space-y-3">
                      <a
                        href={profile.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold transition-colors duration-150 shadow-lg shadow-emerald-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                      >
                        <MessageCircle className="w-4 h-4" aria-hidden="true" />
                        Chat on WhatsApp
                      </a>

                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={`mailto:${profile.email}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                        >
                          <Mail className="w-4 h-4" aria-hidden="true" />
                          Email
                        </a>

                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                        >
                          <Linkedin className="w-4 h-4" aria-hidden="true" />
                          LinkedIn
                        </a>

                        <a
                          href={profile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                        >
                          <Github className="w-4 h-4" aria-hidden="true" />
                          GitHub
                        </a>

                        <a
                          href={profile.fiverrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                        >
                          <ExternalLink className="w-4 h-4 text-violet-400" aria-hidden="true" />
                          Fiverr
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
                            Copied: {profile.email}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                            {profile.email}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right: Project Inquiry Form (Prefills mailto) */}
                  <form
                    onSubmit={handleInquirySubmit}
                    className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7 space-y-4"
                  >
                    <p className="font-display text-lg font-semibold text-white">
                      Quick Project Inquiry
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="inquiry-name"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          Name
                        </label>
                        <input
                          id="inquiry-name"
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#05070C]/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400/60"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="inquiry-email"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          Email
                        </label>
                        <input
                          id="inquiry-email"
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#05070C]/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400/60"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="inquiry-type"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          Project Type
                        </label>
                        <select
                          id="inquiry-type"
                          value={inquiryType}
                          onChange={(e) => setInquiryType(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#05070C] text-sm text-white focus:outline-none focus:border-violet-400/60"
                        >
                          <option value="AI Chatbot (WhatsApp / Website)">
                            AI Chatbot (WhatsApp / Website)
                          </option>
                          <option value="RAG System (Chat with Docs)">
                            RAG System (Chat with Docs)
                          </option>
                          <option value="Automation & Lead Follow-up">
                            Automation &amp; Lead Follow-up
                          </option>
                          <option value="ML / Prediction Solution">
                            ML / Prediction Solution
                          </option>
                          <option value="Internship / Entry-Level AI Role">
                            Internship / Entry-Level AI Role
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="inquiry-budget"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          Budget Range
                        </label>
                        <select
                          id="inquiry-budget"
                          value={inquiryBudget}
                          onChange={(e) => setInquiryBudget(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#05070C] text-sm text-white focus:outline-none focus:border-violet-400/60"
                        >
                          <option value="Under ₹15,000 (<$200)">
                            Under ₹15,000 (&lt;$200)
                          </option>
                          <option value="₹15,000 – ₹40,000 ($200 – $500)">
                            ₹15,000 – ₹40,000 ($200 – $500)
                          </option>
                          <option value="₹40,000+ ($500+)">
                            ₹40,000+ ($500+)
                          </option>
                          <option value="Internship / Full-Time Role">
                            Internship / Full-Time Role
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-message"
                        className="block text-xs font-medium text-slate-300 mb-1.5"
                      >
                        Project Details
                      </label>
                      <textarea
                        id="inquiry-message"
                        rows={3}
                        required
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Tell me briefly what you want to automate or build..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#05070C]/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400/60 resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" aria-hidden="true" />
                        Send Inquiry via Email
                      </button>

                      {inquiryNotice && (
                        <p className="text-xs text-violet-300 leading-snug">
                          {inquiryNotice}
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        {/* ================================================================
            MOBILE STICKY WHATSAPP BUTTON + FLOATING ASK MY AI + BACK TO TOP
            ================================================================ */}
        <a
          href={profile.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Abhinandan on WhatsApp"
          className="md:hidden fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-xl shadow-emerald-500/25 transition-colors"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          WhatsApp
        </a>

        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="fixed bottom-20 right-5 z-40 inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-[#090D16]/90 backdrop-blur-md text-slate-200 hover:text-white hover:border-violet-400/50 shadow-xl shadow-black/40 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>

        <FloatingAskAiWidget
          messages={chatMessages}
          input={chatInput}
          isLoading={chatLoading}
          error={chatError}
          onInputChange={setChatInput}
          onSend={handleSendChat}
          whatsappUrl={profile.whatsappUrl}
          email={profile.email}
        />

        {/* ================================================================
            FOOTER
            ================================================================ */}
        <footer className="relative z-10 border-t border-white/[0.06] bg-[#04060A]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-9 pb-24 md:pb-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} {profile.name}. Built in{' '}
              {profile.location}.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothNav(e, link.href)}
                  className="hover:text-slate-200 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
