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
  Database,
  UserCheck,
  KeyRound,
  Trash2,
  Play,
  Terminal,
  LogOut,
  Loader2,
  Sparkles,
  Cloud,
  UserPlus,
  Plus,
  Shield,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';

interface CompanyTenant {
  id: string;
  tenantId: number;
  name: string;
  ownerEmail: string;
  ownerName: string;
  plan: 'free' | 'starter' | 'business' | 'enterprise';
  status: 'active' | 'suspended';
  setupCompleted: boolean;
  resourcesCount: number;
  monthlySpendINR: number;
  joinedDate: string;
  lastActive: string;
}

interface PlatformUser {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'staff' | 'user';
  twoFactorEnabled: boolean;
  tenantName: string;
  tenantPlan: string;
  joinedDate: string;
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

interface SystemLog {
  runId: string;
  startedAt: string;
  completedAt: string;
  status: string;
  savingsUSD: number;
  details: string;
}

interface AdminOverviewData {
  tenantsTotal: number;
  tenantsActive: number;
  usersTotal: number;
  resourcesTotal: number;
  ec2Count: number;
  rdsCount: number;
  runningCount: number;
  totalSavingsUSD: number;
  totalMrrINR: number;
  totalArrINR: number;
  planBreakdown: Record<string, number>;
  agents: Array<{
    agent: string;
    status: string;
    target: string;
    activeWorkers: number;
  }>;
  awsConnection: {
    account: string;
    region: string;
    iamRole: string;
    boto3Connected: boolean;
  };
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tenants' | 'users' | 'payments' | 'telemetry' | 'logs' | 'limits'>('tenants');
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'starter' | 'business' | 'enterprise'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningGlobalScan, setRunningGlobalScan] = useState(false);

  // Platform Data State
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [tenants, setTenants] = useState<CompanyTenant[]>([]);
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  // Modals State
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateTenantModal, setShowCreateTenantModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<CompanyTenant | null>(null);
  const [newSelectedPlan, setNewSelectedPlan] = useState<'free' | 'starter' | 'business' | 'enterprise'>('starter');
  const [resettingUser, setResettingUser] = useState<PlatformUser | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('Admin@CloudOptimizer2026');

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    role: 'staff' as 'admin' | 'staff' | 'user',
    password: 'Admin@CloudOptimizer2026',
    tenantId: 4
  });
  const [creatingUser, setCreatingUser] = useState(false);

  // New Tenant Form State
  const [newTenantForm, setNewTenantForm] = useState({
    name: '',
    plan: 'starter' as 'free' | 'starter' | 'business' | 'enterprise',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: 'Admin@CloudOptimizer2026'
  });
  const [creatingTenant, setCreatingTenant] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch all real platform admin data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [overRes, tenRes, userRes, logRes] = await Promise.all([
        fetch('/api/admin/overview').then(r => r.json()).catch(() => null),
        fetch('/api/admin/tenants').then(r => r.json()).catch(() => null),
        fetch('/api/admin/users').then(r => r.json()).catch(() => null),
        fetch('/api/admin/system-logs').then(r => r.json()).catch(() => null),
      ]);

      if (overRes?.status === 'success') setOverview(overRes.data);
      if (tenRes?.status === 'success') setTenants(tenRes.data);
      if (userRes?.status === 'success') setUsers(userRes.data);
      if (logRes?.status === 'success') setSystemLogs(logRes.data);

      // Load Payment Transactions
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
        {
          transactionId: 'TXN-SBI-612490',
          companyName: 'Softrenix Technologies',
          planName: 'Starter Plan (Monthly)',
          amountINR: 1999,
          utrNumber: 'UPI-SBI-551299881023',
          bankName: 'State Bank of India',
          timestamp: '2026-11-17 23:55:00',
          status: 'Verified',
        }
      ];

      try {
        const stored = JSON.parse(localStorage.getItem('cloud_optimizer_transactions') || '[]');
        setTransactions([...stored, ...defaultTxs]);
      } catch {
        setTransactions(defaultTxs);
      }

    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Create Staff / Admin User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.fullName || !newUserForm.email) {
      triggerToast('Full name and email are required.');
      return;
    }
    setCreatingUser(true);
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (data.status === 'success') {
        confetti({ particleCount: 60, spread: 60 });
        triggerToast(data.message || 'Staff / Admin user created successfully.');
        setShowCreateUserModal(false);
        setNewUserForm({
          fullName: '',
          email: '',
          role: 'staff',
          password: 'Admin@CloudOptimizer2026',
          tenantId: 4
        });
        fetchAdminData();
      } else {
        triggerToast(`Failed: ${data.message}`);
      }
    } catch (err: any) {
      triggerToast(`User creation error: ${err.message}`);
    } finally {
      setCreatingUser(false);
    }
  };

  // Create New Customer Organization / Tenant
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantForm.name || !newTenantForm.ownerEmail) {
      triggerToast('Company name and owner email are required.');
      return;
    }
    setCreatingTenant(true);
    try {
      const res = await fetch('/api/admin/tenants/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTenantForm),
      });
      const data = await res.json();
      if (data.status === 'success') {
        confetti({ particleCount: 70, spread: 60 });
        triggerToast(data.message || 'Organization registered successfully.');
        setShowCreateTenantModal(false);
        setNewTenantForm({
          name: '',
          plan: 'starter',
          ownerName: '',
          ownerEmail: '',
          ownerPassword: 'Admin@CloudOptimizer2026'
        });
        fetchAdminData();
      } else {
        triggerToast(`Failed: ${data.message}`);
      }
    } catch (err: any) {
      triggerToast(`Organization creation error: ${err.message}`);
    } finally {
      setCreatingTenant(false);
    }
  };

  // Update Subscription Plan in MySQL
  const handleSavePlanChange = async () => {
    if (!editingTenant) return;
    try {
      const res = await fetch(`/api/admin/tenants/${editingTenant.tenantId}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newSelectedPlan }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        confetti({ particleCount: 50, spread: 50 });
        triggerToast(data.message || `Plan changed to ${newSelectedPlan.toUpperCase()}`);
        setEditingTenant(null);
        fetchAdminData();
      } else {
        triggerToast(`Update failed: ${data.message}`);
      }
    } catch (err: any) {
      triggerToast(`Plan change error: ${err.message}`);
    }
  };

  // Toggle Suspend / Active in MySQL
  const handleToggleStatus = async (tenantId: number, currentStatus: string) => {
    try {
      const targetStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const res = await fetch(`/api/admin/tenants/${tenantId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(data.message);
        fetchAdminData();
      }
    } catch (err: any) {
      triggerToast(`Status update error: ${err.message}`);
    }
  };

  // Delete Tenant
  const handleDeleteTenant = async (tenantId: number, tenantName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete organization "${tenantName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/tenants/${tenantId}/delete`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Organization ${tenantName} removed.`);
        fetchAdminData();
      } else {
        triggerToast(`Delete error: ${data.message}`);
      }
    } catch (err: any) {
      triggerToast(`Delete error: ${err.message}`);
    }
  };

  // Elevate / Demote User Role
  const handleToggleUserRole = async (userId: number, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'staff' : currentRole === 'staff' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(data.message);
        fetchAdminData();
      }
    } catch (err: any) {
      triggerToast(`Role update error: ${err.message}`);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: number, email: string) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/delete`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(data.message);
        fetchAdminData();
      } else {
        triggerToast(`Delete error: ${data.message}`);
      }
    } catch (err: any) {
      triggerToast(`Delete error: ${err.message}`);
    }
  };

  // Reset Password for User
  const handleResetPassword = async () => {
    if (!resettingUser) return;
    try {
      const res = await fetch(`/api/admin/users/${resettingUser.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPasswordInput }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Password reset successfully for ${resettingUser.email}`);
        setResettingUser(null);
      } else {
        triggerToast(`Password reset failed: ${data.message}`);
      }
    } catch (err: any) {
      triggerToast(`Password reset error: ${err.message}`);
    }
  };

  // Trigger Global Multi-Agent Optimization Scan
  const handleRunGlobalScan = async () => {
    setRunningGlobalScan(true);
    try {
      const res = await fetch('/api/admin/run-global-discovery', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        triggerToast('Global Multi-Agent Discovery completed across all AWS resources!');
        fetchAdminData();
      } else {
        triggerToast(`Scan notice: ${data.message}`);
      }
    } catch (err: any) {
      triggerToast(`Global scan error: ${err.message}`);
    } finally {
      setRunningGlobalScan(false);
    }
  };

  // Impersonate / Jump to Customer Dashboard
  const handleImpersonateTenant = (t: CompanyTenant) => {
    localStorage.setItem('cloud_optimizer_plan', t.plan);
    localStorage.setItem('cloud_optimizer_tenant', t.name);
    localStorage.setItem('cloud_optimizer_tenant_id', String(t.tenantId));
    navigate(`/dashboard?plan=${t.plan}&tenant=${encodeURIComponent(t.name)}&tenant_id=${t.tenantId}`);
  };

  // Logout Admin
  const handleLogout = () => {
    localStorage.removeItem('cloud_optimizer_token');
    localStorage.removeItem('cloud_optimizer_user');
    navigate('/login');
  };

  // Filtered Tenants
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'all' || t.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ========================================================
          LIGHT-THEMED TOP BAR FOR PLATFORM OWNER
         ======================================================== */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs shrink-0">
        
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
            <CloudOptimizerLogo size="sm" />
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 text-[10px] font-black uppercase tracking-wider">
              Platform Superadmin
            </span>
          </Link>

          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:inline" />
          
          <div className="items-center gap-2 text-slate-500 font-medium text-[11px] hidden lg:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>MySQL 8.x Live &bull; AWS ap-south-2 Multi-Tenant Cluster</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchAdminData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary-blue ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <Link
            to="/dashboard?plan=business"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Customer View</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </header>

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
      <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
        
        {/* EXECUTIVE FOUNDER BANNER (LIGHT SAAS STYLE) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Cloud Optimizer Enterprise Control Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
              Welcome back, Abhinandan
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Managing <strong>{overview?.tenantsTotal ?? 5} client organizations</strong>, 
              <strong> {users.length} enrolled users & platform staff</strong>, and 
              <strong> {overview?.resourcesTotal ?? 7} live AWS resources</strong> in region ap-south-2.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowCreateUserModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-primary-blue" />
              <span>+ Add Admin / Staff</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCreateTenantModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>+ Register Company</span>
            </button>

            <button
              type="button"
              onClick={handleRunGlobalScan}
              disabled={runningGlobalScan}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-60"
            >
              {runningGlobalScan ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning All Tenants...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Run Global Discovery</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* TOP 4 KPI CARDS (LIGHT THEMED) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Tenants */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Organizations</span>
              <Building2 className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="font-display font-extrabold text-3xl text-slate-900">
              {overview?.tenantsTotal ?? tenants.length}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{overview?.tenantsActive ?? tenants.length} Active Accounts</span>
            </div>
          </div>

          {/* Platform MRR (INR) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Platform MRR</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-display font-extrabold text-3xl text-emerald-600">
              ₹{(overview?.totalMrrINR ?? 29996).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500">
              Annualized ARR: ₹{((overview?.totalMrrINR ?? 29996) * 12).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Tracked Cloud Assets */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Tracked Cloud Assets</span>
              <Server className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="font-display font-extrabold text-3xl text-slate-900">
              {overview?.resourcesTotal ?? 7}
            </div>
            <div className="text-xs text-slate-500">
              {overview?.ec2Count ?? 6} EC2 &bull; {overview?.rdsCount ?? 1} RDS (ap-south-2)
            </div>
          </div>

          {/* Customer Savings Delivered */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Client Savings Identified</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-display font-extrabold text-3xl text-slate-900">
              +${overview?.totalSavingsUSD ?? 8.06}/mo
            </div>
            <div className="text-xs text-slate-500">
              ₹{Math.round((overview?.totalSavingsUSD ?? 8.06) * 86.5).toLocaleString('en-IN')} / month waste
            </div>
          </div>

        </div>

        {/* NAVIGATION TABS (LIGHT THEMED) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            {[
              { id: 'tenants', label: 'Tenants & Companies', count: tenants.length },
              { id: 'users', label: 'Platform Users & Staff', count: users.length },
              { id: 'payments', label: 'UPI Financial Ledger', count: transactions.length },
              { id: 'telemetry', label: 'Multi-Agent & AWS Boto3' },
              { id: 'logs', label: 'System Audit Logs', count: systemLogs.length },
              { id: 'limits', label: 'Plan Pricing Matrix' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
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

          <div className="text-[11px] text-slate-500 hidden sm:block font-medium">
            Superadmin Access Mode
          </div>
        </div>

        {/* ========================================================
            TAB 1: TENANTS & CUSTOMERS MANAGEMENT
           ======================================================== */}
        {activeTab === 'tenants' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Search & Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search company name, owner email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-blue shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Plan:</span>
                {(['all', 'free', 'starter', 'business', 'enterprise'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlanFilter(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      planFilter === p
                        ? 'bg-primary-blue text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowCreateTenantModal(true)}
                  className="ml-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Company</span>
                </button>
              </div>
            </div>

            {/* Tenants Data Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-4">Org ID / Company Name</th>
                      <th className="p-4">Owner / Contact</th>
                      <th className="p-4">Plan Tier</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Tracked Assets</th>
                      <th className="p-4">Monthly Rev</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTenants.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          No organizations found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTenants.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                          
                          <td className="p-4">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{t.name}</span>
                              {t.tenantId === 4 && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                  Owner
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-slate-400">{t.id}</span>
                          </td>

                          <td className="p-4">
                            <div className="text-slate-800 font-semibold">{t.ownerName}</div>
                            <div className="font-mono text-[11px] text-slate-500">{t.ownerEmail}</div>
                          </td>

                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
                              t.plan === 'free' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                              t.plan === 'starter' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              t.plan === 'business' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              'bg-amber-50 text-amber-800 border-amber-200 font-black'
                            }`}>
                              {t.plan}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              t.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{t.status}</span>
                            </span>
                          </td>

                          <td className="p-4 font-mono font-bold text-slate-700">
                            {t.resourcesCount} resources
                          </td>

                          <td className="p-4 font-bold text-slate-900">
                            ₹{t.monthlySpendINR.toLocaleString('en-IN')}
                          </td>

                          <td className="p-4 text-slate-500 font-mono text-[11px]">
                            {t.joinedDate}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleImpersonateTenant(t)}
                                title="Open customer dashboard view"
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-primary-blue border border-blue-200 transition-all cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTenant(t);
                                  setNewSelectedPlan(t.plan);
                                }}
                                title="Change subscription plan"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(t.tenantId, t.status)}
                                title={t.status === 'active' ? 'Suspend Tenant' : 'Reactivate Tenant'}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  t.status === 'active'
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>

                              {t.tenantId > 3 && t.tenantId !== 4 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTenant(t.tenantId, t.name)}
                                  title="Delete Tenant"
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: PLATFORM USERS & STAFF MANAGEMENT
           ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">
                    Platform Staff & Customer Accounts
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage Superadmins, Support Staff, FinOps Analysts, and Tenant users.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Create Admin / Staff User</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-4">User Identity</th>
                      <th className="p-4">Organization</th>
                      <th className="p-4">Role Privileges</th>
                      <th className="p-4">2FA Status</th>
                      <th className="p-4">Registered Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{u.fullName}</span>
                            {(u.role === 'admin' || u.role === 'staff') && (
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                                u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                              }`}>
                                {u.role === 'admin' ? 'Superadmin' : 'Staff'}
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500">{u.email}</div>
                        </td>

                        <td className="p-4">
                          <div className="text-slate-800 font-semibold">{u.tenantName}</div>
                          <div className="text-[10px] text-slate-500 uppercase">{u.tenantPlan} plan</div>
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
                            u.role === 'admin'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 font-black'
                              : u.role === 'staff'
                              ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {u.role === 'admin' ? 'Superadmin' : u.role === 'staff' ? 'Platform Staff' : 'Customer User'}
                          </span>
                        </td>

                        <td className="p-4">
                          {u.twoFactorEnabled ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">Disabled</span>
                          )}
                        </td>

                        <td className="p-4 font-mono text-[11px] text-slate-500">
                          {u.joinedDate}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleUserRole(u.id, u.role)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                u.role === 'admin'
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                  : u.role === 'staff'
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {u.role === 'admin' ? 'Set Staff' : u.role === 'staff' ? 'Set User' : 'Promote Admin'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setResettingUser(u);
                                setNewPasswordInput('Admin@CloudOptimizer2026');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                            >
                              Reset Pass
                            </button>

                            {u.id > 5 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                title="Delete user account"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: UPI TRANSACTIONS & FINANCIAL SETTLEMENTS
           ======================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">SBI UPI Settlement Ledger</h3>
                  <p className="text-xs text-slate-500">Verified QR code payments deposited into SBI Account for Cloud Optimizer.</p>
                </div>
                <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Mock Clearing Verified</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-4">Txn ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Plan Activated</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">12-Digit UTR Ref</th>
                      <th className="p-4">Bank</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 text-right">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map(tx => (
                      <tr key={tx.transactionId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#2563EB]">{tx.transactionId}</td>
                        <td className="p-4 font-bold text-slate-900">{tx.companyName}</td>
                        <td className="p-4 text-slate-700">{tx.planName}</td>
                        <td className="p-4 font-bold text-emerald-600">₹{tx.amountINR.toLocaleString('en-IN')}</td>
                        <td className="p-4 font-mono text-[11px] text-slate-700">{tx.utrNumber}</td>
                        <td className="p-4 text-slate-600">{tx.bankName}</td>
                        <td className="p-4 font-mono text-[11px] text-slate-400">{tx.timestamp}</td>
                        <td className="p-4 text-right">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: MULTI-AGENT HEALTH & AWS BOTO3 CLUSTER
           ======================================================== */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* AWS Connection Card (Light Style) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base text-slate-900">Live AWS Boto3 Integration Status</h3>
                    <p className="text-xs text-slate-500">Connected to live AWS account hosting your instances and databases.</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Authenticated via Boto3</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Region</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">ap-south-2 (Hyderabad)</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">AWS Account ID</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">416384710566</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">IAM Role Identity</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">terra-admin</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Live Discovered Assets</span>
                  <div className="font-bold text-primary-blue text-sm mt-0.5">6 EC2 &bull; 1 RDS MySQL</div>
                </div>
              </div>
            </div>

            {/* 6 Autonomous Agents Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(overview?.agents || [
                { agent: 'Agent 1: Asset Discovery', status: 'Healthy', target: 'AWS Boto3 (ap-south-2)', activeWorkers: 2 },
                { agent: 'Agent 2: Metric Harvester', status: 'Healthy', target: 'CloudWatch CPU & IOPS', activeWorkers: 2 },
                { agent: 'Agent 3: Pricing Engine', status: 'Healthy', target: 'AWS On-Demand Matrix', activeWorkers: 1 },
                { agent: 'Agent 4: Waste Rightsizer', status: 'Healthy', target: 'Idle Heuristics Engine', activeWorkers: 1 },
                { agent: 'Agent 5: Risk Assessor', status: 'Healthy', target: 'Production Tag Guard', activeWorkers: 1 },
                { agent: 'Agent 6: Exec Publisher', status: 'Healthy', target: 'ReportLab & Action Queue', activeWorkers: 1 },
              ]).map((ag, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{ag.agent}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      {ag.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-mono">
                    Target: {ag.target}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>Active Workers: {ag.activeWorkers}</span>
                    <span className="text-emerald-600 font-semibold">Latency &lt; 45ms</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 5: SYSTEM AUDIT LOGS & RUN HISTORY
           ======================================================== */}
        {activeTab === 'logs' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">System Execution Audit Trail</h3>
                  <p className="text-xs text-slate-500">Timestamped multi-agent optimization runs from MySQL database.</p>
                </div>
                <span className="text-xs text-[#2563EB] font-bold">{systemLogs.length} Analysis Runs Logged</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-4">Run ID</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Started At</th>
                      <th className="p-4">Completed At</th>
                      <th className="p-4">Potential Savings</th>
                      <th className="p-4">Telemetry Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {systemLogs.map(log => (
                      <tr key={log.runId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-primary-blue">{log.runId}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-600">{log.startedAt}</td>
                        <td className="p-4 font-mono text-[11px] text-slate-500">{log.completedAt}</td>
                        <td className="p-4 font-bold text-emerald-600">+${log.savingsUSD.toFixed(2)}/mo</td>
                        <td className="p-4 text-slate-700 max-w-sm truncate">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: PLAN PRICING & QUOTAS MATRIX
           ======================================================== */}
        {activeTab === 'limits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            {[
              {
                id: 'free',
                name: 'Free Forever',
                price: '₹0',
                period: 'no credit card',
                accounts: '1 AWS Account',
                regions: '2 Monitored Regions',
                resources: 'Up to 5 Resources',
                ai: 'Basic Discovery Only',
                support: 'Community Support',
                badge: 'Exploration',
                bg: 'bg-white border-slate-200',
              },
              {
                id: 'starter',
                name: 'Starter Plan',
                price: '₹1,999',
                period: 'per month',
                accounts: '3 AWS Accounts',
                regions: '5 Monitored Regions',
                resources: 'Up to 50 Resources',
                ai: 'AI Rightsizing Proposals',
                support: 'Standard Email Support',
                badge: 'Growing Startups',
                bg: 'bg-white border-blue-200 ring-1 ring-blue-100',
              },
              {
                id: 'business',
                name: 'Business Plan',
                price: '₹5,999',
                period: 'per month',
                accounts: '10 AWS Accounts',
                regions: '30 Monitored Regions',
                resources: 'Up to 500 Resources',
                ai: 'Autonomous Actions & Audits',
                support: 'Priority 24/7 Slack & Phone',
                badge: 'Most Popular',
                bg: 'bg-white border-amber-300 ring-2 ring-amber-100',
              },
              {
                id: 'enterprise',
                name: 'Enterprise VIP',
                price: 'Custom',
                period: 'annual billing',
                accounts: 'Unlimited Accounts',
                regions: 'All Global Regions',
                resources: 'Unlimited Workloads',
                ai: 'Custom FinOps LLM Models',
                support: 'Dedicated FinOps Architect',
                badge: 'Owner Tier',
                bg: 'bg-white border-purple-200',
              },
            ].map(tier => (
              <div key={tier.id} className={`p-6 rounded-3xl border shadow-2xs flex flex-col justify-between space-y-6 ${tier.bg}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-base text-slate-900">{tier.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {tier.badge}
                    </span>
                  </div>

                  <div>
                    <div className="font-display font-extrabold text-3xl text-slate-900">{tier.price}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{tier.period}</div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tier.accounts}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tier.regions}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tier.resources}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tier.ai}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tier.support}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center text-[10px] text-slate-400 font-semibold">
                  Configured in MySQL Plan Guard
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ========================================================
          MODAL: CREATE NEW ADMIN / STAFF USER
         ======================================================== */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary-blue flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">Create Platform Staff / Admin User</h3>
                  <p className="text-xs text-slate-500">Add team members to manage Cloud Optimizer platform operations.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateUserModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Mehta"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary-blue"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Work Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. arjun@cloudoptimizer.io"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary-blue"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Platform Role Privileges *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'admin', label: 'Superadmin', desc: 'Full control over system' },
                    { id: 'staff', label: 'Platform Staff', desc: 'Support & audit logs' },
                    { id: 'user', label: 'Customer User', desc: 'Tenant level access' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setNewUserForm({ ...newUserForm, role: r.id as any })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        newUserForm.role === r.id
                          ? 'border-primary-blue bg-blue-50/70 text-slate-900 ring-2 ring-primary-blue/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{r.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Temporary Password *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-primary-blue"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Staff can change password in their profile settings.</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-5 py-2 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {creatingUser ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Create User Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: REGISTER NEW COMPANY TENANT
         ======================================================== */}
      {showCreateTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">Register New Organization</h3>
                  <p className="text-xs text-slate-500">Provision a new client tenant in MySQL database.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateTenantModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Cloud"
                  value={newTenantForm.name}
                  onChange={(e) => setNewTenantForm({ ...newTenantForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary-blue"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subscription Plan Tier *</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['free', 'starter', 'business', 'enterprise'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTenantForm({ ...newTenantForm, plan: p })}
                      className={`py-2 text-center rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                        newTenantForm.plan === p
                          ? 'border-primary-blue bg-blue-50 text-[#2563EB] ring-2 ring-primary-blue/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sen"
                    value={newTenantForm.ownerName}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Owner Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ananya@apexcloud.io"
                    value={newTenantForm.ownerEmail}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, ownerEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary-blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Initial Login Password *</label>
                <input
                  type="text"
                  required
                  value={newTenantForm.ownerPassword}
                  onChange={(e) => setNewTenantForm({ ...newTenantForm, ownerPassword: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-primary-blue"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateTenantModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTenant}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {creatingTenant ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Building2 className="w-3.5 h-3.5" />}
                  <span>Register Organization</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CHANGE TENANT PLAN
         ======================================================== */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Change Subscription Plan</h3>
                <p className="text-xs text-slate-500">Instantly update customer tier in MySQL database.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTenant(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{editingTenant.name}</div>
                <div className="text-xs text-slate-500 font-mono">{editingTenant.ownerEmail}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Select Target Plan:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['free', 'starter', 'business', 'enterprise'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewSelectedPlan(p)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        newSelectedPlan === p
                          ? 'border-primary-blue bg-blue-50/70 text-slate-900 font-bold ring-2 ring-primary-blue/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="uppercase text-xs font-extrabold">{p}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {p === 'free' ? '₹0/mo' : p === 'starter' ? '₹1,999/mo' : p === 'business' ? '₹5,999/mo' : 'Custom'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingTenant(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlanChange}
                className="px-5 py-2.5 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Apply Plan in MySQL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: RESET USER PASSWORD
         ======================================================== */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Reset User Password</h3>
                <p className="text-xs text-slate-500">Generate a new password for {resettingUser.email}.</p>
              </div>
              <button
                type="button"
                onClick={() => setResettingUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">New Password *</label>
                <input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-primary-blue"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setResettingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                className="px-5 py-2.5 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
