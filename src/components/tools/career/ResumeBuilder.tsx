import React, { useState, useRef } from 'react';
import { ResultCard } from '../../common/ResultCard';
import {
  Briefcase,
  Download,
  Printer,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  CheckCircle2,
  FileText,
  Upload,
  Eye,
  EyeOff,
  Layers,
  Award,
  BookOpen,
  User,
  ShieldCheck,
  RotateCcw,
  Palette,
  Phone,
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  FolderPlus,
  Copy,
} from 'lucide-react';
import { downloadText } from '../../../utils/download';
import { renderDynamicResumeTemplate } from './ResumeTemplateRenderers';

export interface ResumeData {
  // 1. Personal Details
  fullName: string;
  fatherName: string;
  showFatherName: boolean;
  roleTitle: string;
  email: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  dob: string;
  gender: string;
  nationality: string;
  city: string;
  country: string;
  address: string;
  zipCode: string;
  website: string;
  github: string;
  linkedin: string;
  portfolio: string;
  photoUrl: string;
  photoShape: 'circle' | 'square' | 'rounded';

  // 2. Summary
  summary: string;

  // 3. Education
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    grade: string;
    city: string;
    courses: string;
  }[];

  // 4. Experience
  experience: {
    id: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    bullets: string;
  }[];

  // 5. Skills Matrix
  skills: { id: string; category: string; items: string }[];

  // 6. Projects
  projects: { id: string; title: string; tech: string; link: string; description: string }[];

  // 7. Certifications & Honors
  certifications: { id: string; name: string; issuer: string; year: string }[];
  achievements: { id: string; title: string; year: string; details: string }[];
  languages: { id: string; name: string; fluency: string }[];
}

const TEMPLATES = [
  { id: 'modern', name: '1. Modern Clean', desc: 'Sleek header with structured sections' },
  { id: 'ats', name: '2. ATS Standard Single Column', desc: 'High-parseability single column layout' },
  { id: 'sidebar', name: '3. Modern Sidebar Left', desc: 'Left accent sidebar for skills and contact' },
  { id: 'sidebar_right', name: '4. Modern Sidebar Right', desc: 'Right accent sidebar for contact & competencies' },
  { id: 'bold_header', name: '5. Bold Accent Banner', desc: 'Solid color top block header with white text' },
  { id: 'two_col', name: '6. Clean Split Columns', desc: 'Balanced 50/50 experience and education split' },
  { id: 'tech', name: '7. Tech & Developer Terminal', desc: 'Monospace badges for programming stacks' },
  { id: 'student', name: '8. Student & Fresh Graduate', desc: 'Education and project focused hierarchy' },
  { id: 'minimal', name: '9. Minimal Editorial Serif', desc: 'Clean black-and-white typography' },
  { id: 'creative', name: '10. Creative Portfolio', desc: 'Vibrant accent cards and project links' },
  { id: 'engineering', name: '11. Engineering & STEM Impact', desc: 'Structured technical impact layout' },
  { id: 'business', name: '12. Business & Finance Flow', desc: 'Executive metrics and leadership flow' },
  { id: 'academic', name: '13. Academic & Research CV', desc: 'Publications and honors oriented' },
  { id: 'executive', name: '14. Senior Executive Split', desc: 'Strategic management summary view' },
  { id: 'elegant', name: '15. Elegant Serif Borders', desc: 'Sophisticated typography and borders' },
  { id: 'simple', name: '16. Simple Minimalist', desc: 'Pure essential info without clutter' },
  { id: 'portfolio', name: '17. Interactive Portfolio', desc: 'Highlighted project showcases' },
  { id: 'internship', name: '18. Internship Candidate', desc: 'Highlights coursework & extracurriculars' },
  { id: 'entry_level', name: '19. Entry-Level Career', desc: 'Fast skills-first layout' },
  { id: 'compact', name: '20. Ultra-Compact 1-Page', desc: 'Fits maximum info cleanly in 1 page' },
  { id: 'timeline', name: '21. Chronological Timeline', desc: 'Left-aligned vertical timeline markers' },
  { id: 'split_modern', name: '22. Split Tone Gradient', desc: 'Modern dual-tone visual division' },
  { id: 'minimal_grid', name: '23. Minimalist 2x2 Grid', desc: 'Structured matrix information boxes' },
  { id: 'accent_stripe', name: '24. Left Accent Stripe', desc: 'Solid colorful left boundary line' },
  { id: 'headline_focus', name: '25. Headline Hero', desc: 'Emphasized personal brand tagline' },
  { id: 'boxed_cards', name: '26. Segmented Cards', desc: 'Individual rounded cards per section' },
  { id: 'serif_classic', name: '27. Traditional Law & Med', desc: 'Formal serif standard for medicine & law' },
  { id: 'developer_pro', name: '28. Developer Terminal', desc: 'Terminal header with code-block badges' },
  { id: 'executive_banner', name: '29. Navy Executive Banner', desc: 'Dark corporate title bar with sub-columns' },
  { id: 'creative_split', name: '30. Asymmetrical Creative', desc: 'Artistic 35/65 asymmetric layout' },
  { id: 'modern_border', name: '31. Framed Outline', desc: 'Geometric bordered outer frame' },
  { id: 'clean_dots', name: '32. Dotted Minimal', desc: 'Dotted separator section styling' },
  { id: 'ivy_league', name: '33. Ivy League Academic', desc: 'Conservative collegiate Harvard style' },
  { id: 'nordic', name: '34. Nordic Clean Line', desc: 'Scandinavian airy whitespace layout' },
  { id: 'swiss_design', name: '35. Swiss International', desc: 'Grid-aligned bold typography' },
  { id: 'monospace_clean', name: '36. Clean Monospace', desc: 'Uniform monospace alignment' },
  { id: 'high_contrast', name: '37. High-Contrast B&W', desc: 'Ultra-clear black and white text' },
  { id: 'dual_accent', name: '38. Dual-Tone Accent', desc: 'Primary + secondary accent highlights' },
  { id: 'infographic_light', name: '39. Skill Badges Light', desc: 'Pill badges for technical competencies' },
  { id: 'leadership_pro', name: '40. Leadership Director', desc: 'Executive leadership competencies first' },
];

const ACTION_VERBS = [
  'Architected', 'Engineered', 'Spearheaded', 'Optimized', 'Automated',
  'Developed', 'Orchestrated', 'Reduced', 'Accelerated', 'Collaborated'
];

export const ResumeBuilder: React.FC = () => {
  const [tab, setTab] = useState<'content' | 'templates' | 'design' | 'helpers' | 'check'>('content');
  const [template, setTemplate] = useState('modern');
  const [accentColor, setAccentColor] = useState('#0284c7');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');

  const [data, setData] = useState<ResumeData>({
    fullName: 'Alex Morgan',
    fatherName: 'David Morgan',
    showFatherName: false,
    roleTitle: 'Software Engineer & Computer Science Graduate',
    email: 'alex.morgan@university.edu',
    phonePrimary: '+1 (555) 234-5678',
    phoneSecondary: '',
    whatsapp: '+1 (555) 234-5678',
    dob: '2002-04-15',
    gender: 'Male',
    nationality: 'American',
    city: 'Boston',
    country: 'USA',
    address: '128 Beacon Street, Apt 4B',
    zipCode: '02116',
    website: 'alexmorgan.dev',
    github: 'github.com/alexmorgan',
    linkedin: 'linkedin.com/in/alexmorgan',
    portfolio: 'portfolio.alexmorgan.dev',
    photoUrl: '',
    photoShape: 'circle',
    summary:
      'High-achieving Computer Science graduate with solid expertise in scalable distributed algorithms, React frontend architecture, and full-stack systems engineering. Passionate about developing high-performance, user-centric software solutions.',
    education: [
      {
        id: '1',
        institution: 'Northeastern University',
        degree: 'B.S. in Computer Science',
        field: 'Software Systems & AI Minor',
        startDate: '2023',
        endDate: '2027',
        isCurrent: false,
        grade: '3.92 / 4.00 CGPA',
        city: 'Boston, MA',
        courses: 'Distributed Systems, Data Structures, Machine Learning, Database Design',
      },
    ],
    experience: [
      {
        id: '1',
        role: 'Software Engineering Intern',
        company: 'Vanguard Tech Labs',
        location: 'Boston, MA',
        startDate: 'June 2025',
        endDate: 'August 2025',
        isCurrent: false,
        bullets:
          '• Engineered real-time event ingestion microservices handling 2.5M+ daily records in TypeScript and Node.js.\n• Optimized React state management and bundle payload, reducing First Contentful Paint by 38%.\n• Collaborated in an agile scrum team of 8 engineers and authored 12 REST API specifications.',
      },
    ],
    skills: [
      { id: '1', category: 'Programming Languages', items: 'TypeScript, Python, JavaScript, Java, Go, SQL, C++' },
      { id: '2', category: 'Frameworks & Web', items: 'React, Node.js, Next.js, Express, Tailwind CSS, Jest' },
      { id: '3', category: 'Cloud & Developer Tools', items: 'Docker, AWS (S3, Lambda), Git, PostgreSQL, Redis, Linux' },
    ],
    projects: [
      {
        id: '1',
        title: 'Distributed Raft Key-Value Engine',
        tech: 'Go, Raft Consensus, gRPC',
        link: 'github.com/alexmorgan/raft-kv',
        description:
          'Implemented a fault-tolerant distributed storage cluster with leader election, heartbeat timeouts, and log compaction passing Jepsen consistency tests.',
      },
      {
        id: '2',
        title: 'STUDKIT Academic Operating System',
        tech: 'React, TypeScript, Vite, Web APIs',
        link: 'studkit.app',
        description:
          'Created a privacy-first web utility suite featuring 100+ tools, 40 resume templates, and grounded AI study modules with zero server-side data retention.',
      },
    ],
    certifications: [
      { id: '1', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025' },
    ],
    achievements: [
      { id: '1', title: '1st Place Winner — University Hackathon', year: '2024', details: 'Built an AI study tutor for 1,200+ campus students.' },
      { id: '2', title: 'Dean’s Honor List (4 Consecutive Semesters)', year: '2023 – 2025', details: 'Maintained top 5% GPA across CS department.' },
    ],
    languages: [
      { id: '1', name: 'English', fluency: 'Native / Bilingual' },
      { id: '2', name: 'Spanish', fluency: 'Conversational' },
    ],
  });

  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setData({ ...data, photoUrl: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    downloadText(JSON.stringify(data, null, 2), 'STUDKIT_Resume_Data.json');
  };

  const calculateScore = () => {
    let score = 30;
    if (data.fullName && data.email && data.phonePrimary && data.city) score += 20;
    if (data.summary && data.summary.length > 50) score += 15;
    if (data.education.length > 0) score += 15;
    if (data.experience.length > 0) score += 10;
    if (data.skills.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const atsScore = calculateScore();

  // Render Template-Specific Dynamic Layout Engine
  const renderTemplateCanvas = () => {
    return (
      <div
        ref={resumeRef}
        id="printable-resume"
        className="w-full max-w-[650px] min-h-[850px] bg-white text-gray-900 rounded-2xl shadow-2xl select-text border border-gray-200 overflow-hidden transition-all duration-300 animate-fade-in"
      >
        {renderDynamicResumeTemplate(template, data, accentColor, fontFamily)}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Studio Header Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-4 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Professional ATS Resume Studio</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Score: {atsScore}%
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">40 distinct layout architectures with instant real-time live preview.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/25 flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-3 py-2 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Editor & Toolset Deck */}
        <div className="lg:col-span-5 bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 max-h-[850px] overflow-y-auto print:hidden shadow-xl">
          {/* Sub-tabs */}
          <div className="flex rounded-2xl bg-theme-bg p-1 border border-theme-border overflow-x-auto scrollbar-none">
            {[
              { id: 'content', label: 'Content' },
              { id: 'templates', label: 'Templates (40)' },
              { id: 'design', label: 'Design' },
              { id: 'helpers', label: 'AI Helper' },
              { id: 'check', label: 'ATS Check' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  tab === t.id ? 'bg-theme-accent text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Content Sections */}
          {tab === 'content' && (
            <div className="space-y-6">
              {/* Personal Details */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-theme-text uppercase tracking-wider block">Personal & Contact Information</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={e => setData({ ...data, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text font-bold"
                  />
                  <input
                    type="text"
                    value={data.roleTitle}
                    onChange={e => setData({ ...data, roleTitle: e.target.value })}
                    placeholder="Target Role / Headline"
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData({ ...data, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
                  />
                  <input
                    type="text"
                    value={data.phonePrimary}
                    onChange={e => setData({ ...data, phonePrimary: e.target.value })}
                    placeholder="Primary Contact Number"
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={data.city}
                    onChange={e => setData({ ...data, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
                  />
                  <input
                    type="text"
                    value={data.country}
                    onChange={e => setData({ ...data, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
                  />
                  <input
                    type="text"
                    value={data.github}
                    onChange={e => setData({ ...data, github: e.target.value })}
                    placeholder="GitHub Profile"
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-theme-text uppercase tracking-wider block">Profile Summary</span>
                <textarea
                  value={data.summary}
                  onChange={e => setData({ ...data, summary: e.target.value })}
                  className="w-full h-24 p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text resize-none outline-none leading-relaxed"
                />
              </div>

              {/* Education Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-theme-text uppercase tracking-wider">Education & Degrees</span>
                  <button
                    onClick={() =>
                      setData({
                        ...data,
                        education: [
                          ...data.education,
                          {
                            id: Math.random().toString(36).substring(7),
                            institution: 'University / Institute Name',
                            degree: 'Degree / Qualification',
                            field: 'Major / Specialization',
                            startDate: '2024',
                            endDate: '2028',
                            isCurrent: false,
                            grade: '3.85 CGPA',
                            city: 'City, Country',
                            courses: '',
                          },
                        ],
                      })
                    }
                    className="text-xs text-theme-accent hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" /> Add Degree
                  </button>
                </div>

                {data.education.map((edu, idx) => (
                  <div key={edu.id} className="p-3.5 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={e => {
                          const next = [...data.education];
                          next[idx].institution = e.target.value;
                          setData({ ...data, education: next });
                        }}
                        placeholder="Institution Name"
                        className="w-2/3 px-2 py-1 rounded-lg bg-theme-surface border border-theme-border text-xs font-bold text-theme-text"
                      />
                      <button
                        onClick={() =>
                          setData({ ...data, education: data.education.filter(e => e.id !== edu.id) })
                        }
                        className="text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => {
                          const next = [...data.education];
                          next[idx].degree = e.target.value;
                          setData({ ...data, education: next });
                        }}
                        placeholder="Degree"
                        className="w-full px-2 py-1 rounded-lg bg-theme-surface border border-theme-border text-theme-text"
                      />
                      <input
                        type="text"
                        value={edu.grade}
                        onChange={e => {
                          const next = [...data.education];
                          next[idx].grade = e.target.value;
                          setData({ ...data, education: next });
                        }}
                        placeholder="GPA / Percentage"
                        className="w-full px-2 py-1 rounded-lg bg-theme-surface border border-theme-border text-theme-text"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-theme-text uppercase tracking-wider">Work Experience & Internships</span>
                  <button
                    onClick={() =>
                      setData({
                        ...data,
                        experience: [
                          ...data.experience,
                          {
                            id: Math.random().toString(36).substring(7),
                            role: 'Associate / Intern',
                            company: 'Company Name',
                            location: 'Remote / City',
                            startDate: '2025',
                            endDate: 'Present',
                            isCurrent: true,
                            bullets: '• Developed key features and supported team deliverables.',
                          },
                        ],
                      })
                    }
                    className="text-xs text-theme-accent hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" /> Add Job
                  </button>
                </div>

                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-3.5 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={e => {
                          const next = [...data.experience];
                          next[idx].role = e.target.value;
                          setData({ ...data, experience: next });
                        }}
                        placeholder="Job Title"
                        className="w-2/3 px-2 py-1 rounded-lg bg-theme-surface border border-theme-border text-xs font-bold text-theme-text"
                      />
                      <button
                        onClick={() =>
                          setData({ ...data, experience: data.experience.filter(e => e.id !== exp.id) })
                        }
                        className="text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => {
                          const next = [...data.experience];
                          next[idx].company = e.target.value;
                          setData({ ...data, experience: next });
                        }}
                        placeholder="Company"
                        className="w-full px-2 py-1 rounded-lg bg-theme-surface border border-theme-border text-theme-text"
                      />
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={e => {
                          const next = [...data.experience];
                          next[idx].startDate = e.target.value;
                          setData({ ...data, experience: next });
                        }}
                        placeholder="Duration"
                        className="w-full px-2 py-1 rounded-lg bg-theme-surface border border-theme-border text-theme-text"
                      />
                    </div>

                    <textarea
                      value={exp.bullets}
                      onChange={e => {
                        const next = [...data.experience];
                        next[idx].bullets = e.target.value;
                        setData({ ...data, experience: next });
                      }}
                      placeholder="Bullet points (start with • and action verbs)"
                      className="w-full h-20 p-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-text font-mono resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Templates Picker */}
          {tab === 'templates' && (
            <div className="space-y-4">
              <div className="text-xs text-theme-text-muted">
                Select from 40 recruiter-approved formatting templates:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      template === t.id
                        ? 'bg-theme-accent text-white border-theme-accent shadow-md shadow-theme-accent/25'
                        : 'bg-theme-bg border-theme-border text-theme-text hover:bg-theme-surface'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{t.name}</div>
                      <div className={`text-[10px] mt-0.5 ${template === t.id ? 'text-white/80' : 'text-theme-text-muted'}`}>
                        {t.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Design & Styling */}
          {tab === 'design' && (
            <div className="space-y-6">
              {/* Accent Color Palette */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-theme-text-muted">Accent Color Theme</label>
                <div className="flex flex-wrap items-center gap-2">
                  {['#0284c7', '#0f172a', '#10b981', '#6366f1', '#e11d48', '#d97706', '#475569'].map(c => (
                    <button
                      key={c}
                      onClick={() => setAccentColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        accentColor === c ? 'scale-110 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={e => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-full border cursor-pointer"
                  />
                </div>
              </div>

              {/* Typography Font */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-theme-text-muted">Typography Family</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sans', label: 'Clean Sans (Inter)' },
                    { id: 'serif', label: 'Classic Serif' },
                    { id: 'mono', label: 'Developer Mono' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFontFamily(f.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        fontFamily === f.id
                          ? 'bg-theme-accent text-white border-theme-accent'
                          : 'bg-theme-bg border-theme-border text-theme-text'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2 pt-2 border-t border-theme-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-theme-text">Profile Photo (Optional)</span>
                  {data.photoUrl && (
                    <button
                      onClick={() => setData({ ...data, photoUrl: '' })}
                      className="text-rose-400 hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-theme-text-muted file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-theme-accent file:text-white file:text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Content AI Helpers */}
          {tab === 'helpers' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-theme-text uppercase tracking-wider block">Action Verb Starter Bank</span>
              <div className="flex flex-wrap gap-1.5">
                {ACTION_VERBS.map(v => (
                  <button
                    key={v}
                    onClick={() => navigator.clipboard.writeText(v + ' ')}
                    className="px-2.5 py-1 rounded-lg bg-theme-bg border border-theme-border text-xs font-mono text-cyan-400 hover:bg-theme-accent hover:text-white"
                  >
                    + {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ATS Quality Check */}
          {tab === 'check' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border text-center space-y-2">
                <span className="text-[10px] uppercase font-mono text-theme-text-muted">ATS Parser Readiness</span>
                <div className="text-4xl font-black font-mono text-emerald-400">{atsScore}%</div>
                <p className="text-xs text-theme-text-muted">
                  {atsScore >= 85 ? '🌟 Excellent! High recruiter parseability.' : '⚠️ Add missing details to reach 90%+.'}
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Full Contact Information
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Quantified Achievement Bullets
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Categorized Skills Matrix
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Printable A4 Canvas */}
        <div className="lg:col-span-7 flex justify-center overflow-x-auto">
          {renderTemplateCanvas()}
        </div>
      </div>
    </div>
  );
};
