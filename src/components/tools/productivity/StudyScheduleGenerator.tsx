import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Printer,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { downloadText } from '../../../utils/download';

interface SubjectEntry {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'low' | 'medium' | 'high';
}

interface ScheduleDay {
  dateStr: string;
  dayName: string;
  sessions: {
    subjectName: string;
    durationMinutes: number;
    startTime: string;
    endTime: string;
    isBreak?: boolean;
  }[];
  totalStudyMinutes: number;
}

export const StudyScheduleGenerator: React.FC = () => {
  // 1. Inputs
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultExamDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [examDate, setExamDate] = useState<string>(defaultExamDate);
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState<number>(15);
  const [studyStartTime, setStudyStartTime] = useState<string>('09:00');
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
  ]);

  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    { id: '1', name: 'Mathematics & Calculus', difficulty: 'hard', priority: 'high' },
    { id: '2', name: 'Physics & Mechanics', difficulty: 'hard', priority: 'high' },
    { id: '3', name: 'Computer Science & Algorithms', difficulty: 'medium', priority: 'medium' },
    { id: '4', name: 'Academic Writing & Literature', difficulty: 'easy', priority: 'low' },
  ]);

  const [newSubName, setNewSubName] = useState('');
  const [newSubDiff, setNewSubDiff] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [newSubPrio, setNewSubPrio] = useState<'low' | 'medium' | 'high'>('medium');

  // Days of week
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAddSubject = () => {
    if (!newSubName.trim()) return;
    setSubjects(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: newSubName.trim(),
        difficulty: newSubDiff,
        priority: newSubPrio,
      },
    ]);
    setNewSubName('');
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // 2. Calculations
  const calculationResults = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(examDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (daysRemaining <= 0 || subjects.length === 0 || selectedDays.length === 0) {
      return {
        daysRemaining,
        totalAvailableStudyHours: 0,
        subjectAllocations: [],
        scheduleDays: [],
        isValid: false,
      };
    }

    // Weight calculation per subject: Difficulty (Easy=1, Med=1.5, Hard=2) * Priority (Low=1, Med=1.5, High=2)
    const diffWeights = { easy: 1.0, medium: 1.5, hard: 2.0 };
    const prioWeights = { low: 1.0, medium: 1.5, high: 2.0 };

    const subjectWeights = subjects.map(sub => ({
      ...sub,
      weight: diffWeights[sub.difficulty] * prioWeights[sub.priority],
    }));

    const totalWeight = subjectWeights.reduce((acc, curr) => acc + curr.weight, 0);

    // Count valid study days between now and exam
    let activeStudyDaysCount = 0;
    const dayNameMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < daysRemaining; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dayName = dayNameMap[d.getDay()];
      if (selectedDays.includes(dayName)) {
        activeStudyDaysCount++;
      }
    }

    const totalAvailableStudyHours = activeStudyDaysCount * dailyHours;

    // Allocated hours per subject
    const subjectAllocations = subjectWeights.map(sub => {
      const allocatedHours = totalWeight > 0 ? (sub.weight / totalWeight) * totalAvailableStudyHours : 0;
      return {
        ...sub,
        allocatedHours: Math.round(allocatedHours * 10) / 10,
        percentage: totalAvailableStudyHours > 0 ? Math.round((allocatedHours / totalAvailableStudyHours) * 100) : 0,
      };
    });

    // Generate Timetable Schedule Days
    const scheduleDays: ScheduleDay[] = [];
    let subjectIndexTracker = 0;

    for (let i = 0; i < Math.min(daysRemaining, 30); i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dayName = dayNameMap[d.getDay()];

      if (!selectedDays.includes(dayName)) continue;

      const dateFormatted = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      // Split daily study hours into 45-60 min blocks with breaks
      const sessionBlockMinutes = 50;
      const totalDailyMinutes = dailyHours * 60;
      let minutesPlanned = 0;
      let currentHour = parseInt(studyStartTime.split(':')[0]) || 9;
      let currentMinute = parseInt(studyStartTime.split(':')[1]) || 0;

      const sessions: ScheduleDay['sessions'] = [];

      while (minutesPlanned < totalDailyMinutes && subjectAllocations.length > 0) {
        const activeSub = subjectAllocations[subjectIndexTracker % subjectAllocations.length];
        subjectIndexTracker++;

        const startHStr = String(currentHour).padStart(2, '0');
        const startMStr = String(currentMinute).padStart(2, '0');

        // Add study block
        const duration = Math.min(sessionBlockMinutes, totalDailyMinutes - minutesPlanned);
        minutesPlanned += duration;

        currentMinute += duration;
        while (currentMinute >= 60) {
          currentMinute -= 60;
          currentHour += 1;
        }

        const endHStr = String(currentHour).padStart(2, '0');
        const endMStr = String(currentMinute).padStart(2, '0');

        sessions.push({
          subjectName: activeSub.name,
          durationMinutes: duration,
          startTime: `${startHStr}:${startMStr}`,
          endTime: `${endHStr}:${endMStr}`,
        });

        // Add break if time remains
        if (minutesPlanned < totalDailyMinutes && breakDurationMinutes > 0) {
          const breakStartH = String(currentHour).padStart(2, '0');
          const breakStartM = String(currentMinute).padStart(2, '0');

          currentMinute += breakDurationMinutes;
          while (currentMinute >= 60) {
            currentMinute -= 60;
            currentHour += 1;
          }

          const breakEndH = String(currentHour).padStart(2, '0');
          const breakEndM = String(currentMinute).padStart(2, '0');

          sessions.push({
            subjectName: `Rest & Refreshment Break (${breakDurationMinutes}m)`,
            durationMinutes: breakDurationMinutes,
            startTime: `${breakStartH}:${breakStartM}`,
            endTime: `${breakEndH}:${breakEndM}`,
            isBreak: true,
          });
        }
      }

      scheduleDays.push({
        dateStr: dateFormatted,
        dayName,
        sessions,
        totalStudyMinutes: minutesPlanned,
      });
    }

    return {
      daysRemaining,
      totalAvailableStudyHours,
      subjectAllocations,
      scheduleDays,
      isValid: true,
    };
  }, [examDate, dailyHours, breakDurationMinutes, studyStartTime, selectedDays, subjects]);

  const handleExportCSV = () => {
    if (!calculationResults.isValid) return;

    let csvContent = 'Date,Day,Start Time,End Time,Subject / Activity,Duration (Min)\n';
    calculationResults.scheduleDays.forEach(d => {
      d.sessions.forEach(s => {
        csvContent += `"${d.dateStr}","${d.dayName}","${s.startTime}","${s.endTime}","${s.subjectName}",${s.durationMinutes}\n`;
      });
    });

    downloadText(csvContent, `study_schedule_${examDate}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Study Schedule Generator</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                100% Client-Side Engine
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Auto-generate structured daily study timetables weighted by subject difficulty and priority.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={!calculationResults.isValid}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text disabled:opacity-50 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={!calculationResults.isValid}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Parameters */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>1. Exam & Time Settings</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Target Exam Date</label>
              <input
                type="date"
                min={todayStr}
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Daily Study Hours: <span className="text-cyan-400 font-bold">{dailyHours} hrs/day</span>
              </label>
              <input
                type="range"
                min={1}
                max={12}
                step={0.5}
                value={dailyHours}
                onChange={e => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Daily Start Time</label>
                <input
                  type="time"
                  value={studyStartTime}
                  onChange={e => setStudyStartTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Break Duration</label>
                <select
                  value={breakDurationMinutes}
                  onChange={e => setBreakDurationMinutes(parseInt(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                >
                  <option value={0}>No Breaks</option>
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1.5 font-semibold">Study Days</label>
              <div className="flex flex-wrap gap-1.5">
                {weekDays.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedDays.includes(day)
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-theme-bg text-theme-text-muted border-theme-border hover:text-theme-text'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Subject Management */}
        <div className="md:col-span-2 bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>2. Subjects & Weightings ({subjects.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">
              {calculationResults.daysRemaining} days remaining
            </span>
          </div>

          {/* Add Subject Row */}
          <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              placeholder="Subject Name (e.g. Organic Chemistry)"
              value={newSubName}
              onChange={e => setNewSubName(e.target.value)}
              className="sm:col-span-2 px-3 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
            />
            <select
              value={newSubDiff}
              onChange={e => setNewSubDiff(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
            >
              <option value="easy">Easy (1.0x)</option>
              <option value="medium">Medium (1.5x)</option>
              <option value="hard">Hard (2.0x)</option>
            </select>
            <div className="flex items-center gap-2">
              <select
                value={newSubPrio}
                onChange={e => setNewSubPrio(e.target.value as any)}
                className="w-full px-2 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Med Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                onClick={handleAddSubject}
                className="p-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white transition-all cursor-pointer flex-shrink-0"
                title="Add Subject"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subjects List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {subjects.map(sub => (
              <div
                key={sub.id}
                className="p-2.5 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-semibold text-theme-text truncate flex-1">{sub.name}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold ${
                      sub.difficulty === 'hard'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : sub.difficulty === 'medium'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {sub.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono uppercase font-bold">
                    {sub.priority}
                  </span>
                  <button
                    onClick={() => handleRemoveSubject(sub.id)}
                    className="p-1 rounded text-theme-text-muted hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      {calculationResults.isValid && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Days to Exam</span>
            <p className="text-xl font-black text-cyan-400 font-mono mt-1">{calculationResults.daysRemaining} Days</p>
          </div>
          <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Total Available Hours</span>
            <p className="text-xl font-black text-indigo-400 font-mono mt-1">{calculationResults.totalAvailableStudyHours} Hours</p>
          </div>
          <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Active Subjects</span>
            <p className="text-xl font-black text-emerald-400 font-mono mt-1">{subjects.length} Subjects</p>
          </div>
          <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Avg Daily Pace</span>
            <p className="text-xl font-black text-amber-400 font-mono mt-1">{dailyHours} hrs/day</p>
          </div>
        </div>
      )}

      {/* Subject Hour Allocation Breakdown */}
      {calculationResults.isValid && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Weighted Subject Time Allocation</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {calculationResults.subjectAllocations.map(sub => (
              <div key={sub.id} className="p-3.5 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-theme-text truncate">{sub.name}</span>
                  <span className="font-mono text-cyan-400 font-bold">{sub.allocatedHours} hrs</span>
                </div>
                <div className="w-full h-1.5 bg-theme-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-theme-text-muted font-mono">
                  <span>{sub.percentage}% of schedule</span>
                  <span>{sub.difficulty} • {sub.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Timetable Days */}
      {calculationResults.isValid && calculationResults.scheduleDays.length > 0 && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Generated Daily Timetable (Next {calculationResults.scheduleDays.length} Study Days)</span>
            </h3>
            <span className="text-[11px] font-mono text-theme-text-muted">
              Auto-scheduled until {examDate}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculationResults.scheduleDays.map((day, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-3 hover:border-theme-accent/40 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-theme-border pb-2">
                  <span className="font-black text-sm text-theme-text">{day.dayName}, {day.dateStr}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {Math.round(day.totalStudyMinutes / 60 * 10) / 10} hrs
                  </span>
                </div>

                <div className="space-y-2">
                  {day.sessions.map((sess, sIdx) => (
                    <div
                      key={sIdx}
                      className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 ${
                        sess.isBreak
                          ? 'bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-[11px]'
                          : 'bg-theme-surface border border-theme-border text-theme-text'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {sess.isBreak ? (
                          <Coffee className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                        )}
                        <span className="truncate font-medium">{sess.subjectName}</span>
                      </div>
                      <span className="font-mono text-[10px] text-theme-text-muted flex-shrink-0">
                        {sess.startTime} - {sess.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
