'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Check, Target, Sparkles, ShieldCheck } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function PricingPage() {
  useEffect(() => {
    trackEvent('landing_view', { page: 'pricing' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse</span>
          </Link>
          <Link href="/missions" className="text-xs px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>Free Diagnostic</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Early Cohort Founder Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
            Simple, Transparent Outcome-Driven Pricing
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Start with our free 3-minute diagnostic to map your knowledge gaps. Upgrade to our limited-slot Founder Track Pass for lifetime course access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Free Diagnostic Tier */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Free Diagnostic</div>
              <div className="text-3xl font-extrabold text-slate-100 mb-4">$0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
              <p className="text-xs text-slate-400 mb-6">Take the 3-minute diagnostic probe to discover your exact prerequisite gaps with genuine pedagogical feedback.</p>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full Knowledge Graph Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Real-time 3-Minute Diagnostic Probes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 5-D Competence Radar Visualization</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Prerequisite Gap Identification</li>
              </ul>
            </div>
            <Link
              href="/missions"
              onClick={() => trackEvent('checkout_started', { tier: 'free_diagnostic' })}
              className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-xs font-semibold text-center transition-all flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Take Free Diagnostic</span>
            </Link>
          </div>

          {/* Founder Track Pass */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-slate-900/90 p-8 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/15">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-md">
              Early Founder Cohort
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Founder Track Pass</div>
              <div className="text-3xl font-extrabold text-slate-100 mb-1">$29 <span className="text-xs font-normal text-slate-500">/ one-time</span></div>
              <div className="text-[11px] text-slate-500 mb-4">or 3,300 BDT via bKash • Limited to First 100 Learners</div>
              <p className="text-xs text-slate-400 mb-6">Full lifetime access to one complete Course Track of your choice, including Fast-Track Bypass Exams and verified credential.</p>
              <ul className="space-y-3 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full Lifetime Course Track Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Fast-Track Module Bypass Exams</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> SHA-256 Verified Graduation Certificate</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Socratic AI Tutor Guidance</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Direct founder cohort feedback access</li>
              </ul>
            </div>
            <Link
              href="/missions"
              onClick={() => trackEvent('checkout_started', { tier: 'founder_track', price: 29.0 })}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold text-center shadow-lg shadow-emerald-500/25 transition-all"
            >
              Claim Founder Track ($29)
            </Link>
          </div>

          {/* Standard Course Track */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Standard Course Track</div>
              <div className="text-3xl font-extrabold text-slate-100 mb-4">$49.99 <span className="text-xs font-normal text-slate-500">/ one-time</span></div>
              <p className="text-xs text-slate-400 mb-6">Standard pricing after the first 100 founder slots are filled. Lifetime access to the structured curriculum.</p>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Complete Structured Syllabus</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Module Bypass Exams</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Cryptographic SHA-256 Certificate</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Lifetime Updates</li>
              </ul>
            </div>
            <Link
              href="/courses"
              onClick={() => trackEvent('checkout_started', { tier: 'standard_course_track' })}
              className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-xs font-semibold text-center transition-all"
            >
              Browse Course Tracks
            </Link>
          </div>
        </div>

        {/* Micro-Transactions Breakdown */}
        <div id="bypass" className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/30 p-8">
          <h2 className="text-lg font-bold text-slate-100 mb-2">Individual Module Options & Micro-Transactions</h2>
          <p className="text-xs text-slate-400 mb-6">A la carte unlocks for self-directed study.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60">
              <div className="font-semibold text-slate-200 mb-1">Instant Module Bypass</div>
              <div className="text-emerald-400 font-bold mb-2">$2.99 – $4.99 / module (or 299 – 499 BDT)</div>
              <p className="text-slate-400">Unlock downstream curriculum modules instantly without completing prior lessons.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60">
              <div className="font-semibold text-slate-200 mb-1">Verified Certificate Issuance</div>
              <div className="text-cyan-400 font-bold mb-2">$25.00 / certificate</div>
              <p className="text-slate-400">Tamper-proof digital credential signed on our public cryptographic ledger upon capstone completion.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
