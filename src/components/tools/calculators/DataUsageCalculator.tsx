import React, { useState, useMemo } from 'react';
import {
  Wifi,
  HardDrive,
  Calendar,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';

export const DataUsageCalculator: React.FC = () => {
  const [packageSize, setPackageSize] = useState<number>(50);
  const [packageUnit, setPackageUnit] = useState<'GB' | 'MB'>('GB');
  const [usedData, setUsedData] = useState<number>(18.5);
  const [usedUnit, setUsedUnit] = useState<'GB' | 'MB'>('GB');
  const [remainingDays, setRemainingDays] = useState<number>(12);
  const [dailyTarget, setDailyTarget] = useState<number>(2.5);
  const [dailyTargetUnit, setDailyTargetUnit] = useState<'GB' | 'MB'>('GB');

  // Calculations in normalized MB
  const results = useMemo(() => {
    const totalMb = packageUnit === 'GB' ? packageSize * 1024 : packageSize;
    const usedMb = usedUnit === 'GB' ? usedData * 1024 : usedData;
    const targetMb = dailyTargetUnit === 'GB' ? dailyTarget * 1024 : dailyTarget;

    const remainingMb = Math.max(0, totalMb - usedMb);
    const usedPercentage = totalMb > 0 ? Math.min(100, Math.round((usedMb / totalMb) * 100)) : 0;
    const remainingPercentage = Math.max(0, 100 - usedPercentage);

    const safeRemainingDays = Math.max(1, remainingDays);
    const recommendedDailyMb = remainingMb / safeRemainingDays;

    // Estimated burn rate & package lifetime
    // If daily usage continues at recommended vs target pace
    const projectedTotalUsageMb = usedMb + targetMb * safeRemainingDays;
    const isExceedingPackage = projectedTotalUsageMb > totalMb;
    const daysUntilDepletion = targetMb > 0 ? Math.floor(remainingMb / targetMb) : 999;
    const willRunOutEarly = daysUntilDepletion < remainingDays;

    return {
      totalGb: Math.round((totalMb / 1024) * 100) / 100,
      usedGb: Math.round((usedMb / 1024) * 100) / 100,
      remainingMb: Math.round(remainingMb),
      remainingGb: Math.round((remainingMb / 1024) * 100) / 100,
      usedPercentage,
      remainingPercentage,
      recommendedDailyMb: Math.round(recommendedDailyMb),
      recommendedDailyGb: Math.round((recommendedDailyMb / 1024) * 100) / 100,
      projectedTotalGb: Math.round((projectedTotalUsageMb / 1024) * 100) / 100,
      isExceedingPackage,
      daysUntilDepletion,
      willRunOutEarly,
    };
  }, [packageSize, packageUnit, usedData, usedUnit, remainingDays, dailyTarget, dailyTargetUnit]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Data Usage Calculator</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                MB / GB Internet Allowance
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Compute safe daily allowances, pace predictions, and avoid unexpected data throttling.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Remaining Data</span>
          <p className="text-xl font-black text-cyan-400 font-mono mt-1">{results.remainingGb} GB</p>
          <span className="text-[10px] text-theme-text-muted font-mono">({results.remainingMb.toLocaleString()} MB)</span>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Recommended Daily Limit</span>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">{results.recommendedDailyGb} GB/day</p>
          <span className="text-[10px] text-theme-text-muted font-mono">({results.recommendedDailyMb} MB/day)</span>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Package Used</span>
          <p className="text-xl font-black text-indigo-400 font-mono mt-1">{results.usedPercentage}%</p>
          <span className="text-[10px] text-theme-text-muted font-mono">{results.usedGb} of {results.totalGb} GB</span>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Pace Status</span>
          <p className={`text-xl font-black font-mono mt-1 ${results.willRunOutEarly ? 'text-rose-400' : 'text-emerald-400'}`}>
            {results.willRunOutEarly ? 'Depletion Risk' : 'Healthy Pace'}
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono">{results.daysUntilDepletion} days at target</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-theme-text">
          <span>Package Consumption Status</span>
          <span className="font-mono text-cyan-400">{results.remainingPercentage}% Available</span>
        </div>
        <div className="w-full h-3 bg-theme-bg rounded-full overflow-hidden p-0.5 border border-theme-border">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              results.usedPercentage > 85
                ? 'bg-rose-500'
                : results.usedPercentage > 60
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
            }`}
            style={{ width: `${results.usedPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-theme-text-muted">
          <span>Used: {results.usedGb} GB ({results.usedPercentage}%)</span>
          <span>Total: {results.totalGb} GB</span>
        </div>
      </div>

      {/* Status Warning Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold ${
          results.willRunOutEarly
            ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {results.willRunOutEarly ? (
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          )}
          <span>
            {results.willRunOutEarly
              ? `At your current target of ${dailyTarget} ${dailyTargetUnit}/day, your data will expire in ${results.daysUntilDepletion} days (${remainingDays - results.daysUntilDepletion} days before renewal). Reduce daily consumption to ${results.recommendedDailyGb} GB/day.`
              : `Your consumption rate is within limits. You can safely browse, stream lectures, and study with up to ${results.recommendedDailyGb} GB/day until renewal.`}
          </span>
        </div>
      </div>

      {/* Inputs Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Package & Usage */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>Package Parameters</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Total Monthly Data Allowance</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0.1}
                  step={0.5}
                  value={packageSize}
                  onChange={e => setPackageSize(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
                />
                <select
                  value={packageUnit}
                  onChange={e => setPackageUnit(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold focus:border-theme-accent focus:outline-none"
                >
                  <option value="GB">GB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Data Already Consumed</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={usedData}
                  onChange={e => setUsedData(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
                />
                <select
                  value={usedUnit}
                  onChange={e => setUsedUnit(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold focus:border-theme-accent focus:outline-none"
                >
                  <option value="GB">GB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Days & Target Pace */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Cycle & Usage Pace</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Days Remaining in Billing Cycle: <span className="text-cyan-400 font-bold">{remainingDays} Days</span>
              </label>
              <input
                type="range"
                min={1}
                max={31}
                value={remainingDays}
                onChange={e => setRemainingDays(parseInt(e.target.value) || 1)}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Your Estimated Daily Usage Pace</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={dailyTarget}
                  onChange={e => setDailyTarget(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
                />
                <select
                  value={dailyTargetUnit}
                  onChange={e => setDailyTargetUnit(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold focus:border-theme-accent focus:outline-none"
                >
                  <option value="GB">GB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
