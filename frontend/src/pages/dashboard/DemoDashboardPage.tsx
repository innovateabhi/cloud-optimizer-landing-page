import React, { useState } from 'react';
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
  ChevronDown,
  Printer,
  Copy,
  Plus,
  HelpCircle,
  Bot,
  MessageSquare,
  LifeBuoy
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
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';
import { AiAssistantDrawer } from '../../components/dashboard/AiAssistantDrawer';
import { HelpSupportView } from '../../components/dashboard/HelpSupportView';

// Initial Mock Datasets
interface CloudResource {
  id: string;
  name: string;
  provider: 'AWS' | 'Azure' | 'GCP';
  service: string;
  type: string;
  region: string;
  status: 'overprovisioned' | 'idle' | 'running';
  monthlyCostUSD: number;
  utilization: number;
  savingsOpportunityUSD: number;
}

interface Recommendation {
  id: string;
  resourceId: string;
  resourceName: string;
  provider: 'AWS' | 'Azure' | 'GCP';
  service: string;
  finding: string;
  recommendedAction: string;
  savingsUSD: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  status: 'Pending Review' | 'Approved' | 'Executed';
  explanation: string;
  cliCommand: string;
}

interface SavingsLog {
  id: string;
  recId: string;
  resourceName: string;
  savingsUSD: number;
  approvedBy: string;
  timestamp: string;
  status: 'Verified';
}

interface AutomationPolicy {
  id: string;
  title: string;
  description: string;
  schedule: string;
  estimatedSavingsUSD: number;
  enabled: boolean;
  affectedResources: number;
}

export const DemoDashboardPage: React.FC = () => {
  // Navigation & Control States
  const [activeTab, setActiveTab] = useState<
    'overview' | 'resources' | 'recommendations' | 'analytics' | 'automation' | 'reports' | 'savings' | 'accounts' | 'help'
  >('overview');
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [selectedCloud, setSelectedCloud] = useState<'all' | 'AWS' | 'Azure' | 'GCP'>('all');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState<'all' | 'overprovisioned' | 'idle' | 'running'>('all');
  const [recFilter, setRecFilter] = useState<'all' | 'Pending Review' | 'Approved' | 'Executed'>('all');

  // Dynamic Live Metrics (Change when recommendations are approved!)
  const [totalSpendUSD, setTotalSpendUSD] = useState(12480);
  const [realizedSavingsUSD, setRealizedSavingsUSD] = useState(3720);
  const [healthScore, setHealthScore] = useState(86);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [showExecModal, setShowExecModal] = useState<Recommendation | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [inspectResource, setInspectResource] = useState<CloudResource | null>(null);

  // Report Generator Form State
  const [reportType, setReportType] = useState<'executive' | 'optimization' | 'waste' | 'multicloud'>('executive');
  const [reportFormat, setReportFormat] = useState<'csv' | 'pdf' | 'json'>('csv');
  const [reportRange, setReportRange] = useState('Last 30 Days (Current Billing Cycle)');
  const [isExporting, setIsExporting] = useState(false);

  // Currency Conversion Rate
  const exchangeRate = 83; // 1 USD = 83 INR
  const formatMoney = (amountUSD: number) => {
    if (currency === 'INR') {
      const inr = amountUSD * exchangeRate;
      return `₹${Math.round(inr).toLocaleString('en-IN')}`;
    }
    return `$${Math.round(amountUSD).toLocaleString('en-US')}`;
  };

  // Live Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Recommendations Data
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 'REC-2024-001',
      resourceId: 'i-0b2a9e14c33891a82',
      resourceName: 'prod-analytics-worker-01',
      provider: 'AWS',
      service: 'EC2',
      finding: 'CPU average 11.8% and memory peak 26% over the last 30 consecutive days.',
      recommendedAction: 'Rightsize from c5.2xlarge to c6g.xlarge (AWS Graviton3).',
      savingsUSD: 124,
      riskLevel: 'Low',
      confidence: 0.96,
      status: 'Pending Review',
      explanation: 'Benchmark analysis shows CPU headroom accommodates all burst spikes while cutting hourly compute expense by 50%.',
      cliCommand: 'aws ec2 modify-instance-attribute --instance-id i-0b2a9e14c33891a82 --instance-type c6g.xlarge',
    },
    {
      id: 'REC-2024-002',
      resourceId: 'vol-03f8a1290bb34a91c',
      resourceName: 'staging-redis-backup-old',
      provider: 'AWS',
      service: 'EBS',
      finding: 'Unattached volume with zero IOPS recorded for 45 days.',
      recommendedAction: 'Create snapshot and purge unattached orphaned EBS storage.',
      savingsUSD: 45,
      riskLevel: 'Low',
      confidence: 0.99,
      status: 'Pending Review',
      explanation: 'Orphaned disk left over from decommissioned staging testbed. Snapshot guarantees data retention at ~80% cheaper storage cost.',
      cliCommand: 'aws ec2 create-snapshot --volume-id vol-03f8a1290bb34a91c && aws ec2 delete-volume --volume-id vol-03f8a1290bb34a91c',
    },
    {
      id: 'REC-2024-003',
      resourceId: 'vm-azure-ml-training',
      resourceName: 'az-ml-inferencing-host',
      provider: 'Azure',
      service: 'Virtual Machines',
      finding: 'Standard_D8s_v4 VM idle over 18 hours/day with zero GPU utilization.',
      recommendedAction: 'Auto-scale VM instance pool to Standard_D4s_v4 and schedule shutdown.',
      savingsUSD: 210,
      riskLevel: 'Low',
      confidence: 0.94,
      status: 'Pending Review',
      explanation: 'Instance is provisioned for peak training runs but left idle during normal inference workloads.',
      cliCommand: 'az vm resize --resource-group prod-rg --name az-ml-inferencing-host --size Standard_D4s_v4',
    },
    {
      id: 'REC-2024-004',
      resourceId: 'gcp-cloudsql-staging',
      resourceName: 'gcp-orders-replica-eu',
      provider: 'GCP',
      service: 'Cloud SQL',
      finding: 'High-availability replica active in staging with 0 connection queries.',
      recommendedAction: 'Downgrade to single-zone non-HA tier for staging environments.',
      savingsUSD: 165,
      riskLevel: 'Low',
      confidence: 0.98,
      status: 'Pending Review',
      explanation: 'Non-prod staging clusters do not require multi-region HA replicas; saves standby database hourly license costs.',
      cliCommand: 'gcloud sql instances patch gcp-orders-replica-eu --availability-type=ZONAL',
    },
    {
      id: 'REC-2024-005',
      resourceId: 's3-telemetry-dumps-2024',
      resourceName: 'prod-telemetry-dumps-2024',
      provider: 'AWS',
      service: 'S3',
      finding: '4.8 TB in S3 Standard has not been accessed in over 90 consecutive days.',
      recommendedAction: 'Enable S3 Lifecycle rule to transition to Glacier Flexible Retrieval.',
      savingsUSD: 78,
      riskLevel: 'Low',
      confidence: 0.98,
      status: 'Approved',
      explanation: 'Historical logs are retained strictly for compliance audits; Glacier reduces storage price from $0.023/GB to $0.004/GB.',
      cliCommand: 'aws s3api put-bucket-lifecycle-configuration --bucket prod-telemetry-dumps-2024 --lifecycle-configuration file://lifecycle.json',
    },
    {
      id: 'REC-2024-006',
      resourceId: 'db-orders-replica-dev',
      resourceName: 'dev-orders-aurora-db',
      provider: 'AWS',
      service: 'RDS',
      finding: 'Non-production Aurora cluster running 24/7 with zero traffic between 8 PM - 7 AM.',
      recommendedAction: 'Apply automated stop schedule outside active engineering working hours.',
      savingsUSD: 180,
      riskLevel: 'Low',
      confidence: 0.95,
      status: 'Executed',
      explanation: 'Halts compute engines overnight, reducing billing hours from 720 to 220 hours per month.',
      cliCommand: 'aws rds stop-db-cluster --db-cluster-identifier dev-orders-aurora-db',
    },
  ]);

  // Cloud Resources Inventory
  const [resources] = useState<CloudResource[]>([
    {
      id: 'i-0b2a9e14c33891a82',
      name: 'prod-analytics-worker-01',
      provider: 'AWS',
      service: 'EC2',
      type: 'c5.2xlarge',
      region: 'ap-south-1 (Mumbai)',
      status: 'overprovisioned',
      monthlyCostUSD: 248,
      utilization: 11.8,
      savingsOpportunityUSD: 124,
    },
    {
      id: 'vol-03f8a1290bb34a91c',
      name: 'staging-redis-backup-old',
      provider: 'AWS',
      service: 'EBS',
      type: 'gp3 (500 GB)',
      region: 'ap-south-1 (Mumbai)',
      status: 'idle',
      monthlyCostUSD: 45,
      utilization: 0,
      savingsOpportunityUSD: 45,
    },
    {
      id: 'vm-azure-ml-training',
      name: 'az-ml-inferencing-host',
      provider: 'Azure',
      service: 'Virtual Machines',
      type: 'Standard_D8s_v4 (8 vCPU, 32GB)',
      region: 'East US 2',
      status: 'overprovisioned',
      monthlyCostUSD: 380,
      utilization: 14.2,
      savingsOpportunityUSD: 210,
    },
    {
      id: 'gcp-cloudsql-staging',
      name: 'gcp-orders-replica-eu',
      provider: 'GCP',
      service: 'Cloud SQL',
      type: 'db-custom-4-16384',
      region: 'europe-west1',
      status: 'idle',
      monthlyCostUSD: 220,
      utilization: 3.5,
      savingsOpportunityUSD: 165,
    },
    {
      id: 's3-telemetry-dumps-2024',
      name: 'prod-telemetry-dumps-2024',
      provider: 'AWS',
      service: 'S3',
      type: 'Standard Storage (4.8 TB)',
      region: 'us-east-1 (N. Virginia)',
      status: 'overprovisioned',
      monthlyCostUSD: 110,
      utilization: 2.1,
      savingsOpportunityUSD: 78,
    },
    {
      id: 'i-078bc12a44fa231e9',
      name: 'qa-staging-ingress-router',
      provider: 'AWS',
      service: 'EC2',
      type: 'm5.large',
      region: 'eu-west-1 (Ireland)',
      status: 'running',
      monthlyCostUSD: 72,
      utilization: 64.2,
      savingsOpportunityUSD: 0,
    },
    {
      id: 'aks-cluster-production-eu',
      name: 'k8s-prod-nodepool-01',
      provider: 'Azure',
      service: 'AKS NodePool',
      type: 'Standard_E4s_v3 (3 nodes)',
      region: 'West Europe',
      status: 'running',
      monthlyCostUSD: 490,
      utilization: 71.5,
      savingsOpportunityUSD: 0,
    },
    {
      id: 'gcp-gke-analytics-cluster',
      name: 'gke-batch-workers-pool',
      provider: 'GCP',
      service: 'GKE Cluster',
      type: 'e2-standard-4 (4 nodes)',
      region: 'us-central1',
      status: 'overprovisioned',
      monthlyCostUSD: 340,
      utilization: 22.0,
      savingsOpportunityUSD: 110,
    },
  ]);

  // Savings Audit Ledger
  const [savingsLedger, setSavingsLedger] = useState<SavingsLog[]>([
    {
      id: 'LOG-9401',
      recId: 'REC-2024-006',
      resourceName: 'dev-orders-aurora-db',
      savingsUSD: 180,
      approvedBy: 'Alex Chen (Lead DevOps)',
      timestamp: 'Today at 10:14 AM',
      status: 'Verified',
    },
    {
      id: 'LOG-9400',
      recId: 'REC-2024-005',
      resourceName: 'prod-telemetry-dumps-2024',
      savingsUSD: 78,
      approvedBy: 'Sarah Jenkins (FinOps Architect)',
      timestamp: 'Yesterday at 3:30 PM',
      status: 'Verified',
    },
    {
      id: 'LOG-9399',
      recId: 'REC-2024-000',
      resourceName: 'legacy-reporting-ingress-elb',
      savingsUSD: 95,
      approvedBy: 'Alex Chen (Lead DevOps)',
      timestamp: 'Nov 14, 2024',
      status: 'Verified',
    },
  ]);

  // Automation Policies
  const [policies, setPolicies] = useState<AutomationPolicy[]>([
    {
      id: 'POL-01',
      title: 'Nightly Non-Prod Cluster Shutdown',
      description: 'Automatically stops dev/staging RDS databases and EC2 worker pools at 8:00 PM IST on weekdays and all weekend.',
      schedule: 'Mon-Fri 20:00 - 07:00 IST',
      estimatedSavingsUSD: 480,
      enabled: true,
      affectedResources: 12,
    },
    {
      id: 'POL-02',
      title: 'Orphaned EBS Storage Auto-Snapshot & Cleanup',
      description: 'Identifies volumes detached for >14 days, captures an encrypted incremental snapshot, and purges the idle volume.',
      schedule: 'Every Sunday at 02:00 UTC',
      estimatedSavingsUSD: 125,
      enabled: true,
      affectedResources: 5,
    },
    {
      id: 'POL-03',
      title: 'Idle Kubernetes Worker Garbage Collection',
      description: 'Automatically drains and scales down unused node pools when cluster CPU falls below 15% for over 2 hours.',
      schedule: 'Continuous real-time telemetry',
      estimatedSavingsUSD: 340,
      enabled: false,
      affectedResources: 3,
    },
    {
      id: 'POL-04',
      title: 'Mandatory FinOps Cost Center Tagging Enforcer',
      description: 'Flags or quarantines newly created untagged cloud assets lacking Environment, Owner, or CostCenter metadata.',
      schedule: 'EventBridge real-time audit',
      estimatedSavingsUSD: 0,
      enabled: true,
      affectedResources: 68,
    },
  ]);

  // Connected Cloud Accounts
  const [accounts, setAccounts] = useState([
    {
      id: 'acc-aws-prod',
      provider: 'AWS',
      name: 'Production Multi-Region Core',
      accountId: '8841-9201-9481',
      status: 'Connected',
      roleArn: 'arn:aws:iam::884192019481:role/CloudOptimizerDiscoveryRole',
      regions: 4,
      resourcesCount: 46,
      monthlySpendUSD: 7240,
      lastSync: '2 minutes ago',
    },
    {
      id: 'acc-azure-ent',
      provider: 'Azure',
      name: 'Enterprise Subscriptions Core',
      accountId: 'sub-4921-9921-8840',
      status: 'Connected',
      roleArn: 'azure://subscriptions/sub-4921/providers/CloudOptimizerApp',
      regions: 2,
      resourcesCount: 14,
      monthlySpendUSD: 3120,
      lastSync: '5 minutes ago',
    },
    {
      id: 'acc-gcp-prod',
      provider: 'GCP',
      name: 'GCP Analytics Project Main',
      accountId: 'prj-cloud-analytics-prod',
      status: 'Connected',
      roleArn: 'cloud-optimizer-svc@prj-cloud-analytics-prod.iam.gserviceaccount.com',
      regions: 2,
      resourcesCount: 8,
      monthlySpendUSD: 2120,
      lastSync: '12 minutes ago',
    },
  ]);

  // Chart Data across Timeframe
  const spendChartData = [
    { month: 'Jun', spend: totalSpendUSD * 1.15, optimized: totalSpendUSD * 1.15, aws: 6800, azure: 3800, gcp: 2400 },
    { month: 'Jul', spend: totalSpendUSD * 1.12, optimized: totalSpendUSD * 1.12, aws: 6600, azure: 3700, gcp: 2350 },
    { month: 'Aug', spend: totalSpendUSD * 1.18, optimized: totalSpendUSD * 1.05, aws: 7100, azure: 3900, gcp: 2450 },
    { month: 'Sep', spend: totalSpendUSD * 1.08, optimized: totalSpendUSD * 0.92, aws: 6400, azure: 3500, gcp: 2250 },
    { month: 'Oct', spend: totalSpendUSD * 1.02, optimized: totalSpendUSD * 0.81, aws: 5900, azure: 3300, gcp: 2150 },
    { month: 'Nov', spend: totalSpendUSD, optimized: Math.max(0, totalSpendUSD - realizedSavingsUSD), aws: 5240, azure: 3120, gcp: 2120 },
  ];

  // Service Breakdown for Chart
  const serviceBreakdown = [
    { name: 'Compute (EC2 / VMs)', spend: totalSpendUSD * 0.48, color: '#2563EB' },
    { name: 'Databases (RDS / CloudSQL)', spend: totalSpendUSD * 0.26, color: '#10B981' },
    { name: 'Storage (EBS / S3 / Disks)', spend: totalSpendUSD * 0.16, color: '#F59E0B' },
    { name: 'Networking & Egress', spend: totalSpendUSD * 0.07, color: '#8B5CF6' },
    { name: 'Other Services', spend: totalSpendUSD * 0.03, color: '#64748B' },
  ];

  // Handle Recommendation Execution (Dry Run & Apply)
  const handleConfirmExecution = (rec: Recommendation) => {
    // 1. Update recommendation state
    setRecommendations((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: 'Executed' } : r))
    );
    // 2. Increment realized savings
    setRealizedSavingsUSD((prev) => prev + rec.savingsUSD);
    // 3. Decrement total spend
    setTotalSpendUSD((prev) => Math.max(0, prev - rec.savingsUSD));
    // 4. Boost health score
    setHealthScore((prev) => Math.min(99, prev + 2));
    // 5. Append to Savings Ledger
    const newLog: SavingsLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      recId: rec.id,
      resourceName: rec.resourceName,
      savingsUSD: rec.savingsUSD,
      approvedBy: 'Sandbox Operator (You)',
      timestamp: 'Just now',
      status: 'Verified',
    };
    setSavingsLedger((prev) => [newLog, ...prev]);

    // 6. Confetti effect & toast notification
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    triggerToast(`Recommendation ${rec.id} executed successfully! Saved ${formatMoney(rec.savingsUSD)}/mo.`);
    setShowExecModal(null);
  };

  // Toggle Policy
  const handleTogglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newState = !p.enabled;
          triggerToast(`Policy "${p.title}" ${newState ? 'enabled' : 'paused'}.`);
          return { ...p, enabled: newState };
        }
        return p;
      })
    );
  };

  // Report Generator Logic: Creates actual downloadable CSV / JSON or print
  const handleGenerateAndDownloadReport = () => {
    setIsExporting(true);

    setTimeout(() => {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `CloudOptimizer-${reportType}-Report-${timestamp}`;

      if (reportFormat === 'csv') {
        // Build real CSV string
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Cloud Optimizer Executive FinOps Report\r\n';
        csvContent += `Generated On,${new Date().toLocaleString()}\r\n`;
        csvContent += `Organization,Acme Corp Global Production\r\n`;
        csvContent += `Report Type,${reportType.toUpperCase()}\r\n`;
        csvContent += `Timeframe,${reportRange}\r\n`;
        csvContent += `Current Monthly Run Rate,${formatMoney(totalSpendUSD)}\r\n`;
        csvContent += `Realized Monthly Savings,${formatMoney(realizedSavingsUSD)}\r\n`;
        csvContent += `Optimization Health Score,${healthScore}/100\r\n\r\n`;
        
        csvContent += '--- DETAILED RESOURCE OPTIMIZATION LEDGER ---\r\n';
        csvContent += 'ID,Resource Name,Provider,Service,Current Cost,Savings Opportunity,Risk Level,Status\r\n';
        recommendations.forEach((r) => {
          csvContent += `"${r.id}","${r.resourceName}","${r.provider}","${r.service}","${formatMoney(r.savingsUSD * 2)}","${formatMoney(r.savingsUSD)}","${r.riskLevel}","${r.status}"\r\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        triggerToast(`Report "${filename}.csv" generated & downloaded!`);
      } else if (reportFormat === 'json') {
        const jsonData = {
          organization: 'Acme Corp Global Production',
          generatedAt: new Date().toISOString(),
          currency,
          totalMonthlySpend: totalSpendUSD,
          realizedMonthlySavings: realizedSavingsUSD,
          optimizationScore: healthScore,
          activeCloudAccounts: accounts,
          recommendations,
          savingsLedger,
          automationPolicies: policies,
        };
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        triggerToast(`Report "${filename}.json" downloaded successfully!`);
      } else {
        // PDF format triggers print dialog
        window.print();
        triggerToast('Printable Executive PDF view ready!');
      }

      setIsExporting(false);
      setShowReportModal(false);
    }, 600);
  };

  // Filtered resources based on search and provider
  const filteredResources = resources.filter((r) => {
    const matchesCloud = selectedCloud === 'all' || r.provider === selectedCloud;
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = resourceFilter === 'all' || r.status === resourceFilter;
    return matchesCloud && matchesSearch && matchesFilter;
  });

  // Filtered recommendations
  const filteredRecs = recommendations.filter((r) => {
    const matchesCloud = selectedCloud === 'all' || r.provider === selectedCloud;
    const matchesStatus = recFilter === 'all' || r.status === recFilter;
    return matchesCloud && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ========================================================
          TOP DEMO SANDBOX BANNER (Fixed Header with high contrast brand)
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
            <span>LIVE INTERACTIVE SANDBOX</span>
          </div>
          <span className="hidden md:inline text-slate-400">
            • Multi-Cloud FinOps Engine
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* AI Copilot Pill */}
          <button
            type="button"
            onClick={() => setShowAiAssistant(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Copilot</span>
          </button>

          {/* Quick Generate Report Pill */}
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate FinOps Report</span>
          </button>

          <Link 
            to="/" 
            className="text-slate-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Site</span>
          </Link>

          <Link 
            to="/register?plan=starter" 
            className="px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-xs"
          >
            Connect Real Cloud →
          </Link>
        </div>
      </div>

      {/* ========================================================
          MAIN APP LAYOUT (Sidebar + Content Workspace)
         ======================================================== */}
      <div className="flex flex-1 relative">
        
        {/* LEFT PERMANENTLY FIXED NAVIGATION SIDEBAR */}
        <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 hidden md:flex sticky top-[45px] h-[calc(100vh-45px)] overflow-y-auto z-30">
          
          <div className="p-4 space-y-6">
            
            {/* Org Switcher Header */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Organization</div>
              <div className="font-bold text-xs text-slate-900 truncate flex items-center justify-between">
                <span>Acme Corp Global</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="All 3 Clouds Connected" />
              </div>
              <div className="text-[11px] text-slate-500 truncate">AWS • Azure • GCP Production</div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
                { id: 'resources', label: 'Cloud Resources', icon: Server, badge: resources.length },
                { id: 'recommendations', label: 'AI Recommendations', icon: Zap, badge: recommendations.filter(r => r.status === 'Pending Review').length, badgeColor: 'bg-amber-100 text-amber-800' },
                { id: 'analytics', label: 'Cost Analytics & Forecast', icon: BarChart3 },
                { id: 'automation', label: 'Automation & Policies', icon: Sliders, badge: `${policies.filter(p => p.enabled).length} Active` },
                { id: 'reports', label: 'Executive Reports', icon: FileText },
                { id: 'savings', label: 'Savings Ledger & ROI', icon: TrendingDown },
                { id: 'accounts', label: 'Connected Accounts', icon: Cloud, badge: accounts.length },
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563EB] font-bold text-xs flex items-center justify-center border border-blue-200">
                SC
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Sarah Chen</div>
                <div className="text-[10px] text-slate-500 truncate">FinOps Architect (Admin)</div>
              </div>
            </div>

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
              onClick={() => setShowReportModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Export Custom Report</span>
            </button>
          </div>

        </aside>

        {/* WORKSPACE AREA */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          
          {/* TOP CONTROLS & FILTER BAR */}
          <header className="bg-white border-b border-slate-200/90 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
            
            {/* Title / Tab Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-slate-900 capitalize">
                {activeTab === 'overview' && 'Multi-Cloud Infrastructure Overview'}
                {activeTab === 'resources' && 'Discovered Cloud Resource Inventory'}
                {activeTab === 'recommendations' && 'AI Rightsizing & Governance Queue'}
                {activeTab === 'analytics' && 'Cost Analytics & Predictive Forecasting'}
                {activeTab === 'automation' && 'Autonomous FinOps Optimization Policies'}
                {activeTab === 'reports' && 'Executive FinOps Report Generation'}
                {activeTab === 'savings' && 'Verified Savings Ledger & Audit Trail'}
                {activeTab === 'accounts' && 'Connected Multi-Cloud Accounts'}
                {activeTab === 'help' && 'Help & Technical Support Center'}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">| Sandbox</span>
            </div>

            {/* Filter Buttons & Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Cloud Provider Filter */}
              <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                {[
                  { id: 'all', label: 'All Clouds' },
                  { id: 'AWS', label: 'AWS' },
                  { id: 'Azure', label: 'Azure' },
                  { id: 'GCP', label: 'GCP' },
                ].map((cloud) => (
                  <button
                    key={cloud.id}
                    type="button"
                    onClick={() => setSelectedCloud(cloud.id as any)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedCloud === cloud.id
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cloud.label}
                  </button>
                ))}
              </div>

              {/* Currency Selector (USD vs INR) */}
              <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-[#2563EB] text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === 'INR'
                      ? 'bg-[#2563EB] text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  INR (₹)
                </button>
              </div>

              {/* Timeframe Selector */}
              <div className="hidden lg:flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                {['7d', '30d', '90d', '12m'].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf as any)}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer uppercase ${
                      timeframe === tf
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Notifications Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-bold text-xs text-slate-900">Active FinOps Alerts</span>
                      <span className="text-[10px] text-slate-400">3 unread</span>
                    </div>
                    <div className="space-y-2.5 mt-2.5 text-xs">
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Idle Disk Spike Detected</span>
                        </div>
                        <div className="text-[11px] text-amber-700 mt-0.5">vol-03f8a129 unattached for 45 days ($45/mo waste)</div>
                      </div>
                      <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                        <div className="font-bold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-blue-600" />
                          <span>Graviton3 Upgrade Ready</span>
                        </div>
                        <div className="text-[11px] text-blue-700 mt-0.5">Save $124/mo on prod-analytics-worker-01</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Report Button */}
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate Report</span>
              </button>

            </div>

          </header>

          {/* FLOATING TOAST NOTIFICATION */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-medium animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* VIEW WORKSPACE */}
          <div className="p-6 space-y-6 flex-1">

            {/* ========================================================
                TAB 1: OVERVIEW & KPIS
               ======================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Monthly Cloud Run Rate</span>
                      <Cloud className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div className="text-2xl font-display font-extrabold text-slate-900">
                      {formatMoney(totalSpendUSD)}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>-14.2% vs previous quarter</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Realized Verified Savings</span>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-display font-extrabold text-emerald-600">
                      {formatMoney(realizedSavingsUSD)}<span className="text-xs font-normal text-slate-500">/mo</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Confirmed on multi-cloud billing ledgers
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Optimization Health Score</span>
                      <Zap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-2xl font-display font-extrabold text-[#2563EB]">
                      {healthScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      +16 points after recent rightsizing
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Monitored Assets</span>
                      <Server className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="text-2xl font-display font-extrabold text-slate-900">
                      68 Resources
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Across 3 Providers & 8 Global Regions
                    </div>
                  </div>
                </div>

                {/* 2-Column Visual Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Spend Trajectory Area Chart */}
                  <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-bold text-sm text-slate-900">
                          6-Month Cloud Spend Trajectory & Realized Reductions
                        </h3>
                        <p className="text-xs text-slate-500">
                          Actual monthly billing trend vs pre-optimization baseline
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Saved {formatMoney(realizedSavingsUSD * 6)} Total
                      </span>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={spendChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                          <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                          <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => formatMoney(v)} />
                          <Tooltip formatter={(v: any) => [formatMoney(Number(v)), 'Amount']} />
                          <Area type="monotone" dataKey="spend" name="Original Spend" stroke="#94A3B8" fill="#F8FAFC" strokeWidth={2} />
                          <Area type="monotone" dataKey="optimized" name="Optimized Spend" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right: Cloud Spend by Service Breakdown */}
                  <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        Spend by Service Category
                      </h3>
                      <p className="text-xs text-slate-500">Current allocation across monitored stack</p>
                    </div>

                    <div className="space-y-3 my-2">
                      {serviceBreakdown.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-800">
                            <span>{item.name}</span>
                            <span>{formatMoney(item.spend)}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(item.spend / totalSpendUSD) * 100}%`,
                                backgroundColor: item.color 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('analytics')}
                      className="w-full py-2 text-center text-xs font-bold text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                    >
                      View Deep Analytics Breakdown →
                    </button>
                  </div>

                </div>

                {/* Quick Recommendation Action Strip */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        Top High-Impact Recommendations Ready for Approval
                      </h3>
                      <p className="text-xs text-slate-500">
                        Simulate and apply recommendations with instant dry-run verification
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('recommendations')}
                      className="text-xs font-bold text-[#2563EB] hover:underline"
                    >
                      View All ({recommendations.filter(r => r.status === 'Pending Review').length} Pending) →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.slice(0, 3).map((rec) => (
                      <div key={rec.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 text-blue-800">
                              {rec.provider} • {rec.service}
                            </span>
                            <span className="text-xs font-bold text-emerald-600">
                              +{formatMoney(rec.savingsUSD)}/mo
                            </span>
                          </div>
                          <div className="font-bold text-xs text-slate-900 line-clamp-1">{rec.resourceName}</div>
                          <div className="text-[11px] text-slate-600 line-clamp-2">{rec.recommendedAction}</div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                          {rec.status === 'Executed' ? (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Executed
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowExecModal(rec)}
                              className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs cursor-pointer shadow-2xs"
                            >
                              Simulate & Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                TAB 2: CLOUD RESOURCE INVENTORY
               ======================================================== */}
            {activeTab === 'resources' && (
              <div className="space-y-4">
                
                {/* Search & Filter Header */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by resource name, ID, or service..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    {(['all', 'overprovisioned', 'idle', 'running'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setResourceFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                          resourceFilter === st
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resource Table */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Resource Identifier</th>
                          <th className="p-4">Provider / Service</th>
                          <th className="p-4">Region</th>
                          <th className="p-4">Status & Health</th>
                          <th className="p-4">30-Day Avg Utilization</th>
                          <th className="p-4 text-right">Monthly Cost</th>
                          <th className="p-4 text-right">Optimization Opportunity</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredResources.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-slate-900">{res.name}</div>
                              <div className="text-[10px] font-mono text-slate-400">{res.id}</div>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800 mr-1.5">
                                {res.provider}
                              </span>
                              <span>{res.service} • {res.type}</span>
                            </td>
                            <td className="p-4 text-slate-500">{res.region}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                res.status === 'overprovisioned'
                                  ? 'bg-amber-100 text-amber-800'
                                  : res.status === 'idle'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {res.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="w-32 space-y-1">
                                <div className="flex justify-between text-[10px] font-mono font-bold">
                                  <span>{res.utilization}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      res.utilization < 20
                                        ? 'bg-amber-500'
                                        : res.utilization > 80
                                        ? 'bg-red-500'
                                        : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${Math.min(100, res.utilization)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-right font-bold text-slate-900">
                              {formatMoney(res.monthlyCostUSD)}
                            </td>
                            <td className="p-4 text-right">
                              {res.savingsOpportunityUSD > 0 ? (
                                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  Save {formatMoney(res.savingsOpportunityUSD)}/mo
                                </span>
                              ) : (
                                <span className="text-slate-400">Optimized</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                type="button"
                                onClick={() => setInspectResource(res)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                              >
                                Inspect
                              </button>
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
                TAB 3: AI RECOMMENDATIONS & GOVERNANCE
               ======================================================== */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                
                {/* Header Filter Strip */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div>
                    <h2 className="font-display font-bold text-sm text-slate-900">
                      Multi-Agent Cost Optimization Findings
                    </h2>
                    <p className="text-xs text-slate-500">
                      Human-in-the-loop approvals safeguard your infrastructure before executing changes
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(['all', 'Pending Review', 'Approved', 'Executed'] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setRecFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          recFilter === filter
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommendations List */}
                <div className="space-y-3">
                  {filteredRecs.map((rec) => (
                    <div 
                      key={rec.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3 transition-all hover:border-blue-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="space-y-1 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-100 text-[#2563EB]">
                              {rec.id}
                            </span>
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                              {rec.provider} • {rec.service}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{rec.resourceName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Risk: {rec.riskLevel}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              AI Confidence: {(rec.confidence * 100).toFixed(0)}%
                            </span>
                          </div>

                          <div className="font-bold text-sm text-slate-900 pt-1">
                            {rec.recommendedAction}
                          </div>
                          <div className="text-xs text-slate-600 leading-relaxed">
                            {rec.finding}
                          </div>
                          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                            <strong className="text-slate-700">Audit Justification: </strong>
                            {rec.explanation}
                          </div>
                        </div>

                        {/* Right: Savings & Action */}
                        <div className="flex flex-col items-end gap-2.5 shrink-0">
                          <div className="text-right">
                            <div className="text-lg font-display font-extrabold text-emerald-600">
                              +{formatMoney(rec.savingsUSD)}<span className="text-xs font-normal text-slate-400">/mo</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Annual: +{formatMoney(rec.savingsUSD * 12)}</div>
                          </div>

                          {rec.status === 'Executed' ? (
                            <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                              <Check className="w-4 h-4" /> Executed & Verified
                            </span>
                          ) : rec.status === 'Approved' ? (
                            <span className="px-4 py-2 rounded-xl bg-blue-100 text-[#2563EB] font-bold text-xs flex items-center gap-1.5">
                              <Clock className="w-4 h-4" /> Scheduled Execution
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowExecModal(rec)}
                              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>Simulate & Execute</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ========================================================
                TAB 4: COST ANALYTICS & FORECASTING
               ======================================================== */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                
                {/* 3 Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-xs text-slate-500 font-medium">Forecasted Q4 Spend Without Optimization</div>
                    <div className="text-2xl font-bold font-display text-red-600">{formatMoney(totalSpendUSD * 3.4)}</div>
                    <div className="text-[11px] text-slate-500">Based on historical 12% linear growth curve</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-xs text-slate-500 font-medium">Projected Spend With AI Rightsizing</div>
                    <div className="text-2xl font-bold font-display text-emerald-600">{formatMoney((totalSpendUSD - realizedSavingsUSD) * 3.1)}</div>
                    <div className="text-[11px] text-emerald-700 font-bold">Net projected quarterly savings: {formatMoney(realizedSavingsUSD * 3)}</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-xs text-slate-500 font-medium">FinOps Efficiency Ratio</div>
                    <div className="text-2xl font-bold font-display text-[#2563EB]">84.6%</div>
                    <div className="text-[11px] text-slate-500">Target benchmark: &gt;80% industry top quartile</div>
                  </div>
                </div>

                {/* Multi-Cloud Spend Stacked Bar Chart */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        Monthly Spend Breakdown by Cloud Provider (AWS vs Azure vs GCP)
                      </h3>
                      <p className="text-xs text-slate-500">Multi-cloud unified billing ledger trend</p>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={spendChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                        <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => formatMoney(v)} />
                        <Tooltip formatter={(val: any) => [formatMoney(Number(val)), 'Spend']} />
                        <Legend />
                        <Bar dataKey="aws" name="AWS Cloud" fill="#FF9900" stackId="a" />
                        <Bar dataKey="azure" name="Microsoft Azure" fill="#0089D6" stackId="a" />
                        <Bar dataKey="gcp" name="Google Cloud" fill="#4285F4" stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                TAB 5: AUTOMATION & POLICIES
               ======================================================== */}
            {activeTab === 'automation' && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div>
                    <h2 className="font-display font-bold text-sm text-slate-900">
                      Autonomous FinOps Policies & Governance Rules
                    </h2>
                    <p className="text-xs text-slate-500">
                      Automate repetitive non-destructive hygiene tasks to protect your budget 24/7
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Active Potential: +{formatMoney(policies.filter(p => p.enabled).reduce((acc, p) => acc + p.estimatedSavingsUSD, 0))}/mo
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policies.map((pol) => (
                    <div 
                      key={pol.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700">
                            {pol.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleTogglePolicy(pol.id)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                              pol.enabled ? 'bg-[#2563EB]' : 'bg-slate-300'
                            }`}
                          >
                            <div 
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                pol.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`} 
                            />
                          </button>
                        </div>

                        <div className="font-bold text-sm text-slate-900">{pol.title}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{pol.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-slate-400">Trigger Schedule</div>
                          <div className="font-semibold text-slate-700">{pol.schedule}</div>
                        </div>
                        <div className="text-right space-y-0.5">
                          <div className="text-[10px] text-slate-400">Estimated Savings</div>
                          <div className="font-bold text-emerald-600">
                            {pol.estimatedSavingsUSD > 0 ? `+${formatMoney(pol.estimatedSavingsUSD)}/mo` : 'Compliance'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ========================================================
                TAB 6: EXECUTIVE REPORTS & EXPORT GENERATOR
               ======================================================== */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                
                {/* Executive Report Generator Card */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl space-y-6">
                  <div className="max-w-2xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>FinOps Reporting Engine</span>
                    </div>
                    <h2 className="font-display font-extrabold text-2xl text-white">
                      Generate Enterprise FinOps Executive Reports
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Download boardroom-ready PDF briefs, granular CSV financial ledgers, or raw JSON audit payloads for stakeholder reporting and compliance audits.
                    </p>
                  </div>

                  {/* Configuration Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Report Focus</label>
                      <select 
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="executive">Executive Summary (ROI & Score)</option>
                        <option value="optimization">Detailed Rightsizing Audit</option>
                        <option value="waste">Idle & Orphaned Assets Audit</option>
                        <option value="multicloud">Multi-Cloud Allocation Matrix</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Billing Timeframe</label>
                      <select 
                        value={reportRange}
                        onChange={(e) => setReportRange(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 30 Days (Current Billing Cycle)">Last 30 Days (Current Cycle)</option>
                        <option value="Last Quarter (Q3/Q4)">Last Quarter</option>
                        <option value="Year-to-Date 2024">Year-to-Date 2024</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Format</label>
                      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                        {(['csv', 'pdf', 'json'] as const).map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setReportFormat(fmt)}
                            className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                              reportFormat === fmt
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleGenerateAndDownloadReport}
                      disabled={isExporting}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? 'Generating Document...' : `Generate & Download .${reportFormat.toUpperCase()}`}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowReportModal(true)}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Live Report Preview</span>
                    </button>
                  </div>
                </div>

                {/* Pre-Generated Report Archive */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    Previously Generated Compliance Reports
                  </h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    {[
                      { name: 'Q3-2024-Executive-FinOps-Summary.pdf', date: 'Nov 01, 2024', size: '2.4 MB', author: 'Sarah Chen' },
                      { name: 'October-Multi-Cloud-Cost-Allocation.csv', date: 'Oct 31, 2024', size: '480 KB', author: 'Alex Chen' },
                      { name: 'Audit-Trail-Unattached-EBS-Disks.json', date: 'Oct 15, 2024', size: '120 KB', author: 'Automated Bot' },
                    ].map((rep, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="font-bold text-slate-800">{rep.name}</div>
                            <div className="text-[10px] text-slate-400">Generated on {rep.date} by {rep.author} • {rep.size}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            triggerToast(`Downloading archive report "${rep.name}"...`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                TAB 7: SAVINGS LEDGER & ROI
               ======================================================== */}
            {activeTab === 'savings' && (
              <div className="space-y-6">
                
                {/* ROI Summary Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Cumulative Value Delivered</div>
                    <div className="text-3xl font-display font-extrabold text-white">
                      {formatMoney(realizedSavingsUSD * 12)} <span className="text-xs font-normal text-emerald-200">Annualized Savings</span>
                    </div>
                    <div className="text-xs text-emerald-200">
                      Based on verified human-approved recommendations applied to production.
                    </div>
                  </div>

                  <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/30 text-center shrink-0">
                    <div className="text-xs text-emerald-300 font-bold">Platform ROI Multiplier</div>
                    <div className="text-2xl font-extrabold text-white">18.4x</div>
                    <div className="text-[10px] text-emerald-300">Savings vs SaaS Subscription Cost</div>
                  </div>
                </div>

                {/* Audit Table */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        Immutable Savings Audit Ledger
                      </h3>
                      <p className="text-xs text-slate-500">Chronological history of verified cost reductions</p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {savingsLedger.map((log) => (
                      <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                            ✓
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{log.resourceName}</div>
                            <div className="text-[10px] text-slate-400">
                              {log.id} • Approved by {log.approvedBy} • {log.timestamp}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-emerald-600 font-display text-sm">
                            +{formatMoney(log.savingsUSD)}/mo
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Verified on Billing
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                TAB 8: CONNECTED CLOUD ACCOUNTS
               ======================================================== */}
            {activeTab === 'accounts' && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div>
                    <h2 className="font-display font-bold text-sm text-slate-900">
                      Connected Cloud Environments
                    </h2>
                    <p className="text-xs text-slate-500">
                      Read-only cross-account IAM role connections via AWS STS & Azure Service Principals
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddAccountModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Connect New Account</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {accounts.map((acc) => (
                    <div key={acc.id} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
                          {acc.provider}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {acc.status}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-900">{acc.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{acc.accountId}</div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Regions Monitored:</span>
                          <span className="font-bold text-slate-800">{acc.regions} Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Resources Tracked:</span>
                          <span className="font-bold text-slate-800">{acc.resourcesCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Monthly Run Rate:</span>
                          <span className="font-bold text-slate-900">{formatMoney(acc.monthlySpendUSD)}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Synced {acc.lastSync}</span>
                        <span className="text-emerald-600 font-bold">100% Read-Only</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 9: HELP & SUPPORT VIEW */}
            {activeTab === 'help' && (
              <HelpSupportView onOpenAiAssistant={() => setShowAiAssistant(true)} />
            )}

          </div>

        </main>

      </div>

      {/* ========================================================
          MODAL 1: REPORT GENERATION & LIVE PREVIEW MODAL
         ======================================================== */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  FinOps Executive Report Generator
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Preview Panel inside Modal */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
                <span>PREVIEW: Acme Global Production FinOps Report</span>
                <span className="text-[#2563EB]">{reportRange}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Total Run Rate</div>
                  <div className="font-bold text-slate-900 mt-0.5">{formatMoney(totalSpendUSD)}</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Verified Savings</div>
                  <div className="font-bold text-emerald-600 mt-0.5">+{formatMoney(realizedSavingsUSD)}</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Health Score</div>
                  <div className="font-bold text-[#2563EB] mt-0.5">{healthScore}/100</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                Includes {recommendations.length} action items, {resources.length} monitored infrastructure assets across AWS, Azure, and Google Cloud Platform.
              </div>
            </div>

            {/* Format Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Choose Export Format:</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'csv', label: 'CSV Spreadsheet', desc: 'Granular numbers & ledger' },
                  { id: 'pdf', label: 'PDF Executive Brief', desc: 'Printable executive summary' },
                  { id: 'json', label: 'JSON Audit Payload', desc: 'Raw machine-readable data' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setReportFormat(fmt.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      reportFormat === fmt.id
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{fmt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAndDownloadReport}
                disabled={isExporting}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating...' : `Download .${reportFormat.toUpperCase()}`}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: RECOMMENDATION EXECUTION & DRY-RUN MODAL
         ======================================================== */}
      {showExecModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  Pre-Flight Dry Run & Governance Verification
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowExecModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900">
                <div className="font-bold">Target Resource: {showExecModal.resourceName}</div>
                <div className="text-[11px] text-blue-700 font-mono mt-0.5">{showExecModal.resourceId}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Action</div>
                  <div className="font-bold text-slate-900 mt-0.5">{showExecModal.recommendedAction}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Monthly Net Savings</div>
                  <div className="font-bold text-emerald-600 mt-0.5">+{formatMoney(showExecModal.savingsUSD)}/mo</div>
                </div>
              </div>

              {/* Safety Checks */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                <div className="font-bold text-slate-800">Automated Safety Pre-Conditions:</div>
                <div className="text-emerald-700 flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Read-only IAM STS AssumeRole credentials verified
                </div>
                <div className="text-emerald-700 flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Snapshot rollback snapshot SLA: 100% automated
                </div>
                <div className="text-emerald-700 flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Target environment: Non-disruptive hot migration
                </div>
              </div>

              {/* CLI Command Preview */}
              <div className="space-y-1">
                <div className="font-bold text-slate-700 text-[11px]">Equivalent Cloud CLI Command:</div>
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[10px] overflow-x-auto select-all">
                  {showExecModal.cliCommand}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowExecModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmExecution(showExecModal)}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Apply Optimization</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: CONNECT CLOUD ACCOUNT WIZARD
         ======================================================== */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  Connect Cloud Infrastructure Account
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddAccountModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Connect your cloud accounts securely using read-only IAM cross-account access. Zero root credentials or passwords required.
              </p>

              <div className="space-y-2">
                <label className="font-bold text-slate-800">Select Provider:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['AWS', 'Azure', 'GCP'].map((p) => (
                    <div key={p} className="p-2.5 rounded-xl border border-blue-500 bg-blue-50/50 text-center font-bold text-slate-900">
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Account / Subscription ID:</label>
                <input 
                  type="text" 
                  defaultValue="1942-8821-0091" 
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Generated External ID (Secure STS):</label>
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-700 select-all">
                  co-ext-8f921-prod-sandbox
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddAccountModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerToast('Simulated account connection verified via AWS STS!');
                  setShowAddAccountModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Verify & Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: RESOURCE INSPECT MODAL
         ======================================================== */}
      {inspectResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  Resource Telemetry Details
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setInspectResource(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-sm text-slate-900">{inspectResource.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{inspectResource.id}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Provider & Service</div>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectResource.provider} • {inspectResource.service}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Instance Sizing</div>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectResource.type}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Region</div>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectResource.region}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Monthly Run Rate</div>
                  <div className="font-bold text-slate-900 mt-0.5">{formatMoney(inspectResource.monthlyCostUSD)}</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 space-y-1">
                <div className="font-bold text-xs">30-Day CloudWatch Telemetry</div>
                <div className="text-[11px] text-blue-800">
                  Average CPU: {inspectResource.utilization}% • Peak Memory: {Math.round(inspectResource.utilization * 1.8)}% • IOPS Headroom: 82%
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectResource(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FLOATING AI FINOPS COPILOT LAUNCHER BUTTON
         ======================================================== */}
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

      {/* ========================================================
          AI FINOPS COPILOT DRAWER (OptiBot)
         ======================================================== */}
      <AiAssistantDrawer
        isOpen={showAiAssistant}
        onClose={() => setShowAiAssistant(false)}
        totalSpendFormatted={formatMoney(totalSpendUSD)}
        realizedSavingsFormatted={formatMoney(realizedSavingsUSD)}
        healthScore={healthScore}
        onOpenRec={(recId) => {
          setShowAiAssistant(false);
          setActiveTab('recommendations');
          const rec = recommendations.find((r) => r.id === recId);
          if (rec) setShowExecModal(rec);
        }}
        onOpenReport={() => {
          setShowAiAssistant(false);
          setShowReportModal(true);
        }}
        onSwitchTab={(tab) => {
          setShowAiAssistant(false);
          setActiveTab(tab as any);
        }}
      />

    </div>
  );
};
