'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeartPulse, Scale, TrendingUp, Cpu, ArrowRight, Layers } from 'lucide-react';

const iconMap = {
  'clinical-medicine': HeartPulse,
  'constitutional-law': Scale,
  'macro-finance': TrendingUp,
  'python-systems': Cpu,
};

export default function DomainsPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/domains')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setDomains(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setDomains([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-16 font-sans">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
        Explore Knowledge Domains
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-12">
        Structured Directed Acyclic Graphs mapped out into concept nodes and interactive cognitive activities.
      </p>

      {loading ? (
        <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40 text-slate-500 font-mono text-xs">
          Loading Knowledge Domains...
        </div>
      ) : domains.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 font-mono space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Domains Mapped Yet</h3>
          <p className="text-xs max-w-md mx-auto text-slate-600 dark:text-slate-400 leading-relaxed">
            No knowledge domains or conceptual topologies have been published yet. Once you create domains and concepts in the AI Admin Studio, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((d, idx) => {
            const Icon = iconMap[d.slug] || Cpu;
            return (
              <div key={d.id || idx} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">{d.name || d.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{d.description || d.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/60">
                  <span className="text-[11px] font-semibold text-slate-500 font-mono">{d.concepts?.length || 0} Mapped Concepts</span>
                  <Link href="/missions" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 font-mono">
                    <span>Explore Graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
