import React, { useState, useMemo } from 'react';
import { AlertCircle, AtSign, Award, Bookmark, BookmarkCheck, Calendar, Check, CheckCircle2, Clock, Copy, Download, Globe, HelpCircle, Info, Lightbulb, Mail, Plus, Printer, RefreshCw, Rocket, RotateCcw, Search, Share2, ShieldCheck, Shuffle, Smartphone, Sparkles, Star, Tag, Terminal, Trash2, User, UserCheck, Wand2, Zap } from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export interface ScheduleBlock {
  id: string;
  time: string;
  activity: string;
  category: 'class' | 'study' | 'break' | 'meal' | 'routine' | 'hobby';
  completed: boolean;
}

export const SmartDailySchedulePlanner: React.FC = () => {
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [targetStudyHours, setTargetStudyHours] = useState(4);
  const [classStartTime, setClassStartTime] = useState('09:00');
  const [classEndTime, setClassEndTime] = useState('14:00');

  const defaultSchedule: ScheduleBlock[] = [
    { id: '1', time: '07:00 – 07:30', activity: 'Morning Wakeup, Hydration & Stretches', category: 'routine', completed: false },
    { id: '2', time: '07:30 – 08:30', activity: 'Healthy Breakfast & Review Daily Goals', category: 'meal', completed: false },
    { id: '3', time: '09:00 – 14:00', activity: 'School / College Lectures & Labs', category: 'class', completed: false },
    { id: '4', time: '14:00 – 15:00', activity: 'Lunch & Relaxing Break', category: 'meal', completed: false },
    { id: '5', time: '15:30 – 17:30', activity: 'Core Subject Deep Work & Problem Sets', category: 'study', completed: false },
    { id: '6', time: '17:30 – 18:30', activity: 'Outdoor Walk / Exercise / Hobbies', category: 'hobby', completed: false },
    { id: '7', time: '19:00 – 21:00', activity: 'Assignment Completion & Active Recall Review', category: 'study', completed: false },
    { id: '8', time: '21:00 – 22:00', activity: 'Dinner with Family & Wind-down', category: 'meal', completed: false },
    { id: '9', time: '22:30 – 23:00', activity: 'Pack Bag for Tomorrow & Sleep Routine', category: 'routine', completed: false },
  ];

  const [blocks, setBlocks] = useLocalStorage<ScheduleBlock[]>('studkit_daily_schedule', defaultSchedule);
  const [newActivity, setNewActivity] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState<ScheduleBlock['category']>('study');

  const handleAddBlock = () => {
    if (!newActivity.trim() || !newTime.trim()) return;
    const item: ScheduleBlock = {
      id: Math.random().toString(36).substring(7),
      time: newTime.trim(),
      activity: newActivity.trim(),
      category: newCategory,
      completed: false,
    };
    setBlocks(prev => [...prev, item]);
    setNewActivity('');
    setNewTime('');
  };

  const handleToggleComplete = (id: string) => {
    setBlocks(prev =>
      prev.map(b => (b.id === id ? { ...b, completed: !b.completed } : b))
    );
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleGenerateTemplate = () => {
    const generated: ScheduleBlock[] = [
      { id: '1', time: `${wakeTime} – 07:45`, activity: 'Wakeup Routine & Breakfast', category: 'routine', completed: false },
      { id: '2', time: `${classStartTime} – ${classEndTime}`, activity: 'Mandatory Classes / Lectures', category: 'class', completed: false },
      { id: '3', time: '14:30 – 15:30', activity: 'Post-Class Recovery & Snack', category: 'break', completed: false },
      { id: '4', time: '16:00 – 18:00', activity: `Focused Study Block 1 (${targetStudyHours / 2} hrs)`, category: 'study', completed: false },
      { id: '5', time: '18:00 – 19:00', activity: 'Physical Activity & Social Time', category: 'hobby', completed: false },
      { id: '6', time: '19:30 – 21:30', activity: `Focused Study Block 2 (${targetStudyHours / 2} hrs)`, category: 'study', completed: false },
      { id: '7', time: '21:30 – 22:30', activity: 'Dinner & Digital Wind-Down', category: 'meal', completed: false },
      { id: '8', time: `22:30 – ${sleepTime}`, activity: 'Prepare for Tomorrow & Sleep', category: 'routine', completed: false },
    ];
    setBlocks(generated);
  };

  const categoryColors: Record<ScheduleBlock['category'], { bg: string; text: string; border: string }> = {
    class: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
    study: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    break: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
    meal: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
    routine: { bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30' },
    hobby: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  };

  const completedCount = blocks.filter(b => b.completed).length;
  const progressPercent = blocks.length > 0 ? Math.round((completedCount / blocks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Configuration & Generator Card */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-theme-border">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
              <Calendar className="w-5 h-5 text-theme-accent" />
              <span>Smart Daily Schedule & Routine Builder</span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Auto-generate balanced study schedules tailored to your college hours and sleep goals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Plan</span>
            </button>
            <button
              onClick={handleGenerateTemplate}
              className="px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/25 flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Timetable</span>
            </button>
          </div>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-theme-text-muted font-medium block mb-1">Wakeup Time</label>
            <input
              type="time"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono"
            />
          </div>

          <div>
            <label className="text-theme-text-muted font-medium block mb-1">Sleep Time</label>
            <input
              type="time"
              value={sleepTime}
              onChange={e => setSleepTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono"
            />
          </div>

          <div>
            <label className="text-theme-text-muted font-medium block mb-1">Class Window</label>
            <div className="flex items-center gap-1">
              <input
                type="time"
                value={classStartTime}
                onChange={e => setClassStartTime(e.target.value)}
                className="w-1/2 px-2 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono text-[11px]"
              />
              <span className="text-theme-text-muted">-</span>
              <input
                type="time"
                value={classEndTime}
                onChange={e => setClassEndTime(e.target.value)}
                className="w-1/2 px-2 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="text-theme-text-muted font-medium block mb-1">Target Study Hours</label>
            <input
              type="number"
              min="1"
              max="12"
              value={targetStudyHours}
              onChange={e => setTargetStudyHours(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono"
            />
          </div>
        </div>
      </div>

      {/* Progress & Add Block Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-theme-text">Today's Execution Progress</span>
          <span className="font-mono font-bold text-theme-accent">{completedCount} of {blocks.length} Completed ({progressPercent}%)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-theme-bg overflow-hidden border border-theme-border">
          <div
            className="h-full bg-gradient-to-r from-theme-accent to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Add custom block row */}
        <div className="pt-2 border-t border-theme-border flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="Time (e.g. 16:00 – 17:30)"
            value={newTime}
            onChange={e => setNewTime(e.target.value)}
            className="w-full sm:w-1/4 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono"
          />
          <input
            type="text"
            placeholder="Activity Name (e.g. Organic Chemistry Flashcards)"
            value={newActivity}
            onChange={e => setNewActivity(e.target.value)}
            className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text"
          />
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value as any)}
            className="w-full sm:w-1/4 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text capitalize"
          >
            <option value="study">Study</option>
            <option value="class">Class</option>
            <option value="break">Break</option>
            <option value="meal">Meal</option>
            <option value="routine">Routine</option>
            <option value="hobby">Hobby</option>
          </select>
          <button
            onClick={handleAddBlock}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Schedule Timeline Items */}
      <div className="space-y-3">
        {blocks.map((block) => {
          const catStyle = categoryColors[block.category] || categoryColors.routine;
          return (
            <div
              key={block.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                block.completed
                  ? 'bg-theme-bg/60 border-theme-border opacity-70'
                  : 'bg-theme-surface border-theme-border hover:border-theme-accent/40 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handleToggleComplete(block.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                    block.completed
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-theme-border hover:border-theme-accent text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-theme-text">{block.time}</span>
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      {block.category}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-medium mt-0.5 truncate ${
                      block.completed ? 'line-through text-theme-text-muted' : 'text-theme-text'
                    }`}
                  >
                    {block.activity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteBlock(block.id)}
                className="p-1.5 text-theme-text-muted hover:text-rose-400 rounded-lg transition-colors flex-shrink-0"
                title="Delete Block"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
















interface GeneratedItem {
  id: string;
  value: string;
  category: string;
  style: string;
}

const DOMAINS = ['@gmail.com', '@outlook.com', '@proton.me', '@icloud.com', '@edu.com'];

export const SmartEmailUsernameGenerator: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [profession, setProfession] = useState('Developer');
  const [keyword, setKeyword] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Professional');

  const [usernames, setUsernames] = useState<GeneratedItem[]>([]);
  const [emails, setEmails] = useState<GeneratedItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateResults = (more = false) => {
    const fn = firstName.trim().toLowerCase() || 'alex';
    const ln = lastName.trim().toLowerCase() || 'smith';
    const nick = nickname.trim().toLowerCase() || fn;
    const yr = birthYear.trim() || '24';
    const prof = profession.trim().toLowerCase();
    const kw = keyword.trim().toLowerCase();
    const fInitial = fn.charAt(0);
    const lInitial = ln.charAt(0);

    const newUsers: GeneratedItem[] = [];
    const newEmails: GeneratedItem[] = [];
    const seed = more ? Math.floor(Math.random() * 100) : 1;

    // --- Generate Usernames ---
    const userPatterns = [
      // Professional / Clean
      { val: `${fn}.${ln}`, cat: 'Clean Dot', style: 'Professional' },
      { val: `${fn}_${ln}`, cat: 'Underscore', style: 'Professional' },
      { val: `${fInitial}${ln}`, cat: 'Initial + Last', style: 'Professional' },
      { val: `${fn}${lInitial}`, cat: 'First + Initial', style: 'Professional' },
      { val: `${ln}.${fn}`, cat: 'Last First', style: 'Professional' },

      // Developer / Modern Tech
      { val: `${fn}.codes`, cat: 'Tech Domain', style: 'Developer' },
      { val: `${fn}_dev`, cat: 'Developer Suffix', style: 'Developer' },
      { val: `dev_${fn}`, cat: 'Developer Prefix', style: 'Developer' },
      { val: `${fn}_${prof || 'tech'}`, cat: 'Profession', style: 'Developer' },
      { val: `git_${fn}`, cat: 'Git Handle', style: 'Developer' },

      // Student & Academic
      { val: `${fn}.${ln}${yr}`, cat: 'Student Year', style: 'Student' },
      { val: `${fn}_edu`, cat: 'Academic', style: 'Student' },
      { val: `${fInitial}_${ln}_${yr}`, cat: 'Class Tag', style: 'Student' },

      // Creative & Minimal
      { val: `the.${fn}`, cat: 'Branded', style: 'Creative' },
      { val: `hey_${fn}`, cat: 'Casual', style: 'Creative' },
      { val: `${nick}_hq`, cat: 'Studio Tag', style: 'Creative' },
      { val: `${fn}_${kw || 'pulse'}`, cat: 'Keyword Tag', style: 'Creative' },
      { val: `its${fn}`, cat: 'Modern Direct', style: 'Minimal' },
      { val: `iam_${fn}`, cat: 'Identity', style: 'Minimal' },
      { val: `${fInitial}${lInitial}_${fn}`, cat: 'Monogram', style: 'Minimal' },
    ];

    userPatterns.forEach((p, idx) => {
      newUsers.push({
        id: `user-${idx}-${seed}`,
        value: p.val.replace(/[^a-zA-Z0-9._]/g, ''),
        category: p.cat,
        style: p.style,
      });
    });

    // --- Generate Email Addresses ---
    const emailBases = [
      `${fn}.${ln}`,
      `${fInitial}.${ln}`,
      `${fn}${ln}`,
      `${fn}_${ln}`,
      `${fInitial}${ln}${yr}`,
      `${fn}.${prof || 'work'}`,
      `contact.${fn}`,
      `hello.${fn}.${ln}`,
      `${nick}.${yr}`,
    ];

    emailBases.forEach((base, idx) => {
      const cleanBase = base.replace(/[^a-zA-Z0-9._]/g, '');
      DOMAINS.forEach((domain, dIdx) => {
        if ((idx + dIdx) % 2 === 0 || dIdx === 0) {
          newEmails.push({
            id: `email-${idx}-${dIdx}-${seed}`,
            value: `${cleanBase}${domain}`,
            category: domain.replace('@', '').toUpperCase(),
            style: idx < 3 ? 'Professional' : 'Modern',
          });
        }
      });
    });

    setUsernames(newUsers);
    setEmails(newEmails);
    setHasGenerated(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleFavorite = (text: string) => {
    setFavorites(prev =>
      prev.includes(text) ? prev.filter(f => f !== text) : [...prev, text]
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Studio Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/25 flex-shrink-0">
            <div className="w-full h-full bg-theme-bg rounded-[14px] flex items-center justify-center text-cyan-400">
              <UserCheck className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black text-theme-text tracking-tight flex items-center gap-2">
              <span>Smart Email & Username Generator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Identity Studio
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted mt-0.5">
              Generate clean, professional, developer, and student usernames and email address variations.
            </p>
          </div>
        </div>

        {hasGenerated && (
          <button
            onClick={() => generateResults(true)}
            className="px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate More Variations</span>
          </button>
        )}
      </div>

      {/* Input Configuration Panel */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
          <AtSign className="w-4 h-4" />
          <span>Identity & Keyword Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="e.g. Sohaib"
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="e.g. Shahid"
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">Nickname / Alias</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="e.g. Malik"
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">Birth Year / Number</label>
            <input
              type="text"
              value={birthYear}
              onChange={e => setBirthYear(e.target.value)}
              placeholder="e.g. 2004 or 07"
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent font-medium font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">Profession / Role</label>
            <input
              type="text"
              value={profession}
              onChange={e => setProfession(e.target.value)}
              placeholder="e.g. Developer, Designer"
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">Brand / Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="e.g. Studio, Labs, Dev"
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent font-medium"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-bold text-theme-text">Preferred Naming Vibe</label>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {['Professional', 'Developer', 'Minimal', 'Creative', 'Student'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStyle(st)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                    selectedStyle === st
                      ? 'bg-theme-accent text-white border-theme-accent shadow-sm'
                      : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => generateResults(false)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-theme-accent via-cyan-500 to-indigo-600 hover:from-theme-accent-hover hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-theme-accent/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Smart Usernames & Email Addresses</span>
        </button>
      </div>

      {/* Results Section */}
      {hasGenerated && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Usernames Panel */}
          <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>Generated Usernames ({usernames.length})</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">Handles & IDs</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
              {usernames.map(u => {
                const isFav = favorites.includes(u.value);
                const isCopied = copiedText === u.value;
                return (
                  <div
                    key={u.id}
                    className="p-3 rounded-2xl bg-theme-bg border border-theme-border hover:border-theme-accent/50 flex items-center justify-between gap-3 group transition-all"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-theme-text group-hover:text-theme-accent transition-colors">
                        {u.value}
                      </span>
                      <span className="block text-[9px] font-mono text-theme-text-muted mt-0.5">
                        {u.category} • {u.style}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFavorite(u.value)}
                        className="p-1.5 rounded-lg text-theme-text-muted hover:text-amber-400 transition-colors cursor-pointer"
                        title="Save to favorites"
                      >
                        {isFav ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(u.value)}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-theme-surface border-theme-border text-theme-text-muted hover:text-theme-text'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email Addresses Panel */}
          <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>Generated Email Addresses ({emails.length})</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Professional Inboxes</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
              {emails.map(e => {
                const isFav = favorites.includes(e.value);
                const isCopied = copiedText === e.value;
                return (
                  <div
                    key={e.id}
                    className="p-3 rounded-2xl bg-theme-bg border border-theme-border hover:border-theme-accent/50 flex items-center justify-between gap-3 group transition-all"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-theme-text group-hover:text-theme-accent transition-colors">
                        {e.value}
                      </span>
                      <span className="block text-[9px] font-mono text-theme-text-muted mt-0.5">
                        Domain: {e.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFavorite(e.value)}
                        className="p-1.5 rounded-lg text-theme-text-muted hover:text-amber-400 transition-colors cursor-pointer"
                        title="Save to favorites"
                      >
                        {isFav ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(e.value)}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-theme-surface border-theme-border text-theme-text-muted hover:text-theme-text'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Registration Disclaimer */}
      <div className="p-4 rounded-2xl bg-theme-surface/50 border border-theme-border/60 flex items-start gap-3 text-xs text-theme-text-muted">
        <Info className="w-4 h-4 text-theme-accent flex-shrink-0 mt-0.5" />
        <span>
          <strong>Provider Availability Note:</strong> Generated suggestions represent structured lexical combinations. Live email and username availability is subject to real-time registration with your chosen service provider (Google, Microsoft, Proton, GitHub, etc.).
        </span>
      </div>
    </div>
  );
};















interface ProjectNameResult {
  id: string;
  name: string;
  meaning: string;
  whyItFits: string;
  tagline: string;
  category: 'Modern Tech' | 'Startup' | 'Academic' | 'Minimalist' | 'Creative' | 'Compound';
  domains: string[];
}

export const SmartProjectNameGenerator: React.FC = () => {
  const [description, setDescription] = useState(
    'A high-performance student workspace with AI study tools, document processing, and adaptive quizzes.'
  );
  const [industry, setIndustry] = useState('EdTech & Learning');
  const [targetAudience, setTargetAudience] = useState('Students & Developers');
  const [namingStyle, setNamingStyle] = useState<string>('All Styles');

  const [results, setResults] = useState<ProjectNameResult[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateProjectNames = (more = false) => {
    const desc = description.trim().toLowerCase();
    const ind = industry.toLowerCase();
    const isEdu = desc.includes('student') || desc.includes('study') || desc.includes('learn') || desc.includes('quiz') || ind.includes('edtech');
    const isTech = desc.includes('ai') || desc.includes('code') || desc.includes('developer') || desc.includes('cloud') || desc.includes('tool');

    const seed = more ? Math.floor(Math.random() * 500) : 1;

    const basePool: ProjectNameResult[] = [
      {
        id: `p1-${seed}`,
        name: 'StudKit',
        meaning: 'Fusion of "Student" + "Toolkit" / "Kit".',
        whyItFits: 'Immediately conveys a unified, all-in-one operating toolkit for academic success.',
        tagline: 'Everything Students Need. One Powerful Toolkit.',
        category: 'Compound',
        domains: ['.io', '.app', '.dev', '.com'],
      },
      {
        id: `p2-${seed}`,
        name: 'OmniScholar',
        meaning: 'Latin "Omnis" (all-encompassing) + "Scholar".',
        whyItFits: 'Evokes authoritative academic intelligence and full-spectrum revision mastery.',
        tagline: 'The Autonomous Academic Operating System.',
        category: 'Academic',
        domains: ['.ai', '.com', '.org'],
      },
      {
        id: `p3-${seed}`,
        name: 'NexusPulse',
        meaning: 'Nexus (central link) + Pulse (vital energy and speed).',
        whyItFits: 'Ideal for modern fast-paced software, algorithms, and collaborative hubs.',
        tagline: 'Synchronize Your Workflow with Precision.',
        category: 'Startup',
        domains: ['.dev', '.io', '.cloud'],
      },
      {
        id: `p4-${seed}`,
        name: 'CogniFlow',
        meaning: 'Cognition (mental processing) + Flow (optimal productivity state).',
        whyItFits: 'Emphasizes effortless studying, memory retention, and distraction-free deep work.',
        tagline: 'Effortless Focus. Unbounded Retention.',
        category: 'Modern Tech',
        domains: ['.ai', '.app', '.co'],
      },
      {
        id: `p5-${seed}`,
        name: 'Academiq',
        meaning: 'Modern clipped spelling of Academic + Intelligence Quotient (IQ).',
        whyItFits: 'Short, brandable, and memorable for global student platforms and AI tutoring.',
        tagline: 'Next-Generation Adaptive Learning.',
        category: 'Minimalist',
        domains: ['.io', '.com', '.xyz'],
      },
      {
        id: `p6-${seed}`,
        name: 'Synthetix Lab',
        meaning: 'Synthesis (combining ideas into coherent wholes) + Modern suffix.',
        whyItFits: 'Perfect for data-driven, engineering, or experimental AI tooling projects.',
        tagline: 'From Raw Concept to Engineered Reality.',
        category: 'Modern Tech',
        domains: ['.tech', '.dev', '.ai'],
      },
      {
        id: `p7-${seed}`,
        name: 'VortexLearn',
        meaning: 'Vortex (powerful accelerating core) + Learn.',
        whyItFits: 'Appeals to ambitious students aiming to accelerate their exam preparation.',
        tagline: 'Accelerate Your Mastery Curve.',
        category: 'Startup',
        domains: ['.app', '.co', '.io'],
      },
      {
        id: `p8-${seed}`,
        name: 'PaperPlane Studio',
        meaning: 'Playful metaphor for lightweight, seamless creation and rapid sharing.',
        whyItFits: 'Welcoming, human, and creative for everyday utilities, notes, and PDF tools.',
        tagline: 'Lightweight Tools for Heavy Thinkers.',
        category: 'Creative',
        domains: ['.design', '.studio', '.com'],
      },
    ];

    setResults(basePool);
    setHasGenerated(true);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (name: string) => {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const filteredResults =
    namingStyle === 'All Styles'
      ? results
      : results.filter(r => r.category === namingStyle);

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Studio Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/25 flex-shrink-0">
            <div className="w-full h-full bg-theme-bg rounded-[14px] flex items-center justify-center text-amber-400">
              <Rocket className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black text-theme-text tracking-tight flex items-center gap-2">
              <span>Smart Project & Startup Name Generator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Brand Intelligence
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted mt-0.5">
              Transform natural language project concepts into brandable startup names with etymologies and taglines.
            </p>
          </div>
        </div>

        {hasGenerated && (
          <button
            onClick={() => generateProjectNames(true)}
            className="px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate More Ideas</span>
          </button>
        )}
      </div>

      {/* Input Concept Panel */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" />
            <span>Describe Your Project or Startup Idea</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. A fast PDF compressor and student resume builder with modern dark theme and AI chat..."
            className="w-full p-3.5 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent leading-relaxed resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">Industry / Domain</label>
            <input
              type="text"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="e.g. EdTech, SaaS, AI, Health"
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              placeholder="e.g. College Students, Developers"
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-theme-text">Filter Naming Style</label>
            <select
              value={namingStyle}
              onChange={e => setNamingStyle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
            >
              <option value="All Styles">All Naming Styles</option>
              <option value="Modern Tech">Modern Tech</option>
              <option value="Startup">Startup / Punchy</option>
              <option value="Academic">Academic / Trustworthy</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Creative">Creative / Metaphor</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => generateProjectNames(false)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Synthesize Brandable Project Names</span>
        </button>
      </div>

      {/* Results Grid */}
      {hasGenerated && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>Recommended Project Names ({filteredResults.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-theme-text-muted">
              Favorites saved: {favorites.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map(item => {
              const isFav = favorites.includes(item.name);
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-theme-surface border border-theme-border hover:border-theme-accent rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-theme-text group-hover:text-theme-accent transition-colors font-mono">
                          {item.name}
                        </span>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-theme-bg border border-theme-border text-cyan-400 uppercase">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFavorite(item.name)}
                          className="p-1.5 rounded-lg text-theme-text-muted hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          {isFav ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(item.name, item.id)}
                          className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                          }`}
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border/60 space-y-1">
                      <span className="text-[10px] font-mono text-theme-text-muted font-bold block uppercase tracking-wider">
                        Suggested Tagline:
                      </span>
                      <p className="text-xs font-bold text-amber-400 italic">
                        "{item.tagline}"
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-theme-text-muted leading-relaxed">
                      <p>
                        <strong className="text-theme-text">Etymology:</strong> {item.meaning}
                      </p>
                      <p>
                        <strong className="text-theme-text">Why it fits:</strong> {item.whyItFits}
                      </p>
                    </div>
                  </div>

                  {/* Domain TLD Badges */}
                  <div className="flex items-center justify-between pt-3 border-t border-theme-border/60 text-[10px] font-mono">
                    <span className="text-theme-text-muted flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-theme-accent" /> TLDs:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.domains.map((dom, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2 py-0.5 rounded-md bg-theme-bg border border-theme-border text-theme-text font-bold"
                        >
                          {dom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
