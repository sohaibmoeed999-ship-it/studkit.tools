import React, { useState, useMemo } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Plus,
  Trash2,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Calendar,
  PiggyBank,
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: 'Housing & Rent' | 'Food & Groceries' | 'Books & Stationery' | 'Transport' | 'Entertainment & Subscriptions' | 'Other';
  type: 'fixed' | 'variable';
}

export const StudentBudgetPlanner: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(850);
  const [savingsTarget, setSavingsTarget] = useState<number>(150);
  const [currency, setCurrency] = useState<string>('$');

  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', name: 'Hostel / Rent Share', amount: 350, category: 'Housing & Rent', type: 'fixed' },
    { id: '2', name: 'Meal Plan & Groceries', amount: 180, category: 'Food & Groceries', type: 'variable' },
    { id: '3', name: 'Semester Textbooks & Lab Copies', amount: 45, category: 'Books & Stationery', type: 'fixed' },
    { id: '4', name: 'Metro / Campus Bus Pass', amount: 35, category: 'Transport', type: 'fixed' },
    { id: '5', name: 'Music & Streaming Subscriptions', amount: 15, category: 'Entertainment & Subscriptions', type: 'variable' },
  ]);

  const [newExpName, setNewExpName] = useState('');
  const [newExpAmount, setNewExpAmount] = useState<string>('');
  const [newExpCategory, setNewExpCategory] = useState<ExpenseItem['category']>('Food & Groceries');
  const [newExpType, setNewExpType] = useState<'fixed' | 'variable'>('variable');

  const categories: ExpenseItem['category'][] = [
    'Housing & Rent',
    'Food & Groceries',
    'Books & Stationery',
    'Transport',
    'Entertainment & Subscriptions',
    'Other',
  ];

  const handleAddExpense = () => {
    const val = parseFloat(newExpAmount);
    if (!newExpName.trim() || isNaN(val) || val <= 0) return;

    setExpenses(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: newExpName.trim(),
        amount: Math.round(val * 100) / 100,
        category: newExpCategory,
        type: newExpType,
      },
    ]);
    setNewExpName('');
    setNewExpAmount('');
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Calculations
  const results = useMemo(() => {
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const fixedExpenses = expenses.filter(e => e.type === 'fixed').reduce((acc, curr) => acc + curr.amount, 0);
    const variableExpenses = expenses.filter(e => e.type === 'variable').reduce((acc, curr) => acc + curr.amount, 0);

    const remainingMoney = monthlyIncome - totalExpenses;
    const actualSavingsAchieved = Math.max(0, remainingMoney);
    const isOverBudget = remainingMoney < 0;
    const isUnderSavingsTarget = remainingMoney < savingsTarget && !isOverBudget;

    // Remaining days in current month
    const now = new Date();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const remainingDaysInMonth = Math.max(1, totalDaysInMonth - currentDay + 1);

    // Recommended daily spending allowance (from remaining discretionary money after savings target)
    const discretionaryLeft = Math.max(0, remainingMoney - savingsTarget);
    const recommendedDailyLimit = Math.round((discretionaryLeft / remainingDaysInMonth) * 100) / 100;

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    categories.forEach(c => { categoryTotals[c] = 0; });
    expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0,
    })).filter(c => c.amount > 0);

    return {
      totalExpenses,
      fixedExpenses,
      variableExpenses,
      remainingMoney,
      actualSavingsAchieved,
      isOverBudget,
      isUnderSavingsTarget,
      recommendedDailyLimit,
      remainingDaysInMonth,
      categoryBreakdown,
    };
  }, [monthlyIncome, savingsTarget, expenses]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Student Budget Planner</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Monthly Allowance & Expense Tracker
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Track pocket money, divide fixed vs variable costs, and compute safe daily spending limits.
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
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Monthly Income</span>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">{currency}{monthlyIncome.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Total Expenses</span>
          <p className="text-xl font-black text-rose-400 font-mono mt-1">{currency}{results.totalExpenses.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Remaining Balance</span>
          <p className={`text-xl font-black font-mono mt-1 ${results.isOverBudget ? 'text-rose-400' : 'text-cyan-400'}`}>
            {results.isOverBudget ? '-' : ''}{currency}{Math.abs(results.remainingMoney).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">Safe Daily Spend</span>
          <p className="text-xl font-black text-amber-400 font-mono mt-1">{currency}{results.recommendedDailyLimit}/day</p>
        </div>
      </div>

      {/* Budget Status Alert Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold ${
          results.isOverBudget
            ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            : results.isUnderSavingsTarget
            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {results.isOverBudget ? (
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          ) : (
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          )}
          <span>
            {results.isOverBudget
              ? `Warning: You are over budget by ${currency}${Math.abs(results.remainingMoney)}. Consider reducing variable entertainment and dining costs.`
              : results.isUnderSavingsTarget
              ? `You are within budget, but ${currency}${savingsTarget - results.remainingMoney} short of your ${currency}${savingsTarget} monthly savings goal.`
              : `Great job! Your budget is healthy and your ${currency}${savingsTarget} savings target is fully secured.`}
          </span>
        </div>
        <span className="text-[11px] font-mono whitespace-nowrap">
          {results.remainingDaysInMonth} days left this month
        </span>
      </div>

      {/* Income & Expense Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income & Savings Targets */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-emerald-400" />
            <span>Income & Goals</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Monthly Allowance / Income ({currency})</label>
              <input
                type="number"
                min={0}
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Target Savings Goal ({currency})</label>
              <input
                type="number"
                min={0}
                value={savingsTarget}
                onChange={e => setSavingsTarget(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-theme-border space-y-1.5 text-[11px] text-theme-text-muted">
              <div className="flex justify-between">
                <span>Fixed Monthly Commitments:</span>
                <span className="font-mono text-theme-text font-bold">{currency}{results.fixedExpenses}</span>
              </div>
              <div className="flex justify-between">
                <span>Variable Living Costs:</span>
                <span className="font-mono text-theme-text font-bold">{currency}{results.variableExpenses}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses List & Manager */}
        <div className="md:col-span-2 bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>Expense Items ({expenses.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">
              Total: {currency}{results.totalExpenses}
            </span>
          </div>

          {/* Add Expense Form */}
          <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              placeholder="Item (e.g. WiFi Bill)"
              value={newExpName}
              onChange={e => setNewExpName(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
            />
            <input
              type="number"
              placeholder={`Amount (${currency})`}
              value={newExpAmount}
              onChange={e => setNewExpAmount(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
            />
            <select
              value={newExpCategory}
              onChange={e => setNewExpCategory(e.target.value as any)}
              className="px-2 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <select
                value={newExpType}
                onChange={e => setNewExpType(e.target.value as any)}
                className="w-full px-2 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
              >
                <option value="variable">Variable</option>
                <option value="fixed">Fixed</option>
              </select>
              <button
                onClick={handleAddExpense}
                className="p-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white transition-all cursor-pointer flex-shrink-0"
                title="Add Expense"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expenses Table / List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {expenses.map(e => (
              <div
                key={e.id}
                className="p-2.5 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 truncate flex-1">
                  <span className="font-semibold text-theme-text truncate">{e.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-theme-surface border border-theme-border text-theme-text-muted">
                    {e.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono font-bold text-rose-400">{currency}{e.amount}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {e.type}
                  </span>
                  <button
                    onClick={() => handleRemoveExpense(e.id)}
                    className="p-1 rounded text-theme-text-muted hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Spending Breakdown */}
      {results.categoryBreakdown.length > 0 && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <span>Category Spending Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.categoryBreakdown.map(c => (
              <div key={c.category} className="p-3.5 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-theme-text">
                  <span className="truncate">{c.category}</span>
                  <span className="font-mono text-cyan-400">{currency}{c.amount}</span>
                </div>
                <div className="w-full h-1.5 bg-theme-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 rounded-full"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-theme-text-muted font-mono">
                  <span>{c.percentage}% of total budget</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
