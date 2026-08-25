import React from 'react';
import { Box, Heart, ShieldCheck, Zap, Sparkles, PlayCircle } from 'lucide-react';
import { ToolCategory } from '../../types';

interface FooterProps {
  onSelectCategory: (cat: ToolCategory) => void;
  onReplayIntro: () => void;
  onOpenBlog?: (slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onReplayIntro, onOpenBlog }) => {
  return (
    <footer className="w-full bg-theme-surface/60 border-t border-theme-border mt-20 pt-16 pb-28 lg:pb-16 text-theme-text-muted text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-theme-bg border border-theme-accent/40 flex items-center justify-center shadow-lg shadow-theme-accent/15">
                <img src="/assets/studkit-logo.png" alt="STUDKIT Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-theme-text">
                STUD<span className="text-theme-accent">KIT</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-theme-text-muted max-w-sm leading-relaxed">
              "Everything Students Need. One Powerful Toolkit." Free, private, client-side academic utility platform for students worldwide.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs pt-2">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Privacy
              </span>
              <span className="inline-flex items-center gap-1 text-cyan-400 font-mono">
                <Zap className="w-3.5 h-3.5" /> Zero Mandatory Login
              </span>
            </div>
            <div>
              <button
                onClick={onReplayIntro}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text hover:border-theme-accent transition-all"
              >
                <PlayCircle className="w-3.5 h-3.5 text-theme-accent" />
                <span>Replay Cinematic Intro Video</span>
              </button>
            </div>
          </div>

          {/* Academic & AI */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text mb-4">
              Academic & AI
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('ai')} className="hover:text-theme-accent transition-colors">
                  AI Document Grounding & MCQs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('ai')} className="hover:text-theme-accent transition-colors">
                  Adaptive Quiz & Practice Tests
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('calculators')} className="hover:text-theme-accent transition-colors">
                  CGPA & Attendance Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('math')} className="hover:text-theme-accent transition-colors">
                  Step-by-Step Quadratic & Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Document & Media */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text mb-4">
              Document & Media
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('image')} className="hover:text-theme-accent transition-colors">
                  Passport Size Photo Maker
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('image')} className="hover:text-theme-accent transition-colors">
                  Exact KB/MB Image Compressor
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('pdf')} className="hover:text-theme-accent transition-colors">
                  PDF Merge, Split & Rotate
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('image')} className="hover:text-theme-accent transition-colors">
                  Digital Signature Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Mind Lab & Relax */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text mb-4">
              Mind Lab & Relax
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('mind')} className="hover:text-theme-accent transition-colors text-left">
                  IQ Practice & Reasoning Engine
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('mind')} className="hover:text-theme-accent transition-colors text-left">
                  Number Memory & Stroop Test
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('games')} className="hover:text-theme-accent transition-colors text-left">
                  Drawing & Pixel Art Studio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('games')} className="hover:text-theme-accent transition-colors text-left">
                  2048, Sudoku & Stress Relief
                </button>
              </li>
            </ul>
          </div>

          {/* Student Guides & Blog */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">
              Student Guides & Blog
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenBlog?.('how-to-calculate-cgpa')}
                  className="hover:text-theme-accent transition-colors text-left"
                >
                  How to Calculate GPA & CGPA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBlog?.('how-to-make-ats-friendly-resume')}
                  className="hover:text-theme-accent transition-colors text-left"
                >
                  ATS Student Resume Guide 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBlog?.('how-to-study-effectively-with-ai')}
                  className="hover:text-theme-accent transition-colors text-left"
                >
                  Active Recall & AI MCQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBlog?.('how-to-calculate-safe-attendance-bunks')}
                  className="hover:text-theme-accent transition-colors text-left"
                >
                  75% Attendance & Safe Bunks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBlog?.()}
                  className="text-theme-accent hover:underline font-bold transition-colors text-left pt-1 block"
                >
                  View All Knowledge Guides →
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-theme-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} STUDKIT. Built for students worldwide.</p>
          <div className="flex items-center gap-1 text-theme-text-muted">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for academic productivity & stress relief</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
