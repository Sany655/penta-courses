'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-6">About PentaCourse</h1>
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            PentaCourse was founded with a singular purpose: to make learning complex, high-consequence domains dramatically more efficient, rigorous, and personalized.
          </p>
          <p>
            Traditional education treats all learners as a uniform cohort, forcing students through linear video lectures and multiple-choice quizzes that fail to test procedural execution, causal reasoning, or multi-step synthesis.
          </p>
          <p>
            Our Unified Hybrid Adaptive Learning Platform replaces passive video consumption with interactive cognitive sandboxes, topological Directed Acyclic Graphs, and a 5-Dimensional competence vector across Recall, Explanation, Application, Implementation, and Creation.
          </p>
        </div>
    </main>
  );
}
