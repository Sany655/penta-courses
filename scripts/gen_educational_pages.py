import os

def write_page(path, content):
    p = os.path.normpath(path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {p}")

# Adaptive Learning
write_page("src/app/adaptive-learning/page.jsx", """'use client';

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
""")

# How It Works
write_page("src/app/how-it-works/page.jsx", """'use client';

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
""")

# Domains
write_page("src/app/domains/page.jsx", """'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, Scale, TrendingUp, Cpu, ArrowRight } from 'lucide-react';

export default function DomainsPage() {
  const domains = [
    {
      title: 'Clinical Medicine & Differential Pathophysiology',
      slug: 'clinical-medicine',
      icon: HeartPulse,
      desc: 'Acid-base balance, Arterial Blood Gas (ABG) analysis, Anion Gap, and acute DKA fluid resuscitation algorithms.',
      concepts: 5
    },
    {
      title: 'Constitutional Law & Jurisprudential Logic',
      slug: 'constitutional-law',
      icon: Scale,
      desc: 'Judicial review standards, Article III standing, Equal Protection Clause, and tiers of strict scrutiny.',
      concepts: 3
    },
    {
      title: 'Macroeconomics & Quantitative Finance',
      slug: 'macro-finance',
      icon: TrendingUp,
      desc: 'Central bank policy rates, liquidity preference, yield curve term premia, and monetary transmission mechanisms.',
      concepts: 2
    },
    {
      title: 'Python Systems & High Concurrency Architecture',
      slug: 'python-systems',
      icon: Cpu,
      desc: 'CPython GIL mechanics, AsyncIO event loops, thread safety, and distributed Redlock consensus algorithms.',
      concepts: 3
    }
  ];

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

      <main className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
          Explore Knowledge Domains
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mb-12">
          Structured Directed Acyclic Graphs mapped out into concept nodes and interactive cognitive activities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((d, idx) => {
            const Icon = d.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-2">{d.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{d.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <span className="text-[11px] font-semibold text-slate-500">{d.concepts} Mapped Concepts</span>
                  <Link href="/missions" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    <span>Explore Graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
""")

# Courses
write_page("src/app/courses/page.jsx", """'use client';

import React from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react';

export default function CoursesPage() {
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

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
          Structured Course Tracks
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mb-12">
          Comprehensive, sequential curriculums featuring Fast-Track Module Bypass Exams and verified graduation credentials.
        </p>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 transition-all mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-2 inline-block">
                Clinical Medicine Track
              </span>
              <h2 className="text-xl font-bold text-slate-100">Critical Care Diagnostics & Resuscitation</h2>
            </div>
            <span className="text-lg font-extrabold text-emerald-400">$49.99</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Master the pathophysiological mechanisms of metabolic acidosis, ABG interpretation, anion gap calculations, and intensive DKA fluid resuscitation protocols.
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>2 Modules</span>
              <span>•</span>
              <span>Bypass Exam Enabled</span>
              <span>•</span>
              <span className="text-cyan-400 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Verified Certificate</span>
            </div>
            <Link href="/missions" className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all">
              Enroll / Test Out
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
""")
