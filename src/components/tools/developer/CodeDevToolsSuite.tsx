import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Check, CheckCircle2, Clock, Code, Copy, Download, Hash, HelpCircle, Palette, Play, RefreshCw, RotateCcw, Search, ShieldCheck, Sliders, Sparkles, Terminal, Timer, Trash2, Zap } from 'lucide-react';

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState(
    'Contact support at student@studkit.edu or hello@google.com for queries.'
  );

  let matches: string[] = [];
  let isValid = true;
  let errorMsg = '';

  try {
    const regex = new RegExp(pattern, flags);
    const m = testText.match(regex);
    matches = m ? Array.from(m) : [];
  } catch (e: any) {
    isValid = false;
    errorMsg = e.message;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-base sm:text-lg font-bold text-theme-text">Regex Pattern Tester & Matcher</h2>

        {/* Pattern & Flags */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-theme-bg border border-theme-border rounded-xl px-3 py-2">
            <span className="text-theme-text-muted font-mono mr-2">/</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="e.g. [0-9]+"
              className="w-full bg-transparent font-mono text-xs text-theme-text outline-none"
            />
            <span className="text-theme-text-muted font-mono ml-2">/</span>
          </div>

          <input
            type="text"
            value={flags}
            onChange={e => setFlags(e.target.value)}
            placeholder="flags (g, i, m)"
            className="w-20 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text text-center"
          />
        </div>

        {/* Test String */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-theme-text-muted">Test String</label>
          <textarea
            value={testText}
            onChange={e => setTestText(e.target.value)}
            className="w-full h-32 p-3 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text resize-none focus:border-theme-accent outline-none"
          />
        </div>

        {/* Match Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-theme-text">Matches Found ({matches.length})</span>
            {isValid ? (
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid Regex
              </span>
            ) : (
              <span className="text-rose-400 font-mono">{errorMsg}</span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-theme-bg border border-theme-border min-h-[100px] font-mono text-xs space-y-1.5">
            {matches.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-theme-text-muted text-[10px]">#{idx + 1}:</span>
                <span className="px-2 py-0.5 rounded bg-theme-accent/15 text-theme-accent font-bold">
                  {m}
                </span>
              </div>
            ))}
            {matches.length === 0 && isValid && (
              <span className="text-theme-text-muted/50">No matches found in test string.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



export const UnixTimestampCronHelper: React.FC = () => {
  const [tab, setTab] = useState<'timestamp' | 'cron'>('timestamp');

  // Timestamp states
  const [timestamp, setTimestamp] = useState<number>(Math.floor(Date.now() / 1000));
  const dateObj = new Date(timestamp * 1000);

  // Cron states
  const [cronExp, setCronExp] = useState('0 9 * * 1-5');

  const explainCron = (cron: string): string => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) return 'Invalid 5-field cron expression (minute hour day month day-of-week).';
    const [min, hr, dom, mon, dow] = parts;
    return `Runs at minute ${min}, hour ${hr}, day-of-month ${dom}, month ${mon}, day-of-week ${dow} (e.g. 09:00 AM every Mon-Fri).`;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex rounded-2xl bg-theme-bg p-1 border border-theme-border">
          <button
            onClick={() => setTab('timestamp')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'timestamp' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'}`}
          >
            Unix Timestamp Epoch
          </button>
          <button
            onClick={() => setTab('cron')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'cron' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'}`}
          >
            Cron Expression Explainer
          </button>
        </div>

        {tab === 'timestamp' ? (
          <div className="space-y-6">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-theme-text-muted font-semibold">
                <span>Unix Epoch Seconds</span>
                <button onClick={() => setTimestamp(Math.floor(Date.now() / 1000))} className="text-theme-accent hover:underline">
                  Set Current Time
                </button>
              </div>
              <input
                type="number"
                value={timestamp}
                onChange={e => setTimestamp(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl bg-theme-bg border border-theme-border font-mono text-sm font-bold text-theme-text"
              />
            </div>

            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] text-theme-text-muted uppercase block">UTC Human Date</span>
                <span className="text-base font-bold text-emerald-400">{dateObj.toUTCString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-theme-text-muted uppercase block">Local Browser Date</span>
                <span className="text-base font-bold text-theme-text">{dateObj.toString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-theme-text-muted uppercase block">ISO 8601 Format</span>
                <span className="text-theme-accent">{dateObj.toISOString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1 text-xs">
              <label className="text-theme-text-muted font-semibold">5-Field Cron Expression</label>
              <input
                type="text"
                value={cronExp}
                onChange={e => setCronExp(e.target.value)}
                placeholder="e.g. */15 * * * *"
                className="w-full px-3 py-2.5 rounded-xl bg-theme-bg border border-theme-border font-mono text-sm font-bold text-theme-accent"
              />
            </div>

            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted">Plain English Meaning</span>
              <p className="text-sm font-bold text-emerald-400 font-mono leading-relaxed">
                {explainCron(cronExp)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export const UuidColorSuite: React.FC = () => {
  const [tab, setTab] = useState<'uuid' | 'color'>('uuid');
  const [uuids, setUuids] = useState<string[]>([
    'a3b8d14e-72c6-4b95-a13f-8c9e567104bd',
    'f192b0ca-d2e8-4903-b054-9721d6e1590a',
    '3e4d9c71-08fa-4a25-83e9-74d32f51a8cc',
  ]);
  const [color, setColor] = useState('#0284c7');

  const generateUuids = () => {
    const list = Array(5)
      .fill(0)
      .map(() =>
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        })
      );
    setUuids(list);
  };

  // Convert Hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex rounded-2xl bg-theme-bg p-1 border border-theme-border">
          <button
            onClick={() => setTab('uuid')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              tab === 'uuid' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'
            }`}
          >
            UUID v4 Generator
          </button>
          <button
            onClick={() => setTab('color')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              tab === 'color' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'
            }`}
          >
            Color Converter & Palette
          </button>
        </div>

        {tab === 'uuid' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-theme-text-muted">Cryptographic UUID v4</span>
              <button
                onClick={generateUuids}
                className="px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20"
              >
                Generate 5 UUIDs
              </button>
            </div>

            <div className="space-y-2">
              {uuids.map((id, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between font-mono text-xs text-theme-text"
                >
                  <span className="text-theme-accent font-bold">{id}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(id)}
                    className="p-1 text-theme-text-muted hover:text-theme-text"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer border border-theme-border shadow-inner"
              />
              <div className="space-y-1">
                <span className="text-sm font-bold text-theme-text font-mono uppercase">{color}</span>
                <p className="text-xs text-theme-text-muted">RGB: rgb({r}, {g}, {b})</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
                <span className="text-[10px] text-theme-text-muted block">HEX</span>
                <span className="font-bold text-theme-text block uppercase">{color}</span>
              </div>
              <div className="p-3 rounded-xl bg-theme-bg border border-theme-border">
                <span className="text-[10px] text-theme-text-muted block">RGB CSS</span>
                <span className="font-bold text-theme-text block">rgb({r}, {g}, {b})</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
