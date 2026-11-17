import React, { useState } from 'react';
import { 
  HelpCircle, 
  LifeBuoy, 
  BookOpen, 
  Headphones, 
  Search, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface HelpSupportViewProps {
  onOpenAiAssistant: () => void;
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ onOpenAiAssistant }) => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketProvider, setTicketProvider] = useState('AWS');
  const [ticketSeverity, setTicketSeverity] = useState('Medium');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      id: 'guide-1',
      title: 'Connecting AWS via Cross-Account IAM Role & STS External ID',
      category: 'Authentication & Security',
      readTime: '3 min read',
      snippet: 'Complete walkthrough of deploying the CloudFormation stack, assigning SecurityAudit managed policies, and verifying STS trust relationships.',
    },
    {
      id: 'guide-2',
      title: 'Understanding AI Rightsizing Risk Levels & Confidence Scores',
      category: 'FinOps Optimization',
      readTime: '4 min read',
      snippet: 'How our multi-agent model evaluates 30-day CloudWatch P95 CPU, peak memory, and network IOPS before grading recommendation risk as Low, Medium, or High.',
    },
    {
      id: 'guide-3',
      title: 'Configuring Scheduled Off-Hours Automation Rules',
      category: 'Automation & Governance',
      readTime: '2 min read',
      snippet: 'Set up cron rules to automatically stop non-production RDS Aurora clusters and EC2 auto-scaling groups on nights and weekends.',
    },
    {
      id: 'guide-4',
      title: 'Generating Boardroom FinOps Reports & CSV Financial Ledgers',
      category: 'Reporting & Compliance',
      readTime: '3 min read',
      snippet: 'How to customize report scopes, export granular CSV billing audit files, and prepare print-ready executive PDF summaries.',
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    const ticketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketSubmitted(ticketId);
    setTicketSubject('');
    setTicketDesc('');
  };

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>24/7 FinOps Engineering Support</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white">
            Help Center & Technical Support
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Access step-by-step setup documentation, search troubleshooting guides, or chat directly with our multi-agent AI copilot.
          </p>
        </div>

        {/* Live AI Copilot Quick Action */}
        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>Launch AI Copilot Chat</span>
        </button>
      </div>

      {/* Operational Health Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">All Systems Operational</div>
            <div className="text-[10px] text-slate-500">99.98% platform uptime SLA</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">AWS API Discovery</div>
            <div className="text-[10px] text-slate-500">Normal latency: 22ms sync rate</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Security Audit Logs</div>
            <div className="text-[10px] text-slate-500">Immutable CloudTrail active</div>
          </div>
        </div>
      </div>

      {/* 2-Column: Knowledge Base Search & Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Knowledge Base & Guides */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">
                Setup Guides & Technical Documentation
              </h3>
              <p className="text-xs text-slate-500">
                Curated documentation for DevOps engineers and cloud administrators
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search troubleshooting guides, IAM policies, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {/* Guides List */}
            <div className="space-y-2.5">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded">
                      {guide.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{guide.readTime}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#2563EB] transition-colors flex items-center justify-between">
                    <span>{guide.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {guide.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Submit Support Ticket Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Open a Priority Support Ticket
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct access to our senior cloud architects & FinOps engineers
              </p>
            </div>

            {ticketSubmitted ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">Ticket Created Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your reference ID: <strong className="font-mono">{ticketSubmitted}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    A senior FinOps engineer will respond to your registered email within the plan SLA.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTicketSubmitted(null)}
                  className="px-4 py-2 rounded-xl bg-white text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Subject / Issue Overview</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Assistance configuring cross-account IAM role"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Cloud Provider</label>
                    <select
                      value={ticketProvider}
                      onChange={(e) => setTicketProvider(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <option value="AWS">AWS (Amazon Web Services)</option>
                      <option value="Azure">Microsoft Azure</option>
                      <option value="GCP">Google Cloud Platform</option>
                      <option value="Multi-Cloud">Multi-Cloud General</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Severity</label>
                    <select
                      value={ticketSeverity}
                      onChange={(e) => setTicketSeverity(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <option value="Low">Low (General Inquiry)</option>
                      <option value="Medium">Medium (Configuration / Advice)</option>
                      <option value="High">High (Production Urgent)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Detailed Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about the resources, account IDs, or error codes..."
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Support Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
