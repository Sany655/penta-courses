'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, CheckCircle2, Lock, Sparkles, ChevronRight, 
  CreditCard, Play, Award, Zap, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import { InteractiveBlock, BkashPaymentModal } from '@/components/student/BlockRenderers';

export default function StructuredTrackPlayerPage({ params }) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [bypassedModules, setBypassedModules] = useState({});

  const track = {
    title: 'Clinical Diagnostics & Acute Resuscitation Track',
    domain: 'Clinical Medicine',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 01: Arterial Blood Gas & Acid-Base Physiology',
        is_locked: false,
        is_bypassed: !!bypassedModules['mod-1'],
        bypass_fee: 4.99,
        lessons: [
          {
            id: 'l1',
            title: '1.1 Principles of Henderson-Hasselbalch Equilibrium',
            block: {
              type: 'sequence_engine',
              title: 'Henderson-Hasselbalch Step-Through Dynamics',
              data: {
                steps: [
                  { action: 'Measure Arterial pH and PaCO2', rationale: 'Establish primary acid-base disturbance.' },
                  { action: 'Calculate Serum Bicarbonate', rationale: 'Differentiate metabolic from respiratory etiology.' }
                ]
              }
            }
          },
          {
            id: 'l2',
            title: '1.2 Anion Gap Calculation and Unmeasured Anions',
            block: {
              type: 'variable_sandbox',
              title: 'Anion Gap Parameter Tuning',
              data: {
                labelA: 'Sodium Concentration (mEq/L)',
                labelB: 'Chloride + Bicarbonate (mEq/L)',
                initialA: 140,
                initialB: 128,
                targetOutput: 12
              }
            }
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 02: Diabetic Ketoacidosis & Acute Fluid Resuscitation',
        is_locked: !bypassedModules['mod-1'],
        is_bypassed: !!bypassedModules['mod-2'],
        bypass_fee: 7.99,
        lessons: [
          {
            id: 'l3',
            title: '2.1 DKA Causal Cascade Perturbation',
            block: {
              type: 'causal_graph',
              title: 'DKA Causal Network',
              data: {
                nodes: [
                  { id: '1', label: 'Insulin Deficiency', state: 'Active', effect: 'Hyperglycemia and Lipolysis' },
                  { id: '2', label: 'Beta-Hydroxybutyrate Excess', state: 'Cascading', effect: 'Metabolic Acidosis' }
                ]
              }
            }
          }
        ]
      }
    ]
  };

  const activeModule = track.modules[activeModuleIndex] || track.modules[0];
  const activeLesson = activeModule.lessons[activeLessonIndex] || activeModule.lessons[0];

  const handleBypassSuccess = () => {
    setBypassedModules(prev => ({ ...prev, [activeModule.id]: true }));
    setShowBypassModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <Link href="/courses" className="inline-flex items-center gap-1 text-xs text-indigo-400 font-semibold hover:underline mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{track.title}</h1>
            <p className="text-xs text-slate-400">Structured Track with Automated Prerequisite Mastery Gates & Fast-Track Bypasses</p>
          </div>

          <Link
            href="/missions"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-950/40 transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" /> Switch to Adaptive Mission Mode
          </Link>
        </header>

        {/* Two-Column Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Module & Lesson Navigator */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Track Curriculum</h2>
            <div className="space-y-4">
              {track.modules.map((m, mIdx) => {
                const isActive = activeModuleIndex === mIdx;
                const isLocked = m.is_locked && !bypassedModules[m.id];
                return (
                  <div
                    key={m.id}
                    className={`rounded-2xl border transition overflow-hidden ${
                      isActive ? 'bg-slate-900 border-indigo-500/50' : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                          {m.title}
                          {bypassedModules[m.id] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {isLocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {m.lessons.length} Lessons {bypassedModules[m.id] && '• Bypassed (Mastery Validated)'}
                        </div>
                      </div>
                    </div>

                    {/* Lesson Links or Bypass Action */}
                    {isLocked ? (
                      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Prerequisite Gate Locked</span>
                        <button
                          onClick={() => setShowBypassModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-lg shadow-indigo-600/20 transition"
                        >
                          <Zap className="w-3 h-3" /> Bypass Exam / Instant
                        </button>
                      </div>
                    ) : (
                      <div className="border-t border-slate-800/60 divide-y divide-slate-800/40">
                        {m.lessons.map((l, lIdx) => {
                          const isLessonActive = isActive && activeLessonIndex === lIdx;
                          return (
                            <button
                              key={l.id}
                              onClick={() => {
                                setActiveModuleIndex(mIdx);
                                setActiveLessonIndex(lIdx);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition ${
                                isLessonActive 
                                  ? 'bg-indigo-600/10 text-indigo-300 font-semibold' 
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                              }`}
                            >
                              <span>{l.title}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lesson Content & Cognitive Block Viewport */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                  Lesson Viewport
                </span>
                <span className="text-xs text-slate-400 font-mono">Module 0{activeModuleIndex + 1}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{activeLesson.title}</h2>
            </div>

            {/* Cognitive Block Viewer */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
              <InteractiveBlock
                block={activeLesson.block}
                onEvidence={(ev) => console.log('Structured track evidence emitted:', ev)}
              />
            </div>
          </div>

        </div>

        {/* Bkash / Instant Bypass Modal */}
        {showBypassModal && (
          <BkashPaymentModal
            course={{
              title: activeModule.title,
              bdtPrice: Math.round(activeModule.bypass_fee * 120),
              originalBdtPrice: Math.round(activeModule.bypass_fee * 150)
            }}
            onSuccess={handleBypassSuccess}
            onClose={() => setShowBypassModal(false)}
          />
        )}

      </div>
    </div>
  );
}
