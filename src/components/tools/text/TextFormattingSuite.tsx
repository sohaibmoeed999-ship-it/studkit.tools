import React, { useState, useMemo } from 'react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Award, Binary, Check, CheckCircle2, Copy, Download, FileText, Hash, HelpCircle, Key, Lock, RefreshCw, RotateCcw, Search, Shield, ShieldCheck, Shuffle, Sparkles, Trash2, Type, Unlock, Wand2, Zap } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { ResultCard } from '../../common/ResultCard';

export const TextUtilitiesSuite: React.FC = () => {
  const [text, setText] = useState(
    'Artificial Intelligence\nMachine Learning\nDeep Learning\nData Science\nArtificial Intelligence\nComputer Vision'
  );
  const [activeUtil, setActiveUtil] = useState<
    'frequency' | 'duplicates' | 'sort' | 'numbered' | 'slug' | 'reverse'
  >('frequency');
  const [output, setOutput] = useState('');

  const runUtility = () => {
    if (activeUtil === 'frequency') {
      const words = text.toLowerCase().match(/\b[a-z0-9_-]+\b/g) || [];
      const freqMap: Record<string, number> = {};
      words.forEach(w => (freqMap[w] = (freqMap[w] || 0) + 1));
      const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
      setOutput(
        '# Word Frequency Counter\n\n' +
          sorted.map(([w, c]) => `• ${w}: ${c} occurrences`).join('\n')
      );
    } else if (activeUtil === 'duplicates') {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const seen = new Set<string>();
      const dupes = new Set<string>();
      lines.forEach(l => {
        if (seen.has(l)) dupes.add(l);
        else seen.add(l);
      });
      setOutput(
        `# Duplicate Lines Found (${dupes.size})\n\n` +
          (Array.from(dupes).map(d => `• ${d}`).join('\n') || 'No duplicate lines detected.')
      );
    } else if (activeUtil === 'sort') {
      const lines = text.split('\n').filter(Boolean).sort((a, b) => a.localeCompare(b));
      setOutput(lines.join('\n'));
    } else if (activeUtil === 'numbered') {
      const lines = text.split('\n').filter(Boolean);
      setOutput(lines.map((l, idx) => `${idx + 1}. ${l}`).join('\n'));
    } else if (activeUtil === 'slug') {
      const slug = text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
      setOutput(slug);
    } else if (activeUtil === 'reverse') {
      setOutput(text.split('').reverse().join(''));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-theme-border">
            <div className="flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-theme-accent" />
              <h3 className="text-sm sm:text-base font-bold text-theme-text">Text Processing Utilities</h3>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-theme-text-muted">Input Content</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full h-44 p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text resize-none outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
            {[
              { id: 'frequency', label: 'Word Frequency' },
              { id: 'duplicates', label: 'Find Duplicates' },
              { id: 'sort', label: 'A-Z Alphabetical' },
              { id: 'numbered', label: 'Numbered List' },
              { id: 'slug', label: 'URL Slug' },
              { id: 'reverse', label: 'Reverse Text' },
            ].map(u => (
              <button
                key={u.id}
                onClick={() => setActiveUtil(u.id as any)}
                className={`py-2 px-1 rounded-xl border transition-all truncate text-center ${
                  activeUtil === u.id
                    ? 'bg-theme-accent text-white border-theme-accent shadow-sm'
                    : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>

          <button
            onClick={runUtility}
            className="w-full py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Execute Utility</span>
          </button>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <ResultCard
            title="Clean Processed Result"
            description="Extracted and formatted text output"
            onCopy={() => navigator.clipboard.writeText(output)}
          >
            <textarea
              readOnly
              value={output || 'Click "Execute Utility" to process text above.'}
              className="w-full h-72 p-4 rounded-2xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text resize-none outline-none"
            />
          </ResultCard>
        </div>
      </div>
    </div>
  );
};



export const UsernamePasswordSuite: React.FC = () => {
  const [tab, setTab] = useState<'password' | 'username'>('password');

  // Password Generator
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('k9#XmP!8vL2$wQ5@');

  // Username Generator
  const [usernameType, setUsernameType] = useState<'student' | 'tech' | 'creative'>('student');
  const [usernames, setUsernames] = useState<string[]>([
    'quantum_scholar_42',
    'alex_cyber_mind',
    'matrix_coder_99',
    'orbit_student_dev',
  ]);

  const generatePassword = () => {
    sounds.playPop();
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let res = '';
    for (let i = 0; i < length; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(res);
  };

  const generateUsernames = () => {
    sounds.playPop();
    const prefixes =
      usernameType === 'student'
        ? ['scholar', 'student', 'academic', 'mind', 'focus', 'logic']
        : usernameType === 'tech'
        ? ['byte', 'cipher', 'matrix', 'algo', 'stack', 'kernel']
        : ['nova', 'vivid', 'cosmic', 'zenith', 'stellar', 'echo'];

    const suffixes = ['dev', 'lab', 'hub', 'core', 'code', '42', '99', 'pro', 'x'];

    const list = Array(4)
      .fill(0)
      .map(() => {
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const s = suffixes[Math.floor(Math.random() * suffixes.length)];
        const num = Math.floor(Math.random() * 900) + 100;
        return `${p}_${s}_${num}`;
      });

    setUsernames(list);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex rounded-2xl bg-theme-bg p-1 border border-theme-border">
          <button
            onClick={() => setTab('password')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              tab === 'password' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'
            }`}
          >
            Password Studio & Strength
          </button>
          <button
            onClick={() => setTab('username')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              tab === 'username' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'
            }`}
          >
            Student Username Generator
          </button>
        </div>

        {tab === 'password' ? (
          <div className="space-y-6">
            {/* Generated Output Display */}
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between gap-3">
              <span className="font-mono text-base sm:text-lg font-bold text-theme-accent truncate">
                {generatedPassword}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(generatedPassword)}
                  className="p-2 rounded-lg bg-theme-surface border border-theme-border text-theme-text hover:text-theme-accent"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={generatePassword}
                  className="p-2 rounded-lg bg-theme-surface border border-theme-border text-theme-text hover:text-theme-accent"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Length slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-theme-text-muted font-semibold">Length</span>
                <span className="font-mono text-theme-text font-bold">{length} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={e => setLength(parseInt(e.target.value))}
                className="w-full accent-theme-accent"
              />
            </div>

            {/* Checkbox Options */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={e => setIncludeUpper(e.target.checked)}
                  className="rounded accent-theme-accent"
                />
                <span className="text-theme-text">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={e => setIncludeLower(e.target.checked)}
                  className="rounded accent-theme-accent"
                />
                <span className="text-theme-text">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={e => setIncludeNumbers(e.target.checked)}
                  className="rounded accent-theme-accent"
                />
                <span className="text-theme-text">Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={e => setIncludeSymbols(e.target.checked)}
                  className="rounded accent-theme-accent"
                />
                <span className="text-theme-text">Special Symbols (!@#$)</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'tech', 'creative'] as const).map(u => (
                <button
                  key={u}
                  onClick={() => setUsernameType(u)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    usernameType === u
                      ? 'bg-theme-accent text-white border-theme-accent'
                      : 'bg-theme-bg border-theme-border text-theme-text'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            <button
              onClick={generateUsernames}
              className="w-full py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20"
            >
              Generate Usernames
            </button>

            <div className="space-y-2">
              {usernames.map((name, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between font-mono text-xs text-theme-text"
                >
                  <span className="text-theme-accent font-bold">@{name}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(name)}
                    className="p-1 text-theme-text-muted hover:text-theme-text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export const WordCounterSuite: React.FC = () => {
  const [text, setText] = useState(
    'STUDKIT empowers students worldwide with digital tools for studying, documents, calculators, AI revision, and cognitive focus. Everything students need in one unified toolkit.'
  );

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = text.split(/\n+/).filter(Boolean).length;
  const readingTimeMinutes = Math.ceil(words / 200);

  const convertCase = (type: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab') => {
    let res = text;
    if (type === 'upper') res = text.toUpperCase();
    if (type === 'lower') res = text.toLowerCase();
    if (type === 'title') {
      res = text
        .toLowerCase()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    if (type === 'camel') {
      res = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }
    if (type === 'snake') {
      res = text
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');
    }
    if (type === 'kebab') {
      res = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '');
    }
    setText(res);
  };

  const removeExtraSpaces = () => {
    setText(text.replace(/\s+/g, ' ').trim());
  };

  const removeDuplicateLines = () => {
    const lines = text.split('\n');
    const unique = Array.from(new Set(lines));
    setText(unique.join('\n'));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base sm:text-lg font-bold text-theme-text">Word Counter & Text Formatter</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(text)}
              className="p-2 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setText('')}
              className="p-2 rounded-xl bg-theme-bg hover:bg-rose-500/15 border border-theme-border text-xs text-rose-400"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
          <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
            <span className="text-[10px] uppercase text-theme-text-muted block">Words</span>
            <span className="text-xl font-bold text-theme-accent block mt-0.5">{words}</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
            <span className="text-[10px] uppercase text-theme-text-muted block">Characters</span>
            <span className="text-xl font-bold text-emerald-400 block mt-0.5">{characters}</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
            <span className="text-[10px] uppercase text-theme-text-muted block">Sentences</span>
            <span className="text-xl font-bold text-amber-400 block mt-0.5">{sentences}</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
            <span className="text-[10px] uppercase text-theme-text-muted block">Reading Time</span>
            <span className="text-xl font-bold text-theme-text block mt-0.5">~{readingTimeMinutes} min</span>
          </div>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type text here..."
          className="w-full h-48 p-4 rounded-xl bg-theme-bg border border-theme-border font-sans text-xs text-theme-text resize-none focus:border-theme-accent outline-none leading-relaxed"
        />

        {/* Case Converters & Text Cleaner Utilities */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button onClick={() => convertCase('upper')} className="px-2.5 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text hover:bg-theme-surface-hover">UPPERCASE</button>
          <button onClick={() => convertCase('lower')} className="px-2.5 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text hover:bg-theme-surface-hover">lowercase</button>
          <button onClick={() => convertCase('title')} className="px-2.5 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text hover:bg-theme-surface-hover">Title Case</button>
          <button onClick={() => convertCase('camel')} className="px-2.5 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text hover:bg-theme-surface-hover">camelCase</button>
          <button onClick={() => convertCase('snake')} className="px-2.5 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text hover:bg-theme-surface-hover">snake_case</button>
          <button onClick={() => convertCase('kebab')} className="px-2.5 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text hover:bg-theme-surface-hover">kebab-case</button>
          <button onClick={removeExtraSpaces} className="px-2.5 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-cyan-400 hover:bg-cyan-500/10">Clean Spaces</button>
          <button onClick={removeDuplicateLines} className="px-2.5 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-cyan-400 hover:bg-cyan-500/10">Remove Duplicate Lines</button>
        </div>
      </div>
    </div>
  );
};
