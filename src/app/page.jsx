'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Brain, Network, ShieldCheck, ArrowRight, Layers, Target, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function HomePage() {
  useEffect(() => {
    trackEvent('landing_view', { page: 'home' });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Outcome-Driven Adaptive Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
          Build a <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">Rigorous Working Understanding</span> of Complex Domains
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
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
            className="w-full sm:w-auto px-6 py-4 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Network className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Explore Knowledge Graph</span>
          </Link>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-16">
          ✓ Real interactive probes & 5-D radar • ✓ Immediate gap feedback • ✓ No credit card required
        </p>

        {/* Diagnostic Value Demonstration Banner */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-950 p-8 sm:p-10 mb-20 text-left shadow-xl dark:shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
            <div>
              <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">Interactive Diagnostic Flow</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">How the Free Diagnostic Works in 3 Steps</h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              Genuine Pedagogical Feedback
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/60">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center mb-3">1</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">Active Diagnostic Probes</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Engage with sequence steppers and causal system graphs that test procedural understanding rather than rote trivia.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/60">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-black flex items-center justify-center mb-3">2</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">5-D Competence Radar</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Instantly view your breakdown across Recall, Explanation, Application, Implementation, and Creation.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/60">
              <div className="w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-black flex items-center justify-center mb-3">3</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">Targeted Gap Resolution</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Receive precise prerequisite repair recommendations to fix the exact concepts blocking your progress.</p>
            </div>
          </div>
        </div>

        {/* 3 Core Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:border-emerald-500/40 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">5-D Competence Model</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Quantifies mastery across Recall, Explanation, Application, Implementation, and Creation with Ebbinghaus memory decay protection.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:border-cyan-500/40 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">7 Cognitive Archetypes</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Step through Causal System Graphs, Variable Sandboxes, Spatial Canvases, and Dialectical Builders across diverse fields.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:border-blue-500/40 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Verified Credentials</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Earn tamper-proof SHA-256 cryptographic certificates verifiable on our public ledger upon passing Capstone Projects.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
