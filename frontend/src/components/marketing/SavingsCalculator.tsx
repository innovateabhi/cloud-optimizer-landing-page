import React, { useState } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const SavingsCalculator: React.FC = () => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  
  // Spend presets depending on currency
  const [monthlySpend, setMonthlySpend] = useState<number>(currency === 'INR' ? 450000 : 8000);
  const [optimizationPercent, setOptimizationPercent] = useState<number>(28);

  const handleCurrencyChange = (newCurrency: 'INR' | 'USD') => {
    setCurrency(newCurrency);
    if (newCurrency === 'INR') {
      setMonthlySpend(450000);
    } else {
      setMonthlySpend(8000);
    }
  };

  const monthlySavings = (monthlySpend * optimizationPercent) / 100;
  const annualSavings = monthlySavings * 12;
  const remainingSpend = monthlySpend - monthlySavings;

  const comparisonData = [
    {
      name: 'Current Spend',
      amount: monthlySpend,
      color: '#5B45F6',
    },
    {
      name: 'Optimized Spend',
      amount: remainingSpend,
      color: '#10B981',
    },
  ];

  const minSpend = currency === 'INR' ? 50000 : 1000;
  const maxSpend = currency === 'INR' ? 5000000 : 100000;
  const stepSpend = currency === 'INR' ? 25000 : 500;

  return (
    <section id="savings-calculator" className="py-24 bg-white border-b border-border relative">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider border border-emerald-200 cursor-default">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Estimator</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Estimate Your Potential{' '}
            <span className="text-emerald-600">Cloud Cost Savings</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Adjust your monthly cloud spend and expected reduction to model hypothetical monthly and annual cost recoveries across AWS, Azure, and Google Cloud.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="mt-14 max-w-4xl mx-auto bg-[#FAFBFD] rounded-3xl border border-slate-200/90 shadow-premium p-6 sm:p-10 lg:p-12">
          
          {/* Top Controls: Currency & Direct Spend Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Select Base Currency
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Toggle between INR (₹) and USD ($)</p>
            </div>
            
            <div className="inline-flex p-1 bg-white rounded-full border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => handleCurrencyChange('INR')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currency === 'INR' ? 'bg-[#5B45F6] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                INR (₹)
              </button>
              <button
                type="button"
                onClick={() => handleCurrencyChange('USD')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-[#5B45F6] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8 items-center">
            
            {/* Left Column: Sliders & Controls */}
            <div className="space-y-8">
              
              {/* Spend Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="spend-slider" className="text-xs font-bold text-slate-900 uppercase tracking-wider cursor-pointer">
                    Approximate Monthly Cloud Spend
                  </label>
                  <span className="font-display font-bold text-lg text-[#5B45F6]">
                    {formatCurrency(monthlySpend, currency)}
                  </span>
                </div>
                
                <input
                  id="spend-slider"
                  type="range"
                  min={minSpend}
                  max={maxSpend}
                  step={stepSpend}
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B45F6]"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{formatCurrency(minSpend, currency)}</span>
                  <span>{formatCurrency(maxSpend, currency)}</span>
                </div>
              </div>

              {/* Optimization Percentage Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="percent-slider" className="text-xs font-bold text-slate-900 uppercase tracking-wider cursor-pointer">
                    Assumed Optimization Target
                  </label>
                  <span className="font-display font-bold text-lg text-emerald-600">
                    {optimizationPercent}%
                  </span>
                </div>

                <input
                  id="percent-slider"
                  type="range"
                  min={10}
                  max={45}
                  step={1}
                  value={optimizationPercent}
                  onChange={(e) => setOptimizationPercent(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>10% (Conservative)</span>
                  <span>25% (Typical)</span>
                  <span>45% (Aggressive)</span>
                </div>
              </div>

              {/* Formula & Rule Note */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#5B45F6]" />
                  <span>Calculation Methodology</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Monthly Savings = Cloud Spend × {optimizationPercent}% • Annual Savings = Monthly Savings × 12
                </p>
              </div>

            </div>

            {/* Right Column: Output Metrics & Comparison Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 cursor-default">
                  <div className="text-[11px] font-semibold text-emerald-700">Hypothetical Monthly Savings</div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-emerald-600 mt-1">
                    {formatCurrency(monthlySavings, currency)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">per billing cycle</div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 cursor-default">
                  <div className="text-[11px] font-semibold text-[#5B45F6]">Hypothetical Annual Savings</div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-[#5B45F6] mt-1">
                    {formatCurrency(annualSavings, currency)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">cumulative over 12 mos</div>
                </div>
              </div>

              {/* Chart Comparison */}
              <div className="h-40 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickFormatter={(val) => `${val >= 1000 ? Math.round(val / 1000) + 'k' : val}`} />
                    <Tooltip formatter={(val: any) => [formatCurrency(Number(val), currency), 'Spend']} />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span>Remaining Monthly Spend:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(remainingSpend, currency)}
                </span>
              </div>

            </div>

          </div>

          {/* Disclaimer & Final CTA */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
              * Estimates are illustrative. Actual savings depend on multi-cloud infrastructure usage, pricing, configuration, and implemented recommendations. The calculator does not connect to your cloud accounts.
            </p>

            <Link
              to="/register?plan=starter"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#5B45F6] hover:bg-[#4C35DE] text-white text-xs sm:text-sm font-semibold shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>Discover Your Actual Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
