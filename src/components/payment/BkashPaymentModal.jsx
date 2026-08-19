import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Copy, Check, AlertCircle, 
  Smartphone, ShieldCheck, ArrowRight, Zap, X, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

export const BkashPaymentModal = ({
  isOpen,
  onClose,
  itemTitle = "Module Gatekeeper Instant Bypass",
  itemId,
  itemType = "module", // 'module' | 'course'
  amountBdt = null,
  onSuccess
}) => {
  const { user, bkashSettings, submitBkashPayment } = useAuth();
  
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentBkash = bkashSettings || {
    phoneNumber: '01712-345678',
    accountType: 'Personal',
    defaultFeeBdt: '250',
    instructions: 'Send Money to the bKash number below, then enter your TrxID to unlock access.'
  };

  const finalAmount = amountBdt || currentBkash.defaultFeeBdt || '250';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentBkash.phoneNumber.replace(/[^0-9]/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!user || !user.email) {
      setError('You must be logged in to verify payment and associate access with your account.');
      return;
    }

    if (!trxId.trim() || trxId.trim().length < 6) {
      setError('Please enter a valid bKash Transaction ID (minimum 6 characters, e.g. 8N7A6D5E).');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const result = submitBkashPayment({
        itemType,
        itemId,
        itemTitle,
        amount: `${finalAmount} BDT`,
        trxId: trxId.trim().toUpperCase(),
        senderPhone: senderPhone.trim() || 'N/A'
      });

      setIsVerifying(false);

      if (result.success) {
        setIsSuccess(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          if (onSuccess) onSuccess(result);
          onClose();
          setIsSuccess(false);
          setTrxId('');
          setSenderPhone('');
        }, 1800);
      } else {
        setError(result.message || 'Payment verification failed.');
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          className="bg-[#090d16] border border-pink-500/30 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(226,19,110,0.15)] relative overflow-hidden"
        >
          {/* Top Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
            <div className="flex items-center space-x-3">
              {/* bKash Icon / Badge */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e2136e] to-[#ff4b93] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(226,19,110,0.4)]">
                ৳
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">bKash Instant Gateway</h3>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono font-bold uppercase">
                    Manual Verification
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Fast-track curriculum authorization</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Celebration View */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white">Payment Verified & Authorized!</h4>
                <p className="text-sm text-slate-300 font-mono mt-1">
                  Access unlocked for: <span className="text-cyan-400 font-bold">{itemTitle}</span>
                </p>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Transaction ID: <span className="text-emerald-400 font-bold">{trxId.toUpperCase()}</span> recorded to session ledger.
              </div>
            </div>
          ) : (
            <div className="space-y-5 relative z-10">
              {/* Item Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Purchasing Access</span>
                  <div className="text-sm font-bold text-white line-clamp-1">{itemTitle}</div>
                  <div className="text-xs text-slate-400">Authenticated user: <span className="text-emerald-400 font-mono">{user?.email || 'Guest'}</span></div>
                </div>
                <div className="text-right pl-4">
                  <div className="text-xl font-extrabold text-pink-400 font-mono">৳{finalAmount}</div>
                  <div className="text-[10px] text-slate-500 font-mono">BDT Currency</div>
                </div>
              </div>

              {/* bKash Payment Instructions Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#e2136e]/10 via-slate-900/60 to-slate-950/90 border border-pink-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-pink-300 font-bold font-mono uppercase flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    bKash {currentBkash.accountType} Number
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Type: {currentBkash.accountType === 'Merchant' ? 'Payment' : 'Send Money'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/60 border border-pink-500/40 rounded-xl px-4 py-3">
                  <span className="text-lg sm:text-xl font-mono font-extrabold text-white tracking-widest">
                    {currentBkash.phoneNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-1 pt-1 leading-relaxed">
                  <p className="font-medium text-slate-200">Instructions:</p>
                  <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-0.5">
                    <li>Open bKash app or dial <code className="text-pink-400">*247#</code>.</li>
                    <li>Choose <strong className="text-slate-200">{currentBkash.accountType === 'Merchant' ? 'Payment' : 'Send Money'}</strong> to the number above.</li>
                    <li>Enter amount <strong className="text-emerald-400">৳{finalAmount}</strong> and use your email as Reference.</li>
                    <li>Copy the received <strong className="text-pink-300">Transaction ID (TrxID)</strong> and submit below.</li>
                  </ol>
                </div>
              </div>

              {/* Authentication Warning if not logged in */}
              {(!user || !user.email) && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Please log in to save your unlocked access.</span>
                  </div>
                  <Link
                    to="/auth"
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition shrink-0"
                  >
                    Login
                  </Link>
                </div>
              )}

              {/* Transaction Submission Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-400">
                      bKash TrxID <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 8N7A6D5E4F"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl text-white font-mono text-xs uppercase tracking-wider focus:outline-none transition shadow-inner"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-400">
                      Sender Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl text-white font-mono text-xs focus:outline-none transition shadow-inner"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || !trxId.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#e2136e] via-pink-600 to-[#e2136e] hover:from-[#d01063] hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs font-mono tracking-wide uppercase transition shadow-[0_0_25px_rgba(226,19,110,0.35)] flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Verifying TrxID & Authorizing Access...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify TrxID & Unlock Access</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Modal Footer Security Badge */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 relative z-10">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              RBAC Cryptographic Authorization
            </span>
            <span className="text-slate-400">24/7 Admin Audit Ready</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BkashPaymentModal;
