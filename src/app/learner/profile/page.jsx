'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Brain, Compass, Sparkles, Target, Zap, Clock, 
  CheckCircle2, Flame, ArrowUpRight, Award, Layers 
} from 'lucide-react';
import Link from 'next/link';

export default function LearnerProfilePage() {
  const [activeTab, setActiveTab] = useState('radar');

  const curiositySignals = [
    { id: '1', title: 'Quantum Biology Mechanisms in Enzyme Catalysis', domain: 'Medicine', score: 0.85, mentions: 3 },
    { id: '2', title: 'Distributed Raft Consensus in Low-Latency Storage', domain: 'Python Systems', score: 0.72, mentions: 2 },
    { id: '3', title: 'Constitutional Standard for Algorithmic Due Process', domain: 'Law', score: 0.60, mentions: 1 }
  ];

  const reviewQueue = [
    { id: 'r1', concept: 'Arterial Blood Gas Analysis', domain: 'Medicine', decay: '82% Retention', due: 'Today' },
    { id: 'r2', concept: 'Central Bank Policy Rates', domain: 'Finance', decay: '76% Retention', due: 'Tomorrow' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Card */}
        <header className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-2xl">
              AR
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Alex Rivera</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                  Hybrid Explorer (L3)
                </span>
              </div>
              <p className="text-xs text-slate-400">Adaptive Decision Matrix active across 4 Multi-Domain Graphs</p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Mastered Concepts</div>
              <div className="text-2xl font-bold text-white">18</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Frontier Velocity</div>
              <div className="text-2xl font-bold text-emerald-400">+14%</div>
            </div>
          </div>
        </header>

        {/* 5-Dimensional Mastery Vectors Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Cognitive Mastery Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Brain className="w-4 h-4" /> Multi-Dimensional Mastery Vectors
              </div>
              <span className="text-xs font-mono text-slate-400">Overall: 78%</span>
            </div>

            <div className="space-y-4">
              {[
                { dim: 'Recall (15% weight)', val: 92, color: 'bg-emerald-500' },
                { dim: 'Explanation (20% weight)', val: 84, color: 'bg-blue-500' },
                { dim: 'Application (35% weight)', val: 78, color: 'bg-indigo-500' },
                { dim: 'Implementation (20% weight)', val: 70, color: 'bg-cyan-500' },
                { dim: 'Applied Creation (10% weight)', val: 65, color: 'bg-purple-500' }
              ].map(d => (
                <div key={d.dim} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{d.dim}</span>
                    <span className="font-mono text-slate-400">{d.val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${d.color} rounded-full transition-all duration-500`} style={{ width: `${d.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retention & Spaced Review Queue */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Clock className="w-4 h-4" /> Ebbinghaus Spaced Review Due
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {reviewQueue.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {reviewQueue.map(r => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">{r.concept}</div>
                    <div className="text-xs text-slate-400">{r.domain} • <span className="text-amber-400 font-semibold">{r.decay}</span></div>
                  </div>
                  <Link
                    href="/missions"
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Exploration Radar & Curiosity Signals */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Compass className="w-4 h-4" /> Exploration Radar & Curiosity Signals
            </div>
            <span className="text-xs text-slate-500">Autonomous Interest Tracking</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {curiositySignals.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>{c.domain}</span>
                    <span className="text-indigo-400 font-bold font-mono">Interest: {Math.round(c.score * 100)}%</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">{c.title}</h3>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/20 transition"
                >
                  <Target className="w-3.5 h-3.5" /> Promote to Goal
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
