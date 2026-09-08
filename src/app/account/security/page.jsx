"use client";

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import SecuritySettingsCard from '../../../components/SecuritySettingsCard';

export default function AccountSecurityPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070a] text-slate-900 dark:text-slate-100 font-sans pt-24 pb-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Identity & Access Security
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Account & Password Security
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
                Manage your credentials, change password, or request an email reset link.
              </p>
            </div>
          </div>
        </div>

        {/* Auth Check Guard */}
        {!user ? (
          <div className="bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sign In Required</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Please sign in with your student or administrator account to manage your security credentials.
            </p>
            <Link
              href="/auth"
              className="inline-block px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wide transition shadow-sm"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <SecuritySettingsCard />
        )}
      </div>
    </div>
  );
}
