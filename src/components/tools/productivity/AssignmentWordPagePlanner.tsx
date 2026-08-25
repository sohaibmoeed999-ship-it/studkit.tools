import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Plus,
  Trash2,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface AssignmentSection {
  id: string;
  name: string;
  percentage: number;
}

export const AssignmentWordPagePlanner: React.FC = () => {
  const [planningMode, setPlanningMode] = useState<'words' | 'pages'>('words');
  const [totalTarget, setTotalTarget] = useState<number>(3000);
  const [completedCount, setCompletedCount] = useState<number>(650);

  const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [deadlineDate, setDeadlineDate] = useState<string>(defaultDeadline);

  const [wordsPerPage, setWordsPerPage] = useState<number>(275); // Standard double-spaced academic page ~275 words

  const [sections, setSections] = useState<AssignmentSection[]>([
    { id: '1', name: '1. Abstract & Introduction', percentage: 15 },
    { id: '2', name: '2. Literature Review', percentage: 25 },
    { id: '3', name: '3. Methodology & Analysis', percentage: 35 },
    { id: '4', name: '4. Discussion & Conclusion', percentage: 20 },
    { id: '5', name: '5. References & Appendices', percentage: 5 },
  ]);

  // Calculations
  const results = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(deadlineDate);
    end.setHours(0, 0, 0, 0);

    const diffDays = Math.max(1, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    // Target values in words and pages
    const targetWords = planningMode === 'words' ? totalTarget : totalTarget * wordsPerPage;
    const completedWords = planningMode === 'words' ? completedCount : completedCount * wordsPerPage;

    const remainingWords = Math.max(0, targetWords - completedWords);
    const targetPages = Math.round((targetWords / wordsPerPage) * 10) / 10;
    const completedPages = Math.round((completedWords / wordsPerPage) * 10) / 10;
    const remainingPages = Math.round((remainingWords / wordsPerPage) * 10) / 10;

    const progressPercentage = targetWords > 0 ? Math.min(100, Math.round((completedWords / targetWords) * 100)) : 0;

    const requiredWordsPerDay = Math.ceil(remainingWords / diffDays);
    const requiredPagesPerDay = Math.round((remainingPages / diffDays) * 10) / 10;

    const isHeavyPace = requiredWordsPerDay > 1200;
    const isExtremePace = requiredWordsPerDay > 2500;

    // Section allocations
    const sectionBreakdown = sections.map(s => {
      const sectionWords = Math.round((s.percentage / 100) * targetWords);
      const sectionPages = Math.round((sectionWords / wordsPerPage) * 10) / 10;
      return {
        ...s,
        sectionWords,
        sectionPages,
      };
    });

    return {
      diffDays,
      targetWords,
      completedWords,
      remainingWords,
      targetPages,
      completedPages,
      remainingPages,
      progressPercentage,
      requiredWordsPerDay,
      requiredPagesPerDay,
      isHeavyPace,
      isExtremePace,
      sectionBreakdown,
    };
  }, [planningMode, totalTarget, completedCount, deadlineDate, wordsPerPage, sections]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Assignment Word & Page Planner</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Deadline & Velocity Pacing
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Break long essays and dissertations into realistic daily writing quotas and section budgets.
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-theme-bg rounded-2xl border border-theme-border">
          <button
            onClick={() => setPlanningMode('words')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              planningMode === 'words'
                ? 'bg-theme-accent text-white shadow-md'
                : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Word Count
          </button>
          <button
            onClick={() => setPlanningMode('pages')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              planningMode === 'pages'
                ? 'bg-theme-accent text-white shadow-md'
                : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Page Count
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Remaining Target</span>
          <p className="text-xl font-black text-cyan-400 font-mono mt-1">
            {planningMode === 'words' ? `${results.remainingWords.toLocaleString()} Words` : `${results.remainingPages} Pages`}
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono">{results.progressPercentage}% Completed</span>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Required Daily Pace</span>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">
            {planningMode === 'words' ? `${results.requiredWordsPerDay} Words/day` : `${results.requiredPagesPerDay} Pages/day`}
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono">Over next {results.diffDays} days</span>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Total Paper Length</span>
          <p className="text-xl font-black text-indigo-400 font-mono mt-1">
            {results.targetWords.toLocaleString()} Words
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono">~{results.targetPages} Standard Pages</span>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Days to Deadline</span>
          <p className="text-xl font-black text-amber-400 font-mono mt-1">
            {results.diffDays} Days
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono">Due on {deadlineDate}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-theme-text">
          <span>Overall Assignment Completion Progress</span>
          <span className="font-mono text-cyan-400">{results.progressPercentage}% Written</span>
        </div>
        <div className="w-full h-3 bg-theme-bg rounded-full overflow-hidden p-0.5 border border-theme-border">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${results.progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-theme-text-muted">
          <span>Done: {results.completedWords.toLocaleString()} words ({results.completedPages} pgs)</span>
          <span>Target: {results.targetWords.toLocaleString()} words ({results.targetPages} pgs)</span>
        </div>
      </div>

      {/* Pacing Alert */}
      {results.isHeavyPace && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold ${
            results.isExtremePace
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
          }`}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <span>
            {results.isExtremePace
              ? `High Deadline Pressure: You need ${results.requiredWordsPerDay} words/day. Consider starting early writing sessions and drafting section outlines immediately.`
              : `Brisk Writing Pace: ${results.requiredWordsPerDay} words/day is a solid commitment. Maintain 2-3 focused 45-minute writing blocks daily.`}
          </span>
        </div>
      )}

      {/* Inputs Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Target Details */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Target & Deadline Settings</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Required Total {planningMode === 'words' ? 'Word Count' : 'Page Count'}
              </label>
              <input
                type="number"
                min={1}
                value={totalTarget}
                onChange={e => setTotalTarget(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Already Completed {planningMode === 'words' ? 'Words' : 'Pages'}
              </label>
              <input
                type="number"
                min={0}
                max={totalTarget}
                value={completedCount}
                onChange={e => setCompletedCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Submission Deadline Date</label>
              <input
                type="date"
                value={deadlineDate}
                onChange={e => setDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-theme-border">
              <label className="block text-theme-text-muted mb-1 font-semibold">Academic Density (Words / Page)</label>
              <input
                type="number"
                min={150}
                max={500}
                value={wordsPerPage}
                onChange={e => setWordsPerPage(Math.max(100, parseInt(e.target.value) || 275))}
                className="w-full px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-text-muted mt-1 block">
                Standard double-spaced MLA/APA = 250-275 words/page. Single-spaced = ~500 words.
              </span>
            </div>
          </div>
        </div>

        {/* Section Breakdown Allocation */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Suggested Section Word Budgets</span>
          </h3>

          <div className="space-y-2.5">
            {results.sectionBreakdown.map(sec => (
              <div key={sec.id} className="p-3 rounded-2xl bg-theme-bg border border-theme-border space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-theme-text">
                  <span className="truncate">{sec.name}</span>
                  <span className="font-mono text-cyan-400">
                    {sec.sectionWords.toLocaleString()} words (~{sec.sectionPages} pgs)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full h-1.5 bg-theme-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${sec.percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-theme-text-muted whitespace-nowrap">{sec.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
