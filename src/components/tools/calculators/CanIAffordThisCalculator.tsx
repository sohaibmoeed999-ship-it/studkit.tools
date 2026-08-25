import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  PiggyBank,
  CreditCard,
  ShoppingBag,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const CanIAffordThisCalculator: React.FC = () => {
  const [currency, setCurrency] = useState<string>('$');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(3500);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(2100);
  const [savingsTarget, setSavingsTarget] = useState<number>(500);
  const [purchasePrice, setPurchasePrice] = useState<number>(450);

  // Installment toggle & fields
  const [useInstallment, setUseInstallment] = useState<boolean>(false);
  const [monthlyInstallment, setMonthlyInstallment] = useState<number>(75);
  const [installmentMonths, setInstallmentMonths] = useState<number>(6);

  const handleReset = () => {
    setMonthlyIncome(3500);
    setMonthlyExpenses(2100);
    setSavingsTarget(500);
    setPurchasePrice(450);
    setUseInstallment(false);
    setMonthlyInstallment(75);
    setInstallmentMonths(6);
  };

  // Calculations
  const results = useMemo(() => {
    const validIncome = Math.max(0, monthlyIncome);
    const validExpenses = Math.max(0, monthlyExpenses);
    const validSavings = Math.max(0, savingsTarget);
    const validPrice = Math.max(0, purchasePrice);

    // Current available money after necessary expenses
    const currentDiscretionaryMoney = Math.max(0, validIncome - validExpenses);
    // Surplus after accounting for savings goal
    const unallocatedSurplus = currentDiscretionaryMoney - validSavings;

    let monthlyImpactAmount = validPrice;
    let effectiveRemainingMoney = currentDiscretionaryMoney - validPrice;
    let remainingSavings = Math.max(0, validSavings + (effectiveRemainingMoney < 0 ? effectiveRemainingMoney : 0));

    if (useInstallment) {
      const validInstallment = Math.max(0, monthlyInstallment);
      monthlyImpactAmount = validInstallment;
      effectiveRemainingMoney = currentDiscretionaryMoney - validInstallment;
      remainingSavings = Math.max(0, validSavings);
    }

    // Percentage of Monthly Income used
    const percentageOfIncomeUsed = validIncome > 0 ? (monthlyImpactAmount / validIncome) * 100 : 0;
    const expenseRatio = validIncome > 0 ? ((validExpenses + monthlyImpactAmount) / validIncome) * 100 : 0;

    // Status Determination: Comfortable, Manage Carefully, High Impact
    let status: 'comfortable' | 'manage' | 'high_impact' = 'comfortable';
    let statusTitle = 'Comfortable';
    let statusBadgeColor = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
    let statusIcon = CheckCircle2;
    let explanation = '';

    if (useInstallment) {
      if (monthlyInstallment <= unallocatedSurplus && unallocatedSurplus > 0) {
        status = 'comfortable';
        statusTitle = 'Comfortable';
        statusBadgeColor = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
        statusIcon = CheckCircle2;
        explanation = `The monthly installment of ${currency}${monthlyInstallment} fits within your free discretionary surplus of ${currency}${Math.round(unallocatedSurplus)}/month without compromising your ${currency}${validSavings} savings target.`;
      } else if (effectiveRemainingMoney >= 0) {
        status = 'manage';
        statusTitle = 'Manage Carefully';
        statusBadgeColor = 'bg-amber-500/15 border-amber-500/30 text-amber-300';
        statusIcon = AlertTriangle;
        explanation = `You can cover the ${currency}${monthlyInstallment}/month payment, but it will reduce your monthly savings target by ${currency}${Math.round(validSavings - effectiveRemainingMoney)}/month over the next ${installmentMonths} months.`;
      } else {
        status = 'high_impact';
        statusTitle = 'High Impact / Over Budget';
        statusBadgeColor = 'bg-rose-500/15 border-rose-500/30 text-rose-300';
        statusIcon = XCircle;
        explanation = `This installment will exceed your available income by ${currency}${Math.abs(Math.round(effectiveRemainingMoney))}/month and cause a monthly deficit.`;
      }
    } else {
      if (validPrice <= unallocatedSurplus && unallocatedSurplus > 0) {
        status = 'comfortable';
        statusTitle = 'Comfortable';
        statusBadgeColor = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
        statusIcon = CheckCircle2;
        explanation = `You can afford this upfront purchase! After paying ${currency}${validPrice}, you still have ${currency}${Math.round(unallocatedSurplus - validPrice)} in free surplus and your ${currency}${validSavings} savings goal remains fully intact.`;
      } else if (validPrice <= currentDiscretionaryMoney) {
        status = 'manage';
        statusTitle = 'Manage Carefully';
        statusBadgeColor = 'bg-amber-500/15 border-amber-500/30 text-amber-300';
        statusIcon = AlertTriangle;
        explanation = `You have enough cash this month to make the purchase, but it will dip into your ${currency}${validSavings} savings target, leaving you with ${currency}${Math.round(effectiveRemainingMoney)} saved this month.`;
      } else {
        status = 'high_impact';
        statusTitle = 'High Impact';
        statusBadgeColor = 'bg-rose-500/15 border-rose-500/30 text-rose-300';
        statusIcon = XCircle;
        explanation = `The purchase price of ${currency}${validPrice} exceeds your total available monthly discretionary funds (${currency}${currentDiscretionaryMoney}) by ${currency}${Math.abs(Math.round(effectiveRemainingMoney))}. Consider saving for another month or choosing an installment plan.`;
      }
    }

    return {
      currentDiscretionaryMoney: Math.round(currentDiscretionaryMoney * 100) / 100,
      unallocatedSurplus: Math.round(unallocatedSurplus * 100) / 100,
      monthlyImpactAmount: Math.round(monthlyImpactAmount * 100) / 100,
      effectiveRemainingMoney: Math.round(effectiveRemainingMoney * 100) / 100,
      remainingSavings: Math.round(remainingSavings * 100) / 100,
      percentageOfIncomeUsed: Math.round(percentageOfIncomeUsed * 10) / 10,
      expenseRatio: Math.round(expenseRatio * 10) / 10,
      status,
      statusTitle,
      statusBadgeColor,
      statusIcon,
      explanation,
    };
  }, [monthlyIncome, monthlyExpenses, savingsTarget, purchasePrice, useInstallment, monthlyInstallment, installmentMonths, currency]);

  const StatusIcon = results.statusIcon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none animate-quick-fade">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Can I Afford This?</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Purchase Impact Analyzer
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              See how a purchase could affect your monthly budget before you spend.
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

      {/* Main Status Showcase Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-theme-border shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${results.statusBadgeColor}`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-theme-text-muted block">
                Purchase Affordability Status
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
                <span>{results.statusTitle}</span>
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-theme-text-muted font-mono uppercase block">Income Impact</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{results.percentageOfIncomeUsed}% of income</span>
          </div>
        </div>

        {/* Dynamic Numerical Explanation */}
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
          {results.explanation}
        </p>

        {/* Progress Bar of Expense Load */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-mono text-theme-text-muted">
            <span>Total Monthly Budget Commitment</span>
            <span className="text-white font-bold">{results.expenseRatio}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                results.expenseRatio > 100
                  ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                  : results.expenseRatio > 85
                  ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'
                  : 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500'
              }`}
              style={{ width: `${Math.min(100, results.expenseRatio)}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Numerical Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Available Before</span>
          <p className="text-xl font-black text-cyan-400 font-mono mt-1">
            {currency}{results.currentDiscretionaryMoney.toLocaleString()}
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono">Discretionary Cash</span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Impact Amount</span>
          <p className="text-xl font-black text-rose-400 font-mono mt-1">
            {currency}{results.monthlyImpactAmount.toLocaleString()}
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono">{useInstallment ? 'per month' : 'one-time'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Remaining Balance</span>
          <p className={`text-xl font-black font-mono mt-1 ${results.effectiveRemainingMoney < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {currency}{results.effectiveRemainingMoney.toLocaleString()}
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono">after purchase</span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Savings Kept</span>
          <p className="text-xl font-black text-amber-400 font-mono mt-1">
            {currency}{results.remainingSavings.toLocaleString()}
          </p>
          <span className="text-[10px] text-theme-text-muted font-mono">of {currency}{savingsTarget} goal</span>
        </div>
      </div>

      {/* Input Cards Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Financial Health */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-emerald-400" />
            <span>Monthly Cash Flow</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Total Monthly Income ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Current Monthly Fixed & Living Expenses ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={monthlyExpenses}
                onChange={e => setMonthlyExpenses(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Monthly Savings Target ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={savingsTarget}
                onChange={e => setSavingsTarget(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Purchase & Installment Settings */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>Purchase & Payment Terms</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Total Purchase Price ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={purchasePrice}
                onChange={e => setPurchasePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>

            {/* Installment Toggle Switch */}
            <div className="pt-2 border-t border-theme-border flex items-center justify-between">
              <div>
                <span className="font-semibold text-theme-text block">Pay via Monthly Installments?</span>
                <span className="text-[11px] text-theme-text-muted">Split into BNPL / EMI payment plan</span>
              </div>
              <button
                type="button"
                onClick={() => setUseInstallment(!useInstallment)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  useInstallment ? 'bg-theme-accent' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useInstallment ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {useInstallment && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-semibold">
                    Monthly Payment ({currency})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={monthlyInstallment}
                    onChange={e => setMonthlyInstallment(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-theme-text-muted mb-1 font-semibold">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={installmentMonths}
                    onChange={e => setInstallmentMonths(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-theme-surface/50 border border-theme-border flex items-start gap-3 text-[11px] text-theme-text-muted leading-relaxed">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Budgeting Estimate Disclaimer:</strong> This tool provides mathematical simulations based exclusively on user-entered values to assist in personal budgeting decisions. It does not constitute formal financial, credit, or tax advice.
        </span>
      </div>
    </div>
  );
};
