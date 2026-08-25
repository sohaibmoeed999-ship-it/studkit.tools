import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  FileText,
  Brain,
  Search,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Zap,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface SmartOnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTool: (toolId: string) => void;
}

interface Step {
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  actionToolId?: string;
  actionLabel?: string;
  tips: string[];
}

const ONBOARDING_STEPS: Step[] = [
  {
    title: 'Welcome to STUDKIT OS',
    badge: '100% Free & Privacy First',
    subtitle: 'Your All-in-One Digital Academic & Student Toolbox',
    description:
      'STUDKIT brings together 110+ verified student utilities for exam preparation, document editing, media processing, career building, and brain training—completely in your browser.',
    icon: Sparkles,
    color: 'from-cyan-500 to-blue-600',
    tips: [
      'No mandatory accounts or logins required.',
      '100% client-side privacy: your files stay on your device.',
      'Instant access to all tools from the central directory.',
    ],
  },
  {
    title: 'AI Document & Quiz Engine',
    badge: 'AI Study Lab',
    subtitle: 'Transform lecture notes, PDFs, & textbooks into MCQs',
    description:
      'Upload study notes, PDFs, or scanned assignments to generate exact 1–100 count grounded practice MCQs, interactive flashcards, and key conceptual summaries.',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    actionToolId: 'ai-document-mcq',
    actionLabel: 'Try AI Quiz Engine',
    tips: [
      'Strips internal PDF syntax and extracts clean educational facts.',
      'Generates exact question counts (1 to 100 questions).',
      'Test your answers live with instant source citations.',
    ],
  },
  {
    title: '40 ATS Resume Template Engine',
    badge: 'Career Studio',
    subtitle: 'Professional, ATS-compliant CVs with live preview morphing',
    description:
      'Switch between 40 distinct architectural layouts (Modern Clean, ATS Single-Column, Left/Right Sidebars, Tech Monospace) with zero data loss and instant PDF export.',
    icon: FileText,
    color: 'from-purple-500 to-pink-600',
    actionToolId: 'resume-builder',
    actionLabel: 'Open Resume Builder',
    tips: [
      'Switch templates dynamically while keeping all your resume data.',
      'Customize fonts, heading weights, spacing, and accent colors.',
      'Export directly to clean printable PDF.',
    ],
  },
  {
    title: 'Mind Lab & Relax & Fun Games',
    badge: 'Brain Sprints & Zen Zone',
    subtitle: 'Sharpen cognitive speed & relax with smooth drawing',
    description:
      'Practice IQ matrix reasoning, reaction timers, and number memory in Mind Lab, or relax with the anti-aliased Smooth Drawing Studio, 2048, and casual puzzles.',
    icon: Brain,
    color: 'from-amber-500 to-orange-600',
    actionToolId: 'drawing-creativity-lab',
    actionLabel: 'Launch Drawing Studio',
    tips: [
      '12 Dedicated Mind Lab tools for cognitive training.',
      'Smooth vector drawing canvas with VS Computer and 2-Player modes.',
      'Stress-relief breathing and focus tools.',
    ],
  },
  {
    title: '110+ Utilities & Smart Search',
    badge: 'Shortcut: Ctrl + K',
    subtitle: 'Find any tool instantly across the entire platform',
    description:
      'Press Ctrl + K anytime to launch Global Smart Search. Search by natural keywords like "pdf merge", "bg remove", "bill split", "camera scan", or "dates".',
    icon: Search,
    color: 'from-emerald-500 to-teal-600',
    actionToolId: 'all',
    actionLabel: 'Explore All 110+ Tools',
    tips: [
      'Document Camera Scanner with live HD camera capture and PDF export.',
      'Background Remover with 100 MB limit and custom 2-color themes.',
      'Video Studio supporting lecture clips up to 1 GB.',
    ],
  },
];

export const SmartOnboardingGuide: React.FC<SmartOnboardingGuideProps> = ({
  isOpen,
  onClose,
  onOpenTool,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;

  const handleFinish = () => {
    if (dontShowAgain) {
      localStorage.setItem('studkit_onboarded_v2', 'true');
    }
    onClose();
  };

  const handleAction = () => {
    if (step.actionToolId) {
      handleFinish();
      onOpenTool(step.actionToolId);
    } else {
      handleFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xl bg-theme-surface border border-theme-border rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Top Header Bar with Step Badge & Close */}
        <div className="p-5 sm:p-6 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-theme-accent/15 text-theme-accent border border-theme-accent/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Step {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
            </span>
            <span className="text-xs font-mono text-theme-text-muted hidden sm:inline">
              • {step.badge}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="p-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text-muted hover:text-theme-text transition-all active:scale-95 cursor-pointer"
            title="Close Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Content Area */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Step Icon Header */}
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} p-0.5 shadow-lg flex-shrink-0`}
            >
              <div className="w-full h-full bg-theme-bg rounded-[14px] flex items-center justify-center text-theme-accent">
                <Icon className="w-7 h-7" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-theme-text tracking-tight">
                {step.title}
              </h3>
              <p className="text-xs font-semibold text-theme-accent mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Step Description */}
          <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
            {step.description}
          </p>

          {/* Quick Tips List */}
          <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-theme-accent block">
              Key Capabilities:
            </span>
            <ul className="space-y-1.5 text-xs text-theme-text">
              {step.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step Navigation Dots & Actions Footer */}
        <div className="p-5 sm:p-6 bg-theme-bg border-t border-theme-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Progress Dots */}
            <div className="flex items-center gap-1.5">
              {ONBOARDING_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentStep === idx
                      ? 'w-6 bg-theme-accent'
                      : 'w-2 bg-theme-border hover:bg-theme-text-muted'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Don't show again toggle */}
            <label className="flex items-center gap-1.5 text-[11px] text-theme-text-muted cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={e => setDontShowAgain(e.target.checked)}
                className="rounded accent-theme-accent"
              />
              <span>Don't show on start</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(s => s - 1)}
                className="px-4 py-2.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {step.actionLabel && (
              <button
                onClick={handleAction}
                className="px-4 py-2.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-accent/40 text-xs font-bold text-theme-accent flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <span>{step.actionLabel}</span>
              </button>
            )}

            {!isLast ? (
              <button
                onClick={() => setCurrentStep(s => s + 1)}
                className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black tracking-wide shadow-xl shadow-cyan-500/25 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Exploring</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
