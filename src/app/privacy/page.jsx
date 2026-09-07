'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
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
  );
}
