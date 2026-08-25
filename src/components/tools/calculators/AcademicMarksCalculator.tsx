import React, { useState, useMemo } from 'react';
import {
  Award,
  Percent,
  Target,
  Plus,
  Trash2,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

export const AcademicMarksCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marks_pct' | 'required_exam' | 'weighted'>('marks_pct');

  // 1. Marks to Percentage
  const [obtainedMarks, setObtainedMarks] = useState<number>(445);
  const [maximumMarks, setMaximumMarks] = useState<number>(500);

  // 2. Required Exam Marks
  const [currentScore, setCurrentScore] = useState<number>(72);
  const [targetScore, setTargetScore] = useState<number>(85);
  const [finalWeight, setFinalWeight] = useState<number>(40); // 40% weight for finals

  // 3. Weighted Average Rows
  const [assessments, setAssessments] = useState<{ id: string; name: string; score: number; max: number; weight: number }[]>([
    { id: '1', name: 'Quizzes & Assignments', score: 88, max: 100, weight: 20 },
    { id: '2', name: 'Midterm Examination', score: 76, max: 100, weight: 25 },
    { id: '3', name: 'Laboratory & Project Work', score: 94, max: 100, weight: 20 },
    { id: '4', name: 'Final Comprehensive Exam', score: 85, max: 100, weight: 35 },
  ]);

  const [newAssName, setNewAssName] = useState('');
  const [newAssScore, setNewAssScore] = useState<number>(80);
  const [newAssMax, setNewAssMax] = useState<number>(100);
  const [newAssWeight, setNewAssWeight] = useState<number>(15);

  // Calculations
  const percentage = maximumMarks > 0 ? (obtainedMarks / maximumMarks) * 100 : 0;

  // Grade Letter & Division mapping
  const getGradeInfo = (pct: number) => {
    if (pct >= 90) return { letter: 'A+ / Grade O', division: 'First Class with Distinction', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' };
    if (pct >= 80) return { letter: 'A / Grade A+', division: 'First Class (Honors)', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' };
    if (pct >= 70) return { letter: 'B+ / Grade A', division: 'First Division', color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30' };
    if (pct >= 60) return { letter: 'B / Grade B+', division: 'Second Division', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
    if (pct >= 50) return { letter: 'C / Grade B', division: 'Third Division (Pass)', color: 'text-orange-400 bg-orange-500/15 border-orange-500/30' };
    return { letter: 'F / Grade F', division: 'Needs Improvement / Fail', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' };
  };

  const gradeInfo = getGradeInfo(percentage);

  // Required Final Exam Score
  const currentWeightFraction = 1 - finalWeight / 100;
  const neededFinalScore = finalWeight > 0 ? (targetScore - currentScore * currentWeightFraction) / (finalWeight / 100) : 0;
  const isTargetAttainable = neededFinalScore <= 100;

  // Weighted Course Grade
  const totalWeightConfigured = assessments.reduce((acc, a) => acc + (Number(a.weight) || 0), 0);
  const totalWeightedPercentage = assessments.reduce(
    (acc, a) => acc + (a.max > 0 ? (a.score / a.max) * a.weight : 0),
    0
  );
  const normalizedWeightedScore = totalWeightConfigured > 0 ? (totalWeightedPercentage / totalWeightConfigured) * 100 : 0;

  const handleAddAssessment = () => {
    if (!newAssName.trim()) return;
    setAssessments(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: newAssName.trim(),
        score: newAssScore,
        max: newAssMax,
        weight: newAssWeight,
      },
    ]);
    setNewAssName('');
  };

  const handleRemoveAssessment = (id: string) => {
    if (assessments.length <= 1) return;
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none animate-quick-fade">
      {/* Header Tabs */}
      <div className="flex rounded-3xl bg-theme-surface p-1.5 border border-theme-border shadow-xl">
        <button
          onClick={() => setActiveTab('marks_pct')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'marks_pct' ? 'bg-theme-accent text-white shadow-lg shadow-theme-accent/25' : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          Marks to Percentage
        </button>
        <button
          onClick={() => setActiveTab('required_exam')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'required_exam' ? 'bg-theme-accent text-white shadow-lg shadow-theme-accent/25' : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          Required Final Score
        </button>
        <button
          onClick={() => setActiveTab('weighted')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'weighted' ? 'bg-theme-accent text-white shadow-lg shadow-theme-accent/25' : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          Weighted Course Grade
        </button>
      </div>

      {/* Tab 1: Marks to Percentage */}
      {activeTab === 'marks_pct' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-theme-text">Marks to Percentage & Division Converter</h3>
              <p className="text-xs text-theme-text-muted">Convert total test marks into percentages and standard academic division honors.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Marks Obtained</label>
              <input
                type="number"
                value={obtainedMarks}
                onChange={e => setObtainedMarks(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-2xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Total Maximum Marks</label>
              <input
                type="number"
                value={maximumMarks}
                onChange={e => setMaximumMarks(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-4 py-2.5 rounded-2xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Hero Result */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-theme-border shadow-2xl text-center space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-theme-text-muted block">
              Calculated Percentage
            </span>
            <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 font-mono tracking-tight animate-result-reveal">
              {percentage.toFixed(2)}%
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className={`px-3 py-1 rounded-xl border text-xs font-bold font-mono ${gradeInfo.color}`}>
                {gradeInfo.letter}
              </span>
              <span className="text-xs text-white/80 font-medium">
                • {gradeInfo.division}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Required Final Exam Score */}
      {activeTab === 'required_exam' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-theme-text">Required Final Exam Score Estimator</h3>
              <p className="text-xs text-theme-text-muted">Determine exactly what score you must achieve on your final exam to secure your desired course grade.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Current Course Score (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={currentScore}
                onChange={e => setCurrentScore(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-2xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Target Desired Grade (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={targetScore}
                onChange={e => setTargetScore(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-2xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Final Exam Weight (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={finalWeight}
                onChange={e => setFinalWeight(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-4 py-2.5 rounded-2xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Hero Result */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-theme-border shadow-2xl text-center space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-theme-text-muted block">
              Required Score on Upcoming Final Exam
            </span>
            <div className={`text-5xl sm:text-6xl font-black font-mono tracking-tight animate-result-reveal ${
              isTargetAttainable ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300' : 'text-rose-400'
            }`}>
              {neededFinalScore.toFixed(1)}%
            </div>
            <div className="text-xs font-medium text-white/80">
              {neededFinalScore <= 0
                ? 'Target Already Guaranteed! You have secured enough points before taking the final.'
                : isTargetAttainable
                ? `You need ${neededFinalScore.toFixed(1)}% on the final worth ${finalWeight}% of the course grade to achieve ${targetScore}%.`
                : `Mathematically Impossible: You need ${neededFinalScore.toFixed(1)}% (over 100%) to achieve ${targetScore}%. Consider targeting a slightly lower grade band.`}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Weighted Course Grade */}
      {activeTab === 'weighted' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-theme-text">Weighted Syllabus Assessment Calculator</h3>
                <p className="text-xs text-theme-text-muted">Combine midterms, labs, quizzes, and finals with custom percentage weightings.</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Weight: {totalWeightConfigured}% / 100%
            </span>
          </div>

          {/* Add Row */}
          <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
            <input
              type="text"
              placeholder="Assessment Name"
              value={newAssName}
              onChange={e => setNewAssName(e.target.value)}
              className="sm:col-span-5 px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
            />
            <input
              type="number"
              placeholder="Score"
              value={newAssScore}
              onChange={e => setNewAssScore(parseFloat(e.target.value) || 0)}
              className="sm:col-span-2 px-2 py-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-center focus:border-theme-accent focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={newAssMax}
              onChange={e => setNewAssMax(Math.max(1, parseFloat(e.target.value) || 1))}
              className="sm:col-span-2 px-2 py-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-center focus:border-theme-accent focus:outline-none"
            />
            <input
              type="number"
              placeholder="Weight %"
              value={newAssWeight}
              onChange={e => setNewAssWeight(parseFloat(e.target.value) || 0)}
              className="sm:col-span-2 px-2 py-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-center focus:border-theme-accent focus:outline-none"
            />
            <button
              onClick={handleAddAssessment}
              className="sm:col-span-1 p-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Assessments Table */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {assessments.map(a => (
              <div
                key={a.id}
                className="p-3 rounded-2xl bg-theme-bg border border-theme-border flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-semibold text-theme-text truncate flex-1">{a.name}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span>{a.score} / {a.max} ({Math.round((a.score / a.max) * 100)}%)</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                    {a.weight}% wt
                  </span>
                  <button
                    onClick={() => handleRemoveAssessment(a.id)}
                    disabled={assessments.length <= 1}
                    className="p-1 rounded text-theme-text-muted hover:text-rose-400 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Final Weighted Total */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-theme-border shadow-2xl text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-theme-text-muted block">
              Cumulative Weighted Course Grade
            </span>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 font-mono tracking-tight animate-result-reveal">
              {totalWeightedPercentage.toFixed(2)}%
            </div>
            <span className="text-xs text-white/80 font-medium block">
              Normalized Grade: {normalizedWeightedScore.toFixed(2)}% (out of 100%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
