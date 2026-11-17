import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Server, 
  PieChart as PieIcon, 
  Sparkles, 
  TrendingUp, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ArrowUpRight, 
  Filter, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  DEMO_METRICS, 
  DEMO_RESOURCES, 
  DEMO_RECOMMENDATIONS, 
  DEMO_SERVICE_BREAKDOWN, 
  DEMO_SPEND_HISTORY 
} from '../../data/mockData';
import { Link } from 'react-router-dom';

export const ProductShowcaseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'cost' | 'ai' | 'forecasting' | 'savings'>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'resources', name: 'Resources', icon: Server },
    { id: 'cost', name: 'Cost Analysis', icon: PieIcon },
    { id: 'ai', name: 'AI Recommendations', icon: Sparkles },
    { id: 'forecasting', name: 'Forecasting', icon: TrendingUp },
    { id: 'savings', name: 'Savings Ledger', icon: Coins },
  ];

  const forecastData = [
    { month: 'Jun', actual: 14200, projected: 14200, budget: 13500 },
    { month: 'Jul', actual: 13900, projected: 13900, budget: 13500 },
    { month: 'Aug', actual: 14650, projected: 14650, budget: 13500 },
    { month: 'Sep', actual: 13800, projected: 13800, budget: 13500 },
    { month: 'Oct', actual: 13200, projected: 13200, budget: 13500 },
    { month: 'Nov (Current)', actual: 12480, projected: 12480, budget: 13500 },
    { month: 'Dec (Est)', actual: null, projected: 11100, budget: 13500 },
    { month: 'Jan (Est)', actual: null, projected: 9800, budget: 13500 },
    { month: 'Feb (Est)', actual: null, projected: 8900, budget: 13500 },
  ];

  return (
    <section id="interactive-showcase" className="py-24 bg-background border-b border-border relative">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-blue text-primary-blue text-xs font-semibold border border-primary-blue/20">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Interactive Platform Showcase</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight">
            Explore the Real Dashboard.{' '}
            <span className="text-primary-blue">Experience True Clarity.</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            Click through the interactive modules below to inspect how Cloud Optimizer organizes cloud infrastructure, detects waste, and tracks realized savings.
          </p>
        </div>

        {/* Tab Controls Bar */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex p-1.5 bg-white rounded-2xl border border-border shadow-subtle max-w-full overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-primary-blue text-white shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-blue/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary-blue'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive App Canvas */}
        <div className="mt-8 bg-white rounded-3xl border border-border shadow-premium overflow-hidden">
          
          {/* Mock App Header */}
          <div className="px-6 py-4 bg-gray-50/70 border-b border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
                Environment: Demo Sandbox (Acme Corp Prod)
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-warning border border-amber-200">
                Demo Data Only
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-secondary">AWS Accounts:</span>
              <span className="font-semibold text-text-primary font-mono">3 Connected</span>
              <span className="text-border mx-1">|</span>
              <span className="text-text-secondary">Active Region:</span>
              <span className="font-semibold text-text-primary font-mono">ap-south-1 (Mumbai)</span>
            </div>
          </div>

          {/* Module Content */}
          <div className="p-6 sm:p-8 min-h-[460px]">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-background border border-border">
                      <div className="text-xs text-text-secondary">Monitored Cloud Resources</div>
                      <div className="text-2xl font-bold font-display text-text-primary mt-1">68 Assets</div>
                      <div className="text-[11px] text-text-secondary mt-1">42 Running • 7 Idle • 19 Decommissionable</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-background border border-border">
                      <div className="text-xs text-text-secondary">Current Monthly Run-Rate</div>
                      <div className="text-2xl font-bold font-display text-text-primary mt-1">${DEMO_METRICS.totalMonthlySpend.toLocaleString()}</div>
                      <div className="text-[11px] text-success-green mt-1">-8.4% month-over-month</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-background border border-border">
                      <div className="text-xs text-text-secondary">Identified Savings Headroom</div>
                      <div className="text-2xl font-bold font-display text-success-green mt-1">${DEMO_METRICS.potentialMonthlySavings.toLocaleString()}/mo</div>
                      <div className="text-[11px] text-text-secondary mt-1">~${(DEMO_METRICS.potentialMonthlySavings * 12).toLocaleString()} annualized recovery</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-background border border-border">
                      <div className="text-xs text-text-secondary">FinOps Health Index</div>
                      <div className="text-2xl font-bold font-display text-primary-blue mt-1">86 / 100</div>
                      <div className="text-[11px] text-success-green mt-1">Top tier efficiency benchmark</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                          Monthly Spending vs. Optimized Target
                        </span>
                        <span className="text-xs text-text-secondary font-mono">USD ($)</span>
                      </div>
                      <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={DEMO_SPEND_HISTORY}>
                            <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                            <YAxis stroke="#94A3B8" fontSize={11} />
                            <Tooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Spend']} />
                            <Area type="monotone" dataKey="spend" stroke="#315DDF" fill="#EDF3FF" strokeWidth={2} />
                            <Area type="monotone" dataKey="optimized" stroke="#15866A" fill="#E6F6F2" strokeWidth={2} strokeDasharray="3 3" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-background border border-border space-y-4">
                      <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                        Recent Priority Recommendations
                      </span>
                      {DEMO_RECOMMENDATIONS.slice(0, 3).map((rec) => (
                        <div key={rec.id} className="p-3 bg-white rounded-xl border border-border text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-semibold text-primary-blue">{rec.service}</span>
                            <span className="font-bold text-success-green">+${rec.estimatedSavings}/mo</span>
                          </div>
                          <p className="text-[11px] text-text-secondary truncate">{rec.recommendedAction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: RESOURCES */}
              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                    <span className="font-semibold text-text-primary">Discovered Inventory Telemetry</span>
                    <span className="text-text-secondary">Showing 5 of 68 AWS Resources</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border text-text-secondary">
                          <th className="py-3 px-3 font-semibold">Service</th>
                          <th className="py-3 px-3 font-semibold">Resource ID & Name</th>
                          <th className="py-3 px-3 font-semibold">Type</th>
                          <th className="py-3 px-3 font-semibold">Region</th>
                          <th className="py-3 px-3 font-semibold">Status</th>
                          <th className="py-3 px-3 font-semibold">Avg Utilization</th>
                          <th className="py-3 px-3 font-semibold">Cost / Month</th>
                          <th className="py-3 px-3 font-semibold">Savings Potential</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {DEMO_RESOURCES.map((r) => (
                          <tr key={r.id} className="hover:bg-surface-blue/40 transition-colors">
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-primary-blue/10 text-primary-blue">
                                {r.service}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-text-primary">{r.name}</div>
                              <div className="font-mono text-[10px] text-text-secondary">{r.id}</div>
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] text-text-secondary">{r.type}</td>
                            <td className="py-3 px-3 text-text-secondary">{r.region}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                r.status === 'running' 
                                  ? 'bg-emerald-50 text-success-green border border-emerald-200' 
                                  : r.status === 'idle' 
                                  ? 'bg-rose-50 text-danger border border-rose-200'
                                  : 'bg-amber-50 text-warning border border-amber-200'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono">
                              <div className="flex items-center gap-2">
                                <span className={r.utilization < 20 ? 'text-warning font-semibold' : 'text-text-primary'}>
                                  {r.utilization}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold">${r.monthlyCost}</td>
                            <td className="py-3 px-3 font-mono font-bold text-success-green">
                              {r.savingsOpportunity ? `+$${r.savingsOpportunity}` : 'Optimized'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: COST ANALYSIS */}
              {activeTab === 'cost' && (
                <motion.div
                  key="cost"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div className="p-5 rounded-2xl bg-background border border-border">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-4">
                      AWS Service Spending Breakdown
                    </span>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DEMO_SERVICE_BREAKDOWN} layout="vertical">
                          <XAxis type="number" stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `$${v}`} />
                          <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={90} />
                          <Tooltip formatter={(val: any) => [`$${val}`, 'Monthly Cost']} />
                          <Bar dataKey="spend" fill="#315DDF" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                      Cost Allocation Breakdown
                    </span>
                    <div className="space-y-3">
                      {DEMO_SERVICE_BREAKDOWN.map((item) => (
                        <div key={item.name} className="p-3 bg-white rounded-xl border border-border flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }} />
                            <span className="font-semibold text-text-primary">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-text-secondary">{item.percent}%</span>
                            <span className="font-mono font-bold text-text-primary">${item.spend.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: AI RECOMMENDATIONS */}
              {activeTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                    <span className="font-semibold text-text-primary">Multi-Agent AI Findings & Evidence</span>
                    <span className="text-xs font-semibold text-success-green">4 Actions Available • Total $417/mo Savings</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DEMO_RECOMMENDATIONS.map((rec) => (
                      <div key={rec.id} className="p-4 rounded-2xl bg-background border border-border hover:border-primary-blue/50 transition-colors space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary-blue/10 text-primary-blue">
                            {rec.id} • {rec.service}
                          </span>
                          <span className="text-sm font-bold font-display text-success-green">
                            +${rec.estimatedSavings} / month
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-text-primary">{rec.recommendedAction}</div>
                          <div className="text-[11px] text-text-secondary mt-1">{rec.finding}</div>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-border text-[11px] text-text-secondary">
                          <span className="font-semibold text-text-primary">Reasoning: </span>
                          {rec.explanation}
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span className="text-text-secondary">
                            Confidence: <strong className="text-text-primary">{(rec.confidence * 100).toFixed(0)}%</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-success-green border border-emerald-200">
                            Risk: {rec.riskLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 5: FORECASTING */}
              {activeTab === 'forecasting' && (
                <motion.div
                  key="forecasting"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="p-5 rounded-2xl bg-white border border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                          AI Predictive Spend Forecast (3 Months Forward)
                        </span>
                        <p className="text-[11px] text-text-secondary">
                          Regression projection incorporating right-sizing approvals vs. fixed $13,500 monthly budget ceiling
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary-blue"></span>
                          <span className="text-text-secondary">Actual Spend</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-success-green"></span>
                          <span className="text-text-secondary">Projected Spend</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-0.5 bg-rose-500"></span>
                          <span className="text-text-secondary">Budget Limit</span>
                        </span>
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecastData}>
                          <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                          <YAxis stroke="#94A3B8" fontSize={11} domain={[7000, 16000]} />
                          <Tooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Spend']} />
                          <Line type="monotone" dataKey="actual" stroke="#315DDF" strokeWidth={2.5} connectNulls={false} />
                          <Line type="monotone" dataKey="projected" stroke="#15866A" strokeWidth={2.5} strokeDasharray="4 4" />
                          <Line type="monotone" dataKey="budget" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="2 2" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: SAVINGS LEDGER */}
              {activeTab === 'savings' && (
                <motion.div
                  key="savings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-background border border-border">
                      <div className="text-xs text-text-secondary">Potential Savings Found</div>
                      <div className="text-xl font-bold font-display text-text-primary mt-1">$4,860 / mo</div>
                      <div className="text-[10px] text-text-secondary mt-1">Total identified backlog</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-background border border-border">
                      <div className="text-xs text-text-secondary">Approved by Engineers</div>
                      <div className="text-xl font-bold font-display text-primary-blue mt-1">$4,120 / mo</div>
                      <div className="text-[10px] text-text-secondary mt-1">Awaiting scheduled window</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-background border border-border">
                      <div className="text-xs text-text-secondary">Implemented Changes</div>
                      <div className="text-xl font-bold font-display text-amber-600 mt-1">$3,840 / mo</div>
                      <div className="text-[10px] text-text-secondary mt-1">Active in infrastructure</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="text-xs font-semibold text-success-green">Verified Realized on Bill</div>
                      <div className="text-xl font-bold font-display text-success-green mt-1">$3,720 / mo</div>
                      <div className="text-[10px] text-success-green mt-1">Confirmed on AWS invoice</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-blue/50 border border-primary-blue/20 text-xs text-text-secondary flex items-center justify-between">
                    <span>Ledger audit trail maintains immutable timestamps of every approval and verification event.</span>
                    <Link to="/register?plan=starter" className="font-semibold text-primary-blue hover:underline">
                      Activate ledger on your accounts →
                    </Link>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* App Footer Bar */}
          <div className="px-6 py-4 bg-gray-50/70 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <span>Data updated 12 minutes ago via AWS STS Read-Only worker</span>
            <Link to="/demo" className="font-semibold text-primary-blue hover:underline flex items-center gap-1">
              <span>Launch interactive full sandbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
