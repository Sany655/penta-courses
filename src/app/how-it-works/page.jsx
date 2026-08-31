'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const archetypes = [
    { name: 'SequenceEngine', domain: 'Medicine / Procedures', desc: 'Step-by-step clinical resuscitation protocols and algorithmic execution.' },
    { name: 'CausalSystemGraph', domain: 'Pathophysiology / Systems', desc: 'Interactive DAG perturbation testing how metabolic and physiological shifts propagate.' },
    { name: 'VariableSandbox', domain: 'Economics / Chemistry', desc: 'Real-time multi-variable parameter sliders simulating yield curves and anion gaps.' },
    { name: 'SpatialCanvas', domain: 'Anatomy / Engineering', desc: 'Visual spatial identification and structural mapping of physical components.' },
    { name: 'ComparativeMatrix', domain: 'Law / Architecture', desc: 'Multi-dimensional criteria tables contrasting strict scrutiny vs rational basis or GIL vs AsyncIO.' },
    { name: 'DialecticalBuilder', domain: 'Jurisprudence / Policy', desc: 'Socratic argument and counter-argument synthesis for complex debates.' },
    { name: 'TaxonomySorter', domain: 'Taxonomy / Classification', desc: 'Hierarchical categorization and entity sorting under domain constraints.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse</span>
          </Link>
          <Link href="/missions" className="text-xs px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold">Try Sandbox</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-6">
          The 7 Universal Cognitive Block Archetypes
        </h1>
        <p className="text-base text-slate-400 leading-relaxed mb-10">
          Learning complex topics cannot be achieved through multiple-choice questions alone. We built 7 domain-agnostic interactive cognitive blocks designed for active manipulation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {archetypes.map((a, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 transition-all">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">{a.domain}</div>
              <h3 className="text-base font-bold text-slate-100 mb-2">{a.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center p-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
          <h3 className="text-lg font-bold text-slate-100 mb-2">Explore the Knowledge Graph</h3>
          <p className="text-xs text-slate-400 mb-6">Interact with our live topological visualizer across all 4 knowledge domains.</p>
          <Link href="/knowledge-graph" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs">
            <span>Launch Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
