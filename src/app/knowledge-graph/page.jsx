'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Compass, CheckCircle2, Lock, AlertCircle, 
  Sparkles, ArrowRight, Activity, Zap, Shield, BookOpen, Layers
} from 'lucide-react';
import Link from 'next/link';

const DOMAINS = [
  { id: 'med', name: 'Clinical Medicine', slug: 'clinical-medicine' },
  { id: 'law', name: 'Constitutional Law', slug: 'constitutional-law' },
  { id: 'econ', name: 'Macroeconomics & Finance', slug: 'macro-finance' },
  { id: 'py', name: 'Python Systems Architecture', slug: 'python-systems' }
];

const GRAPH_DATA = {
  med: [
    { id: 'c1', name: 'Arterial Blood Gas Analysis', state: 'MASTERED', mastery: 0.92, type: 'FOUNDATION', prereqs: [] },
    { id: 'c2', name: 'Anion Gap Calculation', state: 'MASTERED', mastery: 0.88, type: 'FOUNDATION', prereqs: ['c1'] },
    { id: 'c3', name: 'High Anion Gap Acidosis (HAGMA)', state: 'FRONTIER', mastery: 0.65, type: 'DIAGNOSTIC', prereqs: ['c2'] },
    { id: 'c4', name: 'Diabetic Ketoacidosis Pathogenesis', state: 'WEAK', mastery: 0.42, type: 'THEORY', prereqs: ['c3'] },
    { id: 'c5', name: 'Acute DKA Resuscitation Protocol', state: 'LOCKED', mastery: 0.0, type: 'TECHNIQUE', prereqs: ['c4'] }
  ],
  law: [
    { id: 'l1', name: 'Judicial Review & Standing', state: 'MASTERED', mastery: 0.95, type: 'FOUNDATION', prereqs: [] },
    { id: 'l2', name: 'Equal Protection Clause', state: 'FRONTIER', mastery: 0.68, type: 'THEORY', prereqs: ['l1'] },
    { id: 'l3', name: 'Strict Scrutiny Adjudication', state: 'LOCKED', mastery: 0.0, type: 'TECHNIQUE', prereqs: ['l2'] }
  ],
  econ: [
    { id: 'e1', name: 'Central Bank Policy Rates', state: 'MASTERED', mastery: 0.85, type: 'FOUNDATION', prereqs: [] },
    { id: 'e2', name: 'Yield Curve Term Structure', state: 'FRONTIER', mastery: 0.70, type: 'THEORY', prereqs: ['e1'] }
  ],
  py: [
    { id: 'p1', name: 'CPython GIL Mechanics', state: 'MASTERED', mastery: 0.90, type: 'FOUNDATION', prereqs: [] },
    { id: 'p2', name: 'AsyncIO Event Loops', state: 'FRONTIER', mastery: 0.62, type: 'THEORY', prereqs: ['p1'] },
    { id: 'p3', name: 'Distributed Redlock Consensus', state: 'LOCKED', mastery: 0.0, type: 'TECHNIQUE', prereqs: ['p2'] }
  ]
};

export default function KnowledgeGraphPage() {
  const [selectedDomain, setSelectedDomain] = useState('med');
  const [selectedConcept, setSelectedConcept] = useState(GRAPH_DATA['med'][2]);

  const nodes = GRAPH_DATA[selectedDomain] || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Network className="w-4 h-4" /> Multi-Domain Knowledge Graph Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Autonomous Conceptual Topology
            </h1>
          </div>

          {/* Domain Switcher */}
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map(d => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDomain(d.id);
                  setSelectedConcept(GRAPH_DATA[d.id][0]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedDomain === d.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </header>

        {/* Graph & Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Visual Graph Canvas */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Topological Prerequisite DAG
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Mastered</span>
                <span className="flex items-center gap-1 text-cyan-400"><Sparkles className="w-3 h-3" /> Frontier</span>
                <span className="flex items-center gap-1 text-amber-400"><AlertCircle className="w-3 h-3" /> Weak</span>
                <span className="flex items-center gap-1 text-slate-500"><Lock className="w-3 h-3" /> Locked</span>
              </div>
            </div>

            {/* Nodes Stack */}
            <div className="space-y-4 pt-2">
              {nodes.map((n, idx) => {
                const isSelected = selectedConcept?.id === n.id;
                return (
                  <motion.div
                    key={n.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedConcept(n)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-400">
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          {n.name}
                          {n.state === 'MASTERED' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {n.state === 'FRONTIER' && <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />}
                          {n.state === 'WEAK' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                          {n.state === 'LOCKED' && <Lock className="w-4 h-4 text-slate-500" />}
                        </div>
                        <div className="text-[11px] text-slate-400 capitalize">Type: {n.type.toLowerCase()}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-300">{Math.round(n.mastery * 100)}%</div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Mastery</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Node Inspector & Action Drawer */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Layers className="w-4 h-4" /> Concept Inspector
            </div>

            {selectedConcept ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedConcept.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      {selectedConcept.type}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      selectedConcept.state === 'MASTERED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      selectedConcept.state === 'FRONTIER' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                      selectedConcept.state === 'WEAK' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {selectedConcept.state}
                    </span>
                  </div>
                </div>

                {/* 5-Dimensional Mastery Breakdown */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">5-D Mastery Vectors</div>
                  {[
                    { label: 'Recall Strength', val: Math.round(selectedConcept.mastery * 100) },
                    { label: 'Explanation Power', val: Math.round(selectedConcept.mastery * 90) },
                    { label: 'Application Skill', val: Math.round(selectedConcept.mastery * 85) },
                    { label: 'Implementation', val: Math.round(selectedConcept.mastery * 80) },
                    { label: 'Applied Creation', val: Math.round(selectedConcept.mastery * 70) }
                  ].map(d => (
                    <div key={d.label} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>{d.label}</span>
                        <span className="font-mono text-indigo-400">{d.val}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Launch Action */}
                <Link
                  href="/missions"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/20 transition"
                >
                  <Zap className="w-4 h-4" /> Launch Focused Mission
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select a concept node in the DAG to inspect mastery.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
