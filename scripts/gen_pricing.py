import os

def write_page(path, content):
    p = os.path.normpath(path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {p}")

# 1. Pricing
write_page("src/app/pricing/page.jsx", """'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
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
          <Link href="/missions" className="text-xs px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold">Start Free</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
            Transparent Pricing for High-Mastery Learning
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            No hidden fees, no fake scarcity. Choose between free self-directed adaptive learning or premium full-curriculum tracks with verified certification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Free Plan</div>
              <div className="text-3xl font-extrabold text-slate-100 mb-4">$0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
              <p className="text-xs text-slate-400 mb-6">Explore multi-domain knowledge graphs and take diagnostic probes to baseline your competence.</p>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full Knowledge Graph Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Fast-Track Diagnostic Probes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 5-D Competence Radar</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Basic Adaptive Recommendations</li>
              </ul>
            </div>
            <Link
              href="/missions"
              onClick={() => trackEvent('checkout_started', { tier: 'free' })}
              className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-xs font-semibold text-center transition-all"
            >
              Start Free
            </Link>
          </div>

          <div className="rounded-2xl border-2 border-emerald-500 bg-slate-900/80 p-8 flex flex-col justify-between relative shadow-xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-full">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Pro Mission</div>
              <div className="text-3xl font-extrabold text-slate-100 mb-1">$19 <span className="text-xs font-normal text-slate-500">/ month</span></div>
              <div className="text-[11px] text-slate-500 mb-4">or 2,200 BDT via bKash</div>
              <p className="text-xs text-slate-400 mb-6">For scholars requiring deep socratic tutoring, closed-loop prerequisite repair, and capstone evaluations.</p>
              <ul className="space-y-3 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Everything in Free</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Prerequisite Repairs</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Socratic AI Teacher Hints</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Applied Capstone Project Submissions</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Ebbinghaus Spaced Review Priority</li>
              </ul>
            </div>
            <Link
              href="/missions"
              onClick={() => trackEvent('checkout_started', { tier: 'pro_monthly', price: 19.0 })}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold text-center shadow-lg shadow-emerald-500/20 transition-all"
            >
              Upgrade to Pro
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Course Track Purchase</div>
              <div className="text-3xl font-extrabold text-slate-100 mb-4">$49.99 <span className="text-xs font-normal text-slate-500">/ one-time</span></div>
              <p className="text-xs text-slate-400 mb-6">Lifetime access to a structured curriculum with Module Bypass Exams and verified graduation credentials.</p>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Complete Structured Syllabus</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Module Bypass Exams</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Cryptographic SHA-256 Certificate</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Lifetime Updates</li>
              </ul>
            </div>
            <Link
              href="/courses"
              onClick={() => trackEvent('checkout_started', { tier: 'course_track' })}
              className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-xs font-semibold text-center transition-all"
            >
              Browse Courses
            </Link>
          </div>
        </div>

        <div id="bypass" className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/30 p-8">
          <h2 className="text-lg font-bold text-slate-100 mb-2">A La Carte Options & Micro-Transactions</h2>
          <p className="text-xs text-slate-400 mb-6">Convenient individual options without requiring recurring commitments.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60">
              <div className="font-semibold text-slate-200 mb-1">Instant Module Bypass</div>
              <div className="text-emerald-400 font-bold mb-2">$2.99 – $4.99 / module (or 299 – 499 BDT)</div>
              <p className="text-slate-400">Unlock downstream modules instantly when you already possess competence without taking the exam.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60">
              <div className="font-semibold text-slate-200 mb-1">Verified Certificate Issuance</div>
              <div className="text-cyan-400 font-bold mb-2">$25.00 / certificate</div>
              <p className="text-slate-400">Tamper-proof digital credential signed on our public cryptographic ledger upon capstone verification.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
""")
