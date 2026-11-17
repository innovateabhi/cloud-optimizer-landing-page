import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  CreditCard, 
  Activity, 
  Server, 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Power, 
  RefreshCw, 
  Download, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Zap,
  Sliders,
  Check,
  X,
  ExternalLink,
  Lock,
  Cpu,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';

interface CompanyTenant {
  id: string;
  name: string;
  ownerEmail: string;
  plan: 'free' | 'starter' | 'business' | 'enterprise';
  status: 'active' | 'trialing' | 'suspended';
  cloudAccounts: number;
  resourcesCount: number;
  monthlySpendINR: number;
  joinedDate: string;
  lastActive: string;
}

interface PaymentTransaction {
  transactionId: string;
  companyName: string;
  planName: string;
  amountINR: number;
  utrNumber: string;
  bankName: string;
  timestamp: string;
  status: 'Verified';
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tenants' | 'payments' | 'telemetry' | 'limits'>('tenants');
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'starter' | 'business' | 'enterprise'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal State for Changing Tenant Plan
  const [editingTenant, setEditingTenant] = useState<CompanyTenant | null>(null);
  const [newSelectedPlan, setNewSelectedPlan] = useState<'free' | 'starter' | 'business' | 'enterprise'>('starter');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Initial Registered Companies (Platform Seed Data)
  const [tenants, setTenants] = useState<CompanyTenant[]>([
    {
      id: 'org-001',
      name: 'TechNova Solutions',
      ownerEmail: 'rahul.s@technova.io',
      plan: 'starter',
      status: 'active',
      cloudAccounts: 3,
      resourcesCount: 42,
      monthlySpendINR: 1999,
      joinedDate: '2026-11-10',
      lastActive: '10 mins ago',
    },
    {
      id: 'org-002',
      name: 'GlobalScale Logistics',
      ownerEmail: 'finance@globalscale.com',
      plan: 'business',
      status: 'active',
      cloudAccounts: 12,
      resourcesCount: 384,
      monthlySpendINR: 5999,
      joinedDate: '2026-11-04',
      lastActive: 'Just now',
    },
    {
      id: 'org-003',
      name: 'Acme Cloud Labs',
      ownerEmail: 'dev@acmelabs.tech',
      plan: 'free',
      status: 'active',
      cloudAccounts: 1,
      resourcesCount: 5,
      monthlySpendINR: 0,
      joinedDate: '2026-11-15',
      lastActive: '2 hours ago',
    },
    {
      id: 'org-004',
      name: 'FinVantage Capital',
      ownerEmail: 'cto@finvantage.in',
      plan: 'business',
      status: 'active',
      cloudAccounts: 8,
      resourcesCount: 290,
      monthlySpendINR: 5999,
      joinedDate: '2026-10-28',
      lastActive: 'Yesterday',
    },
    {
      id: 'org-005',
      name: 'RideEase Mobility',
      ownerEmail: 'infra@rideease.com',
      plan: 'starter',
      status: 'trialing',
      cloudAccounts: 2,
      resourcesCount: 28,
      monthlySpendINR: 1999,
      joinedDate: '2026-11-14',
      lastActive: '5 hours ago',
    },
  ]);

  // Load Transactions from LocalStorage + Default Seeds
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cloud_optimizer_transactions') || '[]');
      const defaultTxs: PaymentTransaction[] = [
        {
          transactionId: 'TXN-SBI-892144',
          companyName: 'TechNova Solutions',
          planName: 'Starter Plan (Monthly)',
          amountINR: 1999,
          utrNumber: 'UPI-SBI-432190887123',
          bankName: 'State Bank of India',
          timestamp: '2026-11-17 19:42:10',
          status: 'Verified',
        },
        {
          transactionId: 'TXN-SBI-773192',
          companyName: 'GlobalScale Logistics',
          planName: 'Business Plan (Monthly)',
          amountINR: 5999,
          utrNumber: 'UPI-SBI-984321009182',
          bankName: 'State Bank of India',
          timestamp: '2026-11-17 14:15:33',
          status: 'Verified',
        },
      ];
      setTransactions([...stored, ...defaultTxs]);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute Platform Totals
  const totalMRR = tenants.reduce((acc, t) => acc + (t.status === 'active' ? t.monthlySpendINR : 0), 0);
  const totalResources = tenants.reduce((acc, t) => acc + t.resourcesCount, 0);
  const activeTenantsCount = tenants.filter(t => t.status === 'active').length;

  // Change Plan Handler
  const handleSavePlanChange = () => {
    if (!editingTenant) return;
    const priceMap = { free: 0, starter: 1999, business: 5999, enterprise: 19999 };
    setTenants(prev => prev.map(t => {
      if (t.id === editingTenant.id) {
        return {
          ...t,
          plan: newSelectedPlan,
          monthlySpendINR: priceMap[newSelectedPlan],
        };
      }
      return t;
    }));
    triggerToast(`Updated ${editingTenant.name} to ${newSelectedPlan.toUpperCase()} plan.`);
    setEditingTenant(null);
  };

  // Toggle Suspend Status
  const handleToggleStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'active' ? 'suspended' : 'active';
        triggerToast(`${t.name} status set to ${nextStatus.toUpperCase()}`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Impersonate / View as Customer
  const handleImpersonate = (tenant: CompanyTenant) => {
    // Navigate to tenant dashboard with their specific plan
    navigate(`/dashboard?plan=${tenant.plan}&tenant=${encodeURIComponent(tenant.name)}`);
  };

  const filteredTenants = tenants.filter(t => {
    const matchesPlan = planFilter === 'all' || t.plan === planFilter;
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlan && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ========================================================
          ADMIN TOP CONTROLS & PLATFORM STATUS BAR
         ======================================================== */}
      <div className="sticky top-0 z-50 bg-[#0B1120] text-white px-4 sm:px-6 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0 shadow-md">
        
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm tracking-tight text-white">
                Cloud<span className="text-amber-400">Optimizer</span>
              </span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold uppercase">
                Platform Admin
              </span>
            </div>
          </Link>

          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 hidden sm:inline" />
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] hidden md:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MySQL 8.x (127.0.0.1:3306) Connected &bull; AWS ap-south-2 Multi-Tenant</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard?plan=business"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Open Customer Dashboard</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 font-semibold text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Site</span>
          </Link>
        </div>

      </div>

      {/* TOAST ALERT */}
      {toastMsg && (
        <div className="fixed top-14 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          ADMIN WORKSPACE CONTAINER
         ======================================================== */}
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
        
        {/* KPI OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Tenants</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-display font-extrabold text-3xl text-slate-900">
              {tenants.length}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{activeTenantsCount} Active Organizations</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Platform MRR (INR)</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-display font-extrabold text-3xl text-emerald-600">
              ₹{totalMRR.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500">
              Annualized ARR: ₹{(totalMRR * 12).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Tracked Cloud Assets</span>
              <Server className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="font-display font-extrabold text-3xl text-slate-900">
              {totalResources}
            </div>
            <div className="text-xs text-slate-500">
              Across EC2, RDS, and S3 resources
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">UPI SBI Gateway</span>
              <CreditCard className="w-4 h-4 text-[#002D62]" />
            </div>
            <div className="font-display font-extrabold text-3xl text-slate-900">
              {transactions.length}
            </div>
            <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Mock Settlement Verified</span>
            </div>
          </div>

        </div>

        {/* ADMIN NAVIGATION TABS */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'tenants', label: 'Tenants & Customers', count: tenants.length },
              { id: 'payments', label: 'UPI Transactions Ledger', count: transactions.length },
              { id: 'telemetry', label: 'Multi-Agent Health' },
              { id: 'limits', label: 'Plan Quotas Configuration' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#0B1120] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Cloud Optimizer Superadmin Mode
          </div>
        </div>

        {/* TAB 1: TENANTS & CUSTOMERS MANAGEMENT */}
        {activeTab === 'tenants' && (
          <div className="space-y-4">
            
            {/* Search & Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search company name, owner email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                {(['all', 'free', 'starter', 'business', 'enterprise'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlanFilter(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      planFilter === p
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Tenants Table */}
            <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Organization Name</th>
                    <th className="p-4">Owner Work Email</th>
                    <th className="p-4">Active Plan</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Accounts</th>
                    <th className="p-4">Resources</th>
                    <th className="p-4">MRR</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTenants.map(tenant => (
                    <tr key={tenant.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        {tenant.name}
                      </td>
                      <td className="p-4 text-slate-600 font-mono text-[11px]">
                        {tenant.ownerEmail}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          tenant.plan === 'free'
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : tenant.plan === 'starter'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : tenant.plan === 'business'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tenant.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : tenant.status === 'trialing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{tenant.status.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {tenant.cloudAccounts}
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {tenant.resourcesCount}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">
                        ₹{tenant.monthlySpendINR.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Impersonate Button */}
                          <button
                            type="button"
                            onClick={() => handleImpersonate(tenant)}
                            title="View customer dashboard"
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Plan Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTenant(tenant);
                              setNewSelectedPlan(tenant.plan);
                            }}
                            title="Change plan"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Suspend/Activate Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(tenant.id)}
                            title={tenant.status === 'active' ? 'Suspend tenant' : 'Activate tenant'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              tenant.status === 'active' 
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: UPI PAYMENTS TRANSACTION LEDGER */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  SBI UPI Mock Payment Settlements
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time record of all UPI subscriptions settled to Merchant: cloudoptimizer@sbi
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#002D62] text-xs font-bold">
                Bank: State Bank of India
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Customer Company</th>
                    <th className="p-4">Plan Activated</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Bank & Payee UPI</th>
                    <th className="p-4">12-Digit UTR Ref</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(tx => (
                    <tr key={tx.transactionId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {tx.transactionId}
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {tx.companyName}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700">
                          {tx.planName}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-emerald-600 text-sm">
                        ₹{tx.amountINR.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-slate-500 text-[11px]">
                        SBI &bull; cloudoptimizer@sbi
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-700">
                        {tx.utrNumber}
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {tx.timestamp}
                      </td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: SYSTEM TELEMETRY & MULTI-AGENT HEALTH */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {[
                { name: 'Resource Discovery Agent', role: 'Crawls EC2, RDS, S3 in AWS ap-south-2', status: 'HEALTHY', latency: '24ms' },
                { name: 'Monitoring Agent', role: 'Fetches CloudWatch CPU & IOPS metrics', status: 'HEALTHY', latency: '38ms' },
                { name: 'Cost Engine Agent', role: 'Computes AWS hourly run rates & forecasts', status: 'HEALTHY', latency: '18ms' },
                { name: 'Optimization Agent', role: 'Evaluates waste, idle assets, & Graviton rules', status: 'HEALTHY', latency: '32ms' },
                { name: 'Risk Assessment Agent', role: 'Scores Low, Medium, High deployment risks', status: 'HEALTHY', latency: '12ms' },
                { name: 'Recommendation Agent', role: 'Generates LLM & rule proposals for tenants', status: 'HEALTHY', latency: '45ms' },
              ].map(agent => (
                <div key={agent.name} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900">{agent.name}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{agent.role}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Average Latency</span>
                    <span className="text-slate-800 font-bold">{agent.latency}</span>
                  </div>
                </div>
              ))}

            </div>

            {/* Infrastructure Health Box */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 border border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h4 className="font-display font-extrabold text-sm text-white">
                  Database & Cloud Connector Health
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Active Engine</span>
                  <div className="font-bold text-white mt-0.5">MySQL 8.x (InnoDB)</div>
                  <div className="text-[10px] text-emerald-400 mt-1">Host: 127.0.0.1:3306</div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">AWS Connector</span>
                  <div className="font-bold text-white mt-0.5">Boto3 STS AssumeRole</div>
                  <div className="text-[10px] text-emerald-400 mt-1">Region: ap-south-2</div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Mock UPI Switch</span>
                  <div className="font-bold text-white mt-0.5">State Bank of India</div>
                  <div className="text-[10px] text-emerald-400 mt-1">Status: Active & Verified</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PLAN QUOTAS CONFIGURATION */}
        {activeTab === 'limits' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  Platform Pricing Plan Quotas & Feature Entitlements
                </h3>
                <p className="text-xs text-slate-500">
                  Enforces resource limits, region coverage, and features across customer tiers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Free Plan Specs */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-extrabold text-sm text-slate-900">Free Tier</h4>
                  <span className="font-extrabold text-xs text-slate-700">₹0/mo</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Cloud Accounts:</span>
                    <strong className="text-slate-900">1 Account</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Regions Monitored:</span>
                    <strong className="text-slate-900">2 Active</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Max Resources:</span>
                    <strong className="text-slate-900">5 Resources</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>AI Recommendations:</span>
                    <span className="text-rose-500 font-bold">Locked</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Approval Workflows:</span>
                    <span className="text-rose-500 font-bold">Locked</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Support Level:</span>
                    <strong className="text-slate-900">Community Only</strong>
                  </div>
                </div>
              </div>

              {/* Starter Plan Specs */}
              <div className="p-5 rounded-3xl bg-blue-50/60 border border-blue-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-extrabold text-sm text-blue-900">Starter Tier</h4>
                  <span className="font-extrabold text-xs text-blue-700">₹1,999/mo</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span>Cloud Accounts:</span>
                    <strong className="text-slate-900">3 Accounts</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span>Regions Monitored:</span>
                    <strong className="text-slate-900">5 Active</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span>Max Resources:</span>
                    <strong className="text-slate-900">50 Resources</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span>AI Recommendations:</span>
                    <span className="text-emerald-600 font-bold">Enabled</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span>Approval Workflows:</span>
                    <span className="text-rose-500 font-bold">Locked</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Support Level:</span>
                    <strong className="text-slate-900">Standard Email</strong>
                  </div>
                </div>
              </div>

              {/* Business Plan Specs */}
              <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-extrabold text-sm text-indigo-900">Business Tier</h4>
                  <span className="font-extrabold text-xs text-indigo-700">₹5,999/mo</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-indigo-100">
                    <span>Cloud Accounts:</span>
                    <strong className="text-slate-900">10+ Accounts</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-indigo-100">
                    <span>Regions Monitored:</span>
                    <strong className="text-slate-900">All Regions</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-indigo-100">
                    <span>Max Resources:</span>
                    <strong className="text-slate-900">500 Resources</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-indigo-100">
                    <span>AI Recommendations:</span>
                    <span className="text-emerald-600 font-bold">Full Multi-Agent</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-indigo-100">
                    <span>Approval Workflows:</span>
                    <span className="text-emerald-600 font-bold">Enabled</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Support Level:</span>
                    <strong className="text-slate-900">Priority Dedicated</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ========================================================
          MODAL: EDIT TENANT PLAN
         ======================================================== */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-extrabold text-base text-slate-900">
                Modify Tenant Plan
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingTenant(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{editingTenant.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{editingTenant.ownerEmail}</div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-2">Select Target Plan:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['free', 'starter', 'business', 'enterprise'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewSelectedPlan(p)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        newSelectedPlan === p
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="uppercase text-[11px]">{p}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {p === 'free' ? '₹0/mo' : p === 'starter' ? '₹1,999/mo' : p === 'business' ? '₹5,999/mo' : 'Custom'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingTenant(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlanChange}
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
