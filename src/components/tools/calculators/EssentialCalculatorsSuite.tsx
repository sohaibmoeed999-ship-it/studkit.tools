import React, { useState } from 'react';
import { Activity, AlertTriangle, ArrowLeftRight, ArrowRight, Calculator, Calendar, CheckCircle2, Clock, Grid, Info, Percent, RotateCcw, Scale, ShieldCheck, Sparkles, Target, TrendingUp, UserCheck2 } from 'lucide-react';
import { ResultCard } from '../../common/ResultCard';

export const AgeDateDifferenceCalculator: React.FC = () => {
  const [tab, setTab] = useState<'age' | 'diff'>('age');
  const [birthDate, setBirthDate] = useState('2004-05-15');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const b = new Date(birthDate);
  const t = new Date(targetDate);
  let years = t.getFullYear() - b.getFullYear();
  let months = t.getMonth() - b.getMonth();
  let days = t.getDate() - b.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((t.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * 24;

  const s = new Date(startDate);
  const e = new Date(endDate);
  const diffTime = Math.abs(e.getTime() - s.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);
  const diffMonths = (diffDays / 30.4375).toFixed(1);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex rounded-2xl bg-theme-surface p-1 border border-theme-border shadow-sm">
        <button
          onClick={() => setTab('age')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${tab === 'age' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-muted hover:text-theme-text'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Chronological Age Calculator</span>
        </button>
        <button
          onClick={() => setTab('diff')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${tab === 'diff' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-muted hover:text-theme-text'}`}
        >
          <Clock className="w-4 h-4" />
          <span>Date Duration & Interval</span>
        </button>
      </div>
      {tab === 'age' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 space-y-4 bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text">Enter Dates</h3>
            <div>
              <label className="block text-xs font-semibold text-theme-text-muted mb-1">Date of Birth</label>
              <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-sm text-theme-text font-semibold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-theme-text-muted mb-1">Age as of Date</label>
              <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-sm text-theme-text font-semibold outline-none" />
            </div>
          </div>
          <div className="md:col-span-6 space-y-3">
            <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-text-muted">Calculated Age</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono mt-2">
                {years} <span className="text-sm font-sans text-theme-text">Years</span> {months} <span className="text-sm font-sans text-theme-text">Months</span> {days} <span className="text-sm font-sans text-theme-text">Days</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border text-center">
                <span className="text-[10px] uppercase font-bold text-theme-text-muted">Total Days Lived</span>
                <p className="text-xl font-bold font-mono text-theme-text mt-1">{totalDays.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border text-center">
                <span className="text-[10px] uppercase font-bold text-theme-text-muted">Total Hours</span>
                <p className="text-xl font-bold font-mono text-theme-text mt-1">{totalHours.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 space-y-4 bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text">Duration Interval</h3>
            <div>
              <label className="block text-xs font-semibold text-theme-text-muted mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-sm text-theme-text font-semibold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-theme-text-muted mb-1">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-sm text-theme-text font-semibold outline-none" />
            </div>
          </div>
          <div className="md:col-span-6 space-y-3">
            <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-text-muted">Total Duration</span>
              <div className="text-4xl font-extrabold text-cyan-400 font-mono mt-2">
                {diffDays} <span className="text-base font-sans text-theme-text">Days</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border text-center">
                <span className="text-[10px] uppercase font-bold text-theme-text-muted">Weeks</span>
                <p className="text-xl font-bold font-mono text-theme-text mt-1">{diffWeeks}</p>
              </div>
              <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border text-center">
                <span className="text-[10px] uppercase font-bold text-theme-text-muted">Approx Months</span>
                <p className="text-xl font-bold font-mono text-theme-text mt-1">{diffMonths}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. Attendance Calculator
// ==========================================
export const AttendanceCalculator: React.FC = () => {
  const [attended, setAttended] = useState<number>(38);
  const [total, setTotal] = useState<number>(50);
  const [requiredPercent, setRequiredPercent] = useState<number>(75);

  const currentPercent = total > 0 ? (attended / total) * 100 : 0;
  const isSafe = currentPercent >= requiredPercent;
  let neededClasses = 0;
  let canBunk = 0;

  if (currentPercent < requiredPercent) {
    neededClasses = Math.ceil((requiredPercent * total - 100 * attended) / (100 - requiredPercent));
  } else {
    canBunk = Math.floor((100 * attended - requiredPercent * total) / requiredPercent);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <UserCheck2 className="w-4 h-4 text-cyan-400" />
            <span>Attendance Details</span>
          </h3>
          <div>
            <label className="block text-xs font-semibold text-theme-text-muted mb-1">Classes Attended</label>
            <input type="number" min="0" value={attended} onChange={e => setAttended(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-theme-text-muted mb-1">Total Classes Conducted</label>
            <input type="number" min="1" value={total} onChange={e => setTotal(Math.max(1, parseInt(e.target.value) || 1))} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-theme-text-muted mb-1">Target Minimum % ({requiredPercent}%)</label>
            <input type="range" min="50" max="90" value={requiredPercent} onChange={e => setRequiredPercent(parseInt(e.target.value))} className="w-full accent-cyan-400" />
          </div>
        </div>
        <div className="md:col-span-7 space-y-4">
          <div className={`p-6 rounded-3xl border shadow-xl ${isSafe ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">Current Attendance Rate</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-4xl sm:text-5xl font-extrabold font-mono ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>{currentPercent.toFixed(1)}%</span>
              <span className="text-xs text-theme-text-muted">Target: {requiredPercent}%</span>
            </div>
            <p className="text-xs text-theme-text mt-3 font-semibold">
              {isSafe ? (
                <span className="text-emerald-400">🎉 You are in the safe zone! You can afford to miss up to <strong>{canBunk}</strong> upcoming classes.</span>
              ) : (
                <span className="text-rose-400">⚠️ You are currently in shortage. You must attend the next <strong>{neededClasses}</strong> consecutive classes without missing.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 3. BMI Calculator
// ==========================================
export const BmiCalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<string>('175');
  const [weightKg, setWeightKg] = useState<string>('68');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('9');
  const [weightLbs, setWeightLbs] = useState<string>('150');

  let heightM = 0;
  let weightNum = 0;
  if (unitSystem === 'metric') {
    heightM = (parseFloat(heightCm) || 0) / 100;
    weightNum = parseFloat(weightKg) || 0;
  } else {
    const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    heightM = totalInches * 0.0254;
    weightNum = (parseFloat(weightLbs) || 0) * 0.453592;
  }

  const bmi = heightM > 0 ? weightNum / (heightM * heightM) : 0;
  let category = 'Normal weight';
  let color = 'text-emerald-400';
  if (bmi < 18.5) { category = 'Underweight'; color = 'text-amber-400'; }
  else if (bmi >= 25 && bmi < 30) { category = 'Overweight'; color = 'text-amber-400'; }
  else if (bmi >= 30) { category = 'Obesity Range'; color = 'text-rose-400'; }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6 bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text">Physical Parameters</h3>
            <div className="flex rounded-xl bg-theme-bg p-1 border border-theme-border text-xs">
              <button onClick={() => setUnitSystem('metric')} className={`px-3 py-1 rounded-lg font-bold ${unitSystem === 'metric' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'}`}>Metric</button>
              <button onClick={() => setUnitSystem('imperial')} className={`px-3 py-1 rounded-lg font-bold ${unitSystem === 'imperial' ? 'bg-theme-accent text-white' : 'text-theme-text-muted'}`}>Imperial</button>
            </div>
          </div>
          {unitSystem === 'metric' ? (
            <>
              <div><label className="block text-xs font-semibold text-theme-text-muted mb-1">Height (cm)</label><input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" /></div>
              <div><label className="block text-xs font-semibold text-theme-text-muted mb-1">Weight (kg)</label><input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" /></div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs font-semibold text-theme-text-muted mb-1">Height (ft)</label><input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" /></div>
                <div><label className="block text-xs font-semibold text-theme-text-muted mb-1">Height (in)</label><input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-theme-text-muted mb-1">Weight (lbs)</label><input type="number" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" /></div>
            </>
          )}
        </div>
        <div className="md:col-span-6 space-y-3">
          <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">Calculated BMI</span>
            <div className={`text-4xl sm:text-5xl font-extrabold font-mono mt-2 ${color}`}>{bmi > 0 ? bmi.toFixed(1) : '0.0'}</div>
            <div className={`text-sm font-bold mt-1 ${color}`}>{category}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. Math Arithmetic Suite
// ==========================================
export const MathArithmeticSuite: React.FC = () => {
  const [numA, setNumA] = useState<number>(24);
  const [numB, setNumB] = useState<number>(36);
  const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
  const lcm = (a: number, b: number): number => (a && b ? (a * b) / gcd(a, b) : 0);
  const calcGcd = gcd(numA, numB);
  const calcLcm = lcm(numA, numB);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6 bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Integer Inputs</span>
          </h3>
          <div><label className="block text-xs font-semibold text-theme-text-muted mb-1">Number A</label><input type="number" value={numA} onChange={e => setNumA(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" /></div>
          <div><label className="block text-xs font-semibold text-theme-text-muted mb-1">Number B</label><input type="number" value={numB} onChange={e => setNumB(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" /></div>
        </div>
        <div className="md:col-span-6 space-y-3">
          <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">Greatest Common Divisor (GCD / HCF)</span>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-1">{calcGcd}</div>
          </div>
          <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">Least Common Multiple (LCM)</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">{calcLcm}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. Unit Converter
// ==========================================
export const UnitConverter: React.FC = () => {
  const [val, setVal] = useState<number>(10);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  const inMeters: Record<string, number> = { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, mi: 1609.34 };
  const meters = val * (inMeters[fromUnit] || 1);
  const result = meters / (inMeters[toUnit] || 1);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>Universal Unit Conversion</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div><label className="block text-xs font-semibold text-theme-text-muted mb-1">Value</label><input type="number" value={val} onChange={e => setVal(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold outline-none" /></div>
          <div>
            <label className="block text-xs font-semibold text-theme-text-muted mb-1">From Unit</label>
            <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-semibold outline-none">
              <option value="m">Meters (m)</option><option value="km">Kilometers (km)</option><option value="cm">Centimeters (cm)</option><option value="ft">Feet (ft)</option><option value="in">Inches (in)</option><option value="mi">Miles (mi)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-theme-text-muted mb-1">To Unit</label>
            <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-semibold outline-none">
              <option value="m">Meters (m)</option><option value="km">Kilometers (km)</option><option value="cm">Centimeters (cm)</option><option value="ft">Feet (ft)</option><option value="in">Inches (in)</option><option value="mi">Miles (mi)</option>
            </select>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border text-center mt-4">
          <span className="text-xs text-theme-text-muted uppercase font-bold">Conversion Result</span>
          <p className="text-2xl font-bold font-mono text-cyan-400 mt-1">{val} {fromUnit} = {result.toFixed(4)} {toUnit}</p>
        </div>
      </div>
    </div>
  );
};