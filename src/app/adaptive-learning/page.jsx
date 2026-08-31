'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, Network, Zap, ArrowRight } from 'lucide-react';

export default function AdaptiveLearningPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse</span>
          </Link>
          <Link href="/missions" className="text-xs px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold">Try Adaptive Engine</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-6">
          How the 5-Dimensional Adaptive Engine Works
        </h1>
        <p className="text-base text-slate-400 leading-relaxed mb-10">
          Traditional platforms track learning with a single simplistic percentage. Our engine models competence as a multidimensional vector governed by causal graph topology and cognitive science.
        </p>

        <section className="space-y-8 text-sm text-slate-300 mb-16">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
            <h2 className="text-lg font-bold text-slate-100 mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-400" />
              1. The 5-Dimensional Competence Vector
            </h2>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Every learner-concept pair is quantified across 5 independent cognitive modalities:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>Recall (R):</strong> Immediate recognition and definitions.</li>
              <li><strong>Explanation (E):</strong> Causal reasoning and articulate understanding.</li>
              <li><strong>Application (A):</strong> Solving realistic diagnostic cases under constraints.</li>
              <li><strong>Implementation (I):</strong> Procedural execution, calculations, and code step-throughs.</li>
              <li><strong>Creation (C):</strong> Capstone synthesis, multi-variable systems design, and open-ended protocol construction.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
            <h2 className="text-lg font-bold text-slate-100 mb-3 flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              2. Topological Knowledge Graph (DAG)
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Concepts are connected as Directed Acyclic Graphs with strictly validated prerequisite relationships. The engine computes your active <em>Frontier Nodes</em>—concepts where all prerequisites have been solidly mastered, ensuring you never face insurmountable cognitive overload.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
            <h2 className="text-lg font-bold text-slate-100 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              3. Closed-Loop Prerequisite Repair
            </h2>
            <p className="text-slate-400 leading-relaxed">
              When an attempt fails, our 10-category failure taxonomy diagnoses the root cause (e.g., prerequisite gap vs misconception). Rather than forcing repetitive generic drills, the engine automatically schedules targeted repair on the exact upstream concept.
            </p>
          </div>
        </section>

        <div className="text-center p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
          <h3 className="text-lg font-bold text-slate-100 mb-2">Experience the Adaptive Engine in Action</h3>
          <p className="text-xs text-slate-400 mb-6">Launch an interactive mission across Medicine, Law, Economics, or High-Concurrency Systems.</p>
          <Link href="/missions" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
            <span>Launch Free Mission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
