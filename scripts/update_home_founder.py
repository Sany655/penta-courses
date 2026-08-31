import os

homepage_code = """'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Brain, Network, ShieldCheck, ArrowRight, Layers, Target, CheckCircle2, Zap } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function HomePage() {
  useEffect(() => {
    trackEvent('landing_view', { page: 'home' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              P
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              PentaCourse
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/domains" className="hover:text-emerald-400 transition-colors">Domains</Link>
            <Link href="/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
            <Link href="/adaptive-learning" className="hover:text-emerald-400 transition-colors">Adaptive Engine</Link>
            <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link>
            <Link href="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/missions"
              onClick={() => trackEvent('cta_click', { cta: 'take_free_diagnostic_nav' })}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Free Diagnostic</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Outcome-Driven Adaptive Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
          Build a <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Rigorous Working Understanding</span> of Complex Domains
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Master high-stakes fields with active cognitive sandboxes. Whether building working competence in <strong>Clinical ABG & DKA Resuscitation</strong>, <strong>Constitutional Jurisprudence</strong>, <strong>Macroeconomics</strong>, or <strong>High-Concurrency Distributed Systems</strong>, our engine models your knowledge as a 5-D competence vector to eliminate redundant drills and repair root-cause gaps.
        </p>

        {/* Primary Outcome Funnel CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-12">
          <Link
            href="/missions"
            onClick={() => trackEvent('cta_click', { cta: 'take_free_3min_diagnostic_hero' })}
            className="w-full sm:w-auto px-8 py-4 text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <Target className="w-4 h-4 text-slate-950" />
            <span>Take the Free 3-Minute Diagnostic</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/knowledge-graph"
            onClick={() => trackEvent('cta_click', { cta: 'explore_knowledge_graph_hero' })}
            className="w-full sm:w-auto px-6 py-4 text-sm font-semibold rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Explore Knowledge Graph</span>
          </Link>
        </div>

        <p className="text-xs text-slate-400 max-w-md mx-auto mb-16">
          ✓ Real interactive probes & 5-D radar • ✓ Immediate gap feedback • ✓ No credit card required
        </p>

        {/* Diagnostic Value Demonstration Banner */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-8 sm:p-10 mb-20 text-left shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">Interactive Diagnostic Flow</span>
              <h2 className="text-xl font-bold text-slate-100">How the Free Diagnostic Works in 3 Steps</h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              Genuine Pedagogical Feedback
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-950/60">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center mb-3">1</div>
              <div className="font-bold text-slate-100 mb-1.5">Active Diagnostic Probes</div>
              <p className="text-slate-400 leading-relaxed">Engage with sequence steppers and causal system graphs that test procedural understanding rather than rote trivia.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-950/60">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center mb-3">2</div>
              <div className="font-bold text-slate-100 mb-1.5">5-D Competence Radar</div>
              <p className="text-slate-400 leading-relaxed">Instantly view your breakdown across Recall, Explanation, Application, Implementation, and Creation.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-950/60">
              <div className="w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-400 font-black flex items-center justify-center mb-3">3</div>
              <div className="font-bold text-slate-100 mb-1.5">Targeted Gap Resolution</div>
              <p className="text-slate-400 leading-relaxed">Receive precise prerequisite repair recommendations to fix the exact concepts blocking your progress.</p>
            </div>
          </div>
        </div>

        {/* Founder Track Offer Card */}
        <div className="max-w-4xl mx-auto rounded-3xl border-2 border-emerald-500/80 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-10 mb-20 text-left relative overflow-hidden shadow-2xl shadow-emerald-500/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider mb-2 inline-block">
                Limited Early Cohort
              </span>
              <h2 className="text-2xl font-extrabold text-slate-100">Founder Track Pass — $29 One-Time</h2>
              <p className="text-xs text-slate-400 mt-1">Available for the first 100 learners per specialized course track (or 3,300 BDT via bKash).</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-3xl font-extrabold text-emerald-400">$29</div>
              <div className="text-[11px] text-slate-500 line-through">Regular $49.99</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-200 mb-8 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full lifetime access to your chosen Course Track</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fast-Track Module Bypass Exams included</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cryptographic SHA-256 Verified Graduation Certificate</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct feedback access to early founder cohorts</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/pricing"
              onClick={() => trackEvent('cta_click', { cta: 'claim_founder_pass' })}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 text-center transition-all"
            >
              Claim Founder Track Pass ($29)
            </Link>
            <span className="text-[11px] text-slate-400">Genuine limit of 100 slots per domain track.</span>
          </div>
        </div>

        {/* 3 Core Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">5-D Competence Model</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quantifies mastery across Recall, Explanation, Application, Implementation, and Creation with Ebbinghaus memory decay protection.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">7 Cognitive Archetypes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step through Causal System Graphs, Variable Sandboxes, Spatial Canvases, and Dialectical Builders across diverse fields.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-blue-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">Verified Credentials</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn tamper-proof SHA-256 cryptographic certificates verifiable on our public ledger upon passing Capstone Projects.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-slate-300 mb-3">Learning Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/domains" className="hover:text-emerald-400">Knowledge Domains</Link></li>
              <li><Link href="/courses" className="hover:text-emerald-400">Course Tracks</Link></li>
              <li><Link href="/adaptive-learning" className="hover:text-emerald-400">Adaptive Decision Engine</Link></li>
              <li><Link href="/how-it-works" className="hover:text-emerald-400">Interactive Archetypes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-300 mb-3">Certifications & Pricing</h4>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="hover:text-emerald-400">Founder & Track Pricing</Link></li>
              <li><Link href="/certifications" className="hover:text-emerald-400">Verified Certificates</Link></li>
              <li><Link href="/pricing#bypass" className="hover:text-emerald-400">Module Bypass Exams</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-300 mb-3">Trust & Safety</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-emerald-400">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-400">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-emerald-400">Refund Policy</Link></li>
              <li><Link href="/terms#clinical-disclaimer" className="hover:text-emerald-400">Clinical Disclaimer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-300 mb-3">Organization</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-emerald-400">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 PentaCourse. All rights reserved.</p>
          <p className="text-[11px] text-slate-600">Educational platform only. Not intended as clinical diagnostic software or legal counsel.</p>
        </div>
      </footer>
    </div>
  );
}
"""

with open('src/app/page.jsx', 'w', encoding='utf-8') as f:
    f.write(homepage_code)

print('Updated src/app/page.jsx with refined outcome-driven messaging and Founder CTA!')
