'use client';

import React from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react';

export default function CoursesPage() {
  return (
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
  );
}
