'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      setVerifyError('Missing password reset security token in URL.');
      return;
    }

    fetch('/api/v1/auth/verify-reset-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenValid(true);
          setUserEmail(data.email);
          setUserName(data.user_name);
        } else {
          setTokenValid(false);
          setVerifyError(data.detail || 'This reset link is invalid or has expired.');
        }
      })
      .catch(() => {
        setTokenValid(false);
        setVerifyError('Could not verify token. Please check your connection.');
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResetError('');

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResetSuccess(true);
        setTimeout(() => {
          router.push('/auth');
        }, 2500);
      } else {
        setResetError(data.detail || 'Failed to reset password. Please try again.');
      }
    } catch {
      setResetError('Network error while resetting password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl dark:shadow-2xl relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-lg font-mono font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Reset Your Password
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
          Create a new secure password for your Pentabrid Engine account.
        </p>
      </div>

      {verifying && (
        <div className="py-12 text-center space-y-3 font-mono text-xs text-slate-400">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Verifying cryptographic security token...</p>
        </div>
      )}

      {!verifying && !tokenValid && (
        <div className="space-y-4">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Reset Link Expired or Invalid</span>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">{verifyError}</p>
            </div>
          </div>
          <Link
            href="/auth"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wide transition shadow-sm block text-center"
          >
            Request a New Reset Link
          </Link>
        </div>
      )}

      {!verifying && tokenValid && resetSuccess && (
        <div className="space-y-4 py-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Password Updated!</h3>
          <p className="text-xs text-slate-400 font-mono">
            Your password has been changed successfully. Redirecting you to sign in...
          </p>
          <Link
            href="/auth"
            className="inline-block py-2.5 px-6 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs font-mono transition"
          >
            Sign In Now &rarr;
          </Link>
        </div>
      )}

      {!verifying && tokenValid && !resetSuccess && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono flex items-center justify-between">
            <span className="text-slate-500">Account:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{userEmail}</span>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-300 text-xs font-medium">New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-300 text-xs font-medium">Confirm New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {resetError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
              <span>{resetError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono uppercase tracking-wide transition shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            <span>{submitting ? 'Updating Password...' : 'Save New Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070a] flex items-center justify-center p-6 pt-24 pb-16 font-sans">
      <Suspense fallback={
        <div className="w-full max-w-md p-12 text-center text-slate-400 font-mono text-xs">
          Loading recovery interface...
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
