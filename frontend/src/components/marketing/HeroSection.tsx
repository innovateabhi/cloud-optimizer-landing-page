import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Check, 
  Calendar, 
  Search, 
  Bell, 
  LayoutDashboard, 
  Server, 
  Zap, 
  PieChart as PieIcon, 
  Sliders, 
  FileText, 
  Settings, 
  TrendingDown, 
  Cloud,
  ChevronDown,
  CheckCircle2,
  Clock,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  Tooltip 
} from 'recharts';
import confetti from 'canvas-confetti';
import { 
  AwsLogo, 
  AzureLogo, 
  GoogleCloudLogo, 
  DigitalOceanLogo, 
  KubernetesLogo 
} from '../ui/CloudProviderLogos';
import { CloudOptimizerLogo } from '../ui/CloudOptimizerLogo';

export const HeroSection: React.FC = () => {
  // Live Interactive Demo State inside the Hero tablet
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resources' | 'recommendations' | 'cost' | 'automation'>('dashboard');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
  
  // Dynamic metrics updated by user interaction
  const [totalSpend, setTotalSpend] = useState(12480);
  const [potentialSavings, setPotentialSavings] = useState(3720);
  const [optimizedCount, setOptimizedCount] = useState(42);
  const [appliedRecs, setAppliedRecs] = useState<string[]>([]);
  const [score, setScore] = useState(86);

  const chartDataMap = {
    '7d': [
      { month: 'Mon', spend: 3200 },
      { month: 'Tue', spend: 3100 },
      { month: 'Wed', spend: 3450 },
      { month: 'Thu', spend: 2900 },
      { month: 'Fri', spend: 2850 },
      { month: 'Sat', spend: 2400 },
      { month: 'Sun', spend: 2150 },
    ],
    '30d': [
      { month: 'Jun', spend: 20000 },
      { month: 'Jul', spend: 18500 },
      { month: 'Aug', spend: 21500 },
      { month: 'Sep', spend: 17200 },
      { month: 'Oct', spend: 15400 },
      { month: 'Nov', spend: 12480 },
    ],
    '90d': [
      { month: 'Q1', spend: 64000 },
      { month: 'Q2', spend: 58000 },
      { month: 'Q3', spend: 49000 },
      { month: 'Q4 (Est)', spend: 38000 },
    ],
  };

  const handleApplyRec = (recId: string, savings: number) => {
    if (appliedRecs.includes(recId)) return;
    setAppliedRecs([...appliedRecs, recId]);
    setTotalSpend((prev) => Math.max(0, prev - savings));
    setPotentialSavings((prev) => Math.max(0, prev - savings));
    setOptimizedCount((prev) => prev + 1);
    setScore((prev) => Math.min(99, prev + 3));
    confetti({ particleCount: 45, spread: 45, origin: { y: 0.6 } });
  };

  const selectTimeframe = (tf: '7d' | '30d' | '90d') => {
    setTimeframe(tf);
    setShowTimeframeDropdown(false);
    if (tf === '7d') {
      setTotalSpend(2850);
      setPotentialSavings(840);
    } else if (tf === '30d') {
      setTotalSpend(12480);
      setPotentialSavings(3720);
    } else {
      setTotalSpend(38200);
      setPotentialSavings(11400);
    }
  };

  return (
    <section className="relative pt-32 pb-12 md:pt-36 md:pb-14 overflow-hidden bg-background bg-grid-slate">
      
      {/* Subtle Grounded Enterprise Ambiance */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-100/30 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[300px] bg-slate-100/50 blur-2xl pointer-events-none rounded-full" />
      
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2-Column Hero Grid matching uploaded image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, CTAs, Trust */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Pill Eyebrow */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-[#2563EB] cursor-default shadow-xs"
            >
              <div className="w-4 h-4 rounded-full bg-[#2563EB] flex items-center justify-center text-white">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
              <span>AI-Powered FinOps Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.25rem] text-slate-900 tracking-tight leading-[1.12]"
            >
              Turn Your Cloud Spend into{' '}
              <span className="text-[#2563EB]">
                Measurable Savings
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
            >
              Discover waste, optimize resources, and cut cloud costs with an AI-driven, automated platform — built for modern teams on AWS, Azure, and Google Cloud.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
            >
              <Link
                to="/register?plan=starter"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#2563EB] fill-[#2563EB]" />
                <span>Live Interactive Demo</span>
              </Link>
            </motion.div>

            {/* 3 Trust checkmarks */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600"
            >
              <div className="flex items-center gap-1.5 cursor-default">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-default">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Deploy in minutes</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-default">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Secure & read-only access</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Live Interactive Tablet Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-7 relative"
          >
            {/* Soft Ambient Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#5B45F6]/20 to-purple-400/10 rounded-3xl blur-2xl transform -rotate-1 scale-95 pointer-events-none" />

            {/* Dashboard Mockup Container */}
            <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden text-xs text-slate-700">
              
              {/* Interactive Demo Top Banner */}
              <div className="bg-[#FAFBFD] px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudOptimizerLogo size="sm" />
                  <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
                    LIVE DEMO
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors" title="Notifications">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-[#5B45F6] font-bold text-xs flex items-center justify-center border border-purple-200 cursor-pointer">
                    A
                  </div>
                </div>
              </div>

              {/* Mock App Body with Left Mini-Sidebar + Interactive Workspace */}
              <div className="grid grid-cols-12 min-h-[410px]">
                
                {/* Left Mini Sidebar with Clickable Tabs */}
                <div className="col-span-3 sm:col-span-3 border-r border-slate-200/80 bg-[#FAFBFD]/60 p-2.5 space-y-1 hidden sm:block">
                  {[
                    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
                    { id: 'resources', name: 'Resources', icon: Server },
                    { id: 'recommendations', name: 'Recommendations', icon: Zap },
                    { id: 'cost', name: 'Cost Analysis', icon: PieIcon },
                    { id: 'automation', name: 'Automation', icon: Sliders },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-semibold text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Interactive Canvas */}
                <div className="col-span-12 sm:col-span-9 p-5 space-y-5 bg-white">
                  
                  {/* Dynamic Header & Interactive Timeframe Filter */}
                  <div className="flex items-center justify-between pb-1 relative">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 capitalize">
                        {activeTab === 'dashboard' ? 'Cloud Cost & Optimization' : activeTab}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {activeTab === 'dashboard'
                          ? 'Real-time telemetry across AWS, Azure, and Google Cloud'
                          : `Live interactive preview of ${activeTab} engine`}
                      </p>
                    </div>

                    {/* Timeframe Dropdown Toggle */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>
                          {timeframe === '7d' ? 'Last 7 Days' : timeframe === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                        </span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {showTimeframeDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30">
                          <button
                            onClick={() => selectTimeframe('7d')}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-purple-50 hover:text-[#5B45F6] cursor-pointer"
                          >
                            Last 7 Days
                          </button>
                          <button
                            onClick={() => selectTimeframe('30d')}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-purple-50 hover:text-[#5B45F6] cursor-pointer font-semibold"
                          >
                            Last 30 Days
                          </button>
                          <button
                            onClick={() => selectTimeframe('90d')}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-purple-50 hover:text-[#5B45F6] cursor-pointer"
                          >
                            Last 90 Days
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TAB 1: DASHBOARD (Default view matching picture) */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-4">
                      {/* 3 Metric Cards */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-purple-200 transition-colors cursor-pointer">
                          <div className="text-[11px] text-slate-500 font-medium">Total Spend</div>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-display font-bold text-lg text-slate-900">
                              ${totalSpend.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                              -8.4%
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-purple-200 transition-colors cursor-pointer">
                          <div className="text-[11px] text-slate-500 font-medium">Potential savings</div>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-display font-bold text-lg text-slate-900">
                              ${potentialSavings.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                              +29.8%
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-purple-200 transition-colors cursor-pointer">
                          <div className="text-[11px] text-slate-500 font-medium">Optimized Resources</div>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-display font-bold text-lg text-slate-900">
                              {optimizedCount}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                              +12
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Row: Monthly Cloud Spend & Optimization Score */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        {/* Spend Chart */}
                        <div className="sm:col-span-8 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-slate-800">
                              Monthly Cloud Spend
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <TrendingDown className="w-3 h-3" />
                              8.4% vs. last month
                            </span>
                          </div>

                          <div className="h-28 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartDataMap[timeframe]}>
                                <defs>
                                  <linearGradient id="heroSpendGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Spend']} />
                                <Area type="monotone" dataKey="spend" stroke="#2563EB" strokeWidth={2.5} fill="url(#heroSpendGrad)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Optimization Score Donut */}
                        <div className="sm:col-span-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col items-center justify-center text-center">
                          <span className="text-[11px] font-bold text-slate-800 mb-2">
                            Optimization Score
                          </span>

                          <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="9" fill="transparent" />
                              <circle
                                cx="50"
                                cy="50"
                                r="38"
                                stroke="#10B981"
                                strokeWidth="9"
                                fill="transparent"
                                strokeDasharray="238"
                                strokeDashoffset={238 * (1 - score / 100)}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-xl font-bold font-display text-slate-900">{score}%</span>
                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                +12 pts
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: RESOURCES */}
                  {activeTab === 'resources' && (
                    <div className="space-y-2.5">
                      <div className="text-[11px] text-slate-500 flex justify-between font-semibold border-b pb-1">
                        <span>Resource ID & Service</span>
                        <span>Avg CPU / Memory</span>
                        <span>Cost & Action</span>
                      </div>
                      {[
                        { id: 'i-0b2a9e14c (AWS EC2)', name: 'prod-analytics-c5', cpu: '11.8%', cost: '$248/mo', status: 'Idle' },
                        { id: 'vm-staging-02 (Azure)', name: 'dev-cluster-d4s', cpu: '6.2%', cost: '$180/mo', status: 'Oversized' },
                        { id: 'gcp-worker-app (GCP)', name: 'n2-standard-4', cpu: '14.5%', cost: '$126/mo', status: 'Idle' },
                      ].map((item, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:bg-purple-50/50 transition-colors cursor-pointer">
                          <div>
                            <div className="font-bold text-slate-900">{item.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{item.id}</div>
                          </div>
                          <div className="text-center font-mono text-[11px] text-amber-600 font-semibold">
                            {item.cpu}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">{item.cost}</div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 font-bold">
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: RECOMMENDATIONS (Interactive Apply) */}
                  {activeTab === 'recommendations' && (
                    <div className="space-y-3">
                      {[
                        { id: 'rec-1', title: 'Right-size 3 EC2 instances to Graviton3', savings: 1240, risk: 'Low' },
                        { id: 'rec-2', title: 'Release 2 unattached staging EBS disks', savings: 280, risk: 'Low' },
                      ].map((rec) => {
                        const isApplied = appliedRecs.includes(rec.id);
                        return (
                          <div key={rec.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{rec.title}</div>
                              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                                +${rec.savings}/month recovery • Risk: {rec.risk}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyRec(rec.id, rec.savings)}
                              disabled={isApplied}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isApplied
                                  ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs'
                              }`}
                            >
                              {isApplied ? 'Applied ✓' : 'Approve & Save'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TAB 4: COST ANALYSIS */}
                  {activeTab === 'cost' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex justify-between font-bold text-xs">
                          <span>Amazon Web Services (AWS)</span>
                          <span className="text-slate-900">$6,840 (55%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#5B45F6] rounded-full" style={{ width: '55%' }} />
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex justify-between font-bold text-xs">
                          <span>Microsoft Azure</span>
                          <span className="text-slate-900">$3,420 (27%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '27%' }} />
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex justify-between font-bold text-xs">
                          <span>Google Cloud Platform</span>
                          <span className="text-slate-900">$2,220 (18%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '18%' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: AUTOMATION */}
                  {activeTab === 'automation' && (
                    <div className="space-y-2.5 text-xs">
                      {[
                        { name: 'Nightly Non-Prod Cluster Shutdown', schedule: '20:00 - 07:00 UTC', status: 'Active' },
                        { name: 'Auto-Snapshot Orphaned EBS Storage', schedule: 'Continuous', status: 'Active' },
                        { name: 'Idle Container Garbage Collection', schedule: 'Daily at 02:00', status: 'Active' },
                      ].map((job, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900">{job.name}</div>
                            <div className="text-[10px] text-slate-500">{job.schedule}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            {job.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>

            </div>
          </motion.div>

        </div>

        {/* Cloud Providers Row ("Trusted by modern infrastructure teams") with authentic brand logos */}
        <div className="mt-8 border-t border-slate-200/80 pt-0">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-0">
            
            <div className="text-xs font-semibold text-slate-500 whitespace-nowrap cursor-default">
              Trusted by modern infrastructure teams
            </div>

            <div className="hidden lg:block w-px h-6 bg-slate-200" />

            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              <AwsLogo />
              <AzureLogo />
              <GoogleCloudLogo />
              <DigitalOceanLogo />
              <KubernetesLogo />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
