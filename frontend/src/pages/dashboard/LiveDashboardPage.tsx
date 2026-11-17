import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Server, 
  Sparkles, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Play, 
  RefreshCw, 
  Check, 
  X,
  ExternalLink,
  DollarSign,
  FileText,
  Sliders,
  Bell,
  Download,
  Filter,
  Search,
  ChevronRight,
  Database,
  Cpu,
  Layers,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Cloud,
  CheckCircle,
  Clock,
  Zap,
  HelpCircle,
  Bot,
  Activity,
  History,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from 'recharts';
import confetti from 'canvas-confetti';
import { AiAssistantDrawer } from '../../components/dashboard/AiAssistantDrawer';
import { HelpSupportView } from '../../components/dashboard/HelpSupportView';

interface LiveResource {
  resource_id: string;
  resource_type: string;
  resource_name: string | null;
  region: string;
  state: string;
  instance_type: string | null;
  last_seen_at: string | null;
}

interface LiveRecommendation {
  id: number;
  resource_id: string;
  recommendation_type: string;
  recommendation: string;
  estimated_savings: number;
  risk_level: string;
  confidence: number;
  status: string;
}

interface LiveAction {
  id: number;
  resource_id: string;
  action_type: string;
  action_status: string;
  reason: string;
  risk_level: string;
  executed_at: string | null;
  created_at: string | null;
}

interface LiveReportRun {
  id: number;
  started_at: string | null;
  completed_at: string | null;
  status: string;
  resources_analyzed: number;
  recommendations_generated: number;
  estimated_savings: number;
  report_path: string | null;
  error_message: string | null;
}

interface SummaryData {
  total_resources: number;
  resource_breakdown: Record<string, number>;
  pending_recommendations: number;
  potential_monthly_savings_usd: number;
  executed_actions_count: number;
  latest_run: {
    id: number;
    started_at: string | null;
    completed_at: string | null;
    status: string;
    estimated_savings: number;
  } | null;
}

export const LiveDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'resources' | 'recommendations' | 'actions' | 'reports' | 'help'
  >('overview');

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [resources, setResources] = useState<LiveResource[]>([]);
  const [recommendations, setRecommendations] = useState<LiveRecommendation[]>([]);
  const [actions, setActions] = useState<LiveAction[]>([]);
  const [reports, setReports] = useState<LiveReportRun[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  
  // Filters
  const [resFilter, setResFilter] = useState<'all' | 'running' | 'stopped'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatMoney = (usd: number) => {
    if (currency === 'INR') {
      const inr = Math.round(usd * 86.5);
      return `₹${inr.toLocaleString('en-IN')}`;
    }
    return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Fetch all live backend data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, resRes, recRes, actRes, repRes] = await Promise.all([
        fetch('/api/dashboard/summary').then((r) => r.json()),
        fetch('/api/resources').then((r) => r.json()),
        fetch('/api/recommendations').then((r) => r.json()),
        fetch('/api/actions').then((r) => r.json()),
        fetch('/api/reports').then((r) => r.json()),
      ]);

      if (sumRes.status === 'success') setSummary(sumRes.data);
      if (resRes.status === 'success') setResources(resRes.data || []);
      if (recRes.status === 'success') setRecommendations(recRes.data || []);
      if (actRes.status === 'success') setActions(actRes.data || []);
      if (repRes.status === 'success') setReports(repRes.data || []);
    } catch (err) {
      console.error('Failed to fetch live API data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Run the real 6-agent analysis pipeline
  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      setAnalysisProgress('Running Resource Discovery Agent...');
      
      const res = await fetch('/api/run-analysis', { method: 'POST' });
      const data = await res.json();

      if (data.status === 'success') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        triggerToast('Cloud Cost Optimization analysis completed successfully!');
        await fetchData();
      } else {
        triggerToast(`Analysis failed: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      triggerToast(`Analysis request error: ${err.message}`);
    } finally {
      setAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  // Approve recommendation
  const handleApprove = async (recId: number) => {
    try {
      const res = await fetch(`/api/recommendations/${recId}/approve`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        confetti({ particleCount: 50, spread: 50 });
        triggerToast(data.message || 'Action approved & queued for execution!');
        await fetchData();
      }
    } catch (err: any) {
      triggerToast(`Approval error: ${err.message}`);
    }
  };

  // Reject recommendation
  const handleReject = async (recId: number) => {
    try {
      const res = await fetch(`/api/recommendations/${recId}/reject`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(data.message || 'Recommendation rejected.');
        await fetchData();
      }
    } catch (err: any) {
      triggerToast(`Rejection error: ${err.message}`);
    }
  };

  // Filtered resources
  const filteredResources = resources.filter((r) => {
    const matchesFilter = resFilter === 'all' || r.state === resFilter;
    const matchesSearch = 
      (r.resource_id && r.resource_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.resource_name && r.resource_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.instance_type && r.instance_type.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ========================================================
          TOP DEMO SANDBOX BANNER
         ======================================================== */}
      <div className="sticky top-0 z-50 bg-[#0F172A] text-white px-4 sm:px-6 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="relative flex shrink-0 items-center justify-center rounded-xl bg-[#2563EB] shadow-xs h-8 w-8">
              <svg className="w-5 h-5 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M10 22C6.68629 22 4 19.3137 4 16C4 12.9863 6.22271 10.4907 9.15587 10.0667C9.69747 6.6436 12.656 4 16.2857 4C20.3703 4 23.7317 7.15857 24.0322 11.238C26.3142 11.8344 28 13.9189 28 16.4C28 19.4928 25.4928 22 22.4 22H10Z" 
                  fill="white" 
                  fillOpacity="0.22" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M16 19V11M16 11L12.5 14.5M16 11L19.5 14.5" 
                  stroke="white" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
            <div className="leading-none">
              <span className="font-display font-extrabold text-base tracking-tight text-white drop-shadow-sm">
                Cloud<span className="text-[#38BDF8]">Optimizer</span>
              </span>
            </div>
          </Link>

          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 hidden sm:inline" />
          
          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE PRODUCTION AGENT CONSOLE</span>
          </div>

          <span className="hidden md:inline text-slate-400">
            • AWS ap-south-2 • MySQL Active
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Currency Toggle */}
          <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 font-semibold text-[11px]">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              ₹ INR
            </button>
          </div>

          {/* Run Analysis CTA */}
          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Agents...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Cloud Analysis</span>
              </>
            )}
          </button>

          {/* AI Copilot Pill */}
          <button
            type="button"
            onClick={() => setShowAiAssistant(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Copilot</span>
          </button>

          <Link 
            to="/" 
            className="text-slate-300 hover:text-white flex items-center gap-1 font-medium transition-colors ml-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Site</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          TOAST ALERT BANNER
         ======================================================== */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN APP LAYOUT (Sidebar + Content Workspace)
         ======================================================== */}
      <div className="flex flex-1 relative">
        
        {/* LEFT PERMANENTLY FIXED NAVIGATION SIDEBAR */}
        <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 hidden md:flex sticky top-[45px] h-[calc(100vh-45px)] overflow-y-auto z-30">
          
          <div className="p-4 space-y-6">
            
            {/* Org Switcher Header */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Connected Infrastructure</div>
              <div className="font-bold text-xs text-slate-900 truncate flex items-center justify-between">
                <span>Production AWS Tenant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Connected to AWS ap-south-2" />
              </div>
              <div className="text-[11px] text-slate-500 truncate">Account: 416384710566 • ap-south-2</div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
                { id: 'resources', label: 'Live Cloud Assets', icon: Server, badge: summary?.total_resources || resources.length },
                { 
                  id: 'recommendations', 
                  label: 'AI Rightsizing Queue', 
                  icon: Zap, 
                  badge: summary?.pending_recommendations || recommendations.length, 
                  badgeColor: 'bg-amber-100 text-amber-800' 
                },
                { id: 'actions', label: 'Actions & Audit Trail', icon: History, badge: actions.length },
                { id: 'reports', label: 'Executive PDF Reports', icon: FileText, badge: reports.length },
                { id: 'help', label: 'Help & Support', icon: HelpCircle, badge: '24/7' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Bottom Sidebar User Pill */}
          <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 space-y-3">
            <button
              type="button"
              onClick={() => setShowAiAssistant(true)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Ask AI Copilot</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 text-white font-medium">Online</span>
            </button>

            <button
              type="button"
              onClick={fetchData}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>

        </aside>

        {/* WORKSPACE AREA */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          
          {/* TOP CONTROLS & FILTER BAR */}
          <header className="bg-white border-b border-slate-200/90 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
            
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-slate-900 capitalize">
                {activeTab === 'overview' && 'Live Multi-Agent Optimization Console'}
                {activeTab === 'resources' && 'Discovered Cloud Resource Inventory (MySQL)'}
                {activeTab === 'recommendations' && 'AI Rightsizing & Governance Queue'}
                {activeTab === 'actions' && 'Executed & Approved Actions Audit Trail'}
                {activeTab === 'reports' && 'Executive PDF Reports & Analysis Logs'}
                {activeTab === 'help' && 'Help & Technical Support Center'}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">| Real DB</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500">
                Region: <strong className="text-slate-800">ap-south-2</strong>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <div className="text-xs text-slate-500">
                DB Engine: <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">MySQL 8.x</strong>
              </div>
            </div>

          </header>

          {/* MAIN CONTENT CONTAINER */}
          <div className="p-6 space-y-6 flex-1 max-w-7xl w-full mx-auto">
            
            {/* Analyzing Progress Overlay Banner */}
            {analyzing && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
                  <div>
                    <div className="text-xs font-bold">{analysisProgress || 'Multi-agent pipeline executing...'}</div>
                    <div className="text-[11px] text-blue-700">Crawling EC2, RDS, and CloudWatch metrics in AWS ap-south-2</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#2563EB]">Live Analysis in Progress</span>
              </div>
            )}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Card 1: Resources Count */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Discovered Assets</span>
                      <Server className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div className="font-display font-extrabold text-2xl text-slate-900">
                      {summary?.total_resources ?? resources.length}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{resources.filter(r => r.state === 'running').length} Running • {resources.filter(r => r.state === 'stopped').length} Stopped</span>
                    </div>
                  </div>

                  {/* Card 2: Identified Waste / Savings */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Monthly Savings Opportunity</span>
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="font-display font-extrabold text-2xl text-emerald-600">
                      {formatMoney(summary?.potential_monthly_savings_usd ?? 8.064)}/mo
                    </div>
                    <div className="text-xs text-slate-500">
                      From {summary?.pending_recommendations ?? recommendations.length} pending optimization rules
                    </div>
                  </div>

                  {/* Card 3: Pending Recommendations */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">AI Proposals</span>
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="font-display font-extrabold text-2xl text-slate-900">
                      {summary?.pending_recommendations ?? recommendations.length} Actionable
                    </div>
                    <div className="text-xs text-slate-500">
                      Requires human governance authorization
                    </div>
                  </div>

                  {/* Card 4: Actions Executed */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Approved Actions</span>
                      <History className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="font-display font-extrabold text-2xl text-slate-900">
                      {summary?.executed_actions_count ?? actions.length}
                    </div>
                    <div className="text-xs text-slate-500">
                      Logged in immutable database audit trail
                    </div>
                  </div>

                </div>

                {/* Live Trigger Action Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Autonomous 6-Agent FinOps Pipeline</span>
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-white">
                      Scan Cloud Resources & Evaluate Rightsizing
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Triggers Resource Agent, Monitoring Agent (CloudWatch), Cost Agent (EC2 Pricing API), Optimization Agent, Risk Agent, and Recommendation Agent.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunAnalysis}
                    disabled={analyzing}
                    className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-60"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Running Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Trigger Live Analysis</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Resource Breakdown & Recent Run Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Breakdown Card */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-extrabold text-sm text-slate-900">
                        Discovered AWS Asset Distribution
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">ap-south-2</span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                            EC2
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">Amazon Elastic Compute Cloud</div>
                            <div className="text-[11px] text-slate-500">Virtual compute instances</div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-white font-bold text-slate-800 border border-slate-200">
                          {resources.filter(r => r.resource_type === 'EC2').length} Instances
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                            RDS
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">Relational Database Service</div>
                            <div className="text-[11px] text-slate-500">Managed database instances</div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-white font-bold text-slate-800 border border-slate-200">
                          {resources.filter(r => r.resource_type === 'RDS').length} Databases
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Latest Run Card */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-extrabold text-sm text-slate-900">
                        Latest Multi-Agent Run Telemetry
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        {summary?.latest_run?.status?.toUpperCase() || 'IDLE'}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Analysis Run ID:</span>
                        <span className="font-bold font-mono text-slate-800">#{summary?.latest_run?.id || 1}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Started Timestamp:</span>
                        <span className="font-mono text-slate-700">{summary?.latest_run?.started_at ? new Date(summary.latest_run.started_at).toLocaleString() : 'Just now'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Completed Timestamp:</span>
                        <span className="font-mono text-slate-700">{summary?.latest_run?.completed_at ? new Date(summary.latest_run.completed_at).toLocaleString() : 'Just now'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500">Calculated Savings:</span>
                        <span className="font-bold text-emerald-600">+{formatMoney(summary?.latest_run?.estimated_savings || 8.064)}/mo</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: RESOURCES */}
            {activeTab === 'resources' && (
              <div className="space-y-4">
                
                {/* Search & State Filter */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative max-w-sm w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search instance ID, tag name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setResFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                        resFilter === 'all' ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      All ({resources.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setResFilter('running')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                        resFilter === 'running' ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Running ({resources.filter(r => r.state === 'running').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setResFilter('stopped')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                        resFilter === 'stopped' ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Stopped ({resources.filter(r => r.state === 'stopped').length})
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Resource ID</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Name / Tag</th>
                        <th className="p-4">Region</th>
                        <th className="p-4">State</th>
                        <th className="p-4">Instance Type</th>
                        <th className="p-4">Last Synced</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredResources.map((res) => (
                        <tr key={res.resource_id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900">
                            {res.resource_id}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700">
                              {res.resource_type}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-800">
                            {res.resource_name || '—'}
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-[11px]">
                            {res.region}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              res.state === 'running' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${res.state === 'running' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              <span>{res.state}</span>
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-700">
                            {res.instance_type || '—'}
                          </td>
                          <td className="p-4 text-slate-400 font-mono text-[11px]">
                            {res.last_seen_at ? new Date(res.last_seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 3: RECOMMENDATIONS */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-slate-900">
                      AI Rightsizing & Governance Proposals
                    </h3>
                    <p className="text-xs text-slate-500">
                      Multi-agent generated optimization proposals requiring human-in-the-loop signoff.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunAnalysis}
                    disabled={analyzing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                    <span>Re-evaluate Recommendations</span>
                  </button>
                </div>

                {recommendations.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="font-display font-bold text-base text-slate-900">No Pending Waste Detected</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      All discovered AWS resources are currently running with healthy utilization. Click "Re-evaluate Recommendations" to trigger another scan.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {recommendations.map((rec) => (
                      <div 
                        key={rec.id} 
                        className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                              <Zap className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-display font-extrabold text-sm text-slate-900">
                                {rec.recommendation_type.replace('_', ' ')}
                              </div>
                              <div className="font-mono text-[11px] text-slate-400">
                                Target Resource: {rec.resource_id}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              rec.risk_level === 'LOW' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : rec.risk_level === 'MEDIUM'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {rec.risk_level} Risk
                            </span>

                            <span className="text-xs text-slate-500 font-semibold">
                              Confidence: {rec.confidence}%
                            </span>

                            <div className="text-right">
                              <div className="font-extrabold text-base text-emerald-600">
                                +{formatMoney(rec.estimated_savings)}/mo
                              </div>
                              <div className="text-[10px] text-slate-400 uppercase font-bold">Projected ROI</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                          {rec.recommendation}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[11px] text-slate-400 font-mono">
                            Status: <strong className="text-amber-600 font-bold uppercase">{rec.status}</strong>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleReject(rec.id)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(rec.id)}
                              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve Action</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB 4: ACTIONS AUDIT TRAIL */}
            {activeTab === 'actions' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">
                    Execution & Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">
                    Immutable history of all human-approved and system-executed optimization actions.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Action ID</th>
                        <th className="p-4">Target Resource</th>
                        <th className="p-4">Action Type</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Risk</th>
                        <th className="p-4">Reason</th>
                        <th className="p-4">Executed At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {actions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            No actions approved yet. When you approve recommendations, they appear in this ledger.
                          </td>
                        </tr>
                      ) : (
                        actions.map((act) => (
                          <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="p-4 font-mono font-bold text-slate-900">
                              #{act.id}
                            </td>
                            <td className="p-4 font-mono font-medium text-slate-800">
                              {act.resource_id}
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-[#2563EB] border border-blue-200">
                                {act.action_type}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                act.action_status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {act.action_status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-slate-700">
                              {act.risk_level}
                            </td>
                            <td className="p-4 text-slate-600 max-w-xs truncate" title={act.reason}>
                              {act.reason || '—'}
                            </td>
                            <td className="p-4 font-mono text-[11px] text-slate-400">
                              {act.created_at ? new Date(act.created_at).toLocaleString() : 'Recent'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-slate-900">
                      Executive Reports & Analysis History
                    </h3>
                    <p className="text-xs text-slate-500">
                      Download boardroom-ready PDF briefs generated by the ReportLab engine.
                    </p>
                  </div>

                  <a
                    href="/api/reports/latest/pdf"
                    download
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Latest PDF Brief</span>
                  </a>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Run ID</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Assets Analyzed</th>
                        <th className="p-4">Proposals Generated</th>
                        <th className="p-4">Estimated Savings</th>
                        <th className="p-4">Completed At</th>
                        <th className="p-4 text-right">PDF File</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reports.map((rep) => (
                        <tr key={rep.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900">
                            #{rep.id}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {rep.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-slate-800">
                            {rep.resources_analyzed} assets
                          </td>
                          <td className="p-4 font-semibold text-slate-800">
                            {rep.recommendations_generated}
                          </td>
                          <td className="p-4 font-bold text-emerald-600">
                            +{formatMoney(rep.estimated_savings)}/mo
                          </td>
                          <td className="p-4 font-mono text-[11px] text-slate-500">
                            {rep.completed_at ? new Date(rep.completed_at).toLocaleString() : 'In Progress'}
                          </td>
                          <td className="p-4 text-right">
                            <a
                              href="/api/reports/latest/pdf"
                              download
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 font-bold text-xs transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              <span>PDF</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 6: HELP & SUPPORT */}
            {activeTab === 'help' && (
              <HelpSupportView onOpenAiAssistant={() => setShowAiAssistant(true)} />
            )}

          </div>

        </main>

      </div>

      {/* Floating AI Copilot Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setShowAiAssistant(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-2xl hover:shadow-blue-500/20 hover:scale-105 border border-slate-700 transition-all cursor-pointer group"
          title="Open AI FinOps Copilot"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">AI Copilot</div>
            <div className="text-xs font-bold font-display text-white">Ask FinOps AI</div>
          </div>
        </button>
      </div>

      {/* AI FinOps Drawer */}
      <AiAssistantDrawer
        isOpen={showAiAssistant}
        onClose={() => setShowAiAssistant(false)}
        totalSpendFormatted={formatMoney(12480)}
        realizedSavingsFormatted={formatMoney(summary?.potential_monthly_savings_usd || 8.064)}
        healthScore={88}
        onOpenRec={() => {
          setShowAiAssistant(false);
          setActiveTab('recommendations');
        }}
        onOpenReport={() => {
          setShowAiAssistant(false);
          setActiveTab('reports');
        }}
        onSwitchTab={(tab) => {
          setShowAiAssistant(false);
          setActiveTab(tab as any);
        }}
      />

    </div>
  );
};
