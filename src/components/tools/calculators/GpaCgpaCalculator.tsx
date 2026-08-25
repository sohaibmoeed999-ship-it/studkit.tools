import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Sliders,
  Award,
  Download,
  Printer,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { downloadText } from '../../../utils/download';

interface CourseRow {
  id: string;
  name: string;
  gradePoints: number;
  credits: number;
}

type GpaScale = '4.0' | '5.0' | '10.0' | '100';

export const GpaCgpaCalculator: React.FC = () => {
  const [scale, setScale] = useState<GpaScale>('4.0');
  const [activeTab, setActiveTab] = useState<'semester' | 'cumulative'>('semester');

  // Semester Courses
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: '1', name: 'Data Structures & Algorithms', gradePoints: 4.0, credits: 4 },
    { id: '2', name: 'Computer Architecture', gradePoints: 3.7, credits: 3 },
    { id: '3', name: 'Linear Algebra & Matrices', gradePoints: 3.3, credits: 3 },
    { id: '4', name: 'Physics Laboratory', gradePoints: 4.0, credits: 1 },
    { id: '5', name: 'Technical Communication', gradePoints: 3.7, credits: 2 },
  ]);

  // Prior Stats for Cumulative CGPA
  const [priorCgpa, setPriorCgpa] = useState<number>(3.65);
  const [priorCredits, setPriorCredits] = useState<number>(45);

  // New Course Input State
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState<number>(3);
  const [newCourseGrade, setNewCourseGrade] = useState<number>(4.0);

  // Preset semester loader
  const loadPreset = (type: 'engineering' | 'premed' | 'business' | 'freshman') => {
    if (type === 'engineering') {
      setCourses([
        { id: '1', name: 'Differential Equations', gradePoints: scale === '10.0' ? 9.0 : 3.7, credits: 4 },
        { id: '2', name: 'Object Oriented Programming', gradePoints: scale === '10.0' ? 10.0 : 4.0, credits: 4 },
        { id: '3', name: 'Digital Logic Design', gradePoints: scale === '10.0' ? 8.0 : 3.3, credits: 3 },
        { id: '4', name: 'Microprocessor Lab', gradePoints: scale === '10.0' ? 10.0 : 4.0, credits: 1 },
      ]);
    } else if (type === 'premed') {
      setCourses([
        { id: '1', name: 'Organic Chemistry I', gradePoints: scale === '10.0' ? 9.0 : 3.7, credits: 4 },
        { id: '2', name: 'Cellular Biology', gradePoints: scale === '10.0' ? 10.0 : 4.0, credits: 4 },
        { id: '3', name: 'Organic Chemistry Lab', gradePoints: scale === '10.0' ? 10.0 : 4.0, credits: 2 },
        { id: '4', name: 'Medical Ethics', gradePoints: scale === '10.0' ? 10.0 : 4.0, credits: 3 },
      ]);
    } else if (type === 'business') {
      setCourses([
        { id: '1', name: 'Financial Accounting', gradePoints: scale === '10.0' ? 9.0 : 3.7, credits: 3 },
        { id: '2', name: 'Microeconomics', gradePoints: scale === '10.0' ? 8.0 : 3.3, credits: 3 },
        { id: '3', name: 'Business Analytics & Stats', gradePoints: scale === '10.0' ? 10.0 : 4.0, credits: 4 },
        { id: '4', name: 'Organizational Behavior', gradePoints: scale === '10.0' ? 9.0 : 3.7, credits: 3 },
      ]);
    } else {
      setCourses([
        { id: '1', name: 'Calculus I', gradePoints: scale === '10.0' ? 9.0 : 3.7, credits: 4 },
        { id: '2', name: 'University English Composition', gradePoints: scale === '10.0' ? 10.0 : 4.0, credits: 3 },
        { id: '3', name: 'Introduction to Psychology', gradePoints: scale === '10.0' ? 8.0 : 3.3, credits: 3 },
        { id: '4', name: 'General Chemistry', gradePoints: scale === '10.0' ? 9.0 : 3.7, credits: 4 },
      ]);
    }
  };

  const addCourse = () => {
    const name = newCourseName.trim() || `Course ${courses.length + 1}`;
    setCourses(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name,
        gradePoints: newCourseGrade,
        credits: newCourseCredits,
      },
    ]);
    setNewCourseName('');
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseRow, val: any) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, [field]: val } : c)));
  };

  // Grade point mapping options based on scale
  const gradeOptions = useMemo(() => {
    if (scale === '4.0') {
      return [
        { label: 'A+ / A (4.00) - 93-100%', val: 4.0, letter: 'A' },
        { label: 'A- (3.70) - 90-92%', val: 3.7, letter: 'A-' },
        { label: 'B+ (3.30) - 87-89%', val: 3.3, letter: 'B+' },
        { label: 'B (3.00) - 83-86%', val: 3.0, letter: 'B' },
        { label: 'B- (2.70) - 80-82%', val: 2.7, letter: 'B-' },
        { label: 'C+ (2.30) - 77-79%', val: 2.3, letter: 'C+' },
        { label: 'C (2.00) - 73-76%', val: 2.0, letter: 'C' },
        { label: 'C- (1.70) - 70-72%', val: 1.7, letter: 'C-' },
        { label: 'D (1.00) - 60-69%', val: 1.0, letter: 'D' },
        { label: 'F (0.00) - Below 60%', val: 0.0, letter: 'F' },
      ];
    } else if (scale === '5.0') {
      return [
        { label: 'A (5.00) - Excellent', val: 5.0, letter: 'A' },
        { label: 'B (4.00) - Very Good', val: 4.0, letter: 'B' },
        { label: 'C (3.00) - Good', val: 3.0, letter: 'C' },
        { label: 'D (2.00) - Pass', val: 2.0, letter: 'D' },
        { label: 'E (1.00) - Weak Pass', val: 1.0, letter: 'E' },
        { label: 'F (0.00) - Fail', val: 0.0, letter: 'F' },
      ];
    } else if (scale === '10.0') {
      return [
        { label: 'O (10.0) - Outstanding', val: 10.0, letter: 'O' },
        { label: 'A+ (9.0) - Excellent', val: 9.0, letter: 'A+' },
        { label: 'A (8.0) - Very Good', val: 8.0, letter: 'A' },
        { label: 'B+ (7.0) - Good', val: 7.0, letter: 'B+' },
        { label: 'B (6.0) - Above Average', val: 6.0, letter: 'B' },
        { label: 'C (5.0) - Average', val: 5.0, letter: 'C' },
        { label: 'P (4.0) - Pass', val: 4.0, letter: 'P' },
        { label: 'F (0.0) - Fail', val: 0.0, letter: 'F' },
      ];
    } else {
      return [
        { label: '100% (High Distinction)', val: 100, letter: 'HD' },
        { label: '90% (Distinction Plus)', val: 90, letter: 'D+' },
        { label: '80% (Distinction)', val: 80, letter: 'D' },
        { label: '70% (Credit)', val: 70, letter: 'CR' },
        { label: '60% (Pass)', val: 60, letter: 'P' },
        { label: '50% (Marginal Pass)', val: 50, letter: 'MP' },
        { label: '0% (Fail)', val: 0, letter: 'F' },
      ];
    }
  }, [scale]);

  // Calculations
  const results = useMemo(() => {
    const currentSemesterCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
    const currentSemesterPoints = courses.reduce((acc, c) => acc + (Number(c.gradePoints) || 0) * (Number(c.credits) || 0), 0);
    const sgpa = currentSemesterCredits > 0 ? currentSemesterPoints / currentSemesterCredits : 0;

    // Cumulative CGPA
    const totalCumulativeCredits = priorCredits + currentSemesterCredits;
    const totalCumulativePoints = priorCgpa * priorCredits + currentSemesterPoints;
    const cumulativeCgpa = totalCumulativeCredits > 0 ? totalCumulativePoints / totalCumulativeCredits : 0;

    // Estimated Percentage conversion
    let estimatedPercentage = 0;
    if (scale === '4.0') {
      estimatedPercentage = Math.min(100, Math.round((sgpa / 4.0) * 100 * 10) / 10);
    } else if (scale === '5.0') {
      estimatedPercentage = Math.min(100, Math.round((sgpa / 5.0) * 100 * 10) / 10);
    } else if (scale === '10.0') {
      estimatedPercentage = Math.min(100, Math.round(sgpa * 9.5 * 10) / 10); // Standard CBSE/AICTE formula
    } else {
      estimatedPercentage = Math.round(sgpa * 10) / 10;
    }

    // Academic Honor / Classification
    let academicStanding = 'Good Standing';
    let standingColor = 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30';

    const normalizedRatio = scale === '4.0' ? sgpa / 4.0 : scale === '5.0' ? sgpa / 5.0 : scale === '10.0' ? sgpa / 10.0 : sgpa / 100;

    if (normalizedRatio >= 0.95) {
      academicStanding = "Summa Cum Laude (Dean's Highest Honors)";
      standingColor = 'text-amber-300 bg-amber-500/15 border-amber-500/30';
    } else if (normalizedRatio >= 0.88) {
      academicStanding = "Magna Cum Laude (Dean's List)";
      standingColor = 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
    } else if (normalizedRatio >= 0.80) {
      academicStanding = 'Cum Laude (First Class with Distinction)';
      standingColor = 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30';
    } else if (normalizedRatio >= 0.65) {
      academicStanding = 'First Division (Good Academic Standing)';
      standingColor = 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30';
    } else if (normalizedRatio < 0.50) {
      academicStanding = 'Academic Warning (Below Passing Threshold)';
      standingColor = 'text-rose-400 bg-rose-500/15 border-rose-500/30';
    }

    // Weighted course contributions
    const courseBreakdown = courses.map(c => {
      const weight = currentSemesterPoints > 0 ? ((c.gradePoints * c.credits) / currentSemesterPoints) * 100 : 0;
      return {
        ...c,
        totalPoints: Math.round(c.gradePoints * c.credits * 100) / 100,
        weight: Math.round(weight * 10) / 10,
      };
    });

    return {
      currentSemesterCredits,
      currentSemesterPoints: Math.round(currentSemesterPoints * 100) / 100,
      sgpa: Math.round(sgpa * 100) / 100,
      totalCumulativeCredits,
      cumulativeCgpa: Math.round(cumulativeCgpa * 100) / 100,
      estimatedPercentage,
      academicStanding,
      standingColor,
      courseBreakdown,
    };
  }, [courses, scale, priorCgpa, priorCredits]);

  const handleExportCSV = () => {
    let csv = 'Course Name,Credits,Grade Points,Quality Points,Weighted Contribution\n';
    results.courseBreakdown.forEach(c => {
      csv += `"${c.name}",${c.credits},${c.gradePoints},${c.totalPoints},${c.weight}%\n`;
    });
    csv += `\nTotal Semester Credits,${results.currentSemesterCredits}\n`;
    csv += `Semester SGPA,${results.sgpa}\n`;
    csv += `Cumulative CGPA,${results.cumulativeCgpa}\n`;
    csv += `Academic Classification,"${results.academicStanding}"\n`;

    downloadText(csv, `grade_report_${scale}_scale.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none animate-quick-fade">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Grade & GPA / CGPA Calculator</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Premium Academic Engine
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Calculate semester SGPA, cumulative CGPA, grade percentage, and academic honors in real-time.
            </p>
          </div>
        </div>

        {/* Global Tools & Scale Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scale Selector */}
          <div className="flex rounded-2xl bg-theme-bg p-1 border border-theme-border">
            {(['4.0', '5.0', '10.0', '100'] as GpaScale[]).map(sc => (
              <button
                key={sc}
                onClick={() => setScale(sc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  scale === sc
                    ? 'bg-theme-accent text-white shadow-md'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                {sc === '100' ? 'Percentage' : `${sc} Scale`}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface border border-theme-border text-xs font-semibold text-theme-text transition-all cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface border border-theme-border text-xs font-semibold text-theme-text transition-all cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Main KPI Result Showcase Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-theme-border shadow-2xl space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          {/* SGPA Result */}
          <div className="space-y-1 p-4 rounded-2xl bg-slate-900/80 border border-theme-border/60">
            <span className="text-[10px] uppercase font-bold tracking-widest text-theme-text-muted block">
              Semester SGPA
            </span>
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 font-mono tracking-tight animate-result-reveal">
              {results.sgpa.toFixed(2)}
            </div>
            <span className="text-[10px] text-theme-text-muted font-mono">
              on {scale} scale
            </span>
          </div>

          {/* Cumulative CGPA */}
          <div className="space-y-1 p-4 rounded-2xl bg-slate-900/80 border border-theme-border/60">
            <span className="text-[10px] uppercase font-bold tracking-widest text-theme-text-muted block">
              Cumulative CGPA
            </span>
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-300 font-mono tracking-tight animate-result-reveal">
              {results.cumulativeCgpa.toFixed(2)}
            </div>
            <span className="text-[10px] text-theme-text-muted font-mono">
              {results.totalCumulativeCredits} total credits
            </span>
          </div>

          {/* Equivalent Percentage */}
          <div className="space-y-1 p-4 rounded-2xl bg-slate-900/80 border border-theme-border/60">
            <span className="text-[10px] uppercase font-bold tracking-widest text-theme-text-muted block">
              Grade Percentage
            </span>
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 font-mono tracking-tight animate-result-reveal">
              {results.estimatedPercentage}%
            </div>
            <span className="text-[10px] text-theme-text-muted font-mono">
              {results.currentSemesterPoints} quality points
            </span>
          </div>

          {/* Total Semester Credits */}
          <div className="space-y-1 p-4 rounded-2xl bg-slate-900/80 border border-theme-border/60">
            <span className="text-[10px] uppercase font-bold tracking-widest text-theme-text-muted block">
              Semester Credits
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight animate-result-reveal">
              {results.currentSemesterCredits}
            </div>
            <span className="text-[10px] text-theme-text-muted font-mono">
              across {courses.length} courses
            </span>
          </div>
        </div>

        {/* Academic Standing Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span className="text-xs text-white/80 font-medium">Academic Honor Status:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${results.standingColor}`}>
              {results.academicStanding}
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-theme-text-muted text-[11px] mr-1">Presets:</span>
            <button
              onClick={() => loadPreset('engineering')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/80 transition-all cursor-pointer"
            >
              Engineering
            </button>
            <button
              onClick={() => loadPreset('premed')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/80 transition-all cursor-pointer"
            >
              Pre-Med
            </button>
            <button
              onClick={() => loadPreset('business')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/80 transition-all cursor-pointer"
            >
              Business
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Course Manager (Left) & Prior CGPA Settings (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Manager Table */}
        <div className="lg:col-span-8 bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Current Semester Courses ({courses.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              {results.currentSemesterCredits} Total Credits
            </span>
          </div>

          {/* Quick Add Row */}
          <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
            <input
              type="text"
              placeholder="Course Name (e.g. Organic Chemistry)"
              value={newCourseName}
              onChange={e => setNewCourseName(e.target.value)}
              className="sm:col-span-6 px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
            />
            <input
              type="number"
              min={1}
              max={10}
              placeholder="Credits"
              value={newCourseCredits}
              onChange={e => setNewCourseCredits(Math.max(1, parseInt(e.target.value) || 1))}
              className="sm:col-span-2 px-2.5 py-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-center focus:border-theme-accent focus:outline-none"
            />
            <select
              value={newCourseGrade}
              onChange={e => setNewCourseGrade(parseFloat(e.target.value))}
              className="sm:col-span-3 px-2 py-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
            >
              {gradeOptions.map(g => (
                <option key={g.label} value={g.val}>{g.label}</option>
              ))}
            </select>
            <button
              onClick={addCourse}
              className="sm:col-span-1 p-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white flex items-center justify-center transition-all cursor-pointer"
              title="Add Course"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Course Rows */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {courses.map((course, idx) => (
              <div
                key={course.id}
                className="p-3 rounded-2xl bg-theme-bg border border-theme-border grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs hover:border-theme-accent/40 transition-colors"
              >
                <div className="sm:col-span-5 flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-lg bg-theme-surface border border-theme-border flex items-center justify-center font-mono text-[10px] text-theme-text-muted flex-shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={course.name}
                    onChange={e => updateCourse(course.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-b border-transparent focus:border-theme-accent text-theme-text font-semibold focus:outline-none truncate"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-1">
                  <span className="text-[10px] text-theme-text-muted sm:hidden">Credits:</span>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={course.credits}
                    onChange={e => updateCourse(course.id, 'credits', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-2 py-1 rounded-lg bg-theme-surface border border-theme-border text-center font-mono text-theme-text focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={course.gradePoints}
                    onChange={e => updateCourse(course.id, 'gradePoints', parseFloat(e.target.value))}
                    className="w-full px-2 py-1 rounded-lg bg-theme-surface border border-theme-border text-theme-text focus:outline-none text-[11px]"
                  >
                    {gradeOptions.map(g => (
                      <option key={g.label} value={g.val}>{g.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  <button
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length <= 1}
                    className="p-1.5 rounded-lg text-theme-text-muted hover:text-rose-400 disabled:opacity-30 transition-colors cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prior CGPA Settings & Weighted Distribution */}
        <div className="lg:col-span-4 space-y-6">
          {/* Prior Academic History */}
          <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Prior Cumulative History</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Prior CGPA</label>
                <input
                  type="number"
                  step={0.01}
                  min={0}
                  max={scale === '100' ? 100 : parseFloat(scale)}
                  value={priorCgpa}
                  onChange={e => setPriorCgpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Prior Completed Credits</label>
                <input
                  type="number"
                  min={0}
                  value={priorCredits}
                  onChange={e => setPriorCredits(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-theme-border text-[11px] text-theme-text-muted space-y-1">
                <div className="flex justify-between">
                  <span>Semester Contribution:</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {Math.round((results.currentSemesterCredits / results.totalCumulativeCredits) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Prior History Contribution:</span>
                  <span className="font-mono text-theme-text font-bold">
                    {Math.round((priorCredits / results.totalCumulativeCredits) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Weighted Impact */}
          <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Credit Weight Breakdown</span>
            </h3>

            <div className="space-y-2">
              {results.courseBreakdown.slice(0, 4).map(c => (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-theme-text">
                    <span className="truncate">{c.name}</span>
                    <span className="font-mono text-cyan-400">{c.weight}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-theme-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                      style={{ width: `${c.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
