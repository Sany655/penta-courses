'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, BookOpen, Clock, ChevronRight, Shield, Zap, Sparkles } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/courses')
      .then(res => res.ok ? res.json() : [])
      .then(serverCourses => {
        if (Array.isArray(serverCourses)) {
          setCourses(serverCourses);
        }
        setLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-20 font-sans">
      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Cognitive Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Structured Course Tracks
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Comprehensive, sequential learning tracks with Fast-Track Module Bypass Exams, live Socratic feedback, and cryptographically verified graduation credentials.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 animate-pulse h-64 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-12 bg-slate-200 dark:bg-slate-800/60 rounded w-full"></div>
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 font-mono text-sm">
          No structured tracks currently available in catalog.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => {
            const firstModule = course.modules?.[0] || { id: 'module-1' };
            const firstLesson = firstModule.lessons?.[0] || { id: 'lesson-1-1' };
            const modulesCount = course.modules?.length || 2;
            const priceDisplay = course.price ? `$${course.price}` : (course.price_in_cents ? `$${(course.price_in_cents / 100).toFixed(2)}` : '$49.99');

            return (
              <div
                key={course.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-md hover:shadow-xl dark:shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] font-mono uppercase tracking-wider">
                      {course.category || 'SPECIALIZATION'}
                    </span>
                    <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {priceDisplay}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition mb-2">
                    {course.title}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> {modulesCount} Phases</span>
                      <span>•</span>
                      <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Verified Cert</span>
                    </div>
                    <span className="text-slate-500">{course.difficulty || 'Intermediate'}</span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      href={`/course/${course.id || course.slug}/overview`}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-transparent text-xs font-bold text-center transition"
                    >
                      View Syllabus
                    </Link>
                    <Link
                      href={`/learn/${course.id}/${firstModule.id}/${firstLesson.id}`}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold text-center transition flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
                    >
                      <span>Enter Track</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
