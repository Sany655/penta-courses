'use client';

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
