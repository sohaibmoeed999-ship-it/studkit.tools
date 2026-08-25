import React, { useState } from 'react';
import { ResultCard } from '../../common/ResultCard';
import {
  Clock,
  Calculator,
  Type,
  FileText,
  KeyRound,
  Calendar,
  Layers,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  Download,
  Trash2,
  Filter,
  BarChart2,
} from 'lucide-react';
import { downloadBlob } from '../../../utils/download';

export const DailyLifeToolsSuite: React.FC<{ defaultTab?: string }> = ({ defaultTab = 'duplicate_remover' }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // 1. Dedicated Duplicate Text Engine State
  const [dupInput, setDupInput] = useState('');
  const [dupMode, setDupMode] = useState<'words' | 'consecutive_words' | 'lines' | 'sentences' | 'paragraphs'>('words');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [dupOutput, setDupOutput] = useState('');
  const [removedCount, setRemovedCount] = useState(0);

  // 2. Text Case Converter State
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // 3. Days Between Dates State
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  // 4. Password Generator State
  const [pwdLength, setPwdLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [generatedPwd, setGeneratedPwd] = useState('');

  // 5. Bill & Tip Calculator
  const [billAmount, setBillAmount] = useState(50);
  const [tipPercent, setTipPercent] = useState(15);
  const [splitCount, setSplitCount] = useState(2);

  // Real Duplicate Analysis Engine
  const processDuplicates = (
    text: string = dupInput,
    mode: 'words' | 'consecutive_words' | 'lines' | 'sentences' | 'paragraphs' = dupMode,
    isCaseSensitive: boolean = caseSensitive
  ) => {
    if (!text.trim()) {
      setDupOutput('');
      setRemovedCount(0);
      return;
    }

    let cleaned = '';
    let count = 0;

    if (mode === 'words') {
      // Clean duplicate individual words across the entire document
      const tokens = text.split(/(\s+)/);
      const seen = new Set<string>();
      const resultTokens: string[] = [];

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (/^\s+$/.test(token)) {
          resultTokens.push(token);
          continue;
        }
        const key = isCaseSensitive ? token : token.toLowerCase();
        if (seen.has(key)) {
          count++;
        } else {
          seen.add(key);
          resultTokens.push(token);
        }
      }
      cleaned = resultTokens.join('').replace(/\s{2,}/g, ' ').trim();
    } else if (mode === 'consecutive_words') {
      // Clean repeated consecutive duplicate words (e.g. "this is this is" or "the the test")
      const wordsArr = text.split(/\s+/);
      const res: string[] = [];
      for (let i = 0; i < wordsArr.length; i++) {
        const current = wordsArr[i];
        const prev = res[res.length - 1];
        const match = prev && (isCaseSensitive ? prev === current : prev.toLowerCase() === current.toLowerCase());
        if (match) {
          count++;
        } else {
          res.push(current);
        }
      }
      cleaned = res.join(' ');
    } else if (mode === 'lines') {
      // Clean duplicate lines
      const lines = text.split('\n');
      const seen = new Set<string>();
      const resLines: string[] = [];

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) {
          resLines.push(line);
          return;
        }
        const key = isCaseSensitive ? trimmed : trimmed.toLowerCase();
        if (seen.has(key)) {
          count++;
        } else {
          seen.add(key);
          resLines.push(line);
        }
      });
      cleaned = resLines.join('\n');
    } else if (mode === 'sentences') {
      // Clean duplicate sentences
      const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [text];
      const seen = new Set<string>();
      const resSentences: string[] = [];

      sentences.forEach(s => {
        const trimmed = s.trim();
        const key = isCaseSensitive ? trimmed : trimmed.toLowerCase();
        if (seen.has(key)) {
          count++;
        } else {
          seen.add(key);
          resSentences.push(s);
        }
      });
      cleaned = resSentences.join(' ').trim();
    } else if (mode === 'paragraphs') {
      // Clean duplicate paragraphs
      const paragraphs = text.split(/\n\s*\n/);
      const seen = new Set<string>();
      const resParas: string[] = [];

      paragraphs.forEach(p => {
        const trimmed = p.trim();
        const key = isCaseSensitive ? trimmed : trimmed.toLowerCase();
        if (seen.has(key)) {
          count++;
        } else {
          seen.add(key);
          resParas.push(p);
        }
      });
      cleaned = resParas.join('\n\n');
    }

    setDupOutput(cleaned);
    setRemovedCount(count);
  };

  // Text Case Transformations
  const handleCaseChange = (mode: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab') => {
    if (!textInput.trim()) return;

    if (mode === 'upper') setTextOutput(textInput.toUpperCase());
    else if (mode === 'lower') setTextOutput(textInput.toLowerCase());
    else if (mode === 'title') {
      setTextOutput(textInput.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()));
    } else if (mode === 'camel') {
      setTextOutput(textInput.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()));
    } else if (mode === 'snake') {
      setTextOutput(textInput.toLowerCase().replace(/[\s\W-]+/g, '_'));
    } else if (mode === 'kebab') {
      setTextOutput(textInput.toLowerCase().replace(/[\s\W_]+/g, '-'));
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, filename);
  };

  const handleGeneratePassword = () => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+~|}{[]:;?><,./-=';
    let res = '';
    for (let i = 0; i < pwdLength; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPwd(res);
  };

  // Date difference computation
  const calcDaysBetween = () => {
    const d1 = new Date(startDate).getTime();
    const d2 = new Date(endDate).getTime();
    const diff = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Stats computation for duplicate remover
  const origWords = dupInput.trim() ? dupInput.trim().split(/\s+/).length : 0;
  const cleanWords = dupOutput.trim() ? dupOutput.trim().split(/\s+/).length : 0;
  const origChars = dupInput.length;
  const cleanChars = dupOutput.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Studio Header Tabs Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-3 shadow-xl flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
        {[
          { id: 'duplicate_remover', label: 'Duplicate Text Remover', icon: Layers },
          { id: 'text', label: 'Case Converter & Sorter', icon: Type },
          { id: 'dates', label: 'Days Between Dates', icon: Calendar },
          { id: 'password', label: 'Password & Key Generator', icon: KeyRound },
          { id: 'splitter', label: 'Student Bill & Tip Splitter', icon: Calculator },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === t.id
                  ? 'bg-theme-accent text-white shadow-md shadow-theme-accent/25'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Real Duplicate Text & Line Remover */}
      {activeTab === 'duplicate_remover' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-theme-border">
            <div>
              <h3 className="text-base font-bold text-theme-text flex items-center gap-2">
                <span>Real Duplicate Text & Line Remover</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  Full Document Analysis
                </span>
              </h3>
              <p className="text-xs text-theme-text-muted">
                Detect and eliminate repeated words, consecutive duplicates, lines, sentences, or paragraphs with exact count statistics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-theme-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={e => {
                    setCaseSensitive(e.target.checked);
                    processDuplicates(dupInput, dupMode, e.target.checked);
                  }}
                  className="rounded accent-theme-accent"
                />
                <span>Case Sensitive</span>
              </label>
            </div>
          </div>

          {/* Mode Selector Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'words', label: 'Duplicate Words' },
              { id: 'consecutive_words', label: 'Repeated Consecutive Words' },
              { id: 'lines', label: 'Duplicate Lines' },
              { id: 'sentences', label: 'Duplicate Sentences' },
              { id: 'paragraphs', label: 'Duplicate Paragraphs' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setDupMode(m.id as any);
                  processDuplicates(dupInput, m.id as any, caseSensitive);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  dupMode === m.id
                    ? 'bg-theme-accent text-white shadow-md shadow-theme-accent/25'
                    : 'bg-theme-bg border border-theme-border text-theme-text hover:bg-theme-surface-hover'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="space-y-2">
            <textarea
              value={dupInput}
              onChange={e => {
                setDupInput(e.target.value);
                processDuplicates(e.target.value, dupMode, caseSensitive);
              }}
              placeholder="Paste or type text here (e.g. 'this is this is a test test')..."
              className="w-full h-36 p-4 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent resize-none leading-relaxed"
            />
          </div>

          {/* Clean Output & Statistics Bar */}
          {dupInput && (
            <div className="space-y-4 animate-fade-in">
              {/* Statistics Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border text-center">
                  <div className="text-[10px] text-theme-text-muted uppercase font-bold">Duplicates Removed</div>
                  <div className="text-lg font-black text-rose-400">{removedCount}</div>
                </div>
                <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border text-center">
                  <div className="text-[10px] text-theme-text-muted uppercase font-bold">Original Words</div>
                  <div className="text-lg font-black text-theme-text">{origWords}</div>
                </div>
                <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border text-center">
                  <div className="text-[10px] text-theme-text-muted uppercase font-bold">Cleaned Words</div>
                  <div className="text-lg font-black text-emerald-400">{cleanWords}</div>
                </div>
                <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border text-center">
                  <div className="text-[10px] text-theme-text-muted uppercase font-bold">Characters Saved</div>
                  <div className="text-lg font-black text-cyan-400">{Math.max(0, origChars - cleanChars)}</div>
                </div>
              </div>

              {/* Clean Result Container */}
              <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-theme-accent">Cleaned Document Output</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(dupOutput)}
                      className="px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1.5 active:scale-95"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadTxt(dupOutput, `STUDKIT_Cleaned_Text_${Date.now()}.txt`)}
                      className="px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-1.5 active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .TXT</span>
                    </button>
                  </div>
                </div>

                <pre className="text-xs text-theme-text font-mono whitespace-pre-wrap select-text max-h-48 overflow-y-auto leading-relaxed">
                  {dupOutput}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Text Case Converter */}
      {activeTab === 'text' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Type or paste text to convert cases..."
            className="w-full h-32 p-4 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent resize-none leading-relaxed"
          />

          <div className="flex flex-wrap items-center gap-2">
            {(['upper', 'lower', 'title', 'camel', 'snake', 'kebab'] as const).map(m => (
              <button
                key={m}
                onClick={() => handleCaseChange(m)}
                className="px-3.5 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-bold text-theme-text capitalize transition-all"
              >
                {m}
              </button>
            ))}
          </div>

          {textOutput && (
            <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-2 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-theme-accent">Converted Output</span>
                <button
                  onClick={() => handleCopy(textOutput)}
                  className="px-3 py-1 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-xs text-theme-text font-mono whitespace-pre-wrap select-text">{textOutput}</pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Days Between Dates */}
      {activeTab === 'dates' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5 animate-fade-in">
          <h3 className="text-base font-bold text-theme-text">Academic Date & Duration Calculator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-theme-text block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-theme-text block">Target / Exam Deadline Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border text-center space-y-1">
            <div className="text-xs text-theme-text-muted font-bold uppercase">Time Remaining</div>
            <div className="text-3xl sm:text-4xl font-black text-cyan-400">{calcDaysBetween()} Days</div>
            <div className="text-xs text-theme-text-muted">
              ({(calcDaysBetween() / 7).toFixed(1)} Weeks | {(calcDaysBetween() / 30.4).toFixed(1)} Months)
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Password Generator */}
      {activeTab === 'password' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5 animate-fade-in">
          <h3 className="text-base font-bold text-theme-text">Cryptographic High-Entropy Key Generator</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-theme-text">
              <span>Password Length: <strong>{pwdLength} characters</strong></span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={pwdLength}
              onChange={e => setPwdLength(Number(e.target.value))}
              className="w-full accent-theme-accent cursor-pointer"
            />
            <div className="flex gap-4 text-xs text-theme-text">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={e => setIncludeNumbers(e.target.checked)}
                  className="rounded accent-theme-accent"
                />
                <span>Include Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={e => setIncludeSymbols(e.target.checked)}
                  className="rounded accent-theme-accent"
                />
                <span>Include Symbols (!@#$%)</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleGeneratePassword}
            className="w-full py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 active:scale-95 transition-all"
          >
            Generate Secure Password
          </button>

          {generatedPwd && (
            <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border flex items-center justify-between gap-3 animate-fade-in">
              <span className="font-mono text-sm font-bold text-cyan-400 break-all select-all">{generatedPwd}</span>
              <button
                onClick={() => handleCopy(generatedPwd)}
                className="px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1 flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Tip & Bill Splitter */}
      {activeTab === 'splitter' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5 animate-fade-in">
          <h3 className="text-base font-bold text-theme-text">Shared Meal & Student Project Cost Splitter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-theme-text block">Total Bill Amount ($)</label>
              <input
                type="number"
                value={billAmount}
                onChange={e => setBillAmount(Math.max(0, Number(e.target.value)))}
                className="w-full p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-theme-text block">Tip Percentage (%)</label>
              <input
                type="number"
                value={tipPercent}
                onChange={e => setTipPercent(Math.max(0, Number(e.target.value)))}
                className="w-full p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-theme-text block">Number of Students</label>
              <input
                type="number"
                min="1"
                value={splitCount}
                onChange={e => setSplitCount(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-[10px] text-theme-text-muted uppercase font-bold">Total with Tip</div>
              <div className="text-xl font-black text-theme-text">${(billAmount * (1 + tipPercent / 100)).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] text-theme-text-muted uppercase font-bold">Per Student Share</div>
              <div className="text-2xl font-black text-emerald-400">
                ${((billAmount * (1 + tipPercent / 100)) / splitCount).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
