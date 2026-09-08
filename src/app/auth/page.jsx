"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Security & Brute Force Defense
  const [honeypot, setHoneypot] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState(null);
  
  const router = useRouter();
  const { login, register } = useAuth();

  // Cooldown countdown effect
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (honeypot) {
      setForgotStatus({ success: false, message: 'Security validation failed.' });
      return;
    }

    setForgotLoading(true);
    setForgotStatus(null);

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() })
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotStatus({
          success: false,
          message: data.detail || 'Failed to dispatch reset email. Please try again.'
        });
      } else {
        setForgotStatus({
          success: true,
          message: data.message || 'If an account matches that email, a password reset link has been dispatched.',
          dev_reset_url: data.dev_reset_url
        });
      }
    } catch {
      setForgotStatus({
        success: false,
        message: 'Failed to reach the server. Please try again.'
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Honeypot bot detection
    if (honeypot) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setError('Security verification failed. Please try again.');
      return;
    }

    // Cooldown lockout check
    if (cooldown > 0) {
      setError(`Access temporarily paused. Please wait ${cooldown} seconds before retrying.`);
      return;
    }

    if (isLogin) {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
        if (result.status === 429 || (result.message && result.message.toLowerCase().includes('restricted'))) {
          setCooldown(60);
        }
      } else {
        router.push('/');
        router.refresh();
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      
      const result = await register(name, email, password);
      if (!result.success) {
        setError(result.message);
        if (result.status === 429) setCooldown(60);
      } else {
        setSuccessMsg('Account registered successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1200);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070a] flex items-center justify-center p-6 pt-24 pb-16 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl dark:shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-lg font-mono font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            ▲
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isLogin ? 'Sign In to Your Account' : 'Create Student Profile'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            {isLogin ? 'Access your curriculum, assessments, and telemetry.' : 'Join the engineering and security learning cluster.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              isLogin 
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              !isLogin 
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono relative z-10">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-slate-700 dark:text-slate-300 text-xs">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none text-xs"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-300 text-xs">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-300 text-xs">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none text-xs"
              />
            </div>
            {isLogin && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotStatus(null);
                    setShowForgotPassword(true);
                  }}
                  className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Invisible Honeypot Trap for automated scripts */}
          <div className="opacity-0 absolute -top-[9999px] -left-[9999px] h-0 w-0 pointer-events-none select-none overflow-hidden" aria-hidden="true" tabIndex={-1}>
            <label htmlFor="auth_security_trap">Ignore this field</label>
            <input
              type="text"
              id="auth_security_trap"
              name="auth_security_trap"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={cooldown > 0}
            className={`w-full py-3.5 rounded-xl text-xs font-mono uppercase tracking-wide transition flex items-center justify-center gap-2 mt-2 font-bold ${
              cooldown > 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
          >
            {cooldown > 0 ? (
              <span>Locked ({cooldown}s)</span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In & Access Platform' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Overlay */}
        {showForgotPassword && (
          <div className="absolute inset-0 bg-white dark:bg-[#090d16] p-8 rounded-3xl z-20 flex flex-col justify-between animate-fade-in border border-emerald-500/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-mono font-bold text-xs">
                    ▲
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Recover Password</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-mono font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                Enter your registered account email. A secure, 15-minute single-use reset link will be dispatched.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 text-xs">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      placeholder="admin@pentabrid.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>

                {forgotStatus && (
                  <div className={`text-xs p-3.5 rounded-xl border space-y-2 ${
                    forgotStatus.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      {forgotStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />}
                      <span className="font-mono text-xs">{forgotStatus.message}</span>
                    </div>
                    {forgotStatus.dev_reset_url && (
                      <div className="pt-2 border-t border-emerald-500/20">
                        <span className="text-[10px] uppercase font-mono block text-emerald-400 font-bold mb-1">Direct Reset Link:</span>
                        <a
                          href={forgotStatus.dev_reset_url}
                          className="font-mono text-[11px] underline break-all text-cyan-400 hover:text-cyan-300 block"
                        >
                          {forgotStatus.dev_reset_url} &rarr;
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono uppercase tracking-wide transition shadow-sm flex items-center justify-center gap-2"
                >
                  {forgotLoading ? 'Dispatching Link...' : 'Send Password Reset Link'}
                </button>
              </form>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="text-xs text-center font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition pt-4"
            >
              &larr; Return to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
