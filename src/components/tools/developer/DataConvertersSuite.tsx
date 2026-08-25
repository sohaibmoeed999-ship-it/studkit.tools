import React, { useState, useMemo } from 'react';
import { AlertCircle, AlertTriangle, ArrowLeftRight, ArrowRight, Binary, Braces, Check, CheckCircle2, Clock, Code, Copy, Download, Eye, FileCode, FileJson, FileSpreadsheet, FileText, FileUp, HelpCircle, Key, Lock, RefreshCw, RotateCcw, Search, Shield, ShieldCheck, Sparkles, Terminal, Trash2, Unlock, Upload, Zap } from 'lucide-react';
import { ResultCard } from '../../common/ResultCard';
import { FileUploader } from '../../common/FileUploader';
import { downloadText } from '../../../utils/download';

export const Base64UrlConverter: React.FC = () => {
  const [tab, setTab] = useState<'base64' | 'url'>('base64');
  const [inputVal, setInputVal] = useState('Hello STUDKIT 2026!');
  const [outputVal, setOutputVal] = useState('');

  const encode = () => {
    if (tab === 'base64') {
      try {
        setOutputVal(btoa(inputVal));
      } catch {
        setOutputVal('Encoding Error (Contains non-ASCII characters)');
      }
    } else {
      setOutputVal(encodeURIComponent(inputVal));
    }
  };

  const decode = () => {
    if (tab === 'base64') {
      try {
        setOutputVal(atob(inputVal));
      } catch {
        setOutputVal('Decoding Error (Invalid Base64 string)');
      }
    } else {
      try {
        setOutputVal(decodeURIComponent(inputVal));
      } catch {
        setOutputVal('Decoding Error (Malformed URI)');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex rounded-2xl bg-theme-bg p-1 border border-theme-border">
          <button
            onClick={() => setTab('base64')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              tab === 'base64' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'
            }`}
          >
            Base64 Encoder / Decoder
          </button>
          <button
            onClick={() => setTab('url')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              tab === 'url' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'
            }`}
          >
            URL Encoder / Decoder
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-theme-text-muted">Input Text / Encoded String</label>
          <textarea
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="w-full h-28 p-3 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text resize-none focus:border-theme-accent outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={encode}
            className="flex-1 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20 transition-all"
          >
            Encode
          </button>
          <button
            onClick={decode}
            className="flex-1 py-2.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text text-xs font-bold transition-all"
          >
            Decode
          </button>
        </div>

        {outputVal && (
          <div className="space-y-2 pt-2 border-t border-theme-border">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-theme-text">Output Result</span>
              <button
                onClick={() => navigator.clipboard.writeText(outputVal)}
                className="text-theme-accent hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <textarea
              readOnly
              value={outputVal}
              className="w-full h-28 p-3 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-accent resize-none outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};



export const CsvJsonConverter: React.FC = () => {
  const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json');
  const [inputVal, setInputVal] = useState('id,name,role,gpa\n1,Alex Morgan,Student,3.92\n2,Taylor Swift,Alumni,4.00');
  const [outputVal, setOutputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const convert = () => {
    setErrorMsg(null);
    try {
      if (mode === 'csv2json') {
        const lines = inputVal.trim().split('\n');
        if (lines.length < 2) throw new Error('CSV must have header row and at least 1 data row.');
        const headers = lines[0].split(',').map(h => h.trim());
        const jsonArr = lines.slice(1).map(line => {
          const vals = line.split(',').map(v => v.trim());
          const obj: Record<string, any> = {};
          headers.forEach((h, i) => {
            const val = vals[i] || '';
            obj[h] = isNaN(Number(val)) || val === '' ? val : Number(val);
          });
          return obj;
        });
        setOutputVal(JSON.stringify(jsonArr, null, 2));
      } else {
        const parsed = JSON.parse(inputVal);
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Input must be a JSON array of objects.');
        const headers = Object.keys(parsed[0]);
        const csvRows = [headers.join(',')];
        parsed.forEach(item => {
          const row = headers.map(h => JSON.stringify(item[h] ?? ''));
          csvRows.push(row.join(','));
        });
        setOutputVal(csvRows.join('\n'));
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-theme-accent" />
            <h3 className="text-base sm:text-lg font-bold text-theme-text">CSV ⟷ JSON Data Converter</h3>
          </div>
          <div className="flex rounded-xl bg-theme-bg p-1 border border-theme-border">
            <button
              onClick={() => {
                setMode('csv2json');
                setInputVal('id,name,role,gpa\n1,Alex,Student,3.92');
                setOutputVal('');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${mode === 'csv2json' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'}`}
            >
              CSV → JSON
            </button>
            <button
              onClick={() => {
                setMode('json2csv');
                setInputVal('[\n  { "id": 1, "name": "Alex", "role": "Student", "gpa": 3.92 }\n]');
                setOutputVal('');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${mode === 'json2csv' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'}`}
            >
              JSON → CSV
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-theme-text-muted">
            Input ({mode === 'csv2json' ? 'CSV Format' : 'JSON Array'})
          </label>
          <textarea
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="w-full h-36 p-3 rounded-2xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text resize-none outline-none"
          />
        </div>

        <button
          onClick={convert}
          className="w-full py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all"
        >
          Convert Format
        </button>

        {errorMsg && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">{errorMsg}</div>}

        {outputVal && (
          <div className="space-y-2 pt-2 border-t border-theme-border">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-theme-text font-mono">Converted Output</span>
              <div className="flex items-center gap-2">
                <button onClick={() => navigator.clipboard.writeText(outputVal)} className="text-theme-accent hover:underline flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copy
                </button>
                <button
                  onClick={() => downloadText(outputVal, mode === 'csv2json' ? 'data.json' : 'data.csv')}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={outputVal}
              className="w-full h-40 p-3 rounded-2xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-accent resize-none outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};



export const JsonSuite: React.FC = () => {
  const [inputJson, setInputJson] = useState(
    '{\n  "name": "STUDKIT",\n  "version": 1.0,\n  "features": ["AI Study", "Calculators", "Games"],\n  "active": true\n}'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, 2));
      setErrorMsg(null);
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      setErrorMsg(null);
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(inputJson);
      setErrorMsg(null);
      alert('Valid JSON structure!');
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base sm:text-lg font-bold text-theme-text">JSON Formatter & Validator</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={formatJson}
              className="px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold shadow-md shadow-theme-accent/20"
            >
              Format (Prettify)
            </button>
            <button
              onClick={minifyJson}
              className="px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text"
            >
              Minify
            </button>
            <button
              onClick={validateJson}
              className="px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text"
            >
              Validate
            </button>
          </div>
        </div>

        <textarea
          value={inputJson}
          onChange={e => {
            setInputJson(e.target.value);
            setErrorMsg(null);
          }}
          className="w-full h-80 p-4 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text resize-none focus:border-theme-accent outline-none leading-relaxed"
        />

        {errorMsg ? (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Invalid JSON: {errorMsg}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] font-mono text-theme-text-muted">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
            </span>
            <span>100% Client-Side Evaluation</span>
          </div>
        )}
      </div>
    </div>
  );
};



export const JwtDecoder: React.FC = () => {
  const [token, setToken] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggTW9yZ2FuIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MDgwMDAwMDAsImV4cCI6MTc5MDAwMDAwMH0.signature'
  );

  let headerObj = null;
  let payloadObj = null;
  let errorMsg = null;
  let isExpired = false;
  let expDate = '';

  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      headerObj = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      payloadObj = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      if (payloadObj.exp) {
        const expTime = payloadObj.exp * 1000;
        isExpired = Date.now() > expTime;
        expDate = new Date(expTime).toUTCString();
      }
    } else {
      errorMsg = 'Invalid JWT token structure (must have 3 dot-separated segments)';
    }
  } catch (e: any) {
    errorMsg = 'Malformed Base64 / JSON token payload: ' + e.message;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-theme-accent" />
            <h3 className="text-base sm:text-lg font-bold text-theme-text">JWT Token Decoder & Inspector</h3>
          </div>
          <span className="text-xs font-mono text-theme-text-muted">100% Client-Side Decoded</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-theme-text-muted">Encoded JSON Web Token</label>
          <textarea
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Paste JWT here..."
            className="w-full h-24 p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs font-mono text-theme-accent resize-none focus:border-theme-accent outline-none break-all"
          />
        </div>

        {errorMsg ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Header */}
            <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400 font-mono">HEADER: ALGORITHM & TYPE</span>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(headerObj, null, 2))}
                  className="text-theme-text-muted hover:text-theme-text"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="text-xs font-mono text-theme-text overflow-x-auto p-2 bg-theme-surface rounded-xl border border-theme-border/60">
                {JSON.stringify(headerObj, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400 font-mono">PAYLOAD: CLAIMS & DATA</span>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(payloadObj, null, 2))}
                  className="text-theme-text-muted hover:text-theme-text"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="text-xs font-mono text-theme-text overflow-x-auto p-2 bg-theme-surface rounded-xl border border-theme-border/60">
                {JSON.stringify(payloadObj, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {payloadObj?.exp && (
          <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-theme-accent" />
              <span>Token Expiration: {expDate}</span>
            </div>
            <span className={`font-bold px-2 py-0.5 rounded ${isExpired ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isExpired ? 'EXPIRED' : 'ACTIVE / VALID'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
