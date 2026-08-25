import React, { useState, useMemo } from 'react';
import { AlertCircle, AlertTriangle, Award, BookCheck, BookOpen, Bookmark, Check, CheckCircle2, CheckSquare, ChevronDown, ChevronRight, Copy, Download, FileEdit, FileText, Filter, Flame, GraduationCap, Grid, HelpCircle, Layers, List, Plus, Quote, RefreshCw, RotateCcw, RotateCw, Search, Share2, ShieldCheck, Shuffle, Sparkles, Star, Target, Trash2, Trophy, Volume2, VolumeX, Wand2, Zap } from 'lucide-react';
import { downloadText } from '../../../utils/download';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { ResultCard } from '../../common/ResultCard';

export const CitationGenerator: React.FC = () => {
  const [sourceType, setSourceType] = useState<'book' | 'article' | 'website'>('book');
  const [style, setStyle] = useState<'apa' | 'mla' | 'chicago' | 'harvard'>('apa');

  const [authors, setAuthors] = useState('Smith, John A.');
  const [title, setTitle] = useState('Principles of Modern Distributed Computing');
  const [year, setYear] = useState('2024');
  const [publisher, setPublisher] = useState('MIT Press');
  const [url, setUrl] = useState('https://mitpress.mit.edu/distributed');

  const generateCitation = (): string => {
    if (sourceType === 'book') {
      if (style === 'apa') return `${authors} (${year}). *${title}*. ${publisher}.`;
      if (style === 'mla') return `${authors}. *${title}*. ${publisher}, ${year}.`;
      if (style === 'chicago') return `${authors}. ${year}. *${title}*. ${publisher}.`;
      if (style === 'harvard') return `${authors}, ${year}. *${title}*. ${publisher}.`;
    } else if (sourceType === 'article') {
      if (style === 'apa') return `${authors} (${year}). "${title}." *Journal of Academic Research*, 14(2), 45-59.`;
      if (style === 'mla') return `${authors}. "${title}." *Journal of Academic Research*, vol. 14, no. 2, ${year}, pp. 45-59.`;
      if (style === 'chicago') return `${authors}. "${title}." *Journal of Academic Research* 14, no. 2 (${year}): 45-59.`;
      if (style === 'harvard') return `${authors}, ${year}. '${title}', *Journal of Academic Research*, 14(2), pp. 45-59.`;
    } else {
      if (style === 'apa') return `${authors} (${year}). *${title}*. Retrieved from ${url}`;
      if (style === 'mla') return `${authors}. "${title}." *Web*, ${year}, <${url}>.`;
      if (style === 'chicago') return `${authors}. "${title}." Accessed ${year}. ${url}.`;
      if (style === 'harvard') return `${authors}, ${year}. *${title}*. Available at: <${url}>.`;
    }
    return '';
  };

  const citation = generateCitation();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-theme-accent" />
            <h3 className="text-base sm:text-lg font-bold text-theme-text">Academic Citation & Bibliography Generator</h3>
          </div>
        </div>

        {/* Source Type & Style Choosers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-theme-text-muted">Source Type</label>
            <div className="flex rounded-xl bg-theme-bg p-1 border border-theme-border">
              {(['book', 'article', 'website'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSourceType(s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    sourceType === s ? 'bg-theme-accent text-white shadow-sm' : 'text-theme-text-muted'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-theme-text-muted">Citation Style</label>
            <div className="flex rounded-xl bg-theme-bg p-1 border border-theme-border">
              {(['apa', 'mla', 'chicago', 'harvard'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStyle(st)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    style === st ? 'bg-theme-accent text-white shadow-sm' : 'text-theme-text-muted'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-theme-text-muted font-semibold">Author(s) (Last, First M.)</label>
            <input
              type="text"
              value={authors}
              onChange={e => setAuthors(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-theme-text-muted font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-theme-text-muted font-semibold">Year of Publication</label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-theme-text-muted font-semibold">
              {sourceType === 'website' ? 'Website URL' : 'Publisher / Journal'}
            </label>
            <input
              type="text"
              value={sourceType === 'website' ? url : publisher}
              onChange={e =>
                sourceType === 'website' ? setUrl(e.target.value) : setPublisher(e.target.value)
              }
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text"
            />
          </div>
        </div>

        {/* Formatted Citation Output */}
        <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-theme-accent uppercase font-mono">{style} Format Citation:</span>
            <button
              onClick={() => navigator.clipboard.writeText(citation.replace(/\*/g, ''))}
              className="text-xs text-theme-accent hover:underline flex items-center gap-1 font-mono font-bold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Clean Citation</span>
            </button>
          </div>
          <p className="text-sm text-theme-text font-serif leading-relaxed select-all">
            {citation}
          </p>
        </div>
      </div>
    </div>
  );
};



interface ChecklistItem {
  id: string;
  subject: string;
  topic: string;
  completed: boolean;
}

export const ExamPrepChecklist: React.FC = () => {
  const [items, setItems] = useLocalStorage<ChecklistItem[]>('studkit_exam_checklist', [
    { id: '1', subject: 'Calculus', topic: 'Derivatives & Chain Rule', completed: true },
    { id: '2', subject: 'Calculus', topic: 'Integration by Parts', completed: false },
    { id: '3', subject: 'Physics', topic: 'Newtonian Dynamics & Momentum', completed: true },
    { id: '4', subject: 'Physics', topic: 'Electromagnetism & Gauss Law', completed: false },
    { id: '5', subject: 'CS', topic: 'Binary Search Trees & Traversal', completed: false },
  ]);

  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('');

  const toggleItem = (id: string) => {
    setItems(items.map(it => (it.id === id ? { ...it, completed: !it.completed } : it)));
  };

  const addItem = () => {
    if (!newTopic) return;
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substring(7),
        subject: newSubject || 'General',
        topic: newTopic,
        completed: false,
      },
    ]);
    setNewTopic('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  const completedCount = items.filter(it => it.completed).length;
  const progressPct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-theme-accent" />
            <h3 className="text-base sm:text-lg font-bold text-theme-text">Exam Preparation Checklist</h3>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">{progressPct}% Mastered</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-theme-text-muted font-mono">
            <span>Progress ({completedCount}/{items.length} topics)</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-theme-bg rounded-full overflow-hidden border border-theme-border">
            <div
              className="h-full bg-gradient-to-r from-theme-accent to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Add Topic Input Row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <input
            type="text"
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            placeholder="Subject (e.g. Physics)"
            className="w-full sm:w-1/3 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
          />
          <input
            type="text"
            value={newTopic}
            onChange={e => setNewTopic(e.target.value)}
            placeholder="Topic to revise..."
            className="w-full sm:w-2/3 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
          />
          <button
            onClick={addItem}
            className="p-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Checklist */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                item.completed
                  ? 'bg-emerald-500/10 border-emerald-500/30 opacity-75'
                  : 'bg-theme-bg border-theme-border hover:border-theme-accent/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="rounded accent-theme-accent cursor-pointer"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase text-theme-accent font-bold mr-2">
                    {item.subject}
                  </span>
                  <span className={`text-xs ${item.completed ? 'line-through text-theme-text-muted' : 'font-semibold text-theme-text'}`}>
                    {item.topic}
                  </span>
                </div>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="text-theme-text-muted hover:text-rose-400 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};













export interface CustomCard {
  id: string;
  front: string;
  back: string;
  mastered?: boolean;
}

export const FlashcardMaker: React.FC = () => {
  const defaultCards: CustomCard[] = [
    { id: '1', front: 'What is Time Complexity of Binary Search?', back: 'O(log N) because search space is halved every iteration.' },
    { id: '2', front: 'What is Newton’s Second Law of Motion?', back: 'F = m · a (Force equals mass multiplied by acceleration).' },
    { id: '3', front: 'What is the formula for calculating SGPA?', back: 'SGPA = Total Grade Points Earned ÷ Total Registered Credit Hours.' },
    { id: '4', front: 'What is the primary function of Mitochondria?', back: 'Generates cellular ATP energy via oxidative phosphorylation.' },
  ];

  const [cards, setCards] = useLocalStorage<CustomCard[]>('studkit_custom_flashcards', defaultCards);
  const [mode, setMode] = useState<'study' | 'edit'>('study');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const handleAddCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    const card: CustomCard = {
      id: Math.random().toString(36).substring(7),
      front: newFront.trim(),
      back: newBack.trim(),
      mastered: false,
    };
    setCards(prev => [...prev, card]);
    setNewFront('');
    setNewBack('');
  };

  const handleDeleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    if (currentIndex >= cards.length - 1) {
      setCurrentIndex(Math.max(0, cards.length - 2));
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  const handleExportJson = () => {
    downloadText(JSON.stringify(cards, null, 2), 'STUDKIT_Flashcards.json');
  };

  const currentCard = cards[currentIndex];
  const masteredCount = cards.filter(c => c.mastered).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header Controls */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-theme-text">Custom Flashcard Studio</h2>
            <p className="text-xs text-theme-text-muted">Create, study, flip, and master custom revision decks.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'study' ? 'edit' : 'study')}
            className="px-3.5 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text"
          >
            {mode === 'study' ? 'Edit & Add Cards' : 'Start Study Mode'}
          </button>
          <button
            onClick={handleExportJson}
            className="px-3.5 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/25 flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {mode === 'study' && cards.length > 0 ? (
        /* Interactive 3D Study Flipper */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-theme-text-muted">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span>Mastered: {masteredCount} / {cards.length}</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] p-8 rounded-3xl bg-theme-surface hover:bg-theme-surface-hover border-2 border-theme-border hover:border-theme-accent/50 shadow-2xl cursor-pointer flex flex-col justify-between items-center text-center transition-all group"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-theme-accent font-bold">
              {isFlipped ? 'Answer (Back)' : 'Question / Term (Front)'}
            </span>

            <div className="text-base sm:text-xl font-bold text-theme-text max-w-xl leading-relaxed my-auto">
              {isFlipped ? currentCard.back : currentCard.front}
            </div>

            <span className="text-xs text-theme-text-muted flex items-center gap-1 font-medium">
              <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
              <span>Click card to flip</span>
            </span>
          </div>

          {/* Navigation & Mastery Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-semibold text-theme-text hover:bg-theme-surface-hover"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const next = [...cards];
                  next[currentIndex].mastered = !next[currentIndex].mastered;
                  setCards(next);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  currentCard.mastered
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-theme-surface border border-theme-border text-theme-text hover:text-emerald-400'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{currentCard.mastered ? 'Mastered' : 'Mark Mastered'}</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-theme-accent text-white text-xs font-bold shadow-md shadow-theme-accent/25 hover:bg-theme-accent-hover"
            >
              Next Card
            </button>
          </div>
        </div>
      ) : (
        /* Edit & Add Deck List */
        <div className="space-y-6">
          {/* Add New Card Form */}
          <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-text block">Add New Flashcard</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <textarea
                placeholder="Front (Question / Definition / Concept)"
                value={newFront}
                onChange={e => setNewFront(e.target.value)}
                className="p-3 rounded-2xl bg-theme-bg border border-theme-border text-theme-text resize-none h-24 outline-none focus:border-theme-accent"
              />
              <textarea
                placeholder="Back (Answer / Explanation / Formula)"
                value={newBack}
                onChange={e => setNewBack(e.target.value)}
                className="p-3 rounded-2xl bg-theme-bg border border-theme-border text-theme-text resize-none h-24 outline-none focus:border-theme-accent"
              />
            </div>
            <button
              onClick={handleAddCard}
              className="w-full py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-theme-accent/25"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Deck</span>
            </button>
          </div>

          {/* Cards Table */}
          <div className="space-y-2.5">
            {cards.map((c, i) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-between gap-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-w-0">
                  <div className="font-bold text-theme-text truncate">
                    <span className="text-theme-accent font-mono mr-1.5">Q{i + 1}:</span>
                    {c.front}
                  </div>
                  <div className="text-theme-text-muted truncate">
                    <span className="text-emerald-400 font-mono mr-1.5">A:</span>
                    {c.back}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCard(c.id)}
                  className="p-1.5 text-theme-text-muted hover:text-rose-400 rounded-lg flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};



export const GradeTargetCalculator: React.FC = () => {
  const [currentGrade, setCurrentGrade] = useState<number>(78);
  const [targetGrade, setTargetGrade] = useState<number>(85);
  const [finalExamWeight, setFinalExamWeight] = useState<number>(30); // 30%

  // Formula: Target = (Current * (100 - Weight) + Required * Weight) / 100
  // Required = (Target * 100 - Current * (100 - Weight)) / Weight
  const weightDecimal = finalExamWeight / 100;
  const currentPortion = currentGrade * (1 - weightDecimal);
  const neededScore = Math.round(((targetGrade - currentPortion) / weightDecimal) * 10) / 10;

  const isPossible = neededScore <= 100;
  const isGuaranteed = neededScore <= 0;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-center">
        <div className="flex items-center justify-center gap-2 pb-2 border-b border-theme-border">
          <Target className="w-5 h-5 text-theme-accent" />
          <h3 className="text-base sm:text-lg font-bold text-theme-text">Grade Target & Final Exam Estimator</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 text-left">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-theme-text-muted">Current Grade (%)</label>
            <input
              type="number"
              value={currentGrade}
              onChange={e => setCurrentGrade(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-bold font-mono text-theme-text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-theme-text-muted">Target Grade (%)</label>
            <input
              type="number"
              value={targetGrade}
              onChange={e => setTargetGrade(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-bold font-mono text-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-theme-text-muted">Final Exam Weight (%)</label>
            <input
              type="number"
              value={finalExamWeight}
              onChange={e => setFinalExamWeight(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-bold font-mono text-theme-accent"
            />
          </div>
        </div>

        {/* Output Result */}
        <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
          <span className="text-[10px] uppercase font-mono text-theme-text-muted block">
            Score Needed on Final Exam
          </span>
          <div
            className={`text-4xl sm:text-5xl font-black font-mono ${
              isGuaranteed
                ? 'text-cyan-400'
                : isPossible
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}
          >
            {isGuaranteed ? '0%' : `${neededScore}%`}
          </div>
          <p className="text-xs text-theme-text-muted max-w-sm mx-auto">
            {isGuaranteed
              ? '🎉 You already secured your target grade even with 0% on the final!'
              : isPossible
              ? `You need at least ${neededScore}% on the final exam (${finalExamWeight}% of grade) to finish with ${targetGrade}%.`
              : `Target unattainable (${neededScore}% needed). Consider aiming for a slightly adjusted target grade.`}
          </p>
        </div>
      </div>
    </div>
  );
};



export const StudyNotesFormatter: React.FC = () => {
  const [rawNotes, setRawNotes] = useState(
    'Thermodynamics Core Concepts:\nZeroth Law: Thermal equilibrium is transitive.\nFirst Law: Conservation of energy (delta U = Q - W).\nSecond Law: Entropy of an isolated system always increases.\nThird Law: As temperature approaches absolute zero, entropy reaches a constant minimum.'
  );
  const [formatType, setFormatType] = useState<'outline' | 'bullet' | 'cheatsheet' | 'qa'>('outline');
  const [formattedText, setFormattedText] = useState('');

  const runFormat = () => {
    const lines = rawNotes
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    if (formatType === 'outline') {
      let out = '# Academic Study Outline\n\n';
      lines.forEach((line, i) => {
        if (line.endsWith(':') || line.length < 35 && !line.includes('.')) {
          out += `\n## ${line.replace(':', '')}\n`;
        } else {
          out += `  - ${line}\n`;
        }
      });
      setFormattedText(out);
    } else if (formatType === 'bullet') {
      const out = lines.map(l => `• ${l.replace(/^[-*•\d.]+\s*/, '')}`).join('\n');
      setFormattedText(`# Clean Revision Bullets\n\n${out}`);
    } else if (formatType === 'cheatsheet') {
      let out = '# Quick Exam Cheat-Sheet\n\n| # | Topic / Law | Key Formula / Definition |\n|---|---|---|\n';
      lines.forEach((line, i) => {
        const parts = line.split(':');
        const topic = parts[0] ? parts[0].trim() : `Point ${i + 1}`;
        const def = parts[1] ? parts.slice(1).join(':').trim() : line;
        out += `| ${i + 1} | **${topic}** | ${def} |\n`;
      });
      setFormattedText(out);
    } else if (formatType === 'qa') {
      let out = '# Self-Testing Q&A Flash Format\n\n';
      lines.forEach((line, i) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          out += `**Q${i + 1}: What is ${parts[0].trim()}?**\n> Answer: ${parts.slice(1).join(':').trim()}\n\n`;
        } else {
          out += `**Q${i + 1}: State the concept for:** ${line}\n\n`;
        }
      });
      setFormattedText(out);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-theme-border">
            <div className="flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-theme-accent" />
              <h3 className="text-sm sm:text-base font-bold text-theme-text">Study Notes Formatter</h3>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-theme-text-muted">Paste Unstructured Notes</label>
            <textarea
              value={rawNotes}
              onChange={e => setRawNotes(e.target.value)}
              placeholder="Paste raw lecture text or notes here..."
              className="w-full h-56 p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text resize-none focus:border-theme-accent outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-theme-text-muted">Format Layout</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'outline', label: 'Structured Outline' },
                { id: 'bullet', label: 'Clean Bullet Points' },
                { id: 'cheatsheet', label: 'Markdown Table Cheat-Sheet' },
                { id: 'qa', label: 'Active Recall Q&A' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormatType(f.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                    formatType === f.id
                      ? 'bg-theme-accent text-white border-theme-accent shadow-md shadow-theme-accent/20'
                      : 'bg-theme-bg border-theme-border text-theme-text hover:bg-theme-surface'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runFormat}
            className="w-full py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Format Notes Instantly</span>
          </button>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <ResultCard
            title="Formatted Revision Sheet"
            description="Ready for Markdown, Notion, Obsidian, or Print"
            onDownload={() => downloadText(formattedText || rawNotes, 'STUDKIT_formatted_notes.md')}
            onCopy={() => navigator.clipboard.writeText(formattedText || rawNotes)}
            downloadLabel="Download Markdown (.md)"
          >
            <textarea
              readOnly
              value={formattedText || 'Click "Format Notes Instantly" to preview formatted revision sheet.'}
              className="w-full h-80 p-4 rounded-2xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text resize-none outline-none leading-relaxed"
            />
          </ResultCard>
        </div>
      </div>
    </div>
  );
};
