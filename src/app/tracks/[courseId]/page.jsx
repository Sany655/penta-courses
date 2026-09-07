'use client';

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, CheckCircle2, Lock, Sparkles, ChevronRight, 
  CreditCard, Play, Award, Zap, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import { InteractiveBlock } from '@/components/student/BlockRenderers';
import { BkashPaymentModal } from '@/components/payment/BkashPaymentModal';

export default function StructuredTrackPlayerPage({ params }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [bypassedModules, setBypassedModules] = useState({});

  useEffect(() => {
    fetch(`/api/v1/courses/${courseId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setCourse(data);
          setLoading(false);
        } else {
          fetch('/api/v1/courses')
            .then(r => r.ok ? r.json() : [])
            .then(list => {
              const matched = list.find(c => c.id === courseId || c.slug === courseId) || list[0];
              setCourse(matched || null);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-10 flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading track curriculum from cluster...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-10 max-w-4xl mx-auto text-center font-mono">
        <p className="text-slate-400">Course track not found.</p>
        <Link href="/courses" className="mt-4 inline-block text-indigo-400 underline text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const track = course;
  const modules = track.modules || [];
  const activeModule = modules[activeModuleIndex] || modules[0] || { id: 'mod-1', title: 'Module 01', lessons: [] };
  const lessons = activeModule.lessons || [];
  const activeLesson = lessons[activeLessonIndex] || lessons[0] || { id: 'l1', title: 'Lesson 1.1' };
  const activeBlock = activeLesson.block || (activeLesson.content_blocks || []).find(b => b.type !== 'markdown') || activeLesson.content_blocks?.[0] || activeLesson.blocks?.[0] || {
    type: 'sequence_engine',
    title: activeLesson.title || 'Interactive Exploration',
    data: { steps: [{ action: 'Analyze Concept', rationale: 'Understanding foundation principles.' }] }
  };
  const bypassFeeCents = activeModule.bypass_fee_in_cents || 299;
  const bypassFeeDollars = (bypassFeeCents / 100).toFixed(2);

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
                block={activeBlock}
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
              bdtPrice: Math.round(bypassFeeDollars * 120),
              originalBdtPrice: Math.round(bypassFeeDollars * 150)
            }}
            onSuccess={handleBypassSuccess}
            onClose={() => setShowBypassModal(false)}
          />
        )}

      </div>
    </div>
  );
}
