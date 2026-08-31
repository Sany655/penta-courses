'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16 text-sm text-slate-300 space-y-6 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-slate-100 mb-6">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: August 31, 2026</p>
        <p>
          At PentaCourse, we believe learner privacy is paramount. We do not sell your learning data, interaction history, or personal details to advertisers.
        </p>
        <h2 className="text-base font-bold text-slate-100">1. Information We Collect</h2>
        <p>
          We collect your email address, name, learning session interaction logs (time-on-task, exercise scores), and payment confirmation references necessary to grant entitlements.
        </p>
        <h2 className="text-base font-bold text-slate-100">2. How We Use Learning Telemetry</h2>
        <p>
          Interaction signals (e.g. hesitation scores, activity completion) are used strictly to calibrate your 5-Dimensional mastery vector and compute optimal prerequisite recommendations.
        </p>
        <h2 className="text-base font-bold text-slate-100">3. Third-Party Payment Processors</h2>
        <p>
          All credit card and mobile financial transactions are processed securely via Stripe and bKash. We never store raw credit card numbers or PINs on our servers.
        </p>
      </main>
    </div>
  );
}
