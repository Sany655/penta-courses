'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse</span>
          </Link>
          <Link href="/missions" className="text-xs px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold">Start Learning</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-6">About PentaCourse</h1>
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            PentaCourse was founded with a singular purpose: to make learning complex, high-consequence domains dramatically more efficient, rigorous, and personalized.
          </p>
          <p>
            Traditional education treats all learners as a uniform cohort, forcing students through linear video lectures and multiple-choice quizzes that fail to test procedural execution, causal reasoning, or multi-step synthesis.
          </p>
          <p>
            Our Unified Hybrid Adaptive Learning Platform replaces passive video consumption with interactive cognitive sandboxes, topological Directed Acyclic Graphs, and a 5-Dimensional competence vector across Recall, Explanation, Application, Implementation, and Creation.
          </p>
        </div>
      </main>
    </div>
  );
}
