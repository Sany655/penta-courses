import os

# 1. Homepage
home_jsx = """'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Brain, Network, Compass, ShieldCheck, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
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
              onClick={() => trackEvent('cta_click', { cta: 'try_adaptive_mission_nav' })}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
            >
              Launch Mission
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Unified Hybrid Adaptive Learning Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
          Learn Complex Domains with <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Topological Intelligence</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Master Medicine, Law, Economics, and High-Concurrency Systems. Powered by a 5-Dimensional competence model, interactive cognitive sandboxes, and closed-loop prerequisite repair.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            href="/missions"
            onClick={() => trackEvent('cta_click', { cta: 'start_learning_free' })}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/knowledge-graph"
            onClick={() => trackEvent('cta_click', { cta: 'explore_knowledge_graph' })}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Explore Knowledge Graph</span>
          </Link>
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
              <li><Link href="/pricing" className="hover:text-emerald-400">Plans & Pricing</Link></li>
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
    f.write(home_jsx)

print('Updated src/app/page.jsx!')
