import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  ArrowRight, 
  Loader2, 
  Building2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface PaymentSuccessData {
  transactionId: string;
  utrNumber: string;
  amountINR: number;
  planId: string;
  planName: string;
  timestamp: string;
  bankName: string;
  payeeUpi: string;
}

interface MockUpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  amountINR: number;
  companyName?: string;
  onPaymentSuccess: (data: PaymentSuccessData) => void;
}

export const MockUpiPaymentModal: React.FC<MockUpiPaymentModalProps> = ({
  isOpen,
  onClose,
  planId,
  planName,
  amountINR,
  companyName = 'Your Organization',
  onPaymentSuccess,
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [utrInput, setUtrInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'qr' | 'processing' | 'success'>('qr');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const payeeUpi = 'cloudoptimizer@sbi';
  const merchantName = 'Cloud Optimizer FinOps Technologies Pvt Ltd';
  const bankName = 'State Bank of India (SBI Corporate Banking)';

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(600);
      setPaymentStep('qr');
      setProcessing(false);
      setErrorMsg(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(payeeUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Simulate Instant App Payment
  const handleSimulatePayment = async () => {
    setErrorMsg(null);
    setProcessing(true);
    setPaymentStep('processing');

    // Simulate SBI Gateway round-trip
    await new Promise((r) => setTimeout(r, 1400));

    const simulatedUtr = `UPI-SBI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const txId = `TXN-SBI-${Date.now().toString().slice(-8)}`;

    const paymentRecord: PaymentSuccessData = {
      transactionId: txId,
      utrNumber: simulatedUtr,
      amountINR,
      planId,
      planName,
      timestamp: new Date().toISOString(),
      bankName,
      payeeUpi,
    };

    // Record transaction in localStorage for Admin Dashboard ledger
    try {
      const existing = JSON.parse(localStorage.getItem('cloud_optimizer_transactions') || '[]');
      existing.unshift({
        ...paymentRecord,
        companyName,
        status: 'Verified',
      });
      localStorage.setItem('cloud_optimizer_transactions', JSON.stringify(existing));
    } catch (e) {
      console.error('Storage error:', e);
    }

    setPaymentStep('success');
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      onPaymentSuccess(paymentRecord);
    }, 1200);
  };

  // Manual UTR submission
  const handleVerifyUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrInput.trim() || utrInput.trim().length < 8) {
      setErrorMsg('Please enter a valid 12-digit UPI Reference / UTR Number.');
      return;
    }
    handleSimulatePayment();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/90 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
        
        {/* Header: SBI Brand + Verified Merchant Pill */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* SBI Circular Logo Vector */}
            <div className="w-10 h-10 rounded-2xl bg-[#002D62] text-white flex items-center justify-center shadow-xs">
              <span className="font-extrabold text-sm tracking-tighter">SBI</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  SBI UPI SmartPay
                </h3>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#002D62] border border-blue-200">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Official Gateway for {merchantName}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentStep === 'success' ? (
          /* ================= PAYMENT SUCCESS SCREEN ================= */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-extrabold text-xl text-slate-900">
                Payment Verified by State Bank of India
              </h4>
              <p className="text-xs text-slate-600">
                ₹{amountINR.toLocaleString('en-IN')}.00 received successfully. Activating your {planName}...
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-mono text-emerald-800">
              Subscription Status: ACTIVE &bull; Redirecting to Dashboard...
            </div>
          </div>
        ) : (
          /* ================= QR PAYMENT SCREEN ================= */
          <div className="space-y-4">
            
            {/* Amount & Plan Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-blue-600">
                  Subscription Activation
                </div>
                <div className="font-display font-extrabold text-sm text-slate-900 mt-0.5">
                  {planName} &bull; {companyName}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-medium">Payable Amount</div>
                <div className="font-display font-black text-2xl text-slate-900">
                  ₹{amountINR.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* UPI QR Display Container */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col items-center justify-center space-y-3">
              
              <div className="relative p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                {/* Visual SVG QR Code */}
                <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer Frame */}
                  <rect width="200" height="200" fill="white" />
                  
                  {/* Position Markers (Top-Left, Top-Right, Bottom-Left) */}
                  <rect x="15" y="15" width="45" height="45" rx="8" fill="#002D62" />
                  <rect x="22" y="22" width="31" height="31" rx="4" fill="white" />
                  <rect x="29" y="29" width="17" height="17" rx="2" fill="#002D62" />

                  <rect x="140" y="15" width="45" height="45" rx="8" fill="#002D62" />
                  <rect x="147" y="22" width="31" height="31" rx="4" fill="white" />
                  <rect x="154" y="29" width="17" height="17" rx="2" fill="#002D62" />

                  <rect x="15" y="140" width="45" height="45" rx="8" fill="#002D62" />
                  <rect x="22" y="147" width="31" height="31" rx="4" fill="white" />
                  <rect x="29" y="154" width="17" height="17" rx="2" fill="#002D62" />

                  {/* Stylized QR Matrix Pattern */}
                  <rect x="70" y="20" width="10" height="10" fill="#1E293B" />
                  <rect x="90" y="20" width="10" height="10" fill="#1E293B" />
                  <rect x="110" y="20" width="10" height="10" fill="#1E293B" />
                  
                  <rect x="70" y="40" width="20" height="10" fill="#1E293B" />
                  <rect x="100" y="40" width="10" height="20" fill="#1E293B" />
                  <rect x="120" y="40" width="10" height="10" fill="#1E293B" />

                  <rect x="20" y="70" width="10" height="10" fill="#1E293B" />
                  <rect x="40" y="70" width="20" height="10" fill="#1E293B" />
                  <rect x="70" y="70" width="10" height="20" fill="#1E293B" />
                  <rect x="90" y="70" width="20" height="10" fill="#1E293B" />
                  <rect x="120" y="70" width="20" height="10" fill="#1E293B" />
                  <rect x="150" y="70" width="10" height="20" fill="#1E293B" />
                  <rect x="170" y="70" width="10" height="10" fill="#1E293B" />

                  <rect x="30" y="90" width="10" height="20" fill="#1E293B" />
                  <rect x="50" y="90" width="10" height="10" fill="#1E293B" />
                  <rect x="110" y="90" width="20" height="10" fill="#1E293B" />
                  <rect x="140" y="90" width="20" height="10" fill="#1E293B" />

                  <rect x="20" y="120" width="20" height="10" fill="#1E293B" />
                  <rect x="70" y="110" width="10" height="30" fill="#1E293B" />
                  <rect x="90" y="110" width="20" height="10" fill="#1E293B" />
                  <rect x="120" y="110" width="10" height="20" fill="#1E293B" />
                  <rect x="140" y="120" width="20" height="10" fill="#1E293B" />
                  <rect x="170" y="110" width="10" height="30" fill="#1E293B" />

                  <rect x="70" y="150" width="20" height="10" fill="#1E293B" />
                  <rect x="100" y="140" width="10" height="20" fill="#1E293B" />
                  <rect x="120" y="150" width="20" height="20" fill="#1E293B" />
                  <rect x="150" y="150" width="10" height="10" fill="#1E293B" />
                  <rect x="170" y="150" width="10" height="20" fill="#1E293B" />

                  <rect x="70" y="170" width="10" height="10" fill="#1E293B" />
                  <rect x="90" y="170" width="20" height="10" fill="#1E293B" />
                  <rect x="140" y="170" width="20" height="10" fill="#1E293B" />

                  {/* Center Badge for SBI */}
                  <circle cx="100" cy="100" r="18" fill="white" stroke="#002D62" strokeWidth="2.5" />
                  <text x="100" y="104" textAnchor="middle" fill="#002D62" fontSize="9" fontWeight="900" fontFamily="sans-serif">SBI</text>
                </svg>

                {/* Expiration Timer Badge */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs border border-slate-700">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Expires in {formatTimer(timeLeft)}</span>
                </div>
              </div>

              {/* Supported UPI Apps Row */}
              <div className="text-center pt-1 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Scan with any UPI App
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">BHIM SBI</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Google Pay</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Paytm</span>
                </div>
              </div>

            </div>

            {/* UPI ID Pill with Copy */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <span className="text-slate-400 block text-[10px] font-bold">UPI ID:</span>
                <span className="font-mono font-bold text-slate-800 truncate block">{payeeUpi}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer text-xs"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1-Click Sandbox Simulation Button */}
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={processing}
              className="w-full py-3 rounded-2xl bg-[#002D62] hover:bg-[#001D40] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying with SBI UPI Switch...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Simulate Instant UPI Payment (Demo)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Manual UTR Verification Accordion */}
            <form onSubmit={handleVerifyUtr} className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500 font-medium">
                Already paid via your mobile app? Enter 12-digit UTR:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 432190887123"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                >
                  Verify UTR
                </button>
              </div>
            </form>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit Encrypted Mock UPI Sandbox &bull; State Bank of India</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
