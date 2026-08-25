import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Clock,
  Calendar,
  Layers,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  Percent,
} from 'lucide-react';

type Frequency = 'yearly' | 'monthly' | 'weekly';

export const SalaryBreakdownCalculator: React.FC = () => {
  const [currency, setCurrency] = useState<string>('$');
  const [salaryAmount, setSalaryAmount] = useState<number>(65000);
  const [frequency, setFrequency] = useState<Frequency>('yearly');
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<number>(21.67);
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState<number>(8);

  // Deductions
  const [taxDeductionPercent, setTaxDeductionPercent] = useState<number>(18);
  const [otherMonthlyDeductions, setOtherMonthlyDeductions] = useState<number>(150); // e.g. health insurance / retirement

  const handleReset = () => {
    setSalaryAmount(65000);
    setFrequency('yearly');
    setWorkingDaysPerMonth(21.67);
    setWorkingHoursPerDay(8);
    setTaxDeductionPercent(18);
    setOtherMonthlyDeductions(150);
  };

  // Calculations
  const results = useMemo(() => {
    const rawAmount = Math.max(0, salaryAmount);
    const validDays = Math.max(1, workingDaysPerMonth);
    const validHours = Math.max(1, workingHoursPerDay);

    // Normalize to Gross Yearly
    let grossYearly = 0;
    if (frequency === 'yearly') {
      grossYearly = rawAmount;
    } else if (frequency === 'monthly') {
      grossYearly = rawAmount * 12;
    } else {
      grossYearly = rawAmount * 52;
    }

    const grossMonthly = grossYearly / 12;
    const grossWeekly = grossYearly / 52;
    const grossDaily = grossMonthly / validDays;
    const grossHourly = grossDaily / validHours;

    // Deductions calculation per month & year
    const taxMonthly = grossMonthly * (Math.max(0, taxDeductionPercent) / 100);
    const totalDeductionsMonthly = taxMonthly + Math.max(0, otherMonthlyDeductions);
    const totalDeductionsYearly = totalDeductionsMonthly * 12;

    // Net values
    const netMonthly = Math.max(0, grossMonthly - totalDeductionsMonthly);
    const netYearly = netMonthly * 12;
    const netWeekly = netYearly / 52;
    const netDaily = netMonthly / validDays;
    const netHourly = netDaily / validHours;

    const effectiveTaxRate = grossMonthly > 0 ? (totalDeductionsMonthly / grossMonthly) * 100 : 0;

    return {
      grossYearly: Math.round(grossYearly * 100) / 100,
      grossMonthly: Math.round(grossMonthly * 100) / 100,
      grossWeekly: Math.round(grossWeekly * 100) / 100,
      grossDaily: Math.round(grossDaily * 100) / 100,
      grossHourly: Math.round(grossHourly * 100) / 100,
      totalDeductionsMonthly: Math.round(totalDeductionsMonthly * 100) / 100,
      totalDeductionsYearly: Math.round(totalDeductionsYearly * 100) / 100,
      netYearly: Math.round(netYearly * 100) / 100,
      netMonthly: Math.round(netMonthly * 100) / 100,
      netWeekly: Math.round(netWeekly * 100) / 100,
      netDaily: Math.round(netDaily * 100) / 100,
      netHourly: Math.round(netHourly * 100) / 100,
      effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
    };
  }, [salaryAmount, frequency, workingDaysPerMonth, workingHoursPerDay, taxDeductionPercent, otherMonthlyDeductions]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none animate-quick-fade">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Salary Breakdown Calculator</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Gross & Net Converter
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Break down your salary into monthly, weekly, daily, and hourly earnings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-xs font-bold text-theme-text focus:border-theme-accent focus:outline-none"
          >
            <option value="$">USD ($)</option>
            <option value="£">GBP (£)</option>
            <option value="€">EUR (€)</option>
            <option value="₹">INR (₹)</option>
            <option value="Rs ">PKR (Rs)</option>
            <option value="C$">CAD (C$)</option>
            <option value="A$">AUD (A$)</option>
          </select>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface border border-theme-border text-xs font-semibold text-theme-text transition-all cursor-pointer"
            title="Reset All Inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-theme-border shadow-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Estimated Net Monthly Pay */}
          <div className="space-y-1 p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Estimated Net Take-Home (Monthly)</span>
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight animate-result-reveal">
              {currency}{results.netMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-theme-text-muted font-mono">
              ~{currency}{results.netYearly.toLocaleString()} / year after deductions
            </span>
          </div>

          {/* Gross Monthly Pay */}
          <div className="space-y-1 p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 block flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              <span>Gross Base Salary (Monthly)</span>
            </span>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 font-mono tracking-tight animate-result-reveal">
              {currency}{results.grossMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-theme-text-muted font-mono">
              {currency}{results.grossYearly.toLocaleString()} / year base
            </span>
          </div>
        </div>

        {/* Deductions & Retention Bar */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-mono text-white/90">
            <span>Net Take-Home vs Deductions Breakdown</span>
            <span className="text-cyan-300 font-bold">
              {100 - results.effectiveTaxRate}% Net • {results.effectiveTaxRate}% Deductions
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-l-full transition-all duration-300"
              style={{ width: `${Math.max(0, 100 - results.effectiveTaxRate)}%` }}
            />
            <div
              className="h-full bg-rose-500 rounded-r-full transition-all duration-300"
              style={{ width: `${Math.min(100, results.effectiveTaxRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Comparison Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Hourly */}
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hourly Pay</span>
          </span>
          <p className="text-xl font-black text-cyan-400 font-mono mt-1">
            {currency}{results.netHourly.toFixed(2)}/hr
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono block">Gross: {currency}{results.grossHourly.toFixed(2)}</span>
        </div>

        {/* Daily */}
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Daily Rate</span>
          </span>
          <p className="text-xl font-black text-indigo-400 font-mono mt-1">
            {currency}{results.netDaily.toFixed(2)}/day
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono block">Gross: {currency}{results.grossDaily.toFixed(2)}</span>
        </div>

        {/* Weekly */}
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Weekly Pay</span>
          </span>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">
            {currency}{results.netWeekly.toFixed(2)}/wk
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono block">Gross: {currency}{results.grossWeekly.toFixed(2)}</span>
        </div>

        {/* Deductions */}
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            <span>Deductions</span>
          </span>
          <p className="text-xl font-black text-rose-400 font-mono mt-1">
            {currency}{results.totalDeductionsMonthly.toFixed(2)}/mo
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono block">~{currency}{results.totalDeductionsYearly.toLocaleString()}/yr</span>
        </div>
      </div>

      {/* Input Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Base Salary Parameters */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Base Salary & Schedule</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Salary Amount ({currency})</label>
              <input
                type="number"
                min={0}
                value={salaryAmount}
                onChange={e => setSalaryAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none text-base"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Salary Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'yearly', label: 'Yearly' },
                  { id: 'monthly', label: 'Monthly' },
                  { id: 'weekly', label: 'Weekly' },
                ].map(freq => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFrequency(freq.id as Frequency)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      frequency === freq.id
                        ? 'bg-theme-accent text-white border-transparent shadow-md'
                        : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Working Days / Month</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  step={0.5}
                  value={workingDaysPerMonth}
                  onChange={e => setWorkingDaysPerMonth(Math.max(1, parseFloat(e.target.value) || 21.67))}
                  className="w-full px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Hours / Work Day</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  step={0.5}
                  value={workingHoursPerDay}
                  onChange={e => setWorkingHoursPerDay(Math.max(1, parseFloat(e.target.value) || 8))}
                  className="w-full px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Deductions & Taxes */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span>Optional Deductions & Taxes</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-theme-text-muted">Estimated Tax / Social Deduction (%)</span>
                <span className="font-mono text-cyan-400 font-bold">{taxDeductionPercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={taxDeductionPercent}
                onChange={e => setTaxDeductionPercent(parseFloat(e.target.value) || 0)}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-theme-text-muted mt-1 block">
                Adjust according to your regional tax bracket (e.g. 15-25%).
              </span>
            </div>

            <div className="pt-2 border-t border-theme-border">
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Other Monthly Deductions ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={otherMonthlyDeductions}
                onChange={e => setOtherMonthlyDeductions(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-text-muted mt-1 block">
                Fixed monthly health insurance, 401(k)/pension contribution, or union dues.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-theme-surface/50 border border-theme-border flex items-start gap-3 text-[11px] text-theme-text-muted leading-relaxed">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Calculation Assumptions & Disclaimer:</strong> Hourly and daily rates are computed assuming standard working schedules ({workingDaysPerMonth} days/month and {workingHoursPerDay} hrs/day). Actual net pay varies by jurisdiction, local tax credits, and statutory deductions. This tool does not provide legal or tax counsel.
        </span>
      </div>
    </div>
  );
};
