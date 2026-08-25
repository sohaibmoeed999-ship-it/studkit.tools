import React, { useState } from 'react';
import { ResultCard } from '../../common/ResultCard';
import { downloadText } from '../../../utils/download';
import { Receipt, Percent, DollarSign, PieChart, FileSpreadsheet } from 'lucide-react';

export const CommerceFinanceSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gst' | 'interest' | 'emi' | 'profit_loss' | 'invoice'>('emi');

  // EMI & Loan
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(3);

  // Profit / Loss
  const [costPrice, setCostPrice] = useState<number>(1200);
  const [sellingPrice, setSellingPrice] = useState<number>(1500);

  // GST & Sales Tax
  const [netAmount, setNetAmount] = useState<number>(2500);
  const [gstRate, setGstRate] = useState<number>(18);

  // Simple & Compound Interest
  const [principal, setPrincipal] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [timeYears, setTimeYears] = useState<number>(5);

  // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  // Profit / Loss Calculation
  const isProfit = sellingPrice >= costPrice;
  const plDiff = Math.abs(sellingPrice - costPrice);
  const plPercent = costPrice > 0 ? (plDiff / costPrice) * 100 : 0;

  // GST calculation
  const gstAmount = (netAmount * gstRate) / 100;
  const grossAmount = netAmount + gstAmount;

  // Compound Interest: A = P(1 + r/100)^t
  const compoundAmount = principal * Math.pow(1 + interestRate / 100, timeYears);
  const compoundInterest = compoundAmount - principal;
  const simpleInterest = (principal * interestRate * timeYears) / 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto p-1.5 rounded-2xl bg-theme-surface border border-theme-border scrollbar-none gap-1">
        {[
          { id: 'emi', label: 'EMI & Loan' },
          { id: 'profit_loss', label: 'Profit & Loss' },
          { id: 'gst', label: 'GST / Tax' },
          { id: 'interest', label: 'Simple & Compound Interest' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === t.id
                ? 'bg-theme-accent text-white shadow-md shadow-theme-accent/20'
                : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'emi' && (
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-theme-text flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-theme-accent" />
            <span>Student Loan & EMI Amortization Calculator</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Principal Loan ($)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={e => setLoanAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={annualRate}
                onChange={e => setAnnualRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Tenure (Years)</label>
              <input
                type="number"
                value={tenureYears}
                onChange={e => setTenureYears(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Monthly EMI</span>
              <span className="text-xl sm:text-2xl font-black text-theme-accent block font-mono mt-1">
                ${emi.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Total Interest</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 block font-mono mt-1">
                ${totalInterest.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Total Payable</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 block font-mono mt-1">
                ${totalPayment.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profit_loss' && (
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-theme-text flex items-center gap-2">
            <PieChart className="w-4 h-4 text-theme-accent" />
            <span>Profit & Loss / Margin Calculator</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Cost Price (CP)</label>
              <input
                type="number"
                value={costPrice}
                onChange={e => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Selling Price (SP)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={e => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border text-center space-y-2">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted">
              {isProfit ? 'Net Profit' : 'Net Loss'}
            </span>
            <span
              className={`text-3xl sm:text-4xl font-black block font-mono ${
                isProfit ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isProfit ? '+' : '-'}${plDiff.toFixed(2)} ({plPercent.toFixed(2)}%)
            </span>
            <span className="text-xs text-theme-text-muted font-mono block">
              Formula: {isProfit ? 'SP - CP' : 'CP - SP'} on Cost Basis
            </span>
          </div>
        </div>
      )}

      {activeTab === 'gst' && (
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-theme-text flex items-center gap-2">
            <Receipt className="w-4 h-4 text-theme-accent" />
            <span>Goods & Services Tax (GST) & Sales Tax</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">Net Base Amount</label>
              <input
                type="number"
                value={netAmount}
                onChange={e => setNetAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-1">GST Slab Rate (%)</label>
              <div className="flex gap-2">
                {[5, 12, 18, 28].map(r => (
                  <button
                    key={r}
                    onClick={() => setGstRate(r)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      gstRate === r ? 'bg-theme-accent text-white border-theme-accent' : 'bg-theme-bg border-theme-border text-theme-text'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted block">GST Tax Amount</span>
              <span className="text-2xl font-black text-amber-400 block font-mono mt-1">
                ${gstAmount.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Total Gross Amount</span>
              <span className="text-2xl font-black text-emerald-400 block font-mono mt-1">
                ${grossAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'interest' && (
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-theme-text flex items-center gap-2">
            <Percent className="w-4 h-4 text-theme-accent" />
            <span>Simple vs Compound Interest Comparison</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-theme-text-muted block mb-1">Principal ($)</label>
              <input
                type="number"
                value={principal}
                onChange={e => setPrincipal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs font-mono text-theme-text font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] text-theme-text-muted block mb-1">Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={e => setInterestRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs font-mono text-theme-text font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] text-theme-text-muted block mb-1">Time (Years)</label>
              <input
                type="number"
                value={timeYears}
                onChange={e => setTimeYears(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs font-mono text-theme-text font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border text-center space-y-1">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted">Simple Interest Return</span>
              <span className="text-xl font-black text-theme-accent block font-mono">
                ${(principal + simpleInterest).toFixed(2)}
              </span>
              <span className="text-[11px] text-theme-text-muted font-mono">
                Interest: +${simpleInterest.toFixed(2)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border text-center space-y-1">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Compound Interest Return</span>
              <span className="text-xl font-black text-emerald-400 block font-mono">
                ${compoundAmount.toFixed(2)}
              </span>
              <span className="text-[11px] text-emerald-400/80 font-mono">
                Compounded Gain: +${compoundInterest.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
