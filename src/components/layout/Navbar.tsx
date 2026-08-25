import React, { useState } from 'react';
import {
  Box,
  Search,
  Sparkles,
  PlayCircle,
  Menu,
  X,
  Compass,
  BookOpen,
} from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { ToolCategory } from '../../types';

interface NavbarProps {
  onOpenSearch: () => void;
  onSelectCategory: (cat: ToolCategory) => void;
  selectedCategory: ToolCategory;
  onReplayIntro: () => void;
  onNavigateHome: () => void;
  onOpenBlog?: () => void;
  isBlogActive?: boolean;
  onOpenOnboarding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onSelectCategory,
  selectedCategory,
  onReplayIntro,
  onNavigateHome,
  onOpenBlog,
  isBlogActive = false,
  onOpenOnboarding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; cat: ToolCategory }[] = [
    { label: 'All Tools', cat: 'all' },
    { label: 'Documentation', cat: 'pdf' },
    { label: 'Images', cat: 'image' },
    { label: 'Calculators', cat: 'calculators' },
    { label: 'Productivity', cat: 'productivity' },
    { label: 'Career', cat: 'career' },
    { label: 'Developer', cat: 'developer' },
    { label: 'Mind Lab', cat: 'mind' },
    { label: 'Relax & Fun', cat: 'games' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-theme-bg/85 border-b border-theme-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo with Official Image */}
        {/* Brand Logo with Interactive Animation */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          title="STUDKIT Home"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-theme-bg border border-theme-accent/40 flex items-center justify-center shadow-lg shadow-theme-accent/15 group-hover:scale-110 group-hover:-rotate-2 group-hover:border-theme-accent group-hover:shadow-[0_0_25px_var(--accent-glow)] transition-all duration-300">
            <img
              src="/assets/studkit-logo.png"
              alt="STUDKIT Logo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="text-left">
            <span className="text-xl font-extrabold tracking-wider text-theme-text group-hover:text-theme-accent transition-colors duration-200 flex items-center gap-0.5">
              <span>STUD</span><span className="text-theme-accent group-hover:text-cyan-400 transition-colors">KIT</span>
            </span>
            <span className="hidden xl:block text-[10px] uppercase font-mono tracking-widest text-theme-text-muted -mt-1 group-hover:text-theme-text transition-colors">
              Student OS
            </span>
          </div>
        </button>

        {/* Desktop Quick Nav Categories - Smooth Scrolling with Zero Overlap */}
        <div className="hidden lg:flex items-center flex-1 max-w-xl xl:max-w-2xl mx-3 overflow-hidden relative">
          <nav className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none scroll-smooth w-full select-none">
            {navLinks.map(item => {
              const isActive = !isBlogActive && selectedCategory === item.cat;
              return (
                <button
                  key={item.cat}
                  onClick={() => onSelectCategory(item.cat)}
                  className={`nav-pill-stylish px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 active:scale-95 border transition-all cursor-pointer ${
                    isActive
                      ? 'active bg-theme-accent text-white border-theme-accent shadow-lg shadow-theme-accent/30 scale-[1.03]'
                      : 'bg-theme-surface/70 border-theme-border/70 text-theme-text-muted hover:text-theme-text hover:border-theme-accent/40 hover:bg-theme-surface'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}

            {onOpenBlog && (
              <button
                onClick={onOpenBlog}
                className={`nav-pill-stylish px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 active:scale-95 border transition-all cursor-pointer ${
                  isBlogActive
                    ? 'active bg-theme-accent text-white border-theme-accent shadow-lg shadow-theme-accent/30 scale-[1.03]'
                    : 'bg-theme-surface/70 border-theme-border/70 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-theme-surface'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guides & Blog</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Smart Search Trigger (Ctrl+K) */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm text-theme-text-muted hover:text-theme-text transition-all group shadow-sm active:scale-95"
            title="Search tools (Ctrl + K)"
          >
            <Search className="w-4 h-4 text-theme-accent group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline text-xs font-medium">Search tools...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-theme-bg border border-theme-border text-theme-text-muted">
              ⌘K
            </kbd>
          </button>

          {/* Onboarding Guide Quick Tour */}
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-cyan-400 hover:border-cyan-400/50 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="First-Time User Guide & Tour"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">Guide</span>
            </button>
          )}

          {/* Intro Replay Button */}
          <button
            onClick={onReplayIntro}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-medium text-theme-text-muted hover:text-theme-text transition-all active:scale-95"
            title="Watch Opening Cinematic"
          >
            <PlayCircle className="w-4 h-4 text-theme-accent" />
            <span className="hidden xl:inline">Cinematic Intro</span>
          </button>

          {/* Theme Switcher */}
          <ThemeSelector />

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text active:scale-95"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-theme-card border-b border-theme-border px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted">
            Tool Categories & Guides
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(item => (
              <button
                key={item.cat}
                onClick={() => {
                  onSelectCategory(item.cat);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all active:scale-95 ${
                  !isBlogActive && selectedCategory === item.cat
                    ? 'bg-theme-accent text-white font-semibold shadow-md shadow-theme-accent/20'
                    : 'bg-theme-surface hover:bg-theme-surface-hover text-theme-text border border-theme-border'
                }`}
              >
                <Compass className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}

            {onOpenBlog && (
              <button
                onClick={() => {
                  onOpenBlog();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all active:scale-95 ${
                  isBlogActive
                    ? 'bg-theme-accent text-white shadow-md shadow-theme-accent/20'
                    : 'bg-theme-surface hover:bg-theme-surface-hover text-cyan-400 border border-theme-border'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">Guides & Blog</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-theme-border flex items-center justify-between">
            <button
              onClick={() => {
                onReplayIntro();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs text-theme-text-muted hover:text-theme-text"
            >
              <PlayCircle className="w-4 h-4 text-theme-accent" />
              <span>Replay Cinematic Intro</span>
            </button>
            <span className="text-[10px] font-mono text-theme-text-muted">STUDKIT OS</span>
          </div>
        </div>
      )}
    </header>
  );
};
