import React, { useState } from 'react';
import { Binary, Delete, RotateCcw } from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [isRad, setIsRad] = useState(true);

  const handleNum = (num: string) => {
    sounds.playPop();
    setDisplay(prev => (prev === '0' || prev === 'Error' ? num : prev + num));
  };

  const handleOp = (op: string) => {
    sounds.playPop();
    setDisplay(prev => prev + ' ' + op + ' ');
  };

  const handleClear = () => {
    sounds.playPop();
    setDisplay('0');
  };

  const handleBackspace = () => {
    sounds.playPop();
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1).trimEnd() : '0'));
  };

  const handleFunc = (funcName: string) => {
    sounds.playPop();
    try {
      const val = parseFloat(display);
      let result = 0;
      switch (funcName) {
        case 'sin':
          result = Math.sin(isRad ? val : (val * Math.PI) / 180);
          break;
        case 'cos':
          result = Math.cos(isRad ? val : (val * Math.PI) / 180);
          break;
        case 'tan':
          result = Math.tan(isRad ? val : (val * Math.PI) / 180);
          break;
        case 'sqrt':
          result = Math.sqrt(val);
          break;
        case 'sq':
          result = Math.pow(val, 2);
          break;
        case 'log':
          result = Math.log10(val);
          break;
        case 'ln':
          result = Math.log(val);
          break;
        case '1/x':
          result = 1 / val;
          break;
      }
      const formatted = Number(result.toFixed(8)).toString();
      setHistory(prev => [`${funcName}(${display}) = ${formatted}`, ...prev.slice(0, 5)]);
      setDisplay(formatted);
    } catch {
      setDisplay('Error');
    }
  };

  const handleCalculate = () => {
    sounds.playSuccess();
    try {
      // Safe sanitized arithmetic evaluation
      const sanitized = display.replace(/×/g, '*').replace(/÷/g, '/');
      const res = Function(`'use strict'; return (${sanitized})`)();
      const formatted = Number(res.toFixed(8)).toString();
      setHistory(prev => [`${display} = ${formatted}`, ...prev.slice(0, 5)]);
      setDisplay(formatted);
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Display Screen */}
        <div className="bg-theme-bg p-4 rounded-2xl border border-theme-border text-right space-y-1">
          <div className="text-[11px] font-mono text-theme-text-muted h-4 overflow-hidden">
            {history[0] || ''}
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-theme-text overflow-x-auto scrollbar-none">
            {display}
          </div>
        </div>

        {/* Radians / Deg Toggle */}
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setIsRad(!isRad)}
            className="px-2.5 py-1 rounded-lg bg-theme-bg border border-theme-border font-mono text-[11px] text-theme-accent font-bold"
          >
            {isRad ? 'RAD' : 'DEG'}
          </button>
          <span className="text-[10px] text-theme-text-muted font-mono">STUDKIT Precision Core</span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-5 gap-2 font-mono text-xs">
          {/* Row 1 Scientific Functions */}
          <button onClick={() => handleFunc('sin')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">sin</button>
          <button onClick={() => handleFunc('cos')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">cos</button>
          <button onClick={() => handleFunc('tan')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">tan</button>
          <button onClick={handleClear} className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold">AC</button>
          <button onClick={handleBackspace} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text flex items-center justify-center"><Delete className="w-4 h-4" /></button>

          {/* Row 2 */}
          <button onClick={() => handleFunc('sqrt')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">√x</button>
          <button onClick={() => handleFunc('sq')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">x²</button>
          <button onClick={() => handleFunc('log')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">log</button>
          <button onClick={() => handleOp('(')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">(</button>
          <button onClick={() => handleOp(')')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">)</button>

          {/* Row 3 Numbers */}
          <button onClick={() => handleNum('7')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">7</button>
          <button onClick={() => handleNum('8')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">8</button>
          <button onClick={() => handleNum('9')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">9</button>
          <button onClick={() => handleOp('÷')} className="p-3.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-accent font-bold">÷</button>
          <button onClick={() => handleFunc('1/x')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">1/x</button>

          {/* Row 4 */}
          <button onClick={() => handleNum('4')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">4</button>
          <button onClick={() => handleNum('5')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">5</button>
          <button onClick={() => handleNum('6')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">6</button>
          <button onClick={() => handleOp('×')} className="p-3.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-accent font-bold">×</button>
          <button onClick={() => handleNum(Math.PI.toFixed(6))} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">π</button>

          {/* Row 5 */}
          <button onClick={() => handleNum('1')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">1</button>
          <button onClick={() => handleNum('2')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">2</button>
          <button onClick={() => handleNum('3')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">3</button>
          <button onClick={() => handleOp('-')} className="p-3.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-accent font-bold">-</button>
          <button onClick={() => handleFunc('ln')} className="p-3 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text">ln</button>

          {/* Row 6 */}
          <button onClick={() => handleNum('0')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">0</button>
          <button onClick={() => handleNum('.')} className="p-3.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-sm font-bold text-theme-text">.</button>
          <button onClick={handleCalculate} className="col-span-2 p-3.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-sm font-bold shadow-lg shadow-theme-accent/25">=</button>
          <button onClick={() => handleOp('+')} className="p-3.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-accent font-bold">+</button>
        </div>
      </div>
    </div>
  );
};
