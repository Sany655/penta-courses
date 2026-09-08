"use client";

import React, { useState } from 'react';
import { Shield, KeyRound, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SecuritySettingsCard() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeMessage, setChangeMessage] = useState(null);

  const [resetEmailLoading, setResetEmailLoading] = useState(false);
  const [resetEmailNotice, setResetEmailNotice] = useState(null);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setChangeMessage(null);

    if (newPassword.length < 6) {
      setChangeMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeMessage({ type: 'error', text: 'New passwords do not match. Please re-enter.' });
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('penta_access_token') : null;
    if (!token) {
      setChangeMessage({ type: 'error', text: 'Session expired. Please log in again.' });
      return;
    }

    setChangeLoading(true);
    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setChangeMessage({
          type: 'success',
          text: 'Password successfully updated! A security confirmation email has been dispatched.'
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setChangeMessage({
          type: 'error',
          text: data.detail || data.message || 'Failed to update password. Verify your current password.'
        });
      }
    } catch {
      setChangeMessage({ type: 'error', text: 'Network error connecting to security service.' });
    } finally {
      setChangeLoading(false);
    }
  };

  const handleRequestResetEmail = async () => {
    if (!user?.email) return;
    setResetEmailNotice(null);
    setResetEmailLoading(true);

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email.toLowerCase().trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetEmailNotice({
          type: 'success',
          text: `Reset link dispatched to ${user.email}. Valid for 15 minutes.`,
          dev_url: data.dev_reset_url
        });
      } else {
        setResetEmailNotice({
          type: 'error',
          text: data.detail || data.message || 'Could not send reset email. Please try again.'
        });
      }
    } catch {
      setResetEmailNotice({ type: 'error', text: 'Network error requesting password reset email.' });
    } finally {
      setResetEmailLoading(false);
    }
  };

  const isAdmin = (user?.role || '').toUpperCase() === 'ADMIN';

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Identity Card */}
      <div className="bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
              Active Authenticated Account
            </span>
            <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {user?.name || user?.full_name || 'Account User'}
            </div>
            <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
              {user?.email || 'user@pentabrid.com'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border flex items-center gap-2 ${
              isAdmin
                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {isAdmin ? 'Administrator Access' : 'Verified Learner'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Direct Password Update */}
        <div className="bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-500" /> Direct Password Update
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Verify your current password to commit a new password immediately.
              </p>
            </div>

            {changeMessage && (
              <div className={`text-xs p-3.5 rounded-2xl flex items-center gap-2.5 font-mono ${
                changeMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}>
                {changeMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                )}
                <span>{changeMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-1 text-xs font-mono">
                <label className="text-slate-700 dark:text-slate-300">Current Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <label className="text-slate-700 dark:text-slate-300">New Password</label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <label className="text-slate-700 dark:text-slate-300">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changeLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wide transition shadow-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {changeLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Commit Password Change</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Email Recovery Loop */}
        <div className="bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500" /> Email Password Reset Link
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Forgot your current password? We can dispatch a single-use cryptographic reset link to your verified address.
              </p>
            </div>

            {resetEmailNotice && (
              <div className={`text-xs p-3.5 rounded-2xl space-y-2 font-mono ${
                resetEmailNotice.type === 'success'
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  {resetEmailNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  )}
                  <span>{resetEmailNotice.text}</span>
                </div>
                {resetEmailNotice.dev_url && (
                  <div className="mt-2 p-2 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-[10px] break-all">
                    <span className="text-cyan-400 block font-bold mb-1">Local Test URL:</span>
                    <a href={resetEmailNotice.dev_url} className="text-slate-300 underline hover:text-white">
                      {resetEmailNotice.dev_url}
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#05070a] border border-slate-200 dark:border-slate-800/80 space-y-3">
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Destination Email:
              </div>
              <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                {user?.email || 'Loading...'}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 font-mono">
                Links are valid for 15 minutes and immediately expire once used. Rate limited to protect delivery quotas.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleRequestResetEmail}
              disabled={resetEmailLoading || !user?.email}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wide transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {resetEmailLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching Email...</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Reset Link to My Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Security Telemetry & Audit Banner */}
      <div className="bg-slate-50 dark:bg-[#070b12] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-bold">Automated Brute-Force Rate Limiting Active</div>
            <div className="text-slate-500 text-[11px]">5 failed login attempts trigger a 15-minute lockout with IP tracking.</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-emerald-500 font-bold">SHA-256 / PBKDF2</span>
          <div className="text-slate-500 text-[11px]">Cryptographic Password Hashing</div>
        </div>
      </div>
    </div>
  );
}
