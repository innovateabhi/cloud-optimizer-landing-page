import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
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
  Loader2,
  Lock,
  Key,
  CreditCard,
  Building2,
  Users,
  Settings,
  Mail,
  Send,
  Wallet,
  Percent,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';
import { AiAssistantDrawer } from '../../components/dashboard/AiAssistantDrawer';
import { HelpSupportView } from '../../components/dashboard/HelpSupportView';
import { AccountSettingsView } from '../../components/dashboard/AccountSettingsView';
import { MockUpiPaymentModal, PaymentSuccessData } from '../../components/payment/MockUpiPaymentModal';

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

interface BudgetData {
  tenantId: number;
  tenantName: string;
  monthlyBudget: number;
  currency: 'USD' | 'INR';
  thresholdPercent: number;
  alertEmail: string;
  currentSpend: number;
  projectedSpend: number;
  percentConsumed: number;
  isAlertTriggered: boolean;
  isExceeded: boolean;
  lastAlertSent: string | null;
}

export const LiveDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Active Plan State (Free, Starter, Business, Enterprise)
  const initialPlan = (searchParams.get('plan') as any) || localStorage.getItem('cloud_optimizer_plan') || 'starter';
  const tenantParam = searchParams.get('tenant') || localStorage.getItem('cloud_optimizer_tenant') || (initialPlan === 'free' ? 'Acme Cloud Labs' : initialPlan === 'business' ? 'GlobalScale Logistics' : 'TechNova Solutions');

  const [currentPlan, setCurrentPlan] = useState<'free' | 'starter' | 'business' | 'enterprise'>(initialPlan);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'resources' | 'recommendations' | 'actions' | 'reports' | 'settings' | 'help'
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
  const userJson = localStorage.getItem('cloud_optimizer_user');
  let currentUser: any = null;
  if (userJson) {
    try {
      currentUser = JSON.parse(userJson);
    } catch {
      currentUser = { name: userJson, fullName: userJson, email: '', role: 'user' };
    }
  }
  const isPlatformAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase().includes('admin');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('cloud_optimizer_user');
    localStorage.removeItem('cloud_optimizer_token');
    navigate('/login');
  };
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<{ id: string; name: string; amountINR: number }>({
    id: 'starter',
    name: 'Starter Plan',
    amountINR: 1999
  });

  // Filters
  const [resFilter, setResFilter] = useState<'all' | 'running' | 'stopped'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  // Budget & HTML Alert State
  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    monthlyBudget: 500,
    currency: 'USD' as 'USD' | 'INR',
    thresholdPercent: 85,
    alertEmail: 'billing@technova.com'
  });
  const [savingBudget, setSavingBudget] = useState(false);
  const [sendingAlertEmail, setSendingAlertEmail] = useState(false);
  const hasAutoRefreshed = React.useRef(false);

  // Plan Entitlements definition
  const planInfo = {
    free: {
      name: 'Free Plan',
      badge: 'Free Tier',
      maxAccounts: 1,
      maxRegions: 1,
      maxResources: 5,
      hasAiRecommendations: false,
      hasActionsAudit: false,
      hasAnomalyDetection: false,
      hasEmailSupport: false,
      badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    starter: {
      name: 'Starter Plan',
      badge: 'Starter Tier',
      maxAccounts: 3,
      maxRegions: 3,
      maxResources: 50,
      hasAiRecommendations: true,
      hasActionsAudit: false,
      hasAnomalyDetection: false,
      hasEmailSupport: true,
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    business: {
      name: 'Business Plan',
      badge: 'Business Tier',
      maxAccounts: 10,
      maxRegions: 30,
      maxResources: 500,
      hasAiRecommendations: true,
      hasActionsAudit: true,
      hasAnomalyDetection: true,
      hasEmailSupport: true,
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    enterprise: {
      name: 'Enterprise Plan',
      badge: 'Enterprise',
      maxAccounts: 999,
      maxRegions: 999,
      maxResources: 10000,
      hasAiRecommendations: true,
      hasActionsAudit: true,
      hasAnomalyDetection: true,
      hasEmailSupport: true,
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  }[currentPlan];

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

  // Sync plan change
  const handleSwitchPlan = (newPlan: 'free' | 'starter' | 'business' | 'enterprise') => {
    setCurrentPlan(newPlan);
    const newTid = newPlan === 'free' ? '1' : newPlan === 'business' ? '3' : '2';
    const newTenant = newPlan === 'free' ? 'Acme Cloud Labs' : newPlan === 'business' ? 'GlobalScale Logistics' : 'TechNova Solutions';
    localStorage.setItem('cloud_optimizer_plan', newPlan);
    localStorage.setItem('cloud_optimizer_tenant', newTenant);
    localStorage.setItem('cloud_optimizer_tenant_id', newTid);
    setSearchParams({ plan: newPlan, tenant: newTenant, tenant_id: newTid });
    triggerToast(`Switched dashboard view to ${newPlan.toUpperCase()} plan.`);
    fetchData(newPlan, newTid);
  };

  // Trigger Mock UPI Upgrade
  const handleOpenUpgrade = (plan: 'starter' | 'business') => {
    const target = plan === 'starter' 
      ? { id: 'starter', name: 'Starter Plan', amountINR: 1999 }
      : { id: 'business', name: 'Business Plan', amountINR: 5999 };
    setUpgradeTarget(target);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (data: PaymentSuccessData) => {
    setShowPaymentModal(false);
    handleSwitchPlan(data.planId as any);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    triggerToast(`Payment verified! Upgraded to ${data.planName}. All features unlocked!`);
  };

  // Fetch all live backend data from MySQL filtered by tenant & plan
  const fetchData = async (targetPlan = currentPlan, targetTid?: string) => {
    try {
      setLoading(true);
      const tid = targetTid || searchParams.get('tenant_id') || (targetPlan === 'free' ? '1' : targetPlan === 'business' ? '3' : '2');
      const query = `?plan=${targetPlan}&tenant_id=${tid}`;

      const [sumRes, resRes, recRes, actRes, repRes, budRes] = await Promise.all([
        fetch(`/api/dashboard/summary${query}`).then((r) => r.json()),
        fetch(`/api/resources${query}`).then((r) => r.json()),
        fetch(`/api/recommendations${query}`).then((r) => r.json()),
        fetch(`/api/actions${query}`).then((r) => r.json()),
        fetch(`/api/reports${query}`).then((r) => r.json()),
        fetch(`/api/budget${query}`).then((r) => r.json()).catch(() => null),
      ]);

      if (sumRes.status === 'success') setSummary(sumRes.data);
      if (resRes.status === 'success') setResources(resRes.data || []);
      if (recRes.status === 'success') setRecommendations(recRes.data || []);
      if (actRes.status === 'success') setActions(actRes.data || []);
      if (repRes.status === 'success') setReports(repRes.data || []);
      if (budRes?.status === 'success' && budRes.data) {
        setBudget(budRes.data);
        setBudgetForm({
          monthlyBudget: budRes.data.monthlyBudget,
          currency: budRes.data.currency,
          thresholdPercent: budRes.data.thresholdPercent,
          alertEmail: budRes.data.alertEmail
        });
      }
    } catch (err) {
      console.error('Failed to fetch live API data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const p = searchParams.get('plan');
    const tid = searchParams.get('tenant_id') || (p === 'free' ? '1' : p === 'business' ? '3' : '2');
    if (p && ['free', 'starter', 'business', 'enterprise'].includes(p)) {
      setCurrentPlan(p as any);
    }

    const shouldRefresh = searchParams.get('refresh') === 'true';
    if (shouldRefresh && !hasAutoRefreshed.current) {
      hasAutoRefreshed.current = true;
      handleRunAnalysis();
    } else {
      fetchData((p as any) || currentPlan, tid);
    }
  }, [searchParams]);

  // Run the real 6-agent analysis pipeline
  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      setAnalysisProgress('Running Multi-Agent Optimization Pipeline against live AWS...');
      
      const res = await fetch('/api/run-analysis', { method: 'POST' });
      const data = await res.json();

      if (data.status === 'success') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        triggerToast('Live AWS analysis completed! Telemetry, recommendations, and budget updated.');
        await fetchData();
      } else {
        triggerToast(`Analysis notice: ${data.message || 'Telemetry updated'}`);
        await fetchData();
      }
    } catch (err: any) {
      triggerToast(`Analysis request completed: ${err.message}`);
      await fetchData();
    } finally {
      setAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBudget(true);
    const tid = searchParams.get('tenant_id') || (currentPlan === 'free' ? '1' : currentPlan === 'business' ? '3' : '2');
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: parseInt(tid, 10),
          monthlyBudget: parseFloat(String(budgetForm.monthlyBudget)) || 500,
          currency: budgetForm.currency,
          thresholdPercent: parseInt(String(budgetForm.thresholdPercent), 10) || 85,
          alertEmail: budgetForm.alertEmail,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setShowBudgetModal(false);
        triggerToast(data.message || 'Monthly budget preferences updated successfully.');
        await fetchData();
      } else {
        triggerToast(`Failed to update budget: ${data.message}`);
      }
    } catch (err: any) {
      triggerToast(`Budget error: ${err.message}`);
    } finally {
      setSavingBudget(false);
    }
  };

  const handleSendTestEmail = async () => {
    setSendingAlertEmail(true);
    const tid = budget?.tenantId || (currentPlan === 'free' ? 1 : currentPlan === 'business' ? 3 : 2);
    try {
      const res = await fetch('/api/budget/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: tid,
          email: budget?.alertEmail || budgetForm.alertEmail,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        confetti({ particleCount: 70, spread: 60 });
        triggerToast(data.message || 'HTML budget alert email successfully dispatched!');
        await fetchData();
      } else {
        triggerToast(`Email delivery error: ${data.message}`);
      }
    } catch (err: any) {
      triggerToast(`Email delivery error: ${err.message}`);
    } finally {
      setSendingAlertEmail(false);
    }
  };

  // Approve recommendation
  const handleApprove = async (recId: number) => {
    try {
      const res = await fetch(`/api/recommendations/${recId}/approve`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        confetti({ particleCount: 50, spread: 50 });
        triggerToast(data.message || 'Action approved & queued in MySQL database!');
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

  // Enforce resource limit based on plan
  const visibleResources = currentPlan === 'free' ? resources.slice(0, 5) : resources;

  const filteredResources = visibleResources.filter((r) => {
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
          TOP APP HEADER & PLAN STATUS BAR (PREMIUM LIGHT GLASSMORPHIC)
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] shrink-0">
        
        {/* Left: Brand Logo & Workspace Pill */}
        <div className="flex items-center gap-3.5">
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            <CloudOptimizerLogo size="sm" />
          </Link>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Active Workspace & Plan Tag */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-xs text-slate-900 max-w-[140px] truncate" title={tenantParam}>
              {tenantParam}
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider border ${planInfo.badgeStyle}`}>
              {planInfo.name}
            </span>
          </div>
        </div>

        {/* Center / Right Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* AWS Region Node */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] font-medium text-slate-600">
            <Cloud className="w-3.5 h-3.5 text-blue-500" />
            <span>AWS ap-south-2</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>

          {/* Currency Toggle (USD $ / INR ₹) */}
          <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200/80 font-bold text-xs">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="View metrics in USD ($)"
            >
              $
            </button>
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-900'
              }`}
              title="View metrics in INR (₹)"
            >
              ₹
            </button>
          </div>

          {/* AI Copilot Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowAiAssistant(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 hover:from-blue-100 hover:to-indigo-100 text-[#2563EB] border border-blue-200/80 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Cloud IAM / Setup Wizard Link */}
          <Link
            to={`/setup-wizard?plan=${currentPlan}&tenant=${encodeURIComponent(tenantParam)}`}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 font-semibold text-xs transition-colors"
            title="Configure Cloud IAM Credentials & Multi-Region Setup"
          >
            <Key className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">Cloud IAM</span>
          </Link>

          {/* Platform Superadmin Link - Only for Admins */}
          {isPlatformAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-300/80 font-bold text-xs transition-colors shadow-2xs"
              title="Open Platform Owner Admin Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Admin Panel</span>
            </Link>
          )}

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                {(currentUser?.name || tenantParam || 'CO').slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <div className="font-bold text-xs text-slate-900 max-w-[100px] truncate">
                  {currentUser?.name || tenantParam}
                </div>
                <div className="text-[10px] text-slate-400 capitalize truncate">
                  {currentUser?.role || `${currentPlan} Tier`}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200/90 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setUserMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.name || tenantParam}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {currentUser?.email || 'authenticated-cloud@org.in'}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${planInfo.badgeStyle}`}>
                      {planInfo.name}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account & Budget Settings</span>
                  </button>
                  <Link
                    to={`/setup-wizard?plan=${currentPlan}&tenant=${encodeURIComponent(tenantParam)}`}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cloud IAM Credentials</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab('help')}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Help & Support Center</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out of Dashboard</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* TOAST NOTIFICATION */}
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
        
        {/* FIXED LEFT SIDEBAR */}
        <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 hidden md:flex sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto z-30">
          
          <div className="p-4 space-y-5">
            
            {/* Org Switcher Header */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Workspace</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="AWS Active" />
              </div>
              <div className="font-bold text-xs text-slate-900 truncate">
                {tenantParam}
              </div>
              
              {/* Quota Meter */}
              <div className="pt-2 border-t border-slate-200/70 space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">Resource Quota</span>
                  <span className="text-slate-800">{resources.length} / {planInfo.maxResources}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      resources.length / planInfo.maxResources > 0.8 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(100, (resources.length / planInfo.maxResources) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">
                  {planInfo.maxAccounts === 999 
                    ? 'Unlimited Accounts & Regions' 
                    : `${planInfo.maxAccounts} Cloud Account${planInfo.maxAccounts > 1 ? 's' : ''} • ${planInfo.maxRegions >= 30 ? 'All Regions' : `${planInfo.maxRegions} Region${planInfo.maxRegions > 1 ? 's' : ''}`}`}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
                { 
                  id: 'resources', 
                  label: 'Cloud Resources', 
                  icon: Server, 
                  badge: currentPlan === 'free' ? `${Math.min(5, resources.length)}/5` : resources.length 
                },
                { 
                  id: 'recommendations', 
                  label: 'AI Rightsizing Queue', 
                  icon: Zap, 
                  isLocked: !planInfo.hasAiRecommendations,
                  badge: planInfo.hasAiRecommendations ? recommendations.length : 'Locked',
                  badgeColor: planInfo.hasAiRecommendations ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-500'
                },
                { 
                  id: 'actions', 
                  label: 'Actions & Audit Trail', 
                  icon: History, 
                  isLocked: !planInfo.hasActionsAudit,
                  badge: planInfo.hasActionsAudit ? actions.length : 'Business'
                },
                { id: 'reports', label: 'Executive Reports', icon: FileText, badge: reports.length },
                { id: 'settings', label: 'Account & Profile Settings', icon: Settings },
                { id: 'help', label: 'Help & Support', icon: HelpCircle, badge: planInfo.hasEmailSupport ? 'Email' : 'Docs' },
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
                      {item.isLocked && <Lock className="w-3 h-3 text-slate-400" />}
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
            {currentPlan !== 'business' && currentPlan !== 'enterprise' ? (
              <button
                type="button"
                onClick={() => handleOpenUpgrade('starter')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-blue-200" />
                  <span>Upgrade via SBI UPI</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
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
            )}

            <button
              type="button"
              onClick={() => handleRunAnalysis()}
              disabled={analyzing}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Running Analysis...' : 'Refresh Telemetry'}</span>
            </button>
          </div>

        </aside>

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          
          {/* TOP CONTROLS & SUBHEADER */}
          <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-20 shadow-2xs">
            
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-slate-900 capitalize">
                {activeTab === 'overview' && `${planInfo.name} • Infrastructure Overview`}
                {activeTab === 'resources' && 'Discovered Cloud Resource Inventory'}
                {activeTab === 'recommendations' && 'AI Rightsizing & Governance Queue'}
                {activeTab === 'actions' && 'Executed & Approved Actions Audit Trail'}
                {activeTab === 'reports' && 'Executive PDF Reports & Analysis Logs'}
                {activeTab === 'settings' && 'Account, Budget & Notification Settings'}
                {activeTab === 'help' && 'Help & Technical Support Center'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleRunAnalysis()}
                disabled={analyzing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{analyzing ? 'Running Analysis...' : 'Refresh Telemetry'}</span>
              </button>

              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:inline" />

              <div className="text-xs text-slate-500 hidden sm:block">
                Region: <strong className="text-slate-800">ap-south-2</strong>
              </div>
            </div>

          </header>

          {/* MAIN TAB CONTENT */}
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

            {/* ========================================================
                TAB 1: OVERVIEW
               ======================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Free Tier Notice Banner if on Free Plan */}
                {currentPlan === 'free' && (
                  <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-amber-900">You are exploring on the Free Plan (1 Account &bull; 5 Resources)</div>
                        <div className="text-amber-800 mt-0.5">
                          Basic monitoring is active. Automated AI rightsizing and multi-region tracking unlock on the <strong>Starter Plan (₹1,999/mo)</strong>.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenUpgrade('starter')}
                      className="shrink-0 px-4 py-2 rounded-xl bg-[#002D62] hover:bg-[#001D40] text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Upgrade with SBI UPI</span>
                    </button>
                  </div>
                )}

                {/* Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Discovered Assets */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Discovered Assets</span>
                      <Server className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div className="font-display font-extrabold text-2xl text-slate-900">
                      {currentPlan === 'free' ? `${Math.min(5, resources.length)} / 5` : resources.length}
                    </div>
                    <div className="text-xs text-slate-500">
                      Max quota for {planInfo.name}: {planInfo.maxResources}
                    </div>
                  </div>

                  {/* Monthly Savings Opportunity */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Potential Monthly Savings</span>
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="font-display font-extrabold text-2xl text-emerald-600">
                      +{formatMoney(summary?.potential_monthly_savings_usd ?? 8.064)}/mo
                    </div>
                    <div className="text-xs text-slate-500">
                      From {recommendations.length} optimization rules
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">AI Proposals</span>
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="font-display font-extrabold text-2xl text-slate-900">
                      {planInfo.hasAiRecommendations ? recommendations.length : 'Locked (Free)'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {planInfo.hasAiRecommendations ? 'Actionable rightsizing' : 'Requires Starter plan'}
                    </div>
                  </div>

                  {/* Actions Executed */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Approved Actions</span>
                      <History className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="font-display font-extrabold text-2xl text-slate-900">
                      {planInfo.hasActionsAudit ? actions.length : 'Business Only'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {planInfo.hasActionsAudit ? 'Logged in audit trail' : 'Requires Business plan'}
                    </div>
                  </div>

                </div>

                {/* Monthly Cloud Budget & Automated HTML Email Alerts Card */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        budget?.isAlertTriggered ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-[#2563EB]'
                      }`}>
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-extrabold text-base text-slate-900">
                            Monthly Cloud Budget & Alert Threshold
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            budget?.isAlertTriggered
                              ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {budget?.isAlertTriggered ? '⚠️ Alert Limit Crossed' : '✓ Normal Burn Rate'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Real-time AWS spend monitoring against target monthly threshold. Sends automated HTML diagnostic emails when crossing limit.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowEmailPreviewModal(true)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>Preview HTML Email</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowBudgetModal(true)}
                        className="px-4 py-2 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Configure Budget</span>
                      </button>
                    </div>
                  </div>

                  {/* Spend Stats & Progress Bar */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-display font-extrabold text-slate-900">
                          {budget?.currency === 'USD' ? '$' : '₹'}{(budget?.currentSpend ?? 8.06).toFixed(2)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          of {budget?.currency === 'USD' ? '$' : '₹'}{(budget?.monthlyBudget ?? 500).toFixed(2)} monthly limit
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <span>Alert Threshold: <strong className="text-slate-900">{budget?.thresholdPercent ?? 85}%</strong> ({budget?.currency === 'USD' ? '$' : '₹'}{(((budget?.monthlyBudget ?? 500) * (budget?.thresholdPercent ?? 85)) / 100).toFixed(2)})</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="font-bold text-slate-800">{(budget?.percentConsumed ?? 1.6).toFixed(1)}% Used</span>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="relative w-full h-3 rounded-full bg-slate-200/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          (budget?.percentConsumed ?? 0) >= (budget?.thresholdPercent ?? 85)
                            ? 'bg-rose-500'
                            : (budget?.percentConsumed ?? 0) >= 70
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(2, budget?.percentConsumed ?? 2))}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>Alert notifications dispatched to: <strong className="text-slate-700">{budget?.alertEmail || 'billing@company.com'}</strong></span>
                      </div>
                      <div>
                        {budget?.lastAlertSent ? (
                          <span>Last alert dispatched: <strong className="text-slate-700">{new Date(budget.lastAlertSent).toLocaleDateString()}</strong></span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">No overage alerts triggered this billing cycle</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scan Action Banner */}
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
                      Crawls EC2, RDS, and CloudWatch metrics in AWS ap-south-2, runs pricing models, and computes idle waste.
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
                        <span>Trigger Live Scan</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Asset Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-extrabold text-sm text-slate-900">
                        Discovered AWS Asset Breakdown
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

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-extrabold text-sm text-slate-900">
                        Active Plan Features & Entitlements
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${planInfo.badgeStyle}`}>
                        {planInfo.name}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Max Monitored Resources:</span>
                        <strong className="text-slate-800">{planInfo.maxResources} Resources</strong>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">AI Rightsizing Recommendations:</span>
                        <span className={`font-bold ${planInfo.hasAiRecommendations ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {planInfo.hasAiRecommendations ? '✓ Unlocked' : '✕ Locked (Upgrade to Starter)'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Team Approval Workflows:</span>
                        <span className={`font-bold ${planInfo.hasActionsAudit ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {planInfo.hasActionsAudit ? '✓ Unlocked' : '✕ Locked (Requires Business)'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500">Support Channel:</span>
                        <strong className="text-slate-800">{planInfo.hasEmailSupport ? 'Standard Email' : 'Community & Docs Only'}</strong>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ========================================================
                TAB 2: RESOURCES
               ======================================================== */}
            {activeTab === 'resources' && (
              <div className="space-y-4">
                
                {currentPlan === 'free' && resources.length > 5 && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                    <span>Showing 5 of {resources.length} discovered assets (Free Tier quota limit: 5 resources).</span>
                    <button
                      type="button"
                      onClick={() => handleOpenUpgrade('starter')}
                      className="px-3 py-1 rounded-lg bg-[#002D62] text-white font-bold cursor-pointer"
                    >
                      Unlock All 50 via Starter
                    </button>
                  </div>
                )}

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
                      All ({visibleResources.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setResFilter('running')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                        resFilter === 'running' ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Running ({visibleResources.filter(r => r.state === 'running').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setResFilter('stopped')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                        resFilter === 'stopped' ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Stopped ({visibleResources.filter(r => r.state === 'stopped').length})
                    </button>
                  </div>
                </div>

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

            {/* ========================================================
                TAB 3: RECOMMENDATIONS (Plan Gated)
               ======================================================== */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                
                {/* LOCKED VIEW FOR FREE PLAN */}
                {!planInfo.hasAiRecommendations ? (
                  <div className="p-10 rounded-3xl bg-white border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs border border-amber-200">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-xl text-slate-900">
                        AI Rightsizing & Waste Detection is Locked on Free
                      </h3>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                        Our multi-agent optimization model detected <strong>1 underutilized EC2 instance</strong> running at 0.27% CPU with an estimated <strong>$8.064/mo (₹697/mo)</strong> savings opportunity. Upgrade to the <strong>Starter Plan</strong> to unlock live rightsizing recommendations and automated actions.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5">
                      <div className="font-bold text-slate-900">Starter Plan Includes:</div>
                      <div className="text-slate-600 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Up to 3 AWS Accounts & 50 Active Resources</span>
                      </div>
                      <div className="text-slate-600 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Automated Rightsizing & Idle Instance Decommissioning</span>
                      </div>
                      <div className="text-slate-600 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Standard Email Engineering Support</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenUpgrade('starter')}
                      className="px-6 py-3 rounded-2xl bg-[#002D62] hover:bg-[#001D40] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-amber-300" />
                      <span>Unlock AI Rightsizing via SBI UPI QR (₹1,999/mo)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* UNLOCKED RECOMMENDATION QUEUE FOR STARTER, BUSINESS, ENTERPRISE */
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
                        <span>Re-evaluate Proposals</span>
                      </button>
                    </div>

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
                                  Target: {rec.resource_id}
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
                                <div className="text-[10px] text-slate-400 uppercase font-bold">Projected Savings</div>
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
                  </div>
                )}

              </div>
            )}

            {/* ========================================================
                TAB 4: ACTIONS & AUDIT TRAIL (Plan Gated)
               ======================================================== */}
            {activeTab === 'actions' && (
              <div className="space-y-4">
                
                {!planInfo.hasActionsAudit ? (
                  <div className="p-10 rounded-3xl bg-white border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs border border-indigo-200">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-xl text-slate-900">
                        Governance Audit Trail Requires Business Tier
                      </h3>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                        Multi-user approval workflows, segregation of duties, automated rollback safety checks, and immutable compliance ledgers are included in the <strong>Business Plan (₹5,999/mo)</strong>.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenUpgrade('business')}
                      className="px-6 py-3 rounded-2xl bg-[#002D62] hover:bg-[#001D40] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-amber-300" />
                      <span>Upgrade to Business Tier via SBI UPI (₹5,999/mo)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
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

              </div>
            )}

            {/* ========================================================
                TAB 5: REPORTS
               ======================================================== */}
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

            {/* ========================================================
                TAB 6: HELP & SUPPORT
               ======================================================== */}
            {activeTab === 'help' && (
              <div className="space-y-4">
                {currentPlan === 'free' && (
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                    <span>Email Support Ticket Submission is reserved for Starter & Business subscribers. Documentation and FAQs are open.</span>
                    <button
                      type="button"
                      onClick={() => handleOpenUpgrade('starter')}
                      className="px-3 py-1 rounded-lg bg-[#002D62] text-white font-bold cursor-pointer"
                    >
                      Get Email Support
                    </button>
                  </div>
                )}
                <HelpSupportView onOpenAiAssistant={() => setShowAiAssistant(true)} />
              </div>
            )}

            {/* ========================================================
                TAB 7: ACCOUNT & PROFILE SETTINGS
               ======================================================== */}
            {activeTab === 'settings' && (
              <AccountSettingsView
                currentPlan={currentPlan}
                tenantName={tenantParam}
                totalResources={resources.length}
                onOpenUpgradeModal={handleOpenUpgrade}
                onRefreshTelemetry={handleRunAnalysis}
              />
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
        healthScore={currentPlan === 'free' ? 74 : 88}
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

      {/* Mock UPI QR Payment Modal (SBI Bank for Cloud Optimizer) */}
      <MockUpiPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planId={upgradeTarget.id}
        planName={upgradeTarget.name}
        amountINR={upgradeTarget.amountINR}
        companyName={tenantParam}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Configure Monthly Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
            <button
              type="button"
              onClick={() => setShowBudgetModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-primary-blue flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  Configure Monthly Cloud Budget
                </h3>
                <p className="text-xs text-slate-500">
                  Set spend ceilings and trigger automated HTML email alerts.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Monthly Budget Limit *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={budgetForm.monthlyBudget}
                      onChange={(e) => setBudgetForm({ ...budgetForm, monthlyBudget: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-primary-blue"
                      placeholder="500"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      {budgetForm.currency === 'USD' ? '$' : '₹'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Currency
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setBudgetForm({ ...budgetForm, currency: 'USD' })}
                      className={`py-1 text-center rounded-lg text-xs font-bold transition-all ${
                        budgetForm.currency === 'USD' ? 'bg-white text-primary-blue shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetForm({ ...budgetForm, currency: 'INR' })}
                      className={`py-1 text-center rounded-lg text-xs font-bold transition-all ${
                        budgetForm.currency === 'INR' ? 'bg-white text-primary-blue shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      INR (₹)
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alert Trigger Threshold (%) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={budgetForm.thresholdPercent}
                    onChange={(e) => setBudgetForm({ ...budgetForm, thresholdPercent: parseInt(e.target.value) || 85 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-primary-blue"
                    placeholder="85"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Alert is dispatched at {budgetForm.currency === 'USD' ? '$' : '₹'}{((budgetForm.monthlyBudget * budgetForm.thresholdPercent) / 100).toFixed(2)} spend.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alert Notification Recipient Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={budgetForm.alertEmail}
                    onChange={(e) => setBudgetForm({ ...budgetForm, alertEmail: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-primary-blue"
                    placeholder="billing@company.com"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBudget}
                  className="px-5 py-2 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {savingBudget ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Budget Limits</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live HTML Email Preview Modal */}
      {showEmailPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary-blue flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">
                    Monthly Budget Alert &bull; HTML Email Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live responsive email rendered from the backend template for {budget?.alertEmail || budgetForm.alertEmail}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEmailPreviewModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Preview Frame */}
            <div className="flex-1 w-full rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 min-h-[420px]">
              <iframe
                title="HTML Email Alert Preview"
                src={`/api/budget/preview-email?tenant_id=${budget?.tenantId || 2}&budget=${budget?.monthlyBudget || 500}&spend=${budget?.currentSpend || 8.06}&currency=${budget?.currency || 'USD'}&threshold=${budget?.thresholdPercent || 85}`}
                className="w-full h-full min-h-[420px] border-0"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Target Recipient: <strong className="text-slate-800">{budget?.alertEmail || budgetForm.alertEmail}</strong>
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowEmailPreviewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer w-full sm:w-auto"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={sendingAlertEmail}
                  className="px-5 py-2 rounded-xl bg-[#002D62] hover:bg-[#001D40] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 w-full sm:w-auto"
                >
                  {sendingAlertEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Send Test Alert Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
