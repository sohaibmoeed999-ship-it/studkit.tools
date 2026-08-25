import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, AlertTriangle, Award, Bookmark, Calendar, Check, CheckCircle2, CheckSquare, Clock, Copy, Download, Edit3, Flame, Grid, HelpCircle, Layers, List, Plus, RefreshCw, RotateCcw, Save, Search, Share2, ShieldCheck, Sparkles, Star, Target, Trash2, Trophy, Zap } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { downloadText } from '../../../utils/download';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const AssignmentTracker: React.FC = () => {
  const [assignments, setAssignments] = useLocalStorage<AssignmentItem[]>('studkit_assignments', [
    {
      id: '1',
      title: 'Operating Systems Virtual Memory Lab',
      course: 'CS 301',
      dueDate: '2026-09-02',
      completed: false,
      priority: 'high',
    },
    {
      id: '2',
      title: 'Linear Algebra Matrix Problem Set 4',
      course: 'MATH 210',
      dueDate: '2026-09-05',
      completed: false,
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Digital Marketing Campaign Report',
      course: 'MKT 101',
      dueDate: '2026-09-10',
      completed: true,
      priority: 'low',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addAssignment = () => {
    if (!newTitle.trim()) return;
    const item: AssignmentItem = {
      id: Math.random().toString(36).substring(7),
      title: newTitle.trim(),
      course: newCourse.trim() || 'General',
      dueDate: newDate || new Date().toISOString().split('T')[0],
      completed: false,
      priority: newPriority,
    };
    setAssignments(prev => [item, ...prev]);
    setNewTitle('');
    setNewCourse('');
    setNewDate('');
  };

  const toggleComplete = (id: string) => {
    setAssignments(prev => prev.map(a => (a.id === id ? { ...a, completed: !a.completed } : a)));
  };

  const removeAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const getDaysLeft = (dateStr: string) => {
    const due = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Create New Assignment */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
          <Plus className="w-4 h-4 text-theme-accent" />
          <span>Add New Homework or Exam Deadline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Assignment title / project name..."
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
            />
          </div>
          <div className="sm:col-span-3">
            <input
              type="text"
              value={newCourse}
              onChange={e => setNewCourse(e.target.value)}
              placeholder="Course code (e.g. CS 301)"
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs font-mono text-theme-text outline-none focus:border-theme-accent"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-theme-text-muted">Priority:</span>
            {(['low', 'medium', 'high'] as const).map(p => (
              <button
                key={p}
                onClick={() => setNewPriority(p)}
                className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono font-bold border transition-all ${
                  newPriority === p
                    ? p === 'high'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : p === 'medium'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-theme-bg border-theme-border text-theme-text-muted'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={addAssignment}
            className="px-5 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20 transition-all"
          >
            Save Assignment
          </button>
        </div>
      </div>

      {/* Assignment List with Countdowns */}
      <div className="space-y-3">
        {assignments.map(item => {
          const daysLeft = getDaysLeft(item.dueDate);
          const isUrgent = daysLeft <= 2 && !item.completed;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                item.completed
                  ? 'bg-theme-surface/40 border-theme-border/40 opacity-60'
                  : isUrgent
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-theme-surface border-theme-border shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleComplete(item.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    item.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-theme-border hover:border-theme-accent'
                  }`}
                >
                  {item.completed && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-semibold ${
                        item.completed ? 'line-through text-theme-text-muted' : 'text-theme-text'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-theme-bg text-theme-text-muted border border-theme-border">
                      {item.course}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-theme-text-muted font-mono mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Due: {item.dueDate}
                    </span>
                    <span
                      className={`font-bold ${
                        daysLeft < 0
                          ? 'text-rose-400'
                          : daysLeft <= 2
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {item.completed
                        ? 'Completed'
                        : daysLeft < 0
                        ? 'Overdue'
                        : daysLeft === 0
                        ? 'Due Today!'
                        : `${daysLeft} days remaining`}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeAssignment(item.id)}
                className="p-2 rounded-xl bg-theme-bg hover:bg-rose-500/15 border border-theme-border text-theme-text-muted hover:text-rose-400 text-xs"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};



interface HabitItem {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
}

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<HabitItem[]>('studkit_habits', [
    { id: '1', name: 'Solve 2 DSA Algorithm Problems', streak: 14, completedToday: true },
    { id: '2', name: 'Read 20 pages of academic textbook', streak: 6, completedToday: false },
    { id: '3', name: 'Review Spaced Repetition Flashcards', streak: 21, completedToday: true },
    { id: '4', name: 'Drink 2L Water & 15m Exercise', streak: 8, completedToday: false },
  ]);

  const [newHabit, setNewHabit] = useState('');

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const item: HabitItem = {
      id: Math.random().toString(36).substring(7),
      name: newHabit.trim(),
      streak: 0,
      completedToday: false,
    };
    setHabits(prev => [...prev, item]);
    setNewHabit('');
  };

  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const nextState = !h.completedToday;
          if (nextState) sounds.playSuccess();
          return {
            ...h,
            completedToday: nextState,
            streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      })
    );
  };

  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-theme-text">Study Habit & Streak Tracker</h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {habits.filter(h => h.completedToday).length} of {habits.length} Complete
          </span>
        </div>

        {/* Add Habit */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newHabit}
            onChange={e => setNewHabit(e.target.value)}
            placeholder="New study habit (e.g. 30m Coding, Calculus notes)..."
            className="flex-1 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
          />
          <button
            onClick={addHabit}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold shadow-md shadow-theme-accent/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Habit List */}
        <div className="space-y-2.5">
          {habits.map(h => (
            <div
              key={h.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                h.completedToday
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-theme-bg border-theme-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleHabit(h.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    h.completedToday
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'border-theme-border hover:border-theme-accent'
                  }`}
                >
                  {h.completedToday && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <span className={`text-xs sm:text-sm font-semibold ${h.completedToday ? 'text-emerald-300' : 'text-theme-text'}`}>
                  {h.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{h.streak}d streak</span>
                </div>
                <button
                  onClick={() => removeHabit(h.id)}
                  className="p-1 text-theme-text-muted hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



interface MatrixTask {
  id: string;
  text: string;
  quadrant: 'urgent_important' | 'not_urgent_important' | 'urgent_not_important' | 'not_urgent_not_important';
}

export const PriorityMatrix: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<MatrixTask[]>('studkit_matrix_tasks', [
    { id: '1', text: 'Submit Computer Science Final Assignment', quadrant: 'urgent_important' },
    { id: '2', text: 'Study 2 hours for Midterms next week', quadrant: 'not_urgent_important' },
    { id: '3', text: 'Reply to group chat project messages', quadrant: 'urgent_not_important' },
    { id: '4', text: 'Browse non-academic social feeds', quadrant: 'not_urgent_not_important' },
  ]);

  const [inputTask, setInputTask] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState<MatrixTask['quadrant']>('urgent_important');

  const addTask = () => {
    if (!inputTask.trim()) return;
    const item: MatrixTask = {
      id: Math.random().toString(36).substring(7),
      text: inputTask.trim(),
      quadrant: selectedQuadrant,
    };
    setTasks(prev => [...prev, item]);
    setInputTask('');
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const quadrants: { id: MatrixTask['quadrant']; label: string; action: string; color: string }[] = [
    { id: 'urgent_important', label: 'Q1: Urgent & Important', action: 'DO IMMEDIATELY', color: 'border-rose-500/40 text-rose-400' },
    { id: 'not_urgent_important', label: 'Q2: Not Urgent, but Important', action: 'SCHEDULE & PLAN', color: 'border-cyan-500/40 text-cyan-400' },
    { id: 'urgent_not_important', label: 'Q3: Urgent, but Not Important', action: 'DELEGATE / QUICK', color: 'border-amber-500/40 text-amber-400' },
    { id: 'not_urgent_not_important', label: 'Q4: Not Urgent & Not Important', action: 'ELIMINATE', color: 'border-gray-500/40 text-gray-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Add Task Input */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <input
          type="text"
          value={inputTask}
          onChange={e => setInputTask(e.target.value)}
          placeholder="New study task..."
          className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
        />

        <select
          value={selectedQuadrant}
          onChange={e => setSelectedQuadrant(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none"
        >
          {quadrants.map(q => (
            <option key={q.id} value={q.id}>
              {q.label}
            </option>
          ))}
        </select>

        <button
          onClick={addTask}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold shadow-md shadow-theme-accent/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map(q => {
          const qTasks = tasks.filter(t => t.quadrant === q.id);
          return (
            <div
              key={q.id}
              className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-theme-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text">{q.label}</h4>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-theme-bg ${q.color}`}>
                    {q.action}
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  {qTasks.map(t => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between gap-2 text-xs text-theme-text"
                    >
                      <span className="truncate">{t.text}</span>
                      <button
                        onClick={() => removeTask(t.id)}
                        className="p-1 text-theme-text-muted hover:text-rose-400 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {qTasks.length === 0 && (
                    <div className="py-6 text-center text-theme-text-muted/50 text-xs font-mono">
                      No tasks in this quadrant
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-theme-text-muted font-mono text-right">
                {qTasks.length} {qTasks.length === 1 ? 'task' : 'tasks'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



export const StudyNotes: React.FC = () => {
  const [noteTitle, setNoteTitle] = useLocalStorage('studkit_note_title', 'Computer Science & Discrete Math Notes');
  const [noteContent, setNoteContent] = useLocalStorage(
    'studkit_note_content',
    `# Algorithms & Data Structures Quick Notes

## 1. Graph Algorithms
- **Breadth-First Search (BFS)**: Uses Queue. Finds shortest path in unweighted graphs. O(V + E)
- **Depth-First Search (DFS)**: Uses Stack / Recursion. Cycle detection and topological sort. O(V + E)
- **Dijkstra's Algorithm**: Greedy with Min-Heap. Shortest path with non-negative weights. O((V+E) log V)

## 2. Dynamic Programming Formulations
- **0/1 Knapsack**: dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i]] + val[i])
- **Longest Common Subsequence (LCS)**: dp[i][j] = dp[i-1][j-1] + 1 if match else max(dp[i-1][j], dp[i][j-1])`
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-theme-border">
          <input
            type="text"
            value={noteTitle}
            onChange={e => setNoteTitle(e.target.value)}
            className="text-base sm:text-lg font-bold text-theme-text bg-transparent outline-none flex-1 focus:border-b border-theme-accent"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(noteContent)}
              className="p-2 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => downloadText(noteContent, `${noteTitle.replace(/[^a-zA-Z0-9]/g, '_')}.md`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold shadow-md shadow-theme-accent/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>
          </div>
        </div>

        <textarea
          value={noteContent}
          onChange={e => setNoteContent(e.target.value)}
          className="w-full h-80 p-4 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text resize-none focus:border-theme-accent outline-none leading-relaxed"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-theme-text-muted">
          <span>Words: {noteContent.trim().split(/\s+/).filter(Boolean).length}</span>
          <span>Characters: {noteContent.length}</span>
          <span>Auto-saved to browser local storage</span>
        </div>
      </div>
    </div>
  );
};
