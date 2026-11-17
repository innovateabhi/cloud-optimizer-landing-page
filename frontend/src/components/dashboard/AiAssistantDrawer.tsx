import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Zap, 
  ArrowRight, 
  Download, 
  Server, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Minimize2,
  Maximize2,
  RefreshCw
} from 'lucide-react';

export interface AiMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    type: 'open_rec' | 'open_report' | 'switch_tab';
    payload?: any;
  };
}

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRec?: (recId: string) => void;
  onOpenReport?: () => void;
  onSwitchTab?: (tab: string) => void;
  totalSpendFormatted: string;
  realizedSavingsFormatted: string;
  healthScore: number;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onOpenRec,
  onOpenReport,
  onSwitchTab,
  totalSpendFormatted,
  realizedSavingsFormatted,
  healthScore,
}) => {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I'm your CloudOptimizer FinOps AI Copilot. I've analyzed your 68 cloud assets across AWS, Azure, and GCP. You currently have ${realizedSavingsFormatted}/mo in verified realized savings and an optimization health score of ${healthScore}/100. How can I assist you with cost reduction or governance today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggested Prompts
  const quickPrompts = [
    'Where is our highest cloud waste?',
    'How safe is the Graviton3 upgrade?',
    'Summarize multi-cloud spend',
    'How do I add a new AWS account?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: AiMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // AI Context-aware Response Generation
    setTimeout(() => {
      let replyText = '';
      let action: AiMessage['action'] | undefined = undefined;
      const lower = text.toLowerCase();

      if (lower.includes('waste') || lower.includes('highest') || lower.includes('unattached') || lower.includes('idle')) {
        replyText = `Based on current 30-day telemetry, your highest single waste opportunity is on **vol-03f8a1290bb34a91c** (unattached EBS disk with 0 IOPS for 45 days) costing $45/mo, and **dev-orders-aurora-db** running 24/7 without night traffic ($180/mo). Purging orphaned storage and scheduling off-hours shutdowns will immediately save ~$225/month.`;
        action = {
          label: 'View Recommendations Queue',
          type: 'switch_tab',
          payload: 'recommendations',
        };
      } else if (lower.includes('graviton') || lower.includes('rec-2024-001') || lower.includes('safe') || lower.includes('ec2')) {
        replyText = `**Recommendation REC-2024-001** proposes migrating \`prod-analytics-worker-01\` from \`c5.2xlarge\` to \`c6g.xlarge\` (AWS Graviton3). 
        
**Safety Evaluation:**
- **Risk Level:** Low
- **CPU Headroom:** Average 11.8%, peak 26% (well within Graviton3 capacity)
- **SLA Rollback:** 100% automated snapshot created prior to migration
- **Estimated Savings:** +$124/month (+50% compute reduction).`;
        action = {
          label: 'Simulate REC-2024-001 Now',
          type: 'open_rec',
          payload: 'REC-2024-001',
        };
      } else if (lower.includes('summarize') || lower.includes('spend') || lower.includes('multi-cloud') || lower.includes('cost')) {
        replyText = `Here is your current multi-cloud spend snapshot:
- **Total Monthly Run Rate:** ${totalSpendFormatted}
- **AWS Spend:** ~$6,800/mo (Compute 51%, RDS 25%, EBS 14%, S3 7%)
- **Azure Spend:** ~$3,420/mo (VMs & AKS node pools)
- **Google Cloud Spend:** ~$2,220/mo (Cloud SQL & GKE)
- **Verified Savings Captured:** ${realizedSavingsFormatted}/mo`;
        action = {
          label: 'Generate Boardroom Report',
          type: 'open_report',
        };
      } else if (lower.includes('add') || lower.includes('account') || lower.includes('iam') || lower.includes('connect')) {
        replyText = `To link a new AWS or cloud account:
1. Go to **Connected Accounts** in the sidebar.
2. Click **Connect New Account**.
3. Deploy our CloudFormation template to create the \`CloudOptimizerDiscoveryRole\`.
4. Enter your Role ARN and unique External ID.
The connection is **100% read-only** via AWS STS AssumeRole with zero stored API keys.`;
        action = {
          label: 'Open Connected Accounts',
          type: 'switch_tab',
          payload: 'accounts',
        };
      } else {
        replyText = `I have analyzed your query: "${text}". Your cloud environment currently has ${healthScore}/100 efficiency with multiple idle assets identified across ap-south-1, us-east-1, and europe-west1. Would you like me to generate a full executive audit report or inspect specific resources?`;
        action = {
          label: 'Open Executive Reports Generator',
          type: 'open_report',
        };
      }

      const botReply: AiMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[580px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 font-sans">
      
      {/* Header */}
      <div className="bg-[#0F172A] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-200" />
          </div>
          <div>
            <div className="font-display font-extrabold text-sm text-white flex items-center gap-2">
              <span>CloudOptimizer AI Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Multi-Agent FinOps Intelligence • Live
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-[#2563EB] text-white shadow-xs rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed text-xs">
                {msg.text}
              </div>

              {msg.action && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (msg.action?.type === 'open_rec' && onOpenRec) {
                        onOpenRec(msg.action.payload);
                      } else if (msg.action?.type === 'open_report' && onOpenReport) {
                        onOpenReport();
                      } else if (msg.action?.type === 'switch_tab' && onSwitchTab) {
                        onSwitchTab(msg.action.payload);
                      }
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-[11px] transition-colors cursor-pointer border border-blue-200"
                  >
                    <span>{msg.action.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div
                className={`text-[9px] text-right font-mono ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-9">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[10px] font-mono ml-1">FinOps AI thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[11px]">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] text-slate-600 transition-colors cursor-pointer shrink-0 border border-slate-200/80"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask AI anything about your cloud spend..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white disabled:opacity-40 transition-all cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
