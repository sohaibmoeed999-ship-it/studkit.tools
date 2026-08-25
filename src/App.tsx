import React, { useState, useEffect, useRef } from 'react';
import { CinematicIntro } from './components/intro/CinematicIntro';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToolHeader } from './components/common/ToolHeader';
import { TOOLS_REGISTRY, CATEGORIES_LIST } from './data/toolsRegistry';
import { ToolCategory, ToolItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

// Image Suite
import { PassportPhotoMaker } from './components/tools/image/PassportPhotoMaker';
import { ImageCompressor } from './components/tools/image/ImageCompressor';
import { BackgroundChanger } from './components/tools/image/BackgroundChanger';
import { SignatureStudio } from './components/tools/image/SignatureStudio';
import { BatchImageResizerCompressor } from './components/tools/image/BatchImageResizerCompressor';
import {
  ImageResizer,
  ImageInspectorSuite,
  ImageRedactor,
  ImageToTextOCR,
  MultiImageToPdf,
} from './components/tools/image/ImageUtilitiesSuite';

// PDF Suite
import { DocScanner } from './components/tools/pdf/DocScanner';
import { WordDocConverterStudio } from './components/tools/pdf/WordDocConverterStudio';
import {
  PdfMerger,
  PdfSplitter,
  PdfPageRotator,
  PdfTextExtractor,
} from './components/tools/pdf/PdfOperationsSuite';

// Calculators & Math
import { GpaCgpaCalculator } from './components/tools/calculators/GpaCgpaCalculator';
import { AcademicMarksCalculator } from './components/tools/calculators/AcademicMarksCalculator';
import { ScientificCalculator } from './components/tools/calculators/ScientificCalculator';
import { CommerceFinanceSuite } from './components/tools/calculators/CommerceFinanceSuite';
import { StudentBudgetPlanner } from './components/tools/calculators/StudentBudgetPlanner';
import { DataUsageCalculator } from './components/tools/calculators/DataUsageCalculator';
import { BatteryChargingEstimator } from './components/tools/calculators/BatteryChargingEstimator';
import { CanIAffordThisCalculator } from './components/tools/calculators/CanIAffordThisCalculator';
import { SalaryBreakdownCalculator } from './components/tools/calculators/SalaryBreakdownCalculator';
import {
  AgeDateDifferenceCalculator,
  AttendanceCalculator,
  BmiCalculator,
  MathArithmeticSuite,
  UnitConverter,
} from './components/tools/calculators/EssentialCalculatorsSuite';
import {
  GeometryPhysicsSuite,
  MatrixCalculator,
  QuadraticSolver,
  StatisticsSuite,
} from './components/tools/math/AdvancedMathSuite';

// Productivity, Study & Career
import { ResumeBuilder } from './components/tools/career/ResumeBuilder';
import { SkillsGapAnalyzer } from './components/tools/career/SkillsGapAnalyzer';
import { BirthdayWisherStudio } from './components/tools/productivity/BirthdayWisherStudio';
import { DailyLifeToolsSuite } from './components/tools/productivity/DailyLifeToolsSuite';
import { StudyScheduleGenerator } from './components/tools/productivity/StudyScheduleGenerator';
import { AssignmentWordPagePlanner } from './components/tools/productivity/AssignmentWordPagePlanner';
import { ContactCardGenerator } from './components/tools/productivity/ContactCardGenerator';
import { AutomaticMessageGenerator } from './components/tools/productivity/AutomaticMessageGenerator';
import {
  AssignmentTracker,
  HabitTracker,
  PriorityMatrix,
  StudyNotes,
} from './components/tools/productivity/ProductivityTrackersSuite';
import {
  PresentationTimer,
  VivaPracticeTimer,
  PomodoroTimer,
} from './components/tools/productivity/TimersStudioSuite';
import {
  SmartDailySchedulePlanner,
  SmartEmailUsernameGenerator,
  SmartProjectNameGenerator,
} from './components/tools/productivity/SmartGeneratorsSuite';
import {
  CitationGenerator,
  ExamPrepChecklist,
  FlashcardMaker,
  GradeTargetCalculator,
  StudyNotesFormatter,
} from './components/tools/study/AcademicStudySuite';
import {
  DecisionWheelRandomPicker,
  TypingSpeedTest,
} from './components/tools/study/InteractiveStudySuite';

// Developer & Text
import { QrCodeStudio } from './components/tools/text/QrCodeStudio';
import {
  TextUtilitiesSuite,
  UsernamePasswordSuite,
  WordCounterSuite,
} from './components/tools/text/TextFormattingSuite';
import {
  Base64UrlConverter,
  CsvJsonConverter,
  JsonSuite,
  JwtDecoder,
} from './components/tools/developer/DataConvertersSuite';
import {
  RegexTester,
  UnixTimestampCronHelper,
  UuidColorSuite,
} from './components/tools/developer/CodeDevToolsSuite';

// Mind Lab
import {
  IqLogicTest,
  MathSpeedSprint,
  NumberMemoryTest,
  ReactionSpeedTest,
  StroopAttentionTest,
} from './components/tools/mind/MindLabAssessmentSuite';

// Games
import {
  BlockPuzzleGame,
  Game2048,
  LogicMinesGame,
  MazeGame,
  MissingNumberGame,
  PathPuzzleGame,
  SudokuGame,
  WordConnectGame,
} from './components/tools/games/PuzzleGamesSuite';
import {
  BubblePopGame,
  ColorMatchGame,
  ConnectFourGame,
  PatternRepeatGame,
  ReactionTapGame,
  SnakeGame,
  TicTacToeGame,
  TileMatchGame,
  WaterSortGame,
} from './components/tools/games/ArcadeActionGamesSuite';
import {
  CalmBreathingGame,
  DrawingCreativityLab,
  HangmanGame,
  MemoryCardsGame,
  RelaxingParticlesGame,
  ShapeRotationGame,
} from './components/tools/games/RelaxCreativitySuite';

// Daily, Media & Common
import { QuoteOfTheDay } from './components/tools/daily/QuoteOfTheDay';
import { VideoCompressor, VideoEditor } from './components/tools/media/VideoStudioSuite';
import { BlogStudio } from './components/blog/BlogStudio';
import { SmartOnboardingGuide } from './components/onboarding/SmartOnboardingGuide';
import { FuturisticBackground } from './components/common/FuturisticBackground';
import { FuturisticCursor } from './components/common/FuturisticCursor';
import { DigitalToolkitTransition } from './components/common/DigitalToolkitTransition';

import {
  Sparkles,
  Search,
  Box,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Compass,
} from 'lucide-react';

export const App: React.FC = () => {
  // Check if intro has played this session or URL has share query
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('share=')) {
      return false;
    }
    return !sessionStorage.getItem('studkit_intro_played');
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [isBlogOpen, setIsBlogOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'blog' || Boolean(params.get('blog'));
    }
    return false;
  });
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('blog');
    }
    return null;
  });

  const [activeToolId, setActiveToolId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('share')) return 'anything-to-qr';
      if (params.get('tool')) return params.get('tool');
      const hash = window.location.hash.replace('#', '');
      if (hash && TOOLS_REGISTRY.some(t => t.id === hash)) return hash;
    }
    return null;
  });

  const [recentToolIds, setRecentToolIds] = useLocalStorage<string[]>('studkit_recent_tools', [
    'anything-to-qr',
    'ai-document-mcq',
    'gpa-cgpa-calculator',
    'passport-photo-maker',
    'study-notes-formatter',
    'game-2048',
  ]);

  const toolsSectionRef = useRef<HTMLElement>(null);

  const handleIntroComplete = () => {
    sessionStorage.setItem('studkit_intro_played', 'true');
    setShowIntro(false);
  };

  // Sync state with browser URL navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool');
      const blogParam = params.get('blog');
      const viewParam = params.get('view');

      if (blogParam || viewParam === 'blog') {
        setIsBlogOpen(true);
        setSelectedBlogSlug(blogParam || null);
        setActiveToolId(null);
      } else if (toolParam) {
        setIsBlogOpen(false);
        setActiveToolId(toolParam);
      } else {
        setIsBlogOpen(false);
        setActiveToolId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Ctrl+K hotkey for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [isTransitioningCategory, setIsTransitioningCategory] = useState(false);

  // Category selection with instant auto-scroll and digital toolkit emergence animation
  const handleSelectCategory = (cat: ToolCategory) => {
    setIsTransitioningCategory(true);
    setSelectedCategory(cat);
    setActiveToolId(null); // Return to directory view
    setTimeout(() => setIsTransitioningCategory(false), 750);

    if (window.history.pushState) {
      window.history.pushState({}, '', window.location.pathname);
    }

    setTimeout(() => {
      const el = document.getElementById('tools-directory-section');
      if (el) {
        const navHeight = 70;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        });
      }
    }, 40);
  };

  const handleOpenTool = (toolId: string) => {
    setActiveToolId(toolId);
    setRecentToolIds(prev => [toolId, ...prev.filter(id => id !== toolId)].slice(0, 6));
    if (window.history.pushState) {
      window.history.pushState({}, '', `?tool=${toolId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTool = TOOLS_REGISTRY.find(t => t.id === activeToolId);

  // Filter tools for catalogue view (mapping sub-categories)
  const visibleTools = TOOLS_REGISTRY.filter(t => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'calculators') {
      return t.category === 'calculators' || t.category === 'math' || t.category === 'commerce';
    }
    if (selectedCategory === 'developer') {
      return t.category === 'developer' || t.category === 'text';
    }
    if (selectedCategory === 'mind') {
      return t.category === 'mind';
    }
    if (selectedCategory === 'games') {
      return t.category === 'games';
    }
    return t.category === selectedCategory;
  });

  const categoryChips: { id: ToolCategory; name: string }[] = [
    { id: 'all', name: 'All Tools' },
    { id: 'pdf', name: 'Documentation' },
    { id: 'image', name: 'Images' },
    { id: 'calculators', name: 'Calculators' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'career', name: 'Career' },
    { id: 'developer', name: 'Developer' },
    { id: 'mind', name: 'Mind Lab' },
    { id: 'games', name: 'Relax & Fun' },
  ];

  const renderActiveToolComponent = () => {
    switch (activeToolId) {
      // Study & Productivity Suite
      case 'study-notes-formatter':
        return <StudyNotesFormatter />;
      case 'citation-generator':
        return <CitationGenerator />;
      case 'grade-target-calculator':
        return <GradeTargetCalculator />;
      case 'exam-prep-checklist':
        return <ExamPrepChecklist />;
      case 'study-schedule-generator':
        return <StudyScheduleGenerator />;
      case 'assignment-word-page-planner':
        return <AssignmentWordPagePlanner />;
      case 'presentation-timer':
        return <PresentationTimer />;
      case 'viva-practice-timer':
        return <VivaPracticeTimer />;
      case 'contact-card-generator':
        return <ContactCardGenerator />;
      case 'automatic-message-generator':
        return <AutomaticMessageGenerator />;

      // Image Suite
      case 'passport-photo-maker':
        return <PassportPhotoMaker />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-inspector-suite':
        return <ImageInspectorSuite />;
      case 'batch-image-resizer':
        return <BatchImageResizerCompressor />;
      case 'background-changer':
        return <BackgroundChanger />;
      case 'image-redactor':
        return <ImageRedactor />;
      case 'signature-studio':
        return <SignatureStudio />;
      case 'multi-image-pdf':
        return <MultiImageToPdf />;
      case 'image-to-text-ocr':
        return <ImageToTextOCR />;

      // PDF & Document Suite
      case 'image-to-pdf':
      case 'pdf-to-images':
        return <MultiImageToPdf />;
      case 'word-to-pdf':
      case 'doc-to-word':
        return <WordDocConverterStudio />;
      case 'pdf-merger':
        return <PdfMerger />;
      case 'pdf-splitter':
        return <PdfSplitter />;
      case 'pdf-page-rotator':
        return <PdfPageRotator />;
      case 'pdf-text-extractor':
        return <PdfTextExtractor />;
      case 'doc-scanner':
        return <DocScanner />;

      // Calculators & Math
      case 'gpa-cgpa-calculator':
        return <GpaCgpaCalculator />;
      case 'attendance-calculator':
        return <AttendanceCalculator />;
      case 'student-budget-planner':
        return <StudentBudgetPlanner />;
      case 'data-usage-calculator':
        return <DataUsageCalculator />;
      case 'battery-charging-estimator':
        return <BatteryChargingEstimator />;
      case 'can-i-afford-this':
        return <CanIAffordThisCalculator />;
      case 'salary-breakdown-calculator':
        return <SalaryBreakdownCalculator />;
      case 'academic-marks-calculator':
        return <AcademicMarksCalculator />;
      case 'scientific-calculator':
        return <ScientificCalculator />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'age-date-difference':
        return <AgeDateDifferenceCalculator />;
      case 'math-arithmetic-suite':
        return <MathArithmeticSuite />;
      case 'commerce-finance-suite':
        return <CommerceFinanceSuite />;
      case 'quadratic-solver':
        return <QuadraticSolver />;
      case 'matrix-calculator':
        return <MatrixCalculator />;
      case 'statistics-suite':
        return <StatisticsSuite />;
      case 'geometry-physics-suite':
        return <GeometryPhysicsSuite />;
      case 'bmi-calculator':
        return <BmiCalculator />;

      // Productivity & Career
      case 'pomodoro-timer':
        return <PomodoroTimer />;
      case 'assignment-tracker':
        return <AssignmentTracker />;
      case 'priority-matrix':
        return <PriorityMatrix />;
      case 'habit-tracker':
        return <HabitTracker />;
      case 'study-notes':
        return <StudyNotes />;
      case 'smart-email-username-generator':
        return <SmartEmailUsernameGenerator />;
      case 'smart-project-name-generator':
        return <SmartProjectNameGenerator />;
      case 'birthday-wisher-studio':
        return <BirthdayWisherStudio />;
      case 'resume-builder':
        return <ResumeBuilder />;
      case 'skills-gap-analyzer':
        return <SkillsGapAnalyzer />;

      // Developer & Text
      case 'anything-to-qr':
        return <QrCodeStudio />;
      case 'jwt-decoder':
        return <JwtDecoder />;
      case 'csv-json-converter':
        return <CsvJsonConverter />;
      case 'unix-cron-helper':
        return <UnixTimestampCronHelper />;
      case 'json-suite':
        return <JsonSuite />;
      case 'regex-tester':
        return <RegexTester />;
      case 'base64-url-converter':
        return <Base64UrlConverter />;
      case 'uuid-color-suite':
        return <UuidColorSuite />;
      case 'word-counter-suite':
        return <WordCounterSuite />;
      case 'text-utilities-suite':
        return <TextUtilitiesSuite />;
      case 'username-password-suite':
        return <UsernamePasswordSuite />;

      // Mind Lab
      case 'iq-logic-test':
        return <IqLogicTest />;
      case 'reaction-speed-test':
        return <ReactionSpeedTest />;
      case 'number-memory-test':
        return <NumberMemoryTest />;
      case 'stroop-attention-test':
        return <StroopAttentionTest />;
      case 'math-speed-sprint':
        return <MathSpeedSprint />;

      // Games
      case 'game-snake':
        return <SnakeGame />;
      case 'game-hangman':
        return <HangmanGame />;
      case 'game-2048':
        return <Game2048 />;
      case 'game-sudoku':
        return <SudokuGame />;
      case 'game-bubble-pop':
        return <BubblePopGame />;
      case 'game-logic-mines':
        return <LogicMinesGame />;
      case 'game-memory-cards':
        return <MemoryCardsGame />;
      case 'game-water-sort':
        return <WaterSortGame />;
      case 'game-calm-breathing':
        return <CalmBreathingGame />;
      case 'game-relaxing-particles':
        return <RelaxingParticlesGame />;
      case 'game-tic-tac-toe':
        return <TicTacToeGame />;
      case 'game-connect-four':
        return <ConnectFourGame />;
      case 'game-color-match':
        return <ColorMatchGame />;
      case 'game-maze':
        return <MazeGame />;
      case 'game-reaction-tap':
        return <ReactionTapGame />;
      case 'game-pattern-repeat':
        return <PatternRepeatGame />;
      case 'game-word-connect':
        return <WordConnectGame />;
      case 'game-block-puzzle':
        return <BlockPuzzleGame />;
      case 'game-path-puzzle':
        return <PathPuzzleGame />;
      case 'game-missing-number':
        return <MissingNumberGame />;
      case 'game-shape-rotation':
        return <ShapeRotationGame />;
      case 'game-tile-match':
        return <TileMatchGame />;
      case 'drawing-creativity-lab':
        return <DrawingCreativityLab />;
      case 'smart-daily-schedule':
        return <SmartDailySchedulePlanner />;
      case 'typing-speed-test':
        return <TypingSpeedTest />;
      case 'flashcard-maker':
        return <FlashcardMaker />;
      case 'decision-wheel-picker':
        return <DecisionWheelRandomPicker />;
      case 'video-compressor':
        return <VideoCompressor />;
      case 'quote-of-the-day':
        return <QuoteOfTheDay />;
      case 'video-editor':
        return <VideoEditor />;
      case 'text-sorter-cleaner':
      case 'reading-time-calculator':
      case 'duplicate-line-remover':
        return <DailyLifeToolsSuite defaultTab="text" />;
      case 'days-between-dates':
        return <DailyLifeToolsSuite defaultTab="dates" />;
      case 'secure-password-generator':
        return <DailyLifeToolsSuite defaultTab="password" />;
      case 'student-bill-splitter':
        return <DailyLifeToolsSuite defaultTab="splitter" />;

      default:
        return <StudyNotesFormatter />;
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col selection:bg-theme-accent/30 selection:text-white transition-colors duration-250 relative">
      {/* Interactive Cyber Constellation Background & Particle Nodes */}
      <FuturisticBackground />

      {/* Desktop Holographic Custom Cursor System */}
      <FuturisticCursor />

      {/* Official Automatic Cinematic Intro */}
      {showIntro && (
        <CinematicIntro
          onComplete={handleIntroComplete}
        />
      )}

      {/* Main Top Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={(cat) => {
          setIsBlogOpen(false);
          handleSelectCategory(cat);
        }}
        selectedCategory={selectedCategory}
        onReplayIntro={() => setShowIntro(true)}
        onNavigateHome={() => {
          setIsBlogOpen(false);
          setActiveToolId(null);
          setSelectedCategory('all');
          if (window.history.pushState) {
            window.history.pushState({}, '', window.location.pathname);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBlog={() => {
          setIsBlogOpen(true);
          setActiveToolId(null);
          if (window.history.pushState) {
            window.history.pushState({}, '', '?view=blog');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isBlogActive={isBlogOpen}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Global Search Modal (Ctrl + K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={toolId => {
          setIsBlogOpen(false);
          handleOpenTool(toolId);
        }}
      />

      {/* Smart Guided Onboarding Tour Modal */}
      <SmartOnboardingGuide
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onOpenTool={toolId => {
          if (toolId === 'all') {
            handleSelectCategory('all');
          } else {
            handleOpenTool(toolId);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {isBlogOpen ? (
          /* Blog & Knowledge Guides Hub */
          <div className="animate-quick-fade">
            <BlogStudio
              onOpenTool={toolId => {
                setIsBlogOpen(false);
                handleOpenTool(toolId);
              }}
              selectedPostSlug={selectedBlogSlug}
              onClearPostSlug={() => {
                setSelectedBlogSlug(null);
                if (window.history.pushState) {
                  window.history.pushState({}, '', '?view=blog');
                }
              }}
            />
          </div>
        ) : activeToolId && currentTool ? (
          /* Active Tool Workspace */
          <div className="animate-quick-fade">
            <ToolHeader
              tool={currentTool}
              onBack={() => {
                setActiveToolId(null);
                handleSelectCategory(selectedCategory);
              }}
            />
            <ErrorBoundary>{renderActiveToolComponent()}</ErrorBoundary>
          </div>
        ) : (
          /* Homepage / Toolbox Emergence Workspace */
          <div className="space-y-12 animate-quick-fade">
            {/* Hero Section */}
            <section className="text-center py-8 sm:py-14 space-y-6 relative overflow-hidden">
              {/* Subtle ambient light glow & floating particles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-theme-accent/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
              
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden p-1 bg-gradient-to-b from-theme-accent/40 via-theme-accent/10 to-transparent border border-theme-accent/30 shadow-2xl shadow-theme-accent/20 hover:scale-105 transition-transform duration-300">
                  <img
                    src="/assets/studkit-logo.png"
                    alt="STUDKIT Brand Logo"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-accent/10 border border-theme-accent/30 text-theme-accent text-xs font-semibold shadow-sm animate-pulse-glow">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The All-In-One Digital Toolbox for Student Life</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-theme-text">
                <span className="text-animated-shimmer inline-block">Everything Students Need.</span>
                <span className="block mt-1 text-animated-gradient font-black">
                  One Powerful Toolkit.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-xs sm:text-sm text-theme-text-muted leading-relaxed">
                Free, privacy-first academic utilities for school, college, and university students. Convert anything to QR, study grounded AI, format citations, resize photos, calculate CGPA, master exams, and relax with focus games.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleSelectCategory('all')}
                  className="btn-shimmer-sheen flex items-center gap-2 px-7 py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs sm:text-sm font-bold shadow-xl shadow-theme-accent/30 transition-all transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <Box className="w-4 h-4 animate-bounce" />
                  <span>Explore {TOOLS_REGISTRY.length}+ Tools</span>
                </button>

                <button
                  onClick={() => handleOpenTool('anything-to-qr')}
                  className="btn-shimmer-sheen flex items-center gap-2 px-6 py-3 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border hover:border-cyan-400/50 text-theme-text text-xs sm:text-sm font-semibold transition-all transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>Anything to QR</span>
                </button>

                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="btn-shimmer-sheen flex items-center gap-2 px-5 py-3 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-theme-text text-xs sm:text-sm font-semibold transition-all transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 text-cyan-400 hover:border-cyan-400/50 cursor-pointer shadow-md"
                >
                  <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
                  <span>Quick Tour & Guide</span>
                </button>
              </div>

              {/* Trust & Privacy Badges */}
              <div className="flex flex-wrap items-center justify-center gap-5 pt-4 text-xs text-theme-text-muted">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No Mandatory Login
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> 100% Client-Side Privacy
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> 100% Free Forever
                </span>
              </div>
            </section>

            {/* Recently Used Tools Bar */}
            {recentToolIds.length > 0 && (
              <section className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
                    Recently Used Tools
                  </h3>
                  <span className="text-[10px] font-mono text-theme-text-muted">Stored locally</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {recentToolIds.map(id => {
                    const tool = TOOLS_REGISTRY.find(t => t.id === id);
                    if (!tool) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => handleOpenTool(id)}
                        className="p-3 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border flex items-center gap-3 text-left transition-all group active:scale-95"
                      >
                        <div className="w-7 h-7 rounded-xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-theme-text truncate">{tool.name}</div>
                          <div className="text-[10px] text-theme-text-muted truncate capitalize">{tool.category}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Category Filter Chips & Live Directory Section */}
            <section
              id="tools-directory-section"
              ref={toolsSectionRef}
              className="space-y-6 pt-4 scroll-mt-20"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-theme-text flex items-center gap-2">
                    <span>Tool Directory</span>
                    <span className="text-xs font-mono font-normal text-theme-accent px-2 py-0.5 rounded-full bg-theme-accent/10 border border-theme-accent/20">
                      {visibleTools.length} {visibleTools.length === 1 ? 'tool' : 'tools'}
                    </span>
                  </h2>
                  <p className="text-xs text-theme-text-muted mt-0.5">
                    Select any category below to instantly view and filter tools.
                  </p>
                </div>

                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-accent hover:underline font-mono active:scale-95"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search (Ctrl + K)</span>
                </button>
              </div>

              {/* Category Filter Pills - Showing all without scrolling */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {categoryChips.map(cat => {
                  const isActive = selectedCategory === cat.id;
                  const count =
                    cat.id === 'all'
                      ? TOOLS_REGISTRY.length
                      : TOOLS_REGISTRY.filter(t => {
                          if (cat.id === 'calculators') {
                            return t.category === 'calculators' || t.category === 'math' || t.category === 'commerce';
                          }
                          if (cat.id === 'developer') {
                            return t.category === 'developer' || t.category === 'text';
                          }
                          return t.category === cat.id;
                        }).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`category-pill-stylish flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all active:scale-95 cursor-pointer ${
                        isActive
                          ? 'active bg-theme-accent text-white border-theme-accent shadow-xl shadow-theme-accent/35 scale-[1.04]'
                          : 'bg-theme-surface/80 border-theme-border text-theme-text hover:bg-theme-surface hover:border-theme-accent/50 hover:text-theme-text'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold transition-all ${
                          isActive
                            ? 'bg-white/25 text-white shadow-inner scale-105'
                            : 'bg-theme-bg/90 text-theme-text-muted border border-theme-border/60'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Digital Toolbox Category Emergence Banner */}
              <div
                key={`toolbox-${selectedCategory}`}
                className="category-banner-enter p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-theme-surface via-theme-bg to-theme-surface border border-theme-accent/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-theme-accent/5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-theme-accent via-cyan-400 to-blue-500 p-0.5 shadow-lg shadow-theme-accent/30 flex-shrink-0 animate-bounce">
                    <div className="w-full h-full bg-theme-bg rounded-[14px] flex items-center justify-center text-theme-accent">
                      <Box className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black tracking-wide text-theme-text uppercase flex items-center gap-2">
                      <span className="text-animated-gradient">STUDKIT Toolbox: {selectedCategory.toUpperCase()}</span>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm">
                        {visibleTools.length} Tools Ready
                      </span>
                    </h3>
                    <p className="text-[11px] text-theme-text-muted mt-0.5">
                      {selectedCategory === 'mind'
                        ? 'Cognitive speed, working memory, and pattern reasoning tools emerged from the digital box.'
                        : selectedCategory === 'games'
                        ? 'Stress-relief games, smooth vector drawing studio, and relaxing casual puzzles ready to play.'
                        : selectedCategory === 'all'
                        ? 'Complete 110+ verified student utilities active and ready for use.'
                        : `Specialized ${selectedCategory} utilities emerged from the digital toolbox.`}
                    </p>
                  </div>
                </div>

                {/* Subcategory Pills */}
                <div className="flex flex-wrap items-center gap-1.5 self-stretch md:self-auto">
                  {(selectedCategory === 'all'
                    ? ['AI Studio', 'PDF Hub', 'Image Lab', 'Math / CGPA', 'Mind Lab', 'Relax Games', 'ATS Resumes']
                    : selectedCategory === 'pdf'
                    ? ['Camera Scanner', 'PDF Merge', 'PDF Split', 'PDF Compress', 'Image to PDF']
                    : selectedCategory === 'ai'
                    ? ['MCQ Generator', 'Document Grounding', 'Study Lab', 'Summarizer', 'Notes Ingest']
                    : selectedCategory === 'image'
                    ? ['BG Remover', 'Compressor', 'Format Converter', 'Collage Studio', 'Color Tools']
                    : selectedCategory === 'calculators'
                    ? ['CGPA / GPA', 'Scientific Math', 'Matrix Algebra', 'Grade Planner', 'ROI / Loans']
                    : selectedCategory === 'productivity'
                    ? ['Schedule Planner', 'Duplicate Text Remover', 'Password Generator', 'Bill Splitter']
                    : selectedCategory === 'career'
                    ? ['40 ATS Templates', 'Live Morphing', 'Custom Fonts', 'PDF Export']
                    : selectedCategory === 'developer'
                    ? ['JSON Studio', 'Base64 & Hashes', 'Regex Tester', 'Markdown Live', 'Diff Tool']
                    : selectedCategory === 'mind'
                    ? ['IQ Matrix', 'Reaction Speed', 'Number Memory', 'Color Stroop', 'Chimp Test']
                    : ['Smooth Vector Draw', '2048 Puzzle', 'Color Sorter', 'Mind Mazes', 'Zen Zone']
                  ).map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-theme-surface border border-theme-border/80 text-theme-text-muted hover:text-theme-accent hover:border-theme-accent/40 transition-all shadow-sm"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Signature Category Emergence Transition */}
              {isTransitioningCategory && (
                <DigitalToolkitTransition
                  category={selectedCategory}
                  categoryName={categoryChips.find(c => c.id === selectedCategory)?.name || 'Tools'}
                  count={visibleTools.length}
                  onFinished={() => setIsTransitioningCategory(false)}
                />
              )}

              {/* Grid of Tool Cards with Staggered Entrance Animation - Matching Reference Image 1 */}
              <div
                key={selectedCategory}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
              >
                {visibleTools.map((tool, idx) => (
                  <div
                    key={tool.id}
                    onClick={() => handleOpenTool(tool.id)}
                    style={{ animationDelay: `${Math.min(idx * 20, 250)}ms` }}
                    className="tool-card tool-card-stagger rounded-2xl p-5 cursor-pointer flex flex-col justify-between space-y-4 group active:scale-[0.98]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="tool-icon-box w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent transition-all duration-300">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        {tool.popular && (
                          <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition-transform">
                            Popular
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="tool-card-title text-sm font-bold text-theme-text transition-colors duration-200">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-theme-text-muted mt-1 leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-theme-border/60 text-xs font-semibold">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-theme-text-muted">{tool.category}</span>
                      <span className="text-xs font-bold text-theme-accent flex items-center gap-1 group-hover:underline">
                        <span>Open Tool</span>
                        <ArrowRight className="tool-card-arrow w-3.5 h-3.5 transition-all duration-200" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setIsBlogOpen(false);
          handleSelectCategory(cat);
        }}
        onHome={() => {
          setIsBlogOpen(false);
          setActiveToolId(null);
          setSelectedCategory('all');
          if (window.history.pushState) {
            window.history.pushState({}, '', window.location.pathname);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setIsBlogOpen(false);
          handleSelectCategory(cat);
        }}
        onReplayIntro={() => setShowIntro(true)}
        onOpenBlog={(slug) => {
          setIsBlogOpen(true);
          setSelectedBlogSlug(slug || null);
          setActiveToolId(null);
          if (window.history.pushState) {
            window.history.pushState({}, '', slug ? `?blog=${slug}` : '?view=blog');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default App;
