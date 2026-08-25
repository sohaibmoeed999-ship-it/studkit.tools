import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AlertCircle, Award, BookOpen, Brain, CheckCircle2, ChevronLeft, ChevronRight, CloudRain, Coffee, Flame, HelpCircle, Layers, Maximize2, Mic, Minimize2, Moon, Music, Pause, Play, Presentation, RefreshCw, RotateCcw, Shuffle, SkipForward, Sliders, Sparkles, Square, Star, Timer, Trees, Trophy, Volume1, Volume2, VolumeX, Waves, Wind, X, XCircle, Zap } from 'lucide-react';
import { sounds, playBeep, AmbientSoundType } from '../../../utils/audio';

export const PresentationTimer: React.FC = () => {
  // Inputs
  const [totalTimeMinutes, setTotalTimeMinutes] = useState<number>(10);
  const [totalSlides, setTotalSlides] = useState<number>(12);
  const [introTimeMinutes, setIntroTimeMinutes] = useState<number>(1);
  const [qaTimeMinutes, setQaTimeMinutes] = useState<number>(2);

  // Active Timer State
  const [isActive, setIsActive] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const totalDurationSeconds = totalTimeMinutes * 60;
  const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);

  // Calculations
  const calculations = useMemo(() => {
    const introSec = introTimeMinutes * 60;
    const qaSec = qaTimeMinutes * 60;
    const totalSec = totalTimeMinutes * 60;

    const availableSlideSeconds = Math.max(0, totalSec - introSec - qaSec);
    const validSlides = Math.max(1, totalSlides);
    const secondsPerSlide = Math.round(availableSlideSeconds / validSlides);
    const minutesPerSlide = Math.round((secondsPerSlide / 60) * 10) / 10;
    return {
      introSec,
      qaSec,
      totalSec,
      availableSlideSeconds,
      secondsPerSlide,
      minutesPerSlide,
    };
  }, [totalTimeMinutes, totalSlides, introTimeMinutes, qaTimeMinutes]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && remainingSeconds > 0) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;

          // Sound warnings at 1 minute remaining, 30 seconds, and 0
          if (soundEnabled) {
            const rem = totalDurationSeconds - next;
            if (rem === 60) playBeep(520, 0.2);
            if (rem === 30) playBeep(660, 0.3);
            if (rem === 0) playBeep(880, 0.6);
          }

          return next;
        });
      }, 1000);
    } else if (remainingSeconds === 0 && isActive) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, remainingSeconds, totalDurationSeconds, soundEnabled]);

  const handleTogglePlay = () => {
    if (remainingSeconds === 0) {
      setElapsedSeconds(0);
      setCurrentSlideIndex(1);
    }
    setIsActive(prev => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setElapsedSeconds(0);
    setCurrentSlideIndex(1);
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides) {
      setCurrentSlideIndex(c => c + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 1) {
      setCurrentSlideIndex(c => c - 1);
    }
  };

  // Format Helpers
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const percentLeft = totalDurationSeconds > 0 ? (remainingSeconds / totalDurationSeconds) * 100 : 0;
  const isDanger = percentLeft <= 10;
  const isWarning = percentLeft <= 25 && !isDanger;

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Presentation & Slide Pacing Timer</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Pacing Assistant
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Deduct intro & Q&A buffers to compute exact time quotas per slide with visual color-coded warnings.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text-muted hover:text-theme-text transition-all cursor-pointer"
          title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Countdown Display */}
      <div
        className={`p-8 rounded-3xl border shadow-2xl transition-colors duration-500 flex flex-col items-center justify-center space-y-6 text-center ${
          isDanger
            ? 'bg-rose-950/40 border-rose-500/50 shadow-rose-500/10'
            : isWarning
            ? 'bg-amber-950/40 border-amber-500/50 shadow-amber-500/10'
            : 'bg-gradient-to-b from-slate-950 to-slate-900 border-theme-border'
        }`}
      >
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-theme-text-muted">
            {remainingSeconds === 0 ? 'TIME EXPIRED' : isActive ? 'PRESENTATION IN PROGRESS' : 'TIMER PAUSED'}
          </span>
          <div className="text-6xl sm:text-8xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {formatTime(remainingSeconds)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isDanger
                ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                : isWarning
                ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'
                : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
            }`}
            style={{ width: `${percentLeft}%` }}
          />
        </div>

        {/* Slide Counter & Controller */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={handlePrevSlide}
            disabled={currentSlideIndex <= 1}
            className="p-2 rounded-xl bg-theme-bg border border-theme-border disabled:opacity-30 hover:bg-theme-surface transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-cyan-300 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            Slide {currentSlideIndex} / {totalSlides}
          </span>
          <button
            onClick={handleNextSlide}
            disabled={currentSlideIndex >= totalSlides}
            className="p-2 rounded-xl bg-theme-bg border border-theme-border disabled:opacity-30 hover:bg-theme-surface transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                : 'bg-theme-accent hover:bg-theme-accent-hover shadow-theme-accent/30'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause Timer' : remainingSeconds === 0 ? 'Restart Session' : 'Start Presentation'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-theme-bg hover:bg-theme-surface border border-theme-border text-theme-text transition-all active:scale-95 cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Target Per Slide</span>
          <p className="text-xl font-black text-cyan-400 font-mono mt-1">{calculations.secondsPerSlide}s</p>
          <span className="text-[10px] text-theme-text-muted font-mono">(~{calculations.minutesPerSlide} min / slide)</span>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Intro Buffer</span>
          <p className="text-xl font-black text-indigo-400 font-mono mt-1">{introTimeMinutes} min</p>
          <span className="text-[10px] text-theme-text-muted font-mono">{calculations.introSec} seconds</span>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Q&A Buffer</span>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">{qaTimeMinutes} min</p>
          <span className="text-[10px] text-theme-text-muted font-mono">{calculations.qaSec} seconds</span>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Elapsed Time</span>
          <p className="text-xl font-black text-amber-400 font-mono mt-1">{formatTime(elapsedSeconds)}</p>
          <span className="text-[10px] text-theme-text-muted font-mono">of {totalTimeMinutes} min</span>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Presentation Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-theme-text-muted mb-1 font-semibold">Total Allotted Time (Minutes)</label>
            <input
              type="number"
              min={1}
              max={180}
              value={totalTimeMinutes}
              onChange={e => setTotalTimeMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={isActive}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-theme-text-muted mb-1 font-semibold">Total Slide Count</label>
            <input
              type="number"
              min={1}
              max={150}
              value={totalSlides}
              onChange={e => setTotalSlides(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={isActive}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-theme-text-muted mb-1 font-semibold">Introduction Buffer (Minutes)</label>
            <input
              type="number"
              min={0}
              max={totalTimeMinutes}
              value={introTimeMinutes}
              onChange={e => setIntroTimeMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              disabled={isActive}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-theme-text-muted mb-1 font-semibold">Audience Q&A Buffer (Minutes)</label>
            <input
              type="number"
              min={0}
              max={totalTimeMinutes}
              value={qaTimeMinutes}
              onChange={e => setQaTimeMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              disabled={isActive}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


















type AnswerRating = 'correct' | 'partial' | 'incorrect' | 'skipped';

interface QuestionRecord {
  id: number;
  text: string;
  rating?: 'correct' | 'partial' | 'incorrect' | 'skipped';
  timeSpentSeconds?: number;
}

export const VivaPracticeTimer: React.FC = () => {
  const sampleQuestions = `What is Newton's Second Law of Motion and what is its standard SI unit?
How does an abstract class differ from an interface in object-oriented programming?
Explain the difference between mitosis and meiosis in eukaryotic cells.
Define Ohm's Law and explain the condition under which it fails.
What is the time complexity of QuickSort in the average versus worst-case scenarios?
Explain the economic law of diminishing marginal utility with an example.
What is the role of mitochondria in cellular ATP production?`;

  const [rawQuestionsText, setRawQuestionsText] = useState<string>(sampleQuestions);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(60);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Session state
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [questionDeck, setQuestionDeck] = useState<QuestionRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [remainingQuestionSeconds, setRemainingQuestionSeconds] = useState<number>(60);
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState<number>(0);

  // Start Session: parse and shuffle student's custom questions
  const handleStartSession = () => {
    const lines = rawQuestionsText
      .split('\n')
      .map(q => q.trim().replace(/^[0-9]+[.)]\s*/, ''))
      .filter(q => q.length > 2);

    if (lines.length === 0) return;

    // Fisher-Yates shuffle
    const shuffled = [...lines].sort(() => Math.random() - 0.5);
    const deck: QuestionRecord[] = shuffled.map((text, idx) => ({
      id: idx + 1,
      text,
    }));

    setQuestionDeck(deck);
    setCurrentIndex(0);
    setRemainingQuestionSeconds(timeLimitSeconds);
    setSessionElapsedSeconds(0);
    setSessionStarted(true);
    setSessionFinished(false);
    setIsTimerRunning(true);
  };

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted && !sessionFinished && isTimerRunning) {
      interval = setInterval(() => {
        setSessionElapsedSeconds(s => s + 1);
        setRemainingQuestionSeconds(prev => {
          if (prev <= 1) {
            if (soundEnabled) playBeep(880, 0.4);
            return 0;
          }
          if (prev === 10 && soundEnabled) {
            playBeep(440, 0.15);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted, sessionFinished, isTimerRunning, soundEnabled]);

  // Rate Answer & Advance
  const handleRateAnswer = (rating: AnswerRating) => {
    const updatedDeck = [...questionDeck];
    updatedDeck[currentIndex].rating = rating;
    updatedDeck[currentIndex].timeSpentSeconds = timeLimitSeconds - remainingQuestionSeconds;
    setQuestionDeck(updatedDeck);

    if (soundEnabled) {
      if (rating === 'correct') playBeep(660, 0.15);
      if (rating === 'incorrect') playBeep(330, 0.2);
    }

    if (currentIndex < questionDeck.length - 1) {
      setCurrentIndex(c => c + 1);
      setRemainingQuestionSeconds(timeLimitSeconds);
    } else {
      setSessionFinished(true);
      setIsTimerRunning(false);
    }
  };

  const handleRestart = () => {
    setSessionStarted(false);
    setSessionFinished(false);
    setCurrentIndex(0);
    setIsTimerRunning(false);
  };

  // Performance Calculations
  const metrics = useMemo(() => {
    const total = questionDeck.length;
    const correctCount = questionDeck.filter(q => q.rating === 'correct').length;
    const partialCount = questionDeck.filter(q => q.rating === 'partial').length;
    const incorrectCount = questionDeck.filter(q => q.rating === 'incorrect').length;
    const skippedCount = questionDeck.filter(q => q.rating === 'skipped').length;
    const attemptedCount = total - skippedCount;

    // Score: Correct = 1.0, Partial = 0.5
    const scorePoints = correctCount * 1 + partialCount * 0.5;
    const scorePercentage = total > 0 ? Math.round((scorePoints / total) * 100) : 0;

    return {
      total,
      correctCount,
      partialCount,
      incorrectCount,
      skippedCount,
      attemptedCount,
      scorePoints,
      scorePercentage,
    };
  }, [questionDeck]);

  const currentQ = questionDeck[currentIndex];
  const timerPercentage = timeLimitSeconds > 0 ? (remainingQuestionSeconds / timeLimitSeconds) * 100 : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Viva & Oral Examination Practice Timer</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                Non-Repeating Randomizer
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Paste your custom exam questions, practice with timed spontaneous recall, and score your viva performance.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text-muted hover:text-theme-text transition-all cursor-pointer"
          title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Setup Mode: Enter Questions */}
      {!sessionStarted && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-cyan-400" />
              <span>Paste Your Viva Questions (1 Question Per Line)</span>
            </label>
            <span className="text-[11px] font-mono text-cyan-400">
              {rawQuestionsText.split('\n').filter(q => q.trim().length > 2).length} questions loaded
            </span>
          </div>

          <textarea
            value={rawQuestionsText}
            onChange={e => setRawQuestionsText(e.target.value)}
            rows={8}
            placeholder="Paste your questions here, one per line..."
            className="w-full p-4 rounded-2xl bg-theme-bg border border-theme-border text-xs font-mono text-theme-text leading-relaxed focus:border-theme-accent focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-theme-text-muted">Time Limit Per Question:</span>
              <select
                value={timeLimitSeconds}
                onChange={e => setTimeLimitSeconds(parseInt(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold focus:border-theme-accent focus:outline-none"
              >
                <option value={30}>30 Seconds (Rapid Fire)</option>
                <option value={45}>45 Seconds</option>
                <option value={60}>60 Seconds (1 Minute)</option>
                <option value={90}>90 Seconds (1.5 Minutes)</option>
                <option value={120}>120 Seconds (2 Minutes)</option>
              </select>
            </div>

            <button
              onClick={handleStartSession}
              disabled={rawQuestionsText.split('\n').filter(q => q.trim().length > 2).length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Start Viva Practice Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Question Stage */}
      {sessionStarted && !sessionFinished && currentQ && (
        <div className="space-y-6">
          {/* Question Card */}
          <div className="p-8 rounded-3xl bg-theme-surface border border-theme-border shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-theme-border pb-4 text-xs font-mono">
              <span className="text-cyan-400 font-bold">
                Question {currentIndex + 1} of {questionDeck.length}
              </span>
              <span className="text-theme-text-muted">
                Elapsed: {Math.floor(sessionElapsedSeconds / 60)}m {sessionElapsedSeconds % 60}s
              </span>
            </div>

            {/* Question Text Display */}
            <div className="py-4">
              <h3 className="text-xl sm:text-2xl font-black text-theme-text leading-relaxed">
                "{currentQ.text}"
              </h3>
            </div>

            {/* Timer Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-theme-text-muted">Remaining Answer Time</span>
                <span className={`font-bold ${remainingQuestionSeconds <= 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
                  {remainingQuestionSeconds}s remaining
                </span>
              </div>
              <div className="w-full h-2.5 bg-theme-bg rounded-full overflow-hidden p-0.5 border border-theme-border">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    remainingQuestionSeconds <= 10
                      ? 'bg-rose-500'
                      : remainingQuestionSeconds <= 20
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                  }`}
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>
            </div>

            {/* Rating Actions */}
            <div className="pt-2 border-t border-theme-border grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleRateAnswer('correct')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Correct (1.0)</span>
              </button>

              <button
                onClick={() => handleRateAnswer('partial')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Partially Correct (0.5)</span>
              </button>

              <button
                onClick={() => handleRateAnswer('incorrect')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Incorrect (0.0)</span>
              </button>

              <button
                onClick={() => handleRateAnswer('skipped')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text-muted hover:text-theme-text text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip Question</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Scorecard */}
      {sessionFinished && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-xl">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-theme-text-muted">
              Viva Performance Scorecard
            </span>
            <h3 className="text-4xl sm:text-5xl font-black text-white font-mono">
              {metrics.scorePercentage}%
            </h3>
            <p className="text-xs text-theme-text-muted">
              Scored {metrics.scorePoints} out of {metrics.total} maximum points
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs font-mono">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
              <span className="block text-[10px] uppercase font-bold text-emerald-400">Correct</span>
              <span className="text-xl font-bold">{metrics.correctCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300">
              <span className="block text-[10px] uppercase font-bold text-amber-400">Partial</span>
              <span className="text-xl font-bold">{metrics.partialCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300">
              <span className="block text-[10px] uppercase font-bold text-rose-400">Incorrect</span>
              <span className="text-xl font-bold">{metrics.incorrectCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border text-theme-text-muted">
              <span className="block text-[10px] uppercase font-bold">Skipped</span>
              <span className="text-xl font-bold text-theme-text">{metrics.skippedCount}</span>
            </div>
          </div>

          {/* Session Questions Review List */}
          <div className="space-y-2 text-left max-w-2xl mx-auto pt-4 border-t border-theme-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text mb-2">Question Breakdown</h4>
            {questionDeck.map((q, idx) => (
              <div
                key={q.id}
                className="p-3 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between gap-3 text-xs"
              >
                <span className="truncate flex-1 font-medium text-theme-text">
                  {idx + 1}. {q.text}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold flex-shrink-0 ${
                    q.rating === 'correct'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : q.rating === 'partial'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : q.rating === 'incorrect'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-theme-surface text-theme-text-muted border border-theme-border'
                  }`}
                >
                  {q.rating || 'unrated'}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Another Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


















export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'short_break' | 'long_break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [activeSound, setActiveSound] = useState<AmbientSoundType | null>(null);

  const modeDurations = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            sounds.playTimerDone();
            if (mode === 'work') {
              setSessionsCompleted(c => c + 1);
              setMode('short_break');
              return modeDurations.short_break;
            } else {
              setMode('work');
              return modeDurations.work;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const toggleSound = (type: AmbientSoundType) => {
    const isPlaying = sounds.toggleAmbientSound(type);
    setActiveSound(isPlaying ? type : null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(modeDurations[mode]);
  };

  const handleModeChange = (newMode: 'work' | 'short_break' | 'long_break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(modeDurations[newMode]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((modeDurations[mode] - timeLeft) / modeDurations[mode]) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-6 select-none">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
        {/* Mode Selector */}
        <div className="flex rounded-2xl bg-theme-bg p-1 border border-theme-border max-w-sm mx-auto">
          <button
            onClick={() => handleModeChange('work')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'work' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Study Focus (25m)
          </button>
          <button
            onClick={() => handleModeChange('short_break')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'short_break' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => handleModeChange('long_break')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'long_break' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Long Rest (15m)
          </button>
        </div>

        {/* Big Circular Dial / Timer */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" className="text-theme-bg stroke-current" strokeWidth="6" fill="transparent" />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-theme-accent stroke-current transition-all duration-500"
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-theme-text">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mt-1 font-bold">
              {mode === 'work' ? 'Deep Work Sprint' : 'Rest Window'}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-14 h-14 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white flex items-center justify-center shadow-lg shadow-theme-accent/30 active:scale-95 transition-all cursor-pointer"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-2xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text-muted hover:text-theme-text flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Synthesized Ambient Audio Generator - All 10 Soundscapes */}
        <div className="pt-6 border-t border-theme-border space-y-3 text-left">
          <div className="flex items-center justify-between text-xs text-theme-text-muted">
            <span className="font-bold uppercase tracking-wider text-theme-accent">
              Synthesized Study Audio (10 Soundscapes)
            </span>
            <span className="font-mono text-[11px] text-cyan-400">
              {activeSound ? `Playing: ${activeSound.toUpperCase()}` : 'Audio Muted'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'rain', label: 'Rain', icon: <CloudRain className="w-3.5 h-3.5" /> },
              { id: 'whitenoise', label: 'White Noise', icon: <Wind className="w-3.5 h-3.5" /> },
              { id: 'campfire', label: 'Campfire', icon: <Flame className="w-3.5 h-3.5" /> },
              { id: 'binaural', label: 'Binaural 10Hz', icon: <Brain className="w-3.5 h-3.5" /> },
              { id: 'ocean', label: 'Ocean Waves', icon: <Waves className="w-3.5 h-3.5" /> },
              { id: 'forest', label: 'Forest Birds', icon: <Trees className="w-3.5 h-3.5" /> },
              { id: 'lofi', label: 'Lo-Fi Chords', icon: <Music className="w-3.5 h-3.5" /> },
              { id: 'cafe', label: 'Coffee Shop', icon: <Coffee className="w-3.5 h-3.5" /> },
              { id: 'night', label: 'Night Sky', icon: <Moon className="w-3.5 h-3.5" /> },
              { id: 'library', label: 'Library Tone', icon: <BookOpen className="w-3.5 h-3.5" /> },
            ].map(a => (
              <button
                key={a.id}
                onClick={() => toggleSound(a.id as any)}
                className={`py-2 px-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  activeSound === a.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-md'
                    : 'bg-theme-bg border-theme-border text-theme-text hover:bg-theme-surface hover:border-theme-accent/40'
                }`}
              >
                {a.icon}
                <span className="truncate">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-mono text-theme-text-muted">
          Sessions Completed Today: <span className="font-bold text-emerald-400">{sessionsCompleted}</span> (
          {sessionsCompleted * 25} minutes)
        </div>
      </div>
    </div>
  );
};
